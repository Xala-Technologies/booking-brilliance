import { useState, FormEvent } from "react";
import { trackConversion } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  EditorialHeading,
  EditorialCard,
  EditorialButton,
  TrustBadge,
  Byline,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { openChatbot } from "@/lib/chatbot/open";
import { useLocation } from "react-router-dom";
import { localeFromPath, type Locale } from "@/lib/i18n";
import { t } from "@/lib/copy";

type FormState = {
  name: string;
  email: string;
  organization: string;
  phone: string;
  role: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  organization: "",
  phone: "",
  role: "",
  message: "",
};

// The submitted VALUE stays Norwegian in both languages — it is what the
// inquiry email and the lead pipeline key on, and translating it would split
// one segment into two that no report joins back up.
const ROLE_VALUES = [
  "kommune", "selskapslokale", "idrett", "kulturhus", "kontor", "annet",
] as const;

const roleOptionsFor = (locale: Locale) =>
  ROLE_VALUES.map((value) => ({ value, label: t(locale, `demo.role.${value}`) }));

const whatYouGetFor = (locale: Locale) => [1, 2, 3, 4].map((n) => t(locale, `demo.get${n}`));
const whatWeNeedFor = (locale: Locale) => [1, 2, 3].map((n) => t(locale, `demo.need${n}`));

type Props = {
  /** Source label sent with the inquiry — e.g. "book-demo" or "homepage-kontakt" */
  source: string;
  /** Show the Ibrahim byline (used on the /book-demo page, hidden on homepage) */
  showByline?: boolean;
  /** Heading level for the "Book en demo." title. Use h1 on /book-demo where
   *  it's the primary heading; default h2 keeps the homepage's hero h1 dominant. */
  headingAs?: "h1" | "h2";
  /** Render the visible "Book en demo." display heading. Set false on the
   *  homepage, where a "BOOK EN DEMO" section eyebrow labels it instead (an
   *  sr-only heading keeps the document outline intact). */
  heading?: boolean;
};

