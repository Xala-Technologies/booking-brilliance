import { TRANSLATED_PATHS } from "./i18n";

/**
 * A page that has no English twin, for tests that need one.
 *
 * Six tests hard-coded `/om-oss` as "the untranslated page". Translating it
 * turned all six red at once, and none of the failures said what had actually
 * happened — they read as i18n regressions. Since translating pages is the
 * ongoing job, that fixture was guaranteed to rot again.
 *
 * So the fixture asserts its own premise. When this page gets translated the
 * error names the problem and the fix, instead of six assertion diffs.
 *
 * It now points at one of the 38 Norwegian-query landing pages, which stay
 * Norwegian deliberately: nobody searches in English to rent a Norwegian
 * function room, and 38 thin English duplicates would land on a site Google
 * already declines to index 147 URLs of. That makes this a stable fixture
 * rather than one that rots on the next translation.
 */
export const UNTRANSLATED_PATH = "/leie/selskapslokale";

if (TRANSLATED_PATHS.has(UNTRANSLATED_PATH)) {
  throw new Error(
    `${UNTRANSLATED_PATH} is now translated, so it can no longer stand for ` +
      `"a page with no English twin". Point UNTRANSLATED_PATH at a path that ` +
      `is still absent from TRANSLATED_PATHS.`,
  );
}
