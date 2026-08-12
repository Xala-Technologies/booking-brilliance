import { useCallback, useEffect, useMemo, useReducer } from "react";
import { trackConversion } from "@/lib/analytics";
import {
  retrieve,
  answerFrom,
  followUpSuggestions,
  FALLBACK_NO_MATCH,
  buildLLMContext,
} from "@/lib/chatbot/rag";
import { getSearchCorpus, searchCorpus } from "@/lib/search/corpus";
import type {
  ChatMessage,
  ChatState,
  InquiryDraft,
  Mode,
  Persona,
} from "@/lib/chatbot/types";
import { summarizeInquiry } from "@/lib/chatbot/inquiry";
import { extractProfile } from "@/lib/chatbot/sales/lead";
import {
  degradationFromError,
  degradationFromResponse,
  degradationWarning,
  mergeDegradation,
  type ChatDegradation,
} from "@/lib/chatbot/degradation";

const STORAGE_KEY = "digilist-chat-v1";

const emptyDraft: InquiryDraft = {
  persona: null,
  topic: "",
  organization: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  contextSummary: "",
};

const initialState = (): ChatState => ({
  open: false,
  mode: "chat",
  messages: [],
  inquiry: { ...emptyDraft },
  thinking: false,
  error: null,
  // Null while the assistant is answering. Set on the first turn that falls
  // back to local FAQ retrieval, and carried into the lead email so a human
  // sees it. See lib/chatbot/degradation.ts for why this is not optional.
  degraded: null,
});

type Action =
  | { type: "TOGGLE_OPEN"; value?: boolean }
  | { type: "SET_MODE"; mode: Mode }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "SET_THINKING"; value: boolean }
  | { type: "SET_DRAFT"; patch: Partial<InquiryDraft> }
  | { type: "RESET" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_DEGRADED"; degraded: ChatDegradation | null }
  | { type: "HYDRATE"; state: ChatState };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, open: action.value ?? !state.open };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_THINKING":
      return { ...state, thinking: action.value };
    case "SET_DRAFT":
      return { ...state, inquiry: { ...state.inquiry, ...action.patch } };
    case "RESET":
      return initialState();
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_DEGRADED":
      // First degradation wins — a later recovery must not erase the fact that
      // the opening answers came from the FAQ.
      return { ...state, degraded: mergeDegradation(state.degraded, action.degraded) };
    case "HYDRATE":
      return { ...action.state, open: false, thinking: false };
    default:
      return state;
  }
}

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function buildContextSummary(messages: ChatMessage[]): string {
  return messages
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Bruker" : "Bot"}: ${m.text}`)
    .join("\n");
}

// Both endpoints are served by the digilist-api Node service on the VPS,
// reverse-proxied by nginx at /api/*. Same origin, so no CORS handshake.
const CHAT_ENDPOINT = "/api/chat";
const INQUIRY_ENDPOINT = "/api/inquiry";

