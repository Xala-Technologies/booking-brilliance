/**
 * Capable agent runner — runs `claude -p` with the FULL toolset enabled: every
 * built-in tool plus every MCP server registered for the Claude CLI (the
 * repository map via codebase-memory, RAG, memory, and the account connectors).
 *
 * This is the counterpart to claudeCli() in generate.ts. claudeCli locks tools
 * OFF (--max-turns 1 + --disallowedTools) for deterministic, cheap text
 * generation; that mode also flakes on large prompts because the model reaches
 * for a tool and hits the turn cap. This runner instead lets the agent USE its
 * tools (explore the codebase, read files, query the graph) across many turns —
 * more capable and more robust. Used by agents that benefit from grounding in
 * the real code (review, analysis).
 *
 * Runs on the Claude Max subscription (no API key), like the rest of the fleet:
 * ANTHROPIC_API_KEY is stripped so the subscription login is used. Tools are on
 * via --dangerously-skip-permissions; no --strict-mcp-config, so the CLI's
 * registered MCP servers (e.g. codebase-memory) are available.
 */
import { spawn } from "node:child_process";

export interface CapableAgentResult {
  text: string; // the agent's final message (raw)
  model: string;
  ok: boolean;
}

export function runCapableAgent(opts: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  cwd?: string; // run in a repo checkout so the repo map + Read target it
  maxTurns?: number;
  timeoutMin?: number;
}): Promise<CapableAgentResult> {
  const model = opts.model ?? "claude-opus-4-8";
  const args = [
    "-p",
    "--output-format", "json",
    "--model", model,
    "--dangerously-skip-permissions",
    "--max-turns", String(opts.maxTurns ?? 30),
  ];
  if (opts.systemPrompt) args.push("--append-system-prompt", opts.systemPrompt);
  const env = { ...process.env };
  delete env.ANTHROPIC_API_KEY; // use the Max login, not a key
  delete env.ANTHROPIC_AUTH_TOKEN;

  const call = () =>
    new Promise<CapableAgentResult>((resolve) => {
      const child = spawn("claude", args, { cwd: opts.cwd, env, stdio: ["pipe", "pipe", "pipe"] });
      let out = "";
      let err = "";
      const timer = setTimeout(() => child.kill("SIGKILL"), (opts.timeoutMin ?? 12) * 60_000);
      child.stdout.on("data", (d) => (out += d));
      child.stderr.on("data", (d) => (err += d));
      child.on("error", (e) => {
        clearTimeout(timer);
        resolve({ text: String(e), model, ok: false });
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        try {
          const j = JSON.parse(out) as { result?: string; is_error?: boolean };
          if (j.result) return resolve({ text: String(j.result), model: `${model} (max-cli)`, ok: code === 0 && !j.is_error });
        } catch {
          /* fall through */
        }
        resolve({ text: (out || err).slice(-2000), model: `${model} (max-cli)`, ok: false });
      });
      child.stdin.write(opts.prompt);
      child.stdin.end();
    });

  return call().then((r) => (r.ok || r.text ? r : call()));
}