export function BookDemoBlock({
  source,
  showByline = false,
  headingAs = "h2",
  heading = true,
}: Props) {
  const locale = localeFromPath(useLocation().pathname);
  // Section sub-headings sit exactly one level below the main heading so the
  // outline never skips: H1→H2 on /book-demo (headingAs="h1"), H2→H3 on the
  // homepage (headingAs="h2"). Previously hardcoded <h3> → H1→H3 skip.
  const SubHeading = headingAs === "h1" ? "h2" : "h3";
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Always the NORWEGIAN label, whatever language the visitor used. This
      // string lands in the sales inbox and in any reporting built on it;
      // sending 'Public body' for one visitor and 'Kommune' for another splits
      // one segment into two that nothing joins back up.
      const roleLabel = t("nb", `demo.role.${form.role}`);
      const payload = {
        name: form.name,
        email: form.email,
        organization: form.organization,
        phone: form.phone,
        persona: form.role || "ukjent",
        topic: "Demo-forespørsel",
        message: form.message,
        summary: `Demo-forespørsel: ${form.organization} (${roleLabel})`,
        source,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Inquiry endpoint returned ${res.status}`);

      // Fired only after the endpoint confirms. Reporting on submit instead
      // would count failed sends as conversions and teach the ad platforms to
      // bid toward an outcome that never happened.
      trackConversion("demo_request", { source });

      setSubmitted(true);
    } catch (err) {
      console.error("[book-demo-block] /api/inquiry failed:", err);
      setError(
        t(locale, "demo.error"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.organization.trim() &&
    form.role &&
    !submitting;

  const inputClass =
    "block w-full border-0 border-b border-hairline-strong rounded-none bg-transparent px-0 py-3 font-sans text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-navy focus:ring-0 transition-colors duration-quick ease-editorial";
  const labelClass = "editorial-mono-caption text-ink-soft mb-1 block";

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-gutter mt-10 lg:mt-14">
      {/* Left: editorial copy */}
      <div className="lg:col-span-5">
        {heading ? (
          <EditorialHeading as={headingAs} size="display" className="mb-6">
            Book en{" "}
            <em
              className="italic"
              style={{ fontVariationSettings: getFraunces("display") }}
            >
              demo
            </em>
            .
          </EditorialHeading>
        ) : (
          <h2 className="sr-only">{t(locale, "demo.heading")}</h2>
        )}
        <p
          className="text-xl text-ink-soft italic measure leading-relaxed mb-10"
          style={{ fontVariationSettings: getFraunces("sub") }}
        >
          {t(locale, "demo.lede")}
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="space-y-10"
        >
          <motion.div variants={staggerChild}>
            <SubHeading className="editorial-mono-caption text-ink-soft mb-4">
              HVA DU FÅR
            </SubHeading>
            <ul className="space-y-3">
              {whatYouGetFor(locale).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-ink leading-relaxed"
                >
                  <CheckCircle2
                    className="h-4 w-4 mt-1 text-accent-text shrink-0"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerChild}>
            <SubHeading className="editorial-mono-caption text-ink-soft mb-4">
              HVA VI TRENGER FRA DEG
            </SubHeading>
            <ul className="space-y-3">
              {whatWeNeedFor(locale).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-ink leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 mt-2.5 rounded-full bg-accent-text shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={staggerChild}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            <TrustBadge>{t(locale, "demo.badge1")}</TrustBadge>
            <TrustBadge>{t(locale, "demo.badge2")}</TrustBadge>
            <TrustBadge>{t(locale, "demo.badge3")}</TrustBadge>
          </motion.div>

          <motion.div variants={staggerChild} className="pt-2">
            <p className="text-base text-ink-soft leading-relaxed measure">
              Foretrekker du en uformell prat først?{" "}
              <button
                type="button"
                onClick={() => openChatbot({ mode: "chat" })}
                className="underline underline-offset-4 decoration-[0.5px] text-accent-text hover:text-ink transition-colors"
              >
                Snakk med oss
              </button>{" "}
              og få svar i chat på under et minutt i kontortid.
            </p>
          </motion.div>

          {showByline && (
            <Byline
              author="Ibrahim Rahmani"
              role="Xala Technologies AS · CTO"
              date="Oslo · 2026"
            />
          )}
        </motion.div>
      </div>

      {/* Right: form card */}
      <div className="lg:col-span-7">
        <EditorialCard className="p-8 lg:p-12">
          {submitted ? (
            <div className="text-center py-12 lg:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-hairline-strong rounded-sm mb-6">
                <CheckCircle2
                  className="h-8 w-8 text-accent-text"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </div>
              <SubHeading
                className="font-serif text-3xl lg:text-4xl text-ink mb-4"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                }}
              >
                {t(locale, "demo.thanks")}
              </SubHeading>
              <p className="text-lg text-ink-soft measure mx-auto leading-relaxed mb-8">
                {t(locale, "demo.sentTo")}{" "}
                <span className="font-mono text-sm">admin@digilist.no</span>. En av oss
                {t(locale, "demo.replyTime")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <EditorialButton variant="primary" size="md" href="/">
                  Tilbake til forsiden
                </EditorialButton>
                <EditorialButton
                  variant="outline"
                  size="md"
                  onClick={() => openChatbot({ mode: "chat" })}
                >
                  Snakk med oss imens
                </EditorialButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <header className="pb-6 border-b border-rule">
                <span className="editorial-mono-caption text-accent-text">
                  DEMO-FORESPØRSEL
                </span>
                <SubHeading
                  className="font-serif text-2xl lg:text-3xl text-ink mt-2"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    letterSpacing: "-0.015em",
                    lineHeight: 1.15,
                  }}
                >
                  {t(locale, "demo.formHeading")}
                </SubHeading>
              </header>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={`${source}-name`} className={labelClass}>
                    {t(locale, "demo.name")} *
                  </label>
                  <input
                    id={`${source}-name`}
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder={t(locale, "demo.namePlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${source}-email`} className={labelClass}>
                    {t(locale, "demo.email")} *
                  </label>
                  <input
                    id={`${source}-email`}
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder={t(locale, "demo.emailPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${source}-org`} className={labelClass}>
                    {t(locale, "demo.org")} *
                  </label>
                  <input
                    id={`${source}-org`}
                    type="text"
                    required
                    autoComplete="organization"
                    value={form.organization}
                    onChange={handleChange("organization")}
                    placeholder={t(locale, "demo.orgPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${source}-phone`} className={labelClass}>
                    {t(locale, "demo.phone")}
                  </label>
                  <input
                    id={`${source}-phone`}
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="+47 ..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${source}-role`} className={labelClass}>
                  {t(locale, "demo.role")} *
                </label>
                <select
                  id={`${source}-role`}
                  required
                  value={form.role}
                  onChange={handleChange("role")}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Velg …
                  </option>
                  {roleOptionsFor(locale).map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${source}-message`} className={labelClass}>
                  {t(locale, "demo.message")}
                </label>
                <textarea
                  id={`${source}-message`}
                  rows={4}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder={t(locale, "demo.messagePlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="border-l-2 border-navy bg-paper-deep/60 px-4 py-3 text-sm text-ink"
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6">
                <EditorialButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!canSubmit}
                  icon={
                    submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    )
                  }
                >
                  {submitting ? t(locale, "demo.submitting") : t(locale, "demo.submit")}
                </EditorialButton>
                <p className="text-xs text-ink-faint leading-relaxed">
                  Vi følger{" "}
                  <Link
                    to="/personvern"
                    className="underline underline-offset-2 decoration-[0.5px] hover:text-ink"
                  >
                    personvernerklæringen
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </EditorialCard>
      </div>
    </div>
  );
}
