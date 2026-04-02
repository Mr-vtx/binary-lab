# BINARY_LAB

> A hacker-aesthetic encoding toolkit. Binary, ASCII, Morse, hex — all in one dark terminal UI.

Built with **Vite + React + Tailwind CSS**. Ships as a fully self-contained single HTML file, or run locally as a dev server.

---

## Quick Start

```bash
cd binary-lab
npm install
npm run dev
```
Then open `http://localhost:5173`.

### Option C — Build from source
```bash
npm run build       # outputs to /dist
npm run preview     # serve the built version locally
```

---

## Features

### 01 · Bit Toggler
Click individual bits in an 8-bit byte to toggle them on/off. Live output updates as you click.

- Displays **decimal**, **binary**, **hex**, and **ASCII** character simultaneously
- Shows bit weights (128, 64, 32 … 1) below each cell
- **Quick Presets** — one-click jump to common values: `A (65)`, `a (97)`, `0 (48)`, `Space (32)`, `NULL`, `DEL`, `128`, `255`
- Reset and set-all buttons

### 02 · Converter
Four independent conversion directions, all with one-click copy buttons on every output field.

| Direction | Input | Outputs |
|---|---|---|
| Binary → Text | Space-separated 8-bit groups | Decimal values · ASCII string |
| Text → Binary | Any string | Binary · Decimal · Hex per character |
| Decimal → Binary | 0–255 | 8-bit binary · Hex · ASCII char |
| Hex → Decimal | `0x41` or `41` | Decimal · Binary |

### 03 · ASCII Table
Full printable ASCII range (32–126) in a browsable grid.

- Filter by category: **All**, **A–Z**, **a–z**, **Digits**, **Symbols**
- Search by character, decimal value, hex, or binary string
- Click any cell to expand: char · decimal · binary · hex — all individually copyable

### 04 · Morse Code
Encode and decode Morse code with a visual dot/dash display.

- **Encoder** — type text, get Morse string + animated dot/dash visuals per character
- **Decoder** — paste Morse, get plain text back (use `/` to separate words)
- **Reference chart** — all A–Z, 0–9, and punctuation codes; click any entry to append that character to the encoder input

### 05 · Practice Quiz
Randomised multiple-choice questions across 6 categories.

| Category | Question type |
|---|---|
| `BIN→DEC` | Read binary, pick decimal |
| `DEC→BIN` | Read decimal, pick 8-bit binary |
| `ASCII` | Read a character, pick its decimal code |
| `DEC→ASCII` | Read decimal code, pick the character |
| `DEC→HEX` | Convert decimal to hex |
| `MORSE` | Read dot/dash visual, identify the character |

Tracks **score**, **accuracy %**, and **streak**. Press `Enter` to advance to the next question. Recent answer history shown below the card.

---

## Project Structure

```
binary-lab/
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx           # Entry point
    ├── App.jsx            # Shell: header, nav tabs, routing
    ├── index.css          # Global styles, CRT scanline overlay, custom scrollbar
    ├── utils.js           # Shared helpers: MORSE_MAP, toBin, toHex, copyToClipboard
    └── components/
        ├── UI.jsx         # Reusable primitives: Card, OutputBox, CopyButton, Label
        ├── BitToggler.jsx
        ├── Converter.jsx
        ├── AsciiTable.jsx
        ├── MorseCode.jsx
        └── Quiz.jsx
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Vite | 6.x | Build tool + dev server |
| React | 19.x | UI framework |
| Tailwind CSS | 3.x | Utility-first styling |
| lucide-react | 0.383 | Icon set (Copy, Check) |
| JetBrains Mono | — | Primary monospace font (Google Fonts) |
| Share Tech Mono | — | Display / logo font (Google Fonts) |

---

## Customisation

### Colors
All theme colors are defined in `tailwind.config.js` under `theme.extend.colors.terminal`. Swap `green` for `#39ff14` for neon, or change `bg` / `panel` for a different dark tone.

```js
terminal: {
  bg:    '#0a0c0f',   // page background
  panel: '#0e1117',   // card / nav background
  green: '#00ff88',   // primary accent
  amber: '#ffb800',   // secondary accent
  cyan:  '#00d4ff',   // tertiary accent
  red:   '#ff3355',   // error / wrong answer
}
```

### Adding quiz question types
Open `src/components/Quiz.jsx` and add a new entry to the `quizTypes` array. Each entry is a function that returns:
```js
{
  category: 'LABEL',   // shown as badge
  q: 'Question text',  // prompt
  code: '...',         // optional: displayed in a code block
  a: 'correct answer', // must match one of opts exactly
  opts: ['a','b','c','d'], // exactly 4 options
  isMorse: false,      // set true to render code as dot/dash visual
}
```

### Extending the Morse map
`src/utils.js` exports `MORSE_MAP` as a plain object. Add any character and its dot/dash string to extend both the encoder and the reference chart automatically.

---

## Browser Support

Works in all modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+). No IE support. Requires JavaScript enabled.

---

## License

AGPL-3.0 You are free to use and modify.
If you modify the code and make it available over a network (e.g., as a web service), you must also make the source code available.
Any derivative work must also be licensed under AGPL-3.0.

---

## Developer

**Vans** (Chukwubuikem Wisdom) — [`mr-vtx`](https://github.com/mr-vtx)

Full-stack developer focused on building systems that actually work in the real world.

### Why this project exists

The idea for BINARY_LAB didn't start with code — it started with a network cable.

After years moving through computer repair, IT support, and networking, one question kept coming back: *how does an IP address actually work?* Not the surface answer. The real one — how `192.168.1.1` is just a human-readable alias for a 32-bit binary number, how every octet is 8 toggled bits, how the entire internet runs on patterns of 1s and 0s that map up through layers of abstraction into the letters on your screen.

That curiosity drove a deeper dive — into binary arithmetic, ASCII encoding, how characters become numbers become voltage become light. BINARY_LAB is the tool built along the way to make that exploration hands-on and immediate. Every tab in this app is a question that once needed answering.

There's always another layer to learn and something new to build.
