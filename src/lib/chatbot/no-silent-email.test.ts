import { describe, expect, it } from "vitest";
import { decideTurn } from "./turn";

/**
 * An email is sent only when the visitor has asked for one.
 *
 * The rule this pins, in one line: nothing reaches the inbox unless there is
 * someone to reply to.
 *
 * What went wrong. A visitor typed "Hva koster det å leie et lokale?" and that
 * single message produced a notification titled "Noen har startet en samtale",
 * with Organisasjon, Navn, E-post and Telefon all showing a dash — because at
 * that point the assistant had collected none of them. It was built to make
 * sure no contact went unseen, and instead filled the inbox with conversations
 * nobody could act on.
 */
const priceQuestion = {
  userTurns: ["Hva koster det å leie et lokale?"],
  reply: "Det avhenger av lokaltype og dato.",
  hitCount: 2,
  leadAlreadyFiled: false,
  alreadyNotified: false,
};

describe("the chatbot never emails about someone it cannot name", () => {
  it("does not notify on a bare price question", () => {
    const d = decideTurn(priceQuestion);
    expect(d.notify, "a question with no contact details must not send mail").toBe("none");
  });

  it("offers the form on that same turn instead", () => {
    // The visitor is not dropped — this is the replacement, not a removal.
    expect(decideTurn(priceQuestion).showInquiryCta).toBe(true);
  });

  it("offers the form to a serious visitor who never asks for a human", () => {
    // This is the case that proves the NEW path works. The one above passes
    // either way, because that phrasing already trips needsHuman — I only
    // found that out by disabling the new branch and watching the test stay
    // green. This conversation scores 68 with no human-request phrasing and
    // retrieval hits, so the qualified branch is the only thing that can
    // surface the CTA.
    const d = decideTurn({
      ...priceQuestion,
      userTurns: ["vi har tre idrettshaller og vurderer å bytte system"],
    });
    expect(d.notify, "must still not email").toBe("none");
    expect(d.showInquiryCta, "a serious visitor must be offered the form").toBe(true);
  });

  it("still notifies the moment an address is given", () => {
    const d = decideTurn({
      ...priceQuestion,
      userTurns: ["Vi vurderer Digilist for fire haller. kari@nordre-follo.kommune.no"],
    });
    expect(d.notify).toBe("lead");
    expect(d.contact.email).toBe("kari@nordre-follo.kommune.no");
  });

  it("never reports `qualified` — the kind that emailed with empty fields", () => {
    // Kept as its own case because `qualified` still exists in the type and a
    // future edit could route to it again. This is the assertion that would
    // catch that.
    const conversations = [
      ["hva koster det å leie et lokale?"],
      ["vi har tre idrettshaller og vurderer å bytte system"],
      ["kan jeg få snakke med en rådgiver?"],
      ["vi skal ut på anbud til høsten, hva koster dette for en kommune?"],
    ];
    for (const userTurns of conversations) {
      const d = decideTurn({ ...priceQuestion, userTurns });
      expect(d.notify, `"${userTurns[0]}" produced ${d.notify}`).not.toBe("qualified");
    }
  });
});
