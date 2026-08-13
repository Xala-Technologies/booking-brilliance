import type { LegalDoc } from "@/content/legal";

/**
 * Renders a legal page from its data.
 *
 * The four legal pages were four copies of the same markup with different
 * Norwegian prose baked in, which is why translating one meant rewriting a
 * whole file. Now the markup lives here once and the prose is data, so the
 * English version of the next policy is an entry in `content/legal.ts`.
 *
 * The classes are lifted verbatim from the Cookies page so the rendered result
 * is byte-identical to what shipped — this is a translation change, not a
 * redesign, and a visual diff on a legal page is noise nobody asked for.
 */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <section className="pt-32 pb-16">
      <div className="container mx-auto md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {doc.title}
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {doc.intro}
          </p>

          {doc.sections.map((section) => (
            <div key={section.h2} className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {section.h2}
              </h2>

              {section.blocks.map((block, i) => (
                // The blocks of one section are an ordered sequence of
                // paragraphs, not a keyed set — several are body-only and two
                // share no unique text, so the index is the identity here.
                <div key={i}>
                  {block.h3 && (
                    <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">
                      {block.h3}
                    </h3>
                  )}
                  {block.body && (
                    <p
                      className={`text-muted-foreground leading-relaxed ${
                        block.bullets ? "mb-2" : ""
                      }`}
                    >
                      {block.body}
                    </p>
                  )}
                  {block.bullets && (
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                      {block.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
