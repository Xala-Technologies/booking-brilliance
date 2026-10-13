# Nginx Configuration Update Required

## XAL-1373: Redirect untranslated /en/* paths

The `nginx.snippet.conf` file now includes 301 redirects for untranslated `/en/*` paths.

### Manual deployment step required

After merging this PR, the nginx config on the server must be updated:

```bash
ssh root@72.61.23.56

# Insert the new redirect location blocks from server/nginx.snippet.conf
# into /etc/nginx/sites-enabled/digilist-apps.conf
# Place them BEFORE any try_files directive

# Test the configuration
nginx -t

# If test passes, reload nginx
nginx -s reload
```

The redirect blocks must come BEFORE the `try_files` directive so nginx returns 301 before falling back to the SPA shell.

**These blocks are not live yet.** `https://digilist.no/en/leie/kontorlokaler` answers 200 with the prerendered stub, not 301, which is proof the location blocks were never installed.

### Why nginx redirects instead of prerender HTML?

Not "instead of" — on top of. Both are wanted, and an earlier version of this file was wrong about why.

The prerendered stubs in `dist/en/*` **do** get served: `try_files` finds the file before it reaches its SPA fallback. Each stub is `noindex, follow` with a canonical to the Norwegian original, which is enough for Google to drop the URL from the index. That is what makes the removal of `Disallow: /en/` from `public/robots.txt` safe today, before this deploy happens.

A 301 is still strictly better: it consolidates the URL's accumulated equity onto the Norwegian page instead of discarding it, and it costs a crawler one request instead of two. `/en/leie/kontorlokaler` alone took 753 impressions in 28 days.

### The `/en` catch-all (required by the robots.txt change)

`nginx.snippet.conf` also ends the `/en` blocks with:

```nginx
location ~ ^/en(/|$) {
    try_files $uri $uri/index.html =404;
}
```

Without it, an `/en` path with no file on disk falls through to the SPA shell and answers **200** with `lang="nb-NO"` and `index, follow` — a soft 404 on an unbounded URL space, which is the one thing `Disallow: /en/` was still genuinely protecting. `scripts/prerender.mjs` now writes a `noindex` stub for every mirrored route *and* every untranslated blog post, so the remaining gap is only URLs nothing links to; this block closes it properly.

Two ordering rules, both load-bearing:

- It must be a **regex** location, not `location ^~ /en/`. A `^~` prefix match wins over regex locations, so it would swallow all the `return 301` blocks above it.
- Regex locations are matched in source order, so it must stay **last** of the `/en` blocks.

## Blog twin consolidation (2026-10-13): merge gate

`nginx.snippet.conf` lines 21-49 add eight `location =` blocks (four loser
slugs, each with and without a trailing slash) that 301 three pairs of
near-duplicate blog posts onto their winner. Same as the `/en` blocks above,
`deploy.sh` never touches this file — it rsyncs `server/` as the chatbot API
source only. These eight blocks are **not live** until someone pastes them in
by hand.

**Merge gate:** paste `nginx.snippet.conf` lines 21-49 into
`/etc/nginx/sites-enabled/digilist-apps.conf` (before the `try_files`
fallback, same placement rule as every other block in this file), run
`nginx -t && systemctl reload nginx`, then curl each loser URL and expect a
single 301 straight to its winner:

```bash
curl -sI https://digilist.no/blogg/hvilket-bookingsystem-bor-en-norsk-kommune-velge
curl -sI https://digilist.no/blogg/hvordan-digitalisere-booking-kommunale-lokaler
curl -sI https://digilist.no/blogg/digitalisere-booking-kommunale-lokaler
curl -sI https://digilist.no/blogg/beste-plattform-private-utleiere-leie-ut-lokalet
```

Each must answer `HTTP/2 301` with a `location:` header pointing directly at
its winner, not at another loser or at a second redirect. Until this step
runs, those four URLs still answer via the prerendered `dist/blogg/<loser>/`
stub (a `noindex, follow` HTML meta-refresh, not a true 301), which is enough
to keep them out of the index but does not consolidate their link equity onto
the winner the way the nginx 301 does.
