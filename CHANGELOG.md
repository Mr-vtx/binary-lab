# BinaryLab Changelog

---

## v1.2.0 — Guided Learning Release

### 🆕 New Features

#### ★ Live Conversion Pipeline (`src/components/Pipeline.jsx`)
- Single input auto-detects **text / binary / hex / decimal** and fans all outputs out simultaneously
- Shows: ASCII, Binary (8-bit), Decimal, Hexadecimal, Octal, Base64, URL-Encoded, Morse
- **Bit-level breakdown** panel for inputs ≤ 4 characters — interactive bit grid with place values
- One-click copy on every output row
- Quick-pick example buttons: `Hello`, `BinaryLab`, `01000001`, `0x48 0x69`, `65`, `SOS`
- Colour-coded rows by format (green=ASCII, cyan=Binary, amber=Hex, purple=Encoded)
- Replaces the old Converter as the landing/default tab

#### 📚 Structured Learn Module (`src/components/Learn.jsx`)
**3 modules · 8 lessons · 290 XP total**

| Module | Lessons |
|--------|---------|
| Binary Fundamentals | What is Binary?, Place Values & Powers of 2, Bits Bytes & Data Size |
| Encoding & ASCII | The ASCII Standard, Hexadecimal, Unicode & UTF-8 |
| Networks & Binary | IP Addresses in Binary, Subnet Masks |

- **Sidebar navigation** — collapsible module groups, per-lesson status (locked / in-progress / complete)
- **Progression unlocking** — must pass lesson quiz (≥2/3) before next lesson unlocks; must complete a module before the next module opens
- **Inline interactive visuals** embedded in lesson content:
  - Counting table, Bit-weight toggler (click bits → see decimal), ASCII key-values grid, Hex↔Binary map, IP breakdown (live converter), Subnet mask slider
- **"Why this matters"** callout on every lesson — answers the "so what?" for beginners
- Per-lesson mini-quiz with correct/incorrect explanation and retry on fail
- XP awarded on lesson pass (20–45 XP per lesson)
- Progress persisted in `localStorage` keyed by user ID (guest-safe)
- Mobile-friendly: sidebar hidden behind toggle on narrow screens

#### 🎯 Challenges Tab (`src/components/DailyChallenge.jsx`)
- **Daily Challenge** — 5 questions, same seed for every user on a given day, resets midnight UTC, +50 XP, stored completed state so it can't be re-farmed
- **5 Topic Challenges**: Binary Sprint (10q), ASCII Master (8q), Hex Wizard (8q), Morse Operator (6q), Mixed Pro (15q)
- Full results screen: score, time taken, per-question breakdown, XP earned (scaled by accuracy)
- Retry any challenge instantly
- Enter-key navigation during challenge

---

### 🔧 Changes

- **App.jsx** — new tab order: Pipeline ★ → Learn → Challenge → Tools → Practice
  - Pipeline is now the default landing tab (was Bit Toggler)
  - Version string updated: `v1.2.0 · learn · convert · challenge`
  - v1.2 badge in header
  - Context-aware guest nudge text for Learn vs Quiz/Challenge
- **utils.js** — added `toAsciiChar()`, `toOctal()`, `APP_VERSION` exports
- **package.json** — version bumped to `1.2.0`

---

### 📌 What wasn't changed

All existing components are **untouched**:
- `BitToggler.jsx`, `Converter.jsx`, `AsciiTable.jsx`, `MorseCode.jsx`
- `Quiz.jsx` and all quiz/progression logic
- Entire auth stack: `AuthContext.jsx`, `AuthPage.jsx`, `ResetPassword.jsx`, `VerifyEmail.jsx`
- All API routes (`api/auth/*`, `api/quiz/*`, `api/user/*`)
- All `lib/` utilities (jwt, cors, rate-limit, progression, mongo…)
- Email templates, Vercel config, Tailwind/Vite config

---

## v1.0.0 — Initial Release
- Bit Toggler, Converter, ASCII Table, Morse Code tools
- Quiz with XP, streaks, stage unlocking (5 stages)
- Auth: register, login, verify-email, reset-password
- Vercel serverless API + MongoDB