export function useChatbot() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Persist + hydrate inquiry draft (not conversation) across reloads.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const persisted = JSON.parse(raw) as { inquiry: InquiryDraft };
        if (persisted.inquiry) {
          dispatch({ type: "SET_DRAFT", patch: persisted.inquiry });
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ inquiry: state.inquiry }),
      );
    } catch {
      // private mode etc
    }
  }, [state.inquiry]);

  // Lock body scroll while open on mobile
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (state.open && window.innerWidth < 768) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [state.open]);

  const toggle = useCallback((value?: boolean) => {
    dispatch({ type: "TOGGLE_OPEN", value });
  }, []);

  const setMode = useCallback((mode: Mode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: ChatMessage = {
        id: cryptoId(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: userMsg });
      dispatch({ type: "SET_THINKING", value: true });
      dispatch({ type: "SET_ERROR", error: null });

      // Segment drives the follow-up chips: a private venue operator must not be
      // offered SSA-L / kommune questions just because the FAQ corpus is
      // municipality-heavy and that is what their message matched.
      const segment = extractProfile([
        ...state.messages.filter((m) => m.role === "user").map((m) => m.text),
        trimmed,
      ]).segment;
      const hits = retrieve(trimmed, 3);
      // Whole-site intelligent search — shown as clickable cards under the reply
      // and fed to the LLM so it can cite pages/blog, not just FAQ.
      const results = searchCorpus(trimmed, getSearchCorpus()).slice(0, 6);

      // Path A — call the digilist-api /api/chat endpoint (Anthropic proxy).
      // Falls through to local FAQ retrieval if the service is unreachable
      // (e.g. before the VPS handler is deployed, or transient network issues).
      try {
        const history = state.messages
          .filter((m) => m.role !== "system")
          .slice(-8)
          .map((m) => ({ role: m.role, text: m.text }));
        const ctx = buildLLMContext(trimmed, hits, history, results);
        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: ctx.system,
            messages: ctx.messages,
            hits,
          }),
        });
        // Parse before judging: a non-2xx still carries a body worth reading,
        // and a 200 with no `text` is a failure the old `if (res.ok)` treated
        // as success.
        let payloadText: string | undefined;
        try {
          payloadText = ((await res.json()) as { text?: string })?.text;
        } catch {
          payloadText = undefined;
        }

        // THE FIX. A 503 does not throw — `fetch` resolves, `res.ok` is false,
        // and the old code fell out of this try WITHOUT entering the catch. The
        // catch was the only place that logged, and only under DEV. So the one
        // failure that actually happened in production was silent everywhere.
        const degraded = degradationFromResponse(
          res.status,
          Boolean(payloadText),
          new Date().toISOString(),
        );
        if (degraded) {
          // Unconditional — never re-add an `import.meta.env.DEV` gate here.
          console.warn(degradationWarning(degraded));
          dispatch({ type: "SET_DEGRADED", degraded });
        } else if (payloadText) {
          const assistantMsg: ChatMessage = {
            id: cryptoId(),
            role: "assistant",
            text: payloadText,
            sourceQ: hits[0]?.q,
            suggestions: followUpSuggestions(hits[0], segment),
            showInquiryCta: hits.length === 0,
            results,
            timestamp: Date.now(),
          };
          dispatch({ type: "ADD_MESSAGE", message: assistantMsg });
          dispatch({ type: "SET_THINKING", value: false });
          return;
        }
      } catch (err) {
        // Only a genuinely thrown request reaches here (offline, DNS, CORS).
        // HTTP errors are handled above — that split is the whole bug.
        const degraded = degradationFromError(err, new Date().toISOString());
        console.warn(degradationWarning(degraded));
        dispatch({ type: "SET_DEGRADED", degraded });
      }

      // Path B — local FAQ retrieval only
      const top = hits[0];
      let assistantMsg: ChatMessage;
      if (top && top.score >= 2) {
        const lead =
          top.score >= 5
            ? ""
            : "Basert på det jeg vet: ";
        assistantMsg = {
          id: cryptoId(),
          role: "assistant",
          text: `${lead}${answerFrom(top)}`,
          sourceQ: top.q,
          suggestions: followUpSuggestions(top, segment),
          results,
          timestamp: Date.now(),
        };
      } else {
        const fallback =
          FALLBACK_NO_MATCH[
            Math.floor(Math.random() * FALLBACK_NO_MATCH.length)
          ];
        assistantMsg = {
          id: cryptoId(),
          role: "assistant",
          text: fallback,
          suggestions: ["Send forespørsel", "Book demo"],
          showInquiryCta: true,
          showDemoCta: true,
          results,
          timestamp: Date.now(),
        };
      }
      // Tiny artificial latency makes streaming feel less janky
      setTimeout(() => {
        dispatch({ type: "ADD_MESSAGE", message: assistantMsg });
        dispatch({ type: "SET_THINKING", value: false });
      }, 250);
    },
    [state.messages],
  );

  const startInquiry = useCallback(() => {
    dispatch({
      type: "SET_DRAFT",
      patch: { contextSummary: buildContextSummary(state.messages) },
    });
    dispatch({ type: "SET_MODE", mode: "inquiry-persona" });
  }, [state.messages]);

  const setPersona = useCallback((p: Persona) => {
    dispatch({ type: "SET_DRAFT", patch: { persona: p } });
    dispatch({ type: "SET_MODE", mode: "inquiry-topic" });
  }, []);

  const setTopic = useCallback((topic: string) => {
    dispatch({ type: "SET_DRAFT", patch: { topic } });
    dispatch({ type: "SET_MODE", mode: "inquiry-contact" });
  }, []);

  const updateDraft = useCallback((patch: Partial<InquiryDraft>) => {
    dispatch({ type: "SET_DRAFT", patch });
  }, []);

  const submitInquiry = useCallback(async () => {
    dispatch({ type: "SET_THINKING", value: true });
    dispatch({ type: "SET_ERROR", error: null });
    const payload = {
      ...state.inquiry,
      summary: summarizeInquiry(state.inquiry),
      source: "chatbot",
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      // The lead email is the one artefact a human reads on every conversation.
      // Geir's arrived on 2026-08-12 describing a chat whose three answers were
      // verbatim FAQ entries, and nothing in it said so. Now it does.
      chatDegraded: state.degraded,
    };

    try {
      const res = await fetch(INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Inquiry endpoint returned ${res.status}`);
      // Only after the endpoint confirms — a failed send is not a conversion.
      trackConversion("inquiry_sent", { source: "chatbot" });
      dispatch({ type: "SET_THINKING", value: false });
      dispatch({ type: "SET_MODE", mode: "inquiry-success" });
    } catch (err) {
      console.error("[chatbot] /api/inquiry failed:", err);
      dispatch({ type: "SET_THINKING", value: false });
      dispatch({
        type: "SET_ERROR",
        error:
          "Vi fikk ikke sendt forespørselen. Prøv igjen, eller send e-post direkte til kontakt@digilist.no.",
      });
    }
  }, [state.inquiry, state.degraded]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Both endpoints are served by the digilist-api Node service behind nginx at
  // /api/* (the old comment here said Supabase edge functions — wrong service
  // entirely, and wrong for long enough that it misdirected an outage triage).
  //
  // `llm` reports what we have OBSERVED, not what we hope. It used to be a
  // hardcoded `true`, which is the same class of lie as the DEV-gated warning:
  // a status field that cannot ever report bad news is not a status field.
  const isConfigured = useMemo(
    () => ({ llm: state.degraded === null, inquiry: true }),
    [state.degraded],
  );

  return {
    state,
    toggle,
    send,
    setMode,
    startInquiry,
    setPersona,
    setTopic,
    updateDraft,
    submitInquiry,
    reset,
    isConfigured,
  };
}
