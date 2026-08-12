import { describe, expect, it } from "vitest";
import { SALES_PERSONA } from "./sales/persona";
import {
  SERIOUS_LEAD_SCORE,
  claimsFalseAction,
  contactFromTurns,
  extractContact,
  handoffNotice,
  honestHandoffReply,
  needsHuman,
  shouldNotify,
} from "./contact";

describe("extractContact", () => {
  it("pulls an email out of a bare reply, the way visitors actually answer", () => {
    // Verbatim from the 2026-08-12 conversation. The assistant asked for an
    // address and the visitor sent nothing but the address.
    expect(extractContact("wahidullah_rahmani@hotmail.com").email).toBe("wahidullah_rahmani@hotmail.com");
  });

  it("never captures our own address — a lead that replies to our own inbox", () => {
    // "jeg prøvde å sende til post@digilist.no men fikk ikke svar" was filed as
    // a lead. Anyone quoting our address is telling us they could not reach us.
    expect(extractContact("jeg prøvde å sende til post@digilist.no").email).toBeNull();
    expect(extractContact("skrev til Kontakt@Digilist.no").email).toBeNull();
    expect(extractContact("sendte til noen@mail.digilist.no").email).toBeNull();
    // A domain that merely ENDS in something similar is still a real visitor.
    expect(extractContact("min adresse er ola@ikkedigilist.no").email).toBe("ola@ikkedigilist.no");
  });

  it("finds an email inside a sentence and lower-cases it", () => {
    // Was `Post@Digilist.NO` — our OWN address, which is now deliberately never
    // captured. The behaviour it checks (find it, lower-case it) is unchanged;
    // the fixture just happened to pick the one address that cannot be a lead.
    expect(extractContact("Send det til Kari@Lillevik.NO takk").email).toBe("kari@lillevik.no");
  });

  it("handles Norwegian letters in the local part", () => {
    expect(extractContact("kjøp@bærum.no").email).toBe("kjøp@bærum.no");
  });

  it("finds a Norwegian phone number, spaced or prefixed, and normalises it", () => {
    expect(extractContact("ring meg på 912 34 567").phone).toBe("91234567");
    expect(extractContact("+47 91234567").phone).toBe("+4791234567");
  });

  it("does not mistake a longer digit run for a phone number", () => {
    // An org number is 9 digits; a year is 4. Neither is a phone number, and a
    // false positive files a lead against something that cannot be called.
    expect(extractContact("orgnr 923456789").phone).toBeNull();
    expect(extractContact("vi startet i 2019 med 30 lokaler").phone).toBeNull();
  });

  it("returns nulls for a turn with no contact details", () => {
    expect(extractContact("Hva koster det for to lokaler?")).toEqual({ email: null, phone: null });
  });
});

describe("contactFromTurns", () => {
  it("keeps the FIRST address across a conversation", () => {
    const turns = ["Hei", "post@kommune.no", "eller kanskje annen@kommune.no"];
    expect(contactFromTurns(turns).email).toBe("post@kommune.no");
  });

  it("collects an email and a phone from different turns", () => {
    const c = contactFromTurns(["post@kommune.no", "eller ring 912 34 567"]);
    expect(c).toEqual({ email: "post@kommune.no", phone: "91234567" });
  });

  it("is empty for a conversation that never shares details", () => {
    expect(contactFromTurns(["hei", "hva koster det?"])).toEqual({ email: null, phone: null });
  });
});

