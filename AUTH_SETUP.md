# Auth & Email Setup 

## What was fixed in v1.2

### Bug 1 — Password reset never worked
`forgot-password.js` was storing the **raw** token in MongoDB, but
`reset-password.js` was looking for the **SHA-256 hash** of that token.
These never matched, so every reset link returned "invalid or expired."

**Fix:** `forgot-password.js` now stores `sha256(rawToken)` in the DB
and sends the raw token in the email link. `reset-password.js` hashes
the incoming token to find the user — they now match.

### Bug 2 — CORS duplicate header
`lib/cors.js` called `res.setHeader("Access-Control-Allow-Origin",...)`
Some browsers and proxies treat this as an invalid header and
block the request.

**Fix:** Single header call. Also added `x-csrf-token` to allowed
headers (was missing — meant CSRF tokens were being stripped).

### Bug 3 — Email verification had no CORS
`api/auth/verify-email.js` had no `cors()` call. When the frontend
called it from a different port (e.g. 5173 vs 3000), the browser blocked it.

**Fix:** Added `cors(req, res)` as the first line.

### Bug 4 — Cookies rejected on localhost
`lib/cookies.js` always set `Secure; SameSite=None`.
Browsers **refuse** to store `Secure` cookies on plain HTTP.
Since `vercel dev` and `npm run dev` run on HTTP locally,
login/register appeared to succeed but no session was saved —
every refresh showed the user as logged out.

**Fix:** In development (detected via `NODE_ENV` / `VERCEL_ENV`),
cookies are set with `SameSite=Lax` only. In production (HTTPS),
`Secure; SameSite=None` is used as before.

---

## Environment variables you MUST set

Copy `.env.example` to `.env.local` for local dev.
In Vercel dashboard → Settings → Environment Variables, add:

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `ACCESS_SECRET` | ✅ Yes | 64-char random hex — for JWT signing |
| `REFRESH_SECRET` | ✅ Yes | Different 64-char random hex |
| `APP_URL` | ✅ Yes | Your deployed URL, e.g. `https://binary-lab.vercel.app` |
| `CLIENT_URL` | ✅ Yes | Same as `APP_URL` (used in CORS) |
| `RESEND_API_KEY` | ✅ if using Resend | From resend.com dashboard |
| `FROM_EMAIL` | ✅ if using Resend | Must be a verified domain in Resend |
| `USE_NODEMAILER` | Optional | Set to `"true"` to use Gmail instead |
| `EMAIL_USER` | ✅ if using Gmail | Your Gmail address |
| `EMAIL_PASS` | ✅ if using Gmail | Gmail App Password (not your password) |
| `APP_NAME` | Optional | Defaults to `"Binary-Lab"` |

Generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run it twice — one for ACCESS_SECRET, one for REFRESH_SECRET.

---

## Local dev: which email provider to use?

### Easiest: Gmail App Password
1. Enable 2-factor auth on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Set in `.env.local`:
   ```
   USE_NODEMAILER=true
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
Gmail limits: 500 emails/day. Fine for development.

### Production: Resend
1. Sign up at https://resend.com (free — 3,000 emails/month)
2. Add and verify your domain
3. Get your API key
4. Set in Vercel dashboard:
   ```
   RESEND_API_KEY=re_...
   FROM_EMAIL=noreply@yourdomain.com
   ```

---

## Auth flow summary

```
REGISTER
  → POST /api/auth/register
  → creates user (emailVerified: false)
  → sends welcome + verify email (raw token in link)
  → sets auth cookies (logged in immediately)
  → frontend shows "verify your email" banner

EMAIL VERIFY
  → user clicks link → GET /api/auth/verify-email?token=RAW
  → server hashes token, finds user, sets emailVerified: true
  → frontend redirects to app

LOGIN
  → POST /api/auth/login
  → checks emailVerified — rejects if false
  → rate limited: 5 attempts per minute per email+IP
  → locks account for 15 min after 5 failed attempts
  → sets 3 cookies: accessToken (15min), refreshToken (7d), csrfToken

TOKEN REFRESH
  → access token expires → axios interceptor auto-calls POST /api/auth/refresh
  → server rotates refresh token (old one deleted, new one issued)
  → transparent to the user

FORGOT PASSWORD
  → POST /api/auth/forgot-password
  → stores SHA-256 hash of token in DB
  → sends raw token in reset link
  → always returns success (never reveals if email exists)

RESET PASSWORD
  → GET /api/auth/reset-password?token=RAW → validates token
  → POST /api/auth/reset-password { token, password, confirmPassword }
  → hashes token to verify, updates password, logs user in
```

---

## MongoDB indexes to create

Run once in MongoDB Atlas (or mongosh):
```js
use binarylab

db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.sessions.createIndex({ token: 1 })
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.rateLimit.createIndex({ key: 1 })
db.rateLimit.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

The TTL indexes on `sessions` and `rateLimit` auto-delete expired documents.
