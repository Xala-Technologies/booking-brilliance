import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organizationType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-demo-request", {
        body: {
          name: formData.name,
          email: formData.email,
          organizationType:
            formData.organizationType || formData.phone || "Ikke oppgitt",
          message:
            formData.message || `Telefon: ${formData.phone || "Ikke oppgitt"}`,
        },
      });
      if (error) throw error;
      toast({
        title: "Demo-forespørsel sendt",
        description: "Vi tar kontakt for å avtale en demo.",
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          organizationType: "",
          message: "",
        });
      }, 4000);
    } catch (error) {
      console.error("Error sending demo request:", error);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke sende forespørselen. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hairline-bottom inputs on light surface — AA contrast on ink text
  const fieldClass =
    "w-full bg-transparent border-0 border-b border-rule-strong focus:border-navy rounded-none px-0 py-3 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:ring-0 transition-colors duration-quick";

  return (
    <section id="kontakt" className="relative py-14 lg:py-20 bg-accent-tinted">
      <div className="container mx-auto px-4">
        <SectionRule label="IX. KONTAKT" />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-gutter">
          <div className="lg:col-span-6">
            <EditorialHeading as="h2" size="display" className="mb-6">
              Book en{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings:
                    '"opsz" 120, "wght" 380, "SOFT" 60, "WONK" 1',
                }}
              >
                demo.
              </em>
            </EditorialHeading>

            <p
              className="text-xl text-ink-soft measure leading-relaxed mb-10"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              30–45 minutter, tilpasset deres bruksområde. Privat lokale, kommune,
              kulturhus eller foreningsbygg — vi viser hvordan Digilist håndterer
              det.
            </p>

            <ul className="space-y-5">
              {[
                {
                  label: "Personlig gjennomgang",
                  caption: "Live demo med en av våre løsningsdesignere",
                },
                {
                  label: "Ingen forpliktelser",
                  caption: "Gratis demo uten binding eller salgsprat",
                },
                {
                  label: "Rask respons",
                  caption: "Vi tar kontakt innen 24 timer",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <CheckCircle2
                    className="h-5 w-5 mt-1 shrink-0 text-accent-text"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <p
                      className="font-serif text-lg text-ink"
                      style={{
                        fontVariationSettings: '"opsz" 36, "wght" 480',
                      }}
                    >
                      {item.label}
                    </p>
                    <p className="text-base text-ink-soft">{item.caption}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            {isSubmitted ? (
              <div className="border border-rule rounded-sm bg-paper p-10 lg:p-12">
                <p className="editorial-mono-caption text-accent-text mb-4">
                  Bekreftelse
                </p>
                <h3
                  className="font-serif text-4xl text-ink mb-4"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  Takk.
                </h3>
                <p className="text-lg text-ink-soft measure">
                  Forespørselen er mottatt. Vi tar kontakt innen 24 timer.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-rule rounded-sm bg-paper p-8 lg:p-10 space-y-7"
              >
                <div>
                  <label
                    htmlFor="cta-name"
                    className="editorial-mono-caption block mb-2"
                  >
                    Navn
                  </label>
                  <input
                    id="cta-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ditt fulle navn"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cta-email"
                    className="editorial-mono-caption block mb-2"
                  >
                    E-post
                  </label>
                  <input
                    id="cta-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="din@epost.no"
                    className={fieldClass}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="cta-phone"
                      className="editorial-mono-caption block mb-2"
                    >
                      Telefon
                    </label>
                    <input
                      id="cta-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+47 ..."
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cta-org"
                      className="editorial-mono-caption block mb-2"
                    >
                      Organisasjon
                    </label>
                    <input
                      id="cta-org"
                      type="text"
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      placeholder="Kommune / Selskap / Forening"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cta-message"
                    className="editorial-mono-caption block mb-2"
                  >
                    Melding (valgfritt)
                  </label>
                  <textarea
                    id="cta-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Fortell oss om deres bruksområde..."
                    rows={4}
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                  <EditorialButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    icon={
                      isSubmitting ? (
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : true
                    }
                  >
                    {isSubmitting ? "Sender..." : "Send forespørsel"}
                  </EditorialButton>
                  <p className="editorial-mono-caption">
                    Godtar{" "}
                    <a
                      href="/personvern"
                      className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      personvernerklæringen
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
