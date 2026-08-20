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

### Why nginx redirects instead of prerender HTML?

The prerendered redirect HTML files exist in `dist/en/*` but nginx's SPA `try_files` fallback catches all unknown routes and serves root `index.html` before checking for the prerendered files.

Explicit nginx `location` blocks with `return 301` ensure the redirect happens at the server level before any file lookup.
