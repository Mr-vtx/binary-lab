import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { toBin, toHex, MORSE_MAP } from "../utils";

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Question generators ──────────────────────────────────────────────────────
const MORSE_KEYS = Object.keys(MORSE_MAP).filter((k) => /^[A-Z0-9]$/.test(k));

function makeQ(type, rand) {
  switch (type) {
    case "BIN→DEC": {
      const n = Math.floor(rand() * 128);
      const wrong = shuffle([...new Set([n+1,n-1,n+3,n-3,n+7,n-7].filter(x=>x>=0&&x<256))], rand).slice(0,3);
      return { cat: "BIN→DEC", q: "Convert binary to decimal:", code: toBin(n), a: String(n), opts: shuffle([String(n),...wrong.map(String)], rand) };
    }
    case "DEC→BIN": {
      const n = Math.floor(rand() * 128);
      const wrong = shuffle([n+1,n-1,n+2,n-2,n+4].filter(x=>x>=0&&x<256), rand).slice(0,3);
      return { cat: "DEC→BIN", q: `Convert ${n} to 8-bit binary:`, a: toBin(n), opts: shuffle([toBin(n),...wrong.map(x=>toBin(x))], rand) };
    }
    case "ASCII": {
      const n = Math.floor(rand() * 94) + 32;
      const ch = String.fromCharCode(n);
      const wrong = shuffle([n+1,n-1,n+3,n-2].filter(x=>x>=32&&x<127), rand).slice(0,3);
      return { cat: "ASCII", q: "What is the decimal ASCII value of:", code: ch === " " ? "SPACE" : ch, a: String(n), opts: shuffle([String(n),...wrong.map(String)], rand) };
    }
    case "DEC→HEX": {
      const n = Math.floor(rand() * 256);
      const h = "0x" + n.toString(16).toUpperCase().padStart(2,"0");
      const wrong = shuffle([n+1,n-1,n+16,n-16].filter(x=>x>=0&&x<256), rand).slice(0,3);
      return { cat: "DEC→HEX", q: `Convert ${n} to hexadecimal:`, a: h, opts: shuffle([h,...wrong.map(x=>"0x"+x.toString(16).toUpperCase().padStart(2,"0"))], rand) };
    }
    case "MORSE": {
      const ch = MORSE_KEYS[Math.floor(rand() * MORSE_KEYS.length)];
      const code = MORSE_MAP[ch];
      const wrongs = shuffle(MORSE_KEYS.filter(k=>k!==ch), rand).slice(0,3);
      return { cat: "MORSE", q: "What character is this Morse code?", code, a: ch, opts: shuffle([ch,...wrongs], rand), isMorse: true };
    }
    case "HEX→DEC": {
      const n = Math.floor(rand() * 256);
      const h = "0x" + n.toString(16).toUpperCase().padStart(2,"0");
      const wrong = shuffle([n+1,n-1,n+16,n-16].filter(x=>x>=0&&x<256), rand).slice(0,3);
      return { cat: "HEX→DEC", q: `What is ${h} in decimal?`, a: String(n), opts: shuffle([String(n),...wrong.map(String)], rand) };
    }
    case "SUBNET": {
      const prefixes = [8,16,24,25,26,28,30];
      const p = prefixes[Math.floor(rand() * prefixes.length)];
      const hosts = Math.max(0, Math.pow(2, 32-p) - 2);
      const wrong = shuffle([hosts+1,hosts-1,hosts+2,Math.pow(2,32-p)].filter(x=>x>=0&&x!==hosts), rand).slice(0,3);
      return { cat: "SUBNET", q: `How many usable hosts does a /${p} subnet provide?`, a: String(hosts), opts: shuffle([String(hosts),...wrong.map(String)], rand) };
    }
    default: return makeQ("BIN→DEC", rand);
  }
}

// ─── Daily challenge helpers ──────────────────────────────────────────────────
const ALL_CATS = ["BIN→DEC","DEC→BIN","ASCII","DEC→HEX","HEX→DEC","MORSE","SUBNET"];

