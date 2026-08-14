/**
 * How large a system prompt the chat endpoint will accept.
 *
 * This is a CONTRACT between two programs that cannot import each other: the
 * browser builds the prompt, and `server/index.mjs` — plain Node, no bundler —
 * rejects it with 413 if it is too long. The number lived only in the server,
 * so the client had no idea it existed and happily built prompts over it.
 *
 * What that cost. The prompt is a fixed template plus the three retrieved FAQ
 * entries plus up to six page suggestions. This site's page titles are long
 * (they are written for search), so the suggestions block runs several hundred
 * characters, and the pricing FAQ entries are the longest answers in the
 * corpus. Together they crossed 8000 and the endpoint refused the request —
 * on 9 of 38 topics, INCLUDING every pricing question, which is what 62 of the
 * last 251 visitor messages were about. The assistant fell back to reading FAQ
 * entries aloud and nothing said why.
 *
 * `limits.test.ts` pins this against the server's own number, because two
 * constants that must agree and cannot see each other will drift.
 */
export const MAX_SYSTEM_CHARS = 12000;

/**
 * Headroom kept below the ceiling when the client trims.
 *
 * The client aims here, not at the limit, so that a prompt built from slightly
 * different data than we measured still fits. A prompt that is 200 characters
 * too long is not degraded — it is rejected outright.
 */
export const SYSTEM_BUDGET = MAX_SYSTEM_CHARS - 1500;