describe("claimsFalseAction", () => {
  it("catches the exact sentences that shipped to a live prospect", () => {
    // Both verbatim from the screenshot. The assistant has no ability to send
    // anything; the visitor was left waiting for an offer that never existed.
    expect(claimsFalseAction("Perfekt. Jeg sender tilbudet til e-postadressen deres — hva er den?")).toBe(true);
    expect(
      claimsFalseAction(
        "Takk. Jeg sender tilbudet nå til wahidullah_rahmani@hotmail.com. Dere får oversikt over pris for to lokaler med egen nettside.",
      ),
    ).toBe(true);
  });

  it("catches the other ways the same lie gets phrased", () => {
    for (const claim of [
      "Jeg har sendt det til deg.",
      "Vi sender prisoversikten på e-post i dag.",
      "Dere får detaljene på e-post om litt.",
      "Jeg setter opp en demo for dere.",
      "Jeg oppretter en konto til dere.",
      "Det kommer i innboksen din straks.",
    ]) {
      expect(claimsFalseAction(claim), claim).toBe(true);
    }
  });

  it("does NOT trip on talking about an offer, which is legitimate", () => {
    // The bot must still be able to discuss offers, prices and demos. Matching
    // the noun rather than the action would gut the sales conversation.
    for (const fine of [
      "Et tilbud avhenger av hvor mange lokaler dere har.",
      "En rådgiver kan gå gjennom pris for deres oppsett.",
      "Vil dere ha et tilbud, sender jeg forespørselen videre til en rådgiver.",
      "Dere får en oversikt i møtet.",
      "Prisen settes ut fra antall lokaler.",
    ]) {
      expect(claimsFalseAction(fine), fine).toBe(false);
    }
  });
});

describe("honestHandoffReply", () => {
  it("names the address it will pass on, and promises only a follow-up", () => {
    const reply = honestHandoffReply({ email: "post@kommune.no", phone: null });
    expect(reply).toContain("post@kommune.no");
    expect(reply).toContain("rådgiver");
    expect(claimsFalseAction(reply)).toBe(false);
  });

  it("asks for an address when there is none, without promising anything", () => {
    const reply = honestHandoffReply({ email: null, phone: null });
    expect(reply).toContain("e-postadressen");
    expect(claimsFalseAction(reply)).toBe(false);
  });
});

describe("the sales prompt states what the assistant cannot do", () => {
  it("forbids claiming to send, and says what actually happens instead", () => {
    // The prompt is the first line of defence; contact.ts is the second. If
    // this block is ever removed, the guard alone would be silently carrying
    // a rule nobody can read.
    expect(SALES_PERSONA).toContain("HVA DU FAKTISK KAN GJØRE");
    expect(SALES_PERSONA).toContain("kan ikke sende e-post");
    expect(SALES_PERSONA).toMatch(/ALDRI si at du sender/);
    expect(SALES_PERSONA).toContain("en rådgiver tar kontakt");
  });
});

describe("needsHuman — when to put the escalation in front of the visitor", () => {
  it("fires on the things the assistant genuinely cannot do", () => {
    for (const ask of [
      "Kan vi få et tilbud?",
      "Jeg vil ha et pristilbud",
      "Kan vi få en demo?",
      "Ring meg i morgen",
      "Kan dere kontakte meg?",
      "Jeg vil snakke med en rådgiver",
      "Kan vi avtale et møte?",
      "Hva koster det for to lokaler?",
      "Hvordan kommer vi i gang?",
      "Send meg detaljene",
    ]) {
      expect(needsHuman(ask), ask).toBe(true);
    }
  });

  it("catches the exact turn that hid the button on a live conversation", () => {
    // "hva koster det for to lokaler" matches the pricing FAQ, so retrieval
    // succeeded, so `hits.length === 0` was false, so the escalation button was
    // hidden — on the turn where the visitor was trying to buy.
    expect(needsHuman("hva koster det for to lokaler med egen nettside")).toBe(true);
  });

  it("does NOT fire on ordinary questions the assistant can answer itself", () => {
    for (const ask of [
      "Støtter dere ID-porten?",
      "Hvordan fungerer sesongleie?",
      "Er dere GDPR-kompatible?",
      "Hvilke kunder bruker Digilist?",
      "Kan man betale med Vipps?",
    ]) {
      expect(needsHuman(ask), ask).toBe(false);
    }
  });
});

