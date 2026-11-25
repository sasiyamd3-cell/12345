# MIYORA PAIR

A small Node.js + static HTML WhatsApp pairing portal for Vercel.

## Files
- `index.html` — frontend
- `api/pair.js` — server-side proxy to the Heroku pairing endpoint
- `package.json` — project metadata

## Deploy to Vercel
1. Upload this folder to a GitHub repository.
2. Import the repository in Vercel. Framework preset: **Other**.
3. In Vercel → Project Settings → Environment Variables, add:
   - Name: `PAIR_API_TOKEN`
   - Value: your pairing API token
4. Redeploy after adding the environment variable.

The API token is kept on the server and is not sent to the browser.

## Local testing
Use Vercel CLI (`vercel dev`) from the project root after setting `PAIR_API_TOKEN` in your local environment.

## Notes
- Enter phone numbers in international format, digits only (example: `94776734030`).
- The website displays the code returned by the upstream API; it does not generate pairing codes itself.
- The exact upstream response format may vary. If the API uses an unusual JSON field name or response shape, update `findCode()` in `index.html` to match it.
- Only pair WhatsApp accounts with the account owner's authorization.
