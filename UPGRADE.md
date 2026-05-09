# Upgrading BinaryLab v1.0 → v1.2

## What's new (3 files to add, 2 to replace)

### Add these 3 new component files
```
src/components/Pipeline.jsx       ← Live Conversion Pipeline
src/components/Learn.jsx          ← Structured lesson system
src/components/DailyChallenge.jsx ← Daily + topic challenges
```

### Replace these 2 files
```
src/App.jsx     ← adds new tabs, badges, default-to-Pipeline
src/utils.js    ← adds toAsciiChar(), toOctal(), APP_VERSION
```

### Bump version in package.json
```json
"version": "1.2.0"
```

---

## Step-by-step

```bash
# 1. Drop the three new components into src/components/
cp Pipeline.jsx       your-project/src/components/
cp Learn.jsx          your-project/src/components/
cp DailyChallenge.jsx your-project/src/components/

# 2. Replace App.jsx and utils.js
cp App.jsx   your-project/src/
cp utils.js  your-project/src/

# 3. No new npm packages needed — all dependencies already in v1.0
#    (lucide-react, @vercel/analytics, axios are all already installed)

# 4. Run locally
npm run dev
```

---

## No backend changes required

All API routes, lib/ utilities, MongoDB schema, email templates, and Vercel
config are **identical to v1.0**. The Learn module uses `localStorage` for
progress; the Daily Challenge uses `localStorage` for completion state. No new
database fields or API endpoints are needed.

---

## Feature flags (optional)

If you want to hide any new tab while it's in beta, set it inactive in `App.jsx`
by removing it from the `TABS` array or adding a `hidden: true` field.

---

## Known limitations in v1.2

- Learn progress lives in `localStorage` — not synced to MongoDB. A future v1.3
  could add a `POST /api/user/lesson-progress` endpoint to persist it server-side.
- Daily Challenge XP bonus is tracked client-side only (completion stored in
  localStorage). To prevent farming on different devices, add server-side
  daily-challenge completion tracking.
- The `DEC→ASCII` question type in DailyChallenge is ready but gated behind
  the Learn module's ASCII lesson completion — wire this up by checking
  `profile?.stage?.unlockedCategories` if you want it in the main Quiz too.