describe("shouldNotify — only a serious prospect is worth a human", () => {
  it("stays quiet on an opening hello", () => {
    expect(shouldNotify({ userTurns: ["hei"], interest: 0 }).notify).toBe(false);
  });

  it("stays quiet on a long conversation with no buying interest", () => {
    // Two earlier versions notified here — one on the first message, one after
    // three. Both measured ACTIVITY. Three GDPR questions from a student is not
    // a lead, and burying a real one under those is how an inbox stops working.
    expect(
      shouldNotify({
        userTurns: ["hei", "er dere GDPR-kompatible?", "hvor lagres dataene?", "og backup?"],
        // Below the bar. This fixture said 20 when the threshold was 45; the
        // number has to mean "no buying interest", not a fixed constant.
        interest: 10,
      }).notify,
    ).toBe(false);
  });

  it("fires immediately when they ask for something only a human can deliver", () => {
    const v = shouldNotify({ userTurns: ["hei", "kan vi få et tilbud?"], interest: 0 });
    expect(v.notify).toBe(true);
    expect(v.reason).toContain("bare et menneske");
  });

  it("fires once the assistant reads them as a serious prospect", () => {
    const v = shouldNotify({ userTurns: ["vi har to lokaler og vurderer å bytte"], interest: 60 });
    expect(v.notify).toBe(true);
    expect(v.reason).toContain("60/100");
  });

  it("holds just below the bar", () => {
    expect(shouldNotify({ userTurns: ["hm"], interest: SERIOUS_LEAD_SCORE - 1 }).notify).toBe(false);
    expect(shouldNotify({ userTurns: ["hm"], interest: SERIOUS_LEAD_SCORE }).notify).toBe(true);
  });

  it("only looks at the LATEST turn for the human-needed trigger", () => {
    expect(shouldNotify({ userTurns: ["kan vi få et tilbud?", "takk"], interest: 0 }).notify).toBe(false);
  });

  it("handles an empty conversation without throwing", () => {
    expect(shouldNotify({ userTurns: [], interest: 0 }).notify).toBe(false);
  });
});

describe("handoffNotice — tell them, and stay in the room", () => {
  it("says a rådgiver is being told AND that the assistant is still here", () => {
    for (const notice of [handoffNotice(true), handoffNotice(false)]) {
      expect(notice).toContain("rådgiver");
      // The second half matters as much as the first: "we will contact you"
      // followed by silence is a dismissal, not a handoff.
      expect(notice).toMatch(/jeg er her|spør gjerne/i);
      // It must never become the thing it replaced.
      expect(claimsFalseAction(notice)).toBe(false);
    }
  });

  it("reads as an addition to a reply, not a new paragraph", () => {
    expect(handoffNotice(true).startsWith(" ")).toBe(true);
  });
});

describe("claimsFalseAction — the honest handoff is not a lie", () => {
  it("ALLOWS forwarding the inquiry onward, which is what actually happens", () => {
    // Verbatim from the live model, graded 2026-08-12. Accurate, useful, and
    // the bare `har sendt` rule was suppressing it.
    expect(
      claimsFalseAction("Takk for e-postadressen. Da har jeg sendt forespørselen videre til en rådgiver som tar kontakt der."),
    ).toBe(false);
    expect(claimsFalseAction("Jeg gir beskjed til en rådgiver som følger opp.")).toBe(false);
    expect(claimsFalseAction("Jeg sender forespørselen videre til oss.")).toBe(false);
  });

  it("still catches sending something TO THE VISITOR", () => {
    expect(claimsFalseAction("Jeg har sendt tilbudet til deg på e-post.")).toBe(true);
    expect(claimsFalseAction("Det raskeste er at vi sender dere et tilbud i dag.")).toBe(true);
  });

  it("catches a lie sitting next to an honest handoff in the same reply", () => {
    // One true sentence must not launder the one beside it.
    expect(
      claimsFalseAction("Jeg sender forespørselen videre til en rådgiver. Du får tilbudet på e-post i morgen."),
    ).toBe(true);
  });
});
