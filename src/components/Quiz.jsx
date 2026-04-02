import { useState, useCallback, useEffect } from "react";
import { Card } from "./UI";
import { toBin, toHex } from "../utils";
import { MORSE_MAP } from "../utils";
import { useAuth } from "../AuthContext";
import api from "../api";
import { track } from "@vercel/analytics";

const MORSE_KEYS = Object.keys(MORSE_MAP).filter((k) => /^[A-Z0-9]$/.test(k));

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const ALL_QUESTION_TYPES = {
  "BIN→DEC": () => {
    const n = Math.floor(Math.random() * 128);
    const wrongs = shuffle([
      ...new Set(
        [n + 1, n - 1, n + 3, n + 5, n - 3, n + 7].filter(
          (x) => x >= 0 && x < 256,
        ),
      ),
    ]).slice(0, 3);
    return {
      category: "BIN→DEC",
      q: "What is this binary number in decimal?",
      code: toBin(n),
      a: String(n),
      opts: shuffle([String(n), ...wrongs.map(String)]),
    };
  },
  "DEC→BIN": () => {
    const n = Math.floor(Math.random() * 128);
    const wrongs = shuffle(
      [n + 1, n - 1, n + 2, n - 2, n + 4].filter((x) => x >= 0 && x < 256),
    ).slice(0, 3);
    return {
      category: "DEC→BIN",
      q: `Convert ${n} to 8-bit binary:`,
      a: toBin(n),
      opts: shuffle([toBin(n), ...wrongs.map((x) => toBin(x))]),
    };
  },
  ASCII: () => {
    const n = Math.floor(Math.random() * 94) + 32;
    const ch = String.fromCharCode(n);
    const wrongs = shuffle(
      [n + 1, n - 1, n + 3, n - 2].filter((x) => x >= 32 && x < 127),
    ).slice(0, 3);
    return {
      category: "ASCII",
      q: "What is the decimal ASCII value of:",
      code: ch === " " ? "SPACE" : ch,
      a: String(n),
      opts: shuffle([String(n), ...wrongs.map(String)]),
    };
  },
  "DEC→ASCII": () => {
    const n = Math.floor(Math.random() * 94) + 32;
    const ch = String.fromCharCode(n);
    const wrongs = shuffle(
      [n + 1, n - 1, n + 3, n - 2].filter((x) => x >= 32 && x < 127),
    )
      .slice(0, 3)
      .map((x) => String.fromCharCode(x));
    return {
      category: "DEC→ASCII",
      q: `ASCII decimal ${n} represents:`,
      a: ch,
      opts: shuffle([ch, ...wrongs]),
    };
  },
  "DEC→HEX": () => {
    const n = Math.floor(Math.random() * 256);
    const h = toHex(n);
    const wrongs = shuffle(
      [n + 1, n - 1, n + 16, n - 16].filter((x) => x >= 0 && x < 256),
    ).slice(0, 3);
    return {
      category: "DEC→HEX",
      q: `What is ${n} in hexadecimal?`,
      a: h,
      opts: shuffle([h, ...wrongs.map((x) => toHex(x))]),
    };
  },
  MORSE: () => {
    const ch = MORSE_KEYS[Math.floor(Math.random() * MORSE_KEYS.length)];
    const code = MORSE_MAP[ch];
    const wrongKeys = shuffle(MORSE_KEYS.filter((k) => k !== ch)).slice(0, 3);
    return {
      category: "MORSE",
      q: "What character does this Morse code represent?",
      code,
      a: ch,
      opts: shuffle([ch, ...wrongKeys]),
      isMorse: true,
    };
  },
};

const CAT_COLORS = {
  "BIN→DEC":
    "text-terminal-green border-terminal-green/40 bg-terminal-green-muted",
  "DEC→BIN":
    "text-terminal-green border-terminal-green/40 bg-terminal-green-muted",
  ASCII: "text-terminal-amber border-terminal-amber/40 bg-yellow-900/20",
  "DEC→ASCII": "text-terminal-amber border-terminal-amber/40 bg-yellow-900/20",
  "DEC→HEX": "text-terminal-cyan border-terminal-cyan/40 bg-cyan-900/20",
  MORSE: "text-purple-400 border-purple-400/40 bg-purple-900/20",
};

