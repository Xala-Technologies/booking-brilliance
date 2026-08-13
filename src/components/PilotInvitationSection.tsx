import { CheckCircle2, ArrowUpRight, Package, ClipboardList } from "lucide-react";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  Byline,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { openChatbot } from "@/lib/chatbot/open";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const PilotInvitationSection = () => {
  const locale = localeFromPath(useLocation().pathname);
  const DELIVERS = Array.from({ length: 10 }, (_, i) => t(locale, `pilot.delivers.${i}`));
  const NEEDS = Array.from({ length: 5 }, (_, i) => t(locale, `pilot.needs.${i}`));
  return (
    <section
      id="pilot"
      className="py-14 lg:py-20 bg-accent-tinted"
      aria-labelledby="pilot-heading"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label={t(locale, "pilot.rule")} />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-gutter">
          {/* Left — invitation copy */}
          <div className="lg:col-span-7">
            <EditorialHeading
              as="h2"
              size="display"
              className="mb-8"
              {...({ id: "pilot-heading" } as object)}
            >
              {t(locale, "pilot.h2")}{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: getFraunces("display") }}
              >
                {t(locale, "pilot.h2em")}
              </em>
              .
            </EditorialHeading>

            <div className="space-y-5 text-lg text-ink-soft leading-relaxed measure">
              <p>
                {t(locale, "pilot.p1")}
              </p>
              <p>
                {t(locale, "pilot.p2")}
              </p>
              <p>
                <strong className="text-ink">
                  {t(locale, "pilot.p3em")}
                </strong>{" "}
                {t(locale, "pilot.p3tail")}
              </p>
              <p className="text-ink font-medium">
                {t(locale, "pilot.p4")}
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <EditorialButton
                variant="primary"
                size="lg"
                href="mailto:kontakt@digilist.no?subject=Pilot%20for%20kommune"
                icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              >
                {t(locale, "pilot.cta")}
              </EditorialButton>
              <EditorialButton
                variant="outline"
                size="lg"
                icon={false}
                onClick={(e) => {
                  e.preventDefault();
                  openChatbot({ mode: "chat" });
                }}
              >
                {t(locale, "nav.talkToUs")}
              </EditorialButton>
            </div>

            <Byline
              author="Ibrahim Rahmani"
              role={t(locale, "pilot.role")}
              date={t(locale, "pilot.date")}
              className="mt-10"
            />
          </div>

          {/* Right — what we deliver + what we need */}
          <div className="lg:col-span-5 space-y-6">
            <EditorialCard className="bg-paper">
              <header className="mb-6 pb-5 border-b border-rule">
                <span className="editorial-mono-caption text-accent-text mb-3 block">
                  {t(locale, "pilot.offerLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-accent-text shrink-0">
                    <Package
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <h3
                    className="font-serif text-2xl lg:text-3xl text-ink leading-tight"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {"Digilist"}{" "}
                    <em
                      className="italic"
                      style={{
                        fontVariationSettings:
                          '"opsz" 36, "wght" 420',
                      }}
                    >
                      {t(locale, "pilot.deliverEm")}
                    </em>
                  </h3>
                </div>
              </header>
              <ul className="space-y-3.5">
                {DELIVERS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className="h-4 w-4 mt-1 shrink-0 text-accent-text"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span
                      className="text-base lg:text-[1.0625rem] text-ink leading-snug"
                      style={{
                        fontVariationSettings: '"opsz" 24, "wght" 400',
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </EditorialCard>

            <EditorialCard className="bg-paper">
              <header className="mb-6 pb-5 border-b border-rule">
                <span className="editorial-mono-caption text-accent-text mb-3 block">
                  {t(locale, "pilot.inputLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-accent-text shrink-0">
                    <ClipboardList
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <h3
                    className="font-serif text-2xl lg:text-3xl text-ink leading-tight"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {t(locale, "pilot.needH3")}{" "}
                    <em
                      className="italic"
                      style={{
                        fontVariationSettings:
                          '"opsz" 36, "wght" 420',
                      }}
                    >
                      {t(locale, "pilot.needH3em")}
                    </em>
                  </h3>
                </div>
              </header>
              <ul className="space-y-3.5">
                {NEEDS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="h-4 w-4 mt-1.5 shrink-0 inline-flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="w-2 h-2 rounded-full bg-accent-text" />
                    </span>
                    <span
                      className="text-base lg:text-[1.0625rem] text-ink leading-snug"
                      style={{
                        fontVariationSettings: '"opsz" 24, "wght" 400',
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-6 italic text-sm lg:text-base text-ink-faint border-t border-rule pt-5"
                style={{
                  fontFamily: '"Newsreader", Georgia, serif',
                  fontVariationSettings:
                    '"opsz" 24, "wght" 380',
                }}
              >
                {t(locale, "pilot.footnote")}
              </p>
            </EditorialCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilotInvitationSection;