function getDailyKey() {
  return new Date().toISOString().slice(0, 10);
}
function getDailySeed() {
  const k = getDailyKey();
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (Math.imul(31, h) + k.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function buildDailyQs() {
  const seed = getDailySeed();
  const rand = seededRand(seed);
  const cats = shuffle(ALL_CATS, rand);
  return Array.from({ length: 5 }, (_, i) =>
    makeQ(cats[i % cats.length], seededRand(seed + i + 1))
  );
}

// ─── Topic challenges ─────────────────────────────────────────────────────────
const TOPICS = [
  { id: "binary-sprint", label: "Binary Sprint",   emoji: "💻", desc: "10 binary ↔ decimal conversions", cats: ["BIN→DEC","DEC→BIN"], count: 10, xp: 15, color: "#00ff88" },
  { id: "ascii-master",  label: "ASCII Master",    emoji: "🔤", desc: "8 ASCII value challenges",          cats: ["ASCII"],            count: 8,  xp: 12, color: "#ffb800" },
  { id: "hex-wizard",    label: "Hex Wizard",      emoji: "🔢", desc: "8 hex conversion challenges",       cats: ["DEC→HEX","HEX→DEC"],count: 8,  xp: 15, color: "#00d4ff" },
  { id: "morse-op",      label: "Morse Operator",  emoji: "📡", desc: "6 Morse code questions",            cats: ["MORSE"],            count: 6,  xp: 20, color: "#c084fc" },
  { id: "net-basics",    label: "Network Basics",  emoji: "🌐", desc: "8 subnet & IP questions",           cats: ["SUBNET"],           count: 8,  xp: 20, color: "#00d4ff" },
  { id: "mixed-pro",     label: "Mixed Pro",       emoji: "⚡", desc: "15 questions across ALL categories", cats: ALL_CATS,            count: 15, xp: 30, color: "#ff3355" },
];

// ─── Category badge colors ────────────────────────────────────────────────────
const CAT_COLOR = {
  "BIN→DEC": "#00ff88", "DEC→BIN": "#00ff88",
  "ASCII": "#ffb800", "DEC→HEX": "#ffb800", "HEX→DEC": "#ffb800",
  "MORSE": "#c084fc", "SUBNET": "#00d4ff",
};

// ─── Morse visual ─────────────────────────────────────────────────────────────
function MorseVisual({ code }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
      {code.split("").map((s, i) =>
        s === "." ? (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
        ) : s === "-" ? (
          <div key={i} style={{ width: 32, height: 10, borderRadius: 4, background: "#00ff88", boxShadow: "0 0 8px #00ff8866" }} />
        ) : (
          <div key={i} style={{ width: 16 }} />
        )
      )}
    </div>
  );
}

// ─── Challenge runner ─────────────────────────────────────────────────────────
function Runner({ questions, title, onFinish }) {
  const [qi, setQi]         = useState(0);
  const [chosen, setChosen] = useState(null);
  const [results, setResults] = useState([]);
  const [startTime]         = useState(Date.now());

  const q      = questions[qi];
  const isLast = qi === questions.length - 1;
  const correct = results.filter((r) => r.correct).length;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Enter" && chosen) advance(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [chosen]);

  const advance = () => {
    const isCorrect = chosen === q.a;
    const nr = [...results, { ...q, chosen, correct: isCorrect }];
    if (isLast) {
      onFinish(nr, Math.round((Date.now() - startTime) / 1000));
    } else {
      setResults(nr);
      setQi(qi + 1);
      setChosen(null);
    }
  };

  const pct = (qi / questions.length) * 100;
  const catColor = CAT_COLOR[q.cat] || "#6b8a7a";

  return (
    <div className="panel-animate" style={{ maxWidth: 560 }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>{title}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#6b8a7a" }}>{qi + 1}/{questions.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "20px" }}>
        {/* Category badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{
            fontFamily: "JetBrains Mono", fontSize: 9, padding: "3px 9px", borderRadius: 3,
            border: `1px solid ${catColor}44`, color: catColor, background: catColor + "11",
            letterSpacing: "0.08em",
          }}>
            {q.cat}
          </span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>
            {correct} correct so far
          </span>
        </div>

        {/* Question text */}
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#a8c8b8", marginBottom: 14, lineHeight: 1.6 }}>
          {q.q}
        </p>

        {/* Code display */}
        {q.code && (
          <div style={{
            background: "#080b0e", border: "1px solid #1a2030", borderRadius: 6,
            padding: "16px", textAlign: "center", marginBottom: 16,
          }}>
            {q.isMorse ? (
              <div>
                <MorseVisual code={q.code} />
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#3a5040", marginTop: 10, letterSpacing: "0.2em" }}>
                  {q.code}
                </div>
              </div>
            ) : (
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: "#e8f5ef", letterSpacing: "0.12em" }}>
                {q.code}
              </span>
            )}
          </div>
        )}

        {/* Options */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {q.opts.map((opt) => {
            let bg = "#080b0e", border = "#1a2030", color = "#6b8a7a";
            if (chosen) {
              if (opt === q.a)         { bg = "#0d1f14"; border = "#00ff88"; color = "#00ff88"; }
              else if (opt === chosen) { bg = "#1a0a0d"; border = "#ff3355"; color = "#ff3355"; }
              else                     { color = "#2a3a2a"; border = "#1a2030"; }
            }
            return (
              <button
                key={opt}
                onClick={() => !chosen && setChosen(opt)}
                disabled={!!chosen}
                style={{
                  background: bg, border: `1px solid ${border}`, borderRadius: 6,
                  padding: "12px", fontFamily: "JetBrains Mono", fontSize: 12,
                  color, cursor: chosen ? "default" : "pointer",
                  textAlign: "left", transition: "all 0.12s", lineHeight: 1.4,
                  wordBreak: "break-all",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {chosen && (
          <div className="panel-animate" style={{ marginTop: 14 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: chosen === q.a ? "#00ff88" : "#ff3355", marginBottom: 12 }}>
              {chosen === q.a ? "✓ Correct!" : `✗ Answer: ${q.a}`}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="btn-primary" onClick={advance}>
                {isLast ? "See results →" : "Next →"}
              </button>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>or press Enter</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Results screen ───────────────────────────────────────────────────────────
function Results({ results, elapsed, xp, title, onRetry, onBack }) {
  const score  = results.filter((r) => r.correct).length;
  const total  = results.length;
  const pct    = Math.round((score / total) * 100);
  const xpEarned = pct >= 80 ? xp : pct >= 60 ? Math.round(xp * 0.5) : Math.round(xp * 0.2);
  const mins   = Math.floor(elapsed / 60);
  const secs   = elapsed % 60;
  const grade  = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📖";
  const gradeColor = pct >= 80 ? "#00ff88" : pct >= 60 ? "#ffb800" : "#6b8a7a";

  return (
    <div className="panel-animate" style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Score card */}
      <div style={{ background: "#0e1117", border: `1px solid ${gradeColor}30`, borderRadius: 8, padding: "28px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>{grade}</div>
        <div style={{ fontFamily: "Share Tech Mono", fontSize: 36, color: gradeColor, letterSpacing: "0.06em", marginBottom: 6 }}>
          {score}/{total}
        </div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", marginBottom: 14 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: gradeColor, fontWeight: 700 }}>{pct}%</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>accuracy</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: "#6b8a7a" }}>
              {mins > 0 ? `${mins}m ` : ""}{secs}s
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>time</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: "#ffb800", fontWeight: 700 }}>+{xpEarned}</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>XP</div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "14px 16px" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
          Breakdown
        </div>
        {results.map((r, i) => {
          const cc = CAT_COLOR[r.cat] || "#6b8a7a";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: "1px solid #1a203030" }}>
              <span style={{ color: r.correct ? "#00ff88" : "#ff3355", fontFamily: "JetBrains Mono", fontSize: 12, flexShrink: 0 }}>
                {r.correct ? "✓" : "✗"}
              </span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, padding: "1px 6px", borderRadius: 3, border: `1px solid ${cc}44`, color: cc, flexShrink: 0 }}>
                {r.cat}
              </span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.code || r.q?.slice(0, 32)}
              </span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: r.correct ? "#6b8a7a" : "#ff3355", flexShrink: 0 }}>
                → {r.a}
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-ghost" style={{ flex: 1 }} onClick={onRetry}>Try again</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={onBack}>← Challenges</button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DailyChallenge() {
  const { user } = useAuth();
  const [mode, setMode]       = useState("menu");  // menu | daily | topic | results
  const [active, setActive]   = useState(null);    // current challenge config
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const dailyKey     = getDailyKey();
  const storeKey     = `blchallenge_${dailyKey}_${user?.id || "guest"}`;
  const dailyDone    = !!localStorage.getItem(storeKey);
  const dailyQs      = useMemo(() => buildDailyQs(), [dailyKey]);

  const startDaily = () => {
    setActive({ label: `Daily Challenge · ${dailyKey}`, xp: 50 });
    setQuestions(dailyQs);
    setMode("daily");
  };

  const startTopic = (t) => {
    const rand = seededRand(Date.now() + Math.random() * 99999);
    const qs = Array.from({ length: t.count }, (_, i) =>
      makeQ(t.cats[i % t.cats.length], seededRand(Date.now() + i * 7 + Math.floor(rand() * 9999)))
    );
    setActive({ label: t.label, xp: t.xp, topicId: t.id });
    setQuestions(qs);
    setMode("topic");
  };

  const handleFinish = (res, secs) => {
    setResults(res);
    setElapsed(secs);
    if (mode === "daily") localStorage.setItem(storeKey, "1");
    setMode("results");
  };

  const handleRetry = () => {
    if (active?.topicId) {
      const t = TOPICS.find((t) => t.id === active.topicId);
      if (t) { startTopic(t); return; }
    }
    setQuestions(dailyQs);
    setMode("daily");
    setResults(null);
  };

  // ── Runner / Results views ──
  if (mode === "daily" || mode === "topic") {
    return <Runner questions={questions} title={active?.label} onFinish={handleFinish} />;
  }
  if (mode === "results") {
    return (
      <Results
        results={results} elapsed={elapsed} xp={active?.xp || 20}
        title={active?.label}
        onRetry={handleRetry}
        onBack={() => { setMode("menu"); setResults(null); }}
      />
    );
  }

  // ── Menu ──
  return (
    <div className="panel-animate" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Daily challenge */}
      <div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Today's Challenge · {dailyKey}
        </div>
        <button
          onClick={startDaily}
          disabled={dailyDone}
          style={{
            width: "100%", textAlign: "left", background: "#0e1117",
            border: `1px solid ${dailyDone ? "#00ff8820" : "#00ff8840"}`,
            borderRadius: 8, padding: "16px 18px", cursor: dailyDone ? "default" : "pointer",
            transition: "all 0.15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#e8f5ef", fontWeight: 600 }}>
                  Daily Challenge
                </span>
                {dailyDone && (
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, padding: "2px 7px", borderRadius: 3, border: "1px solid #00ff8840", color: "#00ff88", background: "#0d1f14" }}>
                    ✓ done
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", marginBottom: 10 }}>
                5 questions · same for everyone today · resets midnight UTC · +50 XP
              </p>
              {!dailyDone && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {dailyQs.slice(0, 4).map((q, i) => {
                    const c = CAT_COLOR[q.cat] || "#6b8a7a";
                    return (
                      <span key={i} style={{ fontFamily: "JetBrains Mono", fontSize: 9, padding: "2px 7px", borderRadius: 3, border: `1px solid ${c}44`, color: c }}>
                        {q.cat}
                      </span>
                    );
                  })}
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>+ 1 more</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: "#ffb800", fontWeight: 700 }}>+50</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>XP</div>
            </div>
          </div>
        </button>
      </div>

      {/* Topic challenges */}
      <div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Topic Challenges
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => startTopic(t)}
              style={{
                width: "100%", textAlign: "left", background: "#0e1117",
                border: `1px solid ${t.color}20`, borderRadius: 7, padding: "13px 16px",
                cursor: "pointer", transition: "all 0.12s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{t.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: t.color, fontWeight: 600, marginBottom: 2 }}>
                    {t.label}
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>
                    {t.desc}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#ffb800", fontWeight: 700 }}>+{t.xp}</div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>{t.count} q's</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div style={{ background: "#080b0e", border: "1px solid #1a2030", borderRadius: 7, padding: "12px 16px" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Tips
        </div>
        {[
          "Press Enter to advance to the next question",
          "Do the Daily Challenge first for maximum XP",
          "Mixed Pro is the hardest — all 7 categories",
          !user && "Sign in to save your XP and streak",
        ].filter(Boolean).map((tip, i) => (
          <div key={i} style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", marginBottom: 5 }}>
            → {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