function MorseVisual({ code }) {
  return (
    <div className="flex items-center gap-1.5 justify-center flex-wrap">
      {code
        .split("")
        .map((s, i) =>
          s === "." ? (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-terminal-green inline-block"
              style={{ boxShadow: "0 0 6px #00ff88" }}
            />
          ) : (
            <span
              key={i}
              className="w-7 h-3 rounded-full bg-terminal-green inline-block"
              style={{ boxShadow: "0 0 6px #00ff88" }}
            />
          ),
        )}
    </div>
  );
}

function StageGate({ stage, nextStage, xpToNext }) {
  return (
    <div className="bg-terminal-panel border border-terminal-border rounded-lg p-6 text-center space-y-3">
      <div className="text-3xl">🔒</div>
      <div className="text-sm font-mono text-terminal-text-secondary">
        This category unlocks at{" "}
        <span className="text-terminal-green">
          {nextStage?.name || "next stage"}
        </span>
      </div>
      <div className="text-xs font-mono text-terminal-text-muted">
        You need <span className="text-terminal-amber">{xpToNext} more XP</span>{" "}
        to unlock it. Keep practicing the available categories!
      </div>
    </div>
  );
}

export default function Quiz() {
  const { user, profile, refreshProfile } = useAuth();

  const unlockedCats = profile?.stage?.unlockedCategories || [
    "BIN→DEC",
    "DEC→BIN",
  ];

  const makeQuestion = useCallback(() => {
    const available = unlockedCats.filter((c) => ALL_QUESTION_TYPES[c]);
    const cat = available[Math.floor(Math.random() * available.length)];
    return ALL_QUESTION_TYPES[cat]?.() || ALL_QUESTION_TYPES["BIN→DEC"]();
  }, [unlockedCats.join(",")]);

  const [q, setQ] = useState(makeQuestion);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [localScore, setLocalScore] = useState(0);
  const [localStreak, setLocalStreak] = useState(0);
  const [localTotal, setLocalTotal] = useState(0);
  const [history, setHistory] = useState([]);

  const answer = async (opt) => {
    if (answered || submitting) return;
    const isCorrect = opt === q.a;
    setChosen(opt);
    setAnswered(true);
    setLocalTotal((t) => t + 1);
    if (isCorrect) {
      setLocalScore((s) => s + 1);
      setLocalStreak((s) => s + 1);
    } else setLocalStreak(0);
    setHistory((h) => [{ ...q, chosen: opt, isCorrect }, ...h].slice(0, 5));
    track("question_solved", {
      category: q.category,
      correct: isCorrect,
    });
    if (user) {
      setSubmitting(true);
      try {
        const { data } = await api.post("/quiz/answer", {
          category: q.category,
          question: q.code || q.q,
          answer: q.a,
          chosen: opt,
        });
        setResult(data);
        await refreshProfile();
      } catch (err) {
        console.error("Failed to submit answer", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const next = () => {
    setQ(makeQuestion());
    setAnswered(false);
    setChosen(null);
    setResult(null);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && answered && !submitting) next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answered, submitting]);

  const displayStreak = result ? result.streak.current : localStreak;
  const displayScore = user ? user.stats?.totalCorrect || 0 : localScore;
  const displayTotal = user ? user.stats?.totalAnswered || 0 : localTotal;
  const displayAccuracy =
    displayTotal > 0 ? Math.round((displayScore / displayTotal) * 100) : 0;

  return (
    <div className="space-y-4 panel-animate">
      {profile && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono text-terminal-text-muted uppercase tracking-widest">
            Unlocked:
          </span>
          {Object.keys(ALL_QUESTION_TYPES).map((cat) => {
            const locked = !unlockedCats.includes(cat);
            return (
              <span
                key={cat}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${locked ? "border-terminal-border text-terminal-text-muted opacity-40" : CAT_COLORS[cat]}`}
              >
                {locked ? "🔒 " : ""}
                {cat}
              </span>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Score", val: displayScore, color: "text-terminal-green" },
          {
            label: "Accuracy",
            val: `${displayAccuracy}%`,
            color:
              displayAccuracy >= 70
                ? "text-terminal-green"
                : "text-terminal-amber",
          },
          {
            label: "Streak",
            val: displayStreak,
            color:
              displayStreak >= 3
                ? "text-terminal-amber glow-amber"
                : "text-terminal-text-primary",
          },
          {
            label: "Total",
            val: displayTotal,
            color: "text-terminal-text-primary",
          },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="bg-terminal-panel border border-terminal-border rounded p-2 text-center"
          >
            <div className="text-[10px] text-terminal-text-muted uppercase tracking-widest">
              {label}
            </div>
            <div className={`text-xl font-mono font-semibold mt-0.5 ${color}`}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {result?.xpGained > 0 && (
        <div className="flex items-center gap-2 text-xs font-mono text-terminal-cyan fade-slide">
          <span>+{result.xpGained} XP</span>
          {result.stagedUp && (
            <span className="text-terminal-amber glow-amber">
              🎉 Stage up! → {result.stage.name}
            </span>
          )}
          {result.streak.current >= 5 && (
            <span className="text-terminal-amber">
              ⚡ {result.streak.current} streak!
            </span>
          )}
        </div>
      )}

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${CAT_COLORS[q.category] || ""}`}
          >
            {q.category}
          </span>
          {displayStreak >= 3 && !answered && (
            <span className="text-[10px] font-mono text-terminal-amber glow-amber">
              ⚡ {displayStreak} streak
            </span>
          )}
        </div>

        <p className="text-sm font-mono text-terminal-text-secondary mb-2">
          {q.q}
        </p>

        {q.code && (
          <div className="bg-terminal-bg border border-terminal-border rounded px-4 py-3 mb-4 text-center">
            {q.isMorse ? (
              <MorseVisual code={q.code} />
            ) : (
              <span className="text-2xl font-mono font-bold text-terminal-text-primary tracking-widest">
                {q.code}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {q.opts.map((opt) => {
            let cls =
              "bg-terminal-bg border-terminal-border text-terminal-text-primary hover:border-terminal-green/40 hover:bg-terminal-panel";
            if (answered) {
              if (opt === q.a)
                cls =
                  "bg-terminal-green-muted border-terminal-green text-terminal-green shadow-glow-green";
              else if (opt === chosen && opt !== q.a)
                cls = "bg-red-900/30 border-terminal-red text-terminal-red";
              else
                cls =
                  "bg-terminal-bg border-terminal-border text-terminal-text-muted opacity-40";
            }
            return (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={answered}
                className={`border rounded px-4 py-3 font-mono text-sm text-left transition-all duration-150 ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`mt-3 text-sm font-mono fade-slide ${chosen === q.a ? "text-terminal-green" : "text-terminal-red"}`}
          >
            {chosen === q.a
              ? `✓ Correct${displayStreak >= 3 ? ` · ${displayStreak} in a row!` : ""}`
              : `✗ Correct answer: ${q.a}${result?.weakSpot ? ` · practice more ${result.weakSpot}` : ""}`}
          </div>
        )}
      </Card>

      <div className="flex items-center gap-2">
        <button
          onClick={next}
          disabled={!answered || submitting}
          className={`font-mono text-sm px-4 py-2 rounded border transition-all
            ${
              answered && !submitting
                ? "border-terminal-green text-terminal-green bg-terminal-green-muted hover:shadow-glow-green cursor-pointer"
                : "border-terminal-border text-terminal-text-muted cursor-default opacity-40"
            }`}
        >
          {submitting ? "saving..." : "Next question →"}
        </button>
        {answered && !submitting && (
          <span className="text-[11px] text-terminal-text-muted font-mono">
            or press Enter
          </span>
        )}
        {!user && (
          <span className="text-[11px] text-terminal-text-muted font-mono ml-auto">
            <span className="text-terminal-amber">↑</span> Sign in to save
            progress
          </span>
        )}
      </div>

      {profile?.weakSpots?.length > 0 && (
        <div className="bg-red-900/10 border border-terminal-red/20 rounded p-3 text-xs font-mono">
          <span className="text-terminal-red">⚠ Weak spots: </span>
          <span className="text-terminal-text-secondary">
            {profile.weakSpots
              .map((w) => `${w.category} (${w.accuracy}%)`)
              .join(" · ")}
          </span>
          <span className="text-terminal-text-muted">
            {" "}
            — keep practicing these!
          </span>
        </div>
      )}

      {history.length > 0 && (
        <Card title="Recent">
          <div className="space-y-1 opacity-70">
            {history.map((h, i) => (
              <div
                key={i}
                className={`text-xs font-mono flex items-center gap-2 ${h.isCorrect ? "text-terminal-text-secondary" : "text-terminal-red/60"}`}
              >
                <span>{h.isCorrect ? "✓" : "✗"}</span>
                <span className="truncate flex-1">
                  {h.code || h.q.slice(0, 30)}
                </span>
                <span>→ {h.a}</span>
                {h.chosen !== h.a && (
                  <span className="text-terminal-red/50">({h.chosen})</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
