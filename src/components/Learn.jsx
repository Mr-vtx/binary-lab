import { useState } from "react";
import { MODULES, isUnlocked } from "../learnData";


function BinaryCount() {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    dec: i,
    bin: i.toString(2).padStart(3, "0"),
  }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
      {rows.map(({ dec, bin }) => (
        <div
          key={dec}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#080b0e", border: "1px solid #1a2030",
            borderRadius: 4, padding: "5px 10px",
          }}
        >
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a", width: 20 }}>
            {dec}
          </span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#00ff88", letterSpacing: "0.15em" }}>
            {bin}
          </span>
        </div>
      ))}
    </div>
  );
}

function BitWeights() {
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const [on, setOn] = useState([]);
  const total = on.reduce((s, i) => s + weights[i], 0);
  return (
    <div>
      <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginBottom: 8 }}>
        Click the bits to add their values:
      </p>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {weights.map((w, i) => {
          const active = on.includes(i);
          return (
            <button
              key={i}
              onClick={() => setOn((a) => active ? a.filter((x) => x !== i) : [...a, i])}
              style={{
                flex: 1, border: `1px solid ${active ? "#00ff88" : "#1a2030"}`,
                borderRadius: 5, padding: "8px 0", background: active ? "#0d1f14" : "#080b0e",
                cursor: "pointer", textAlign: "center",
                boxShadow: active ? "0 0 8px #00ff8833" : "none",
                transition: "all 0.12s",
              }}
            >
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: active ? "#00ff88" : "#3a5040", marginBottom: 3 }}>
                {w}
              </div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700, color: active ? "#00ff88" : "#3a5040" }}>
                {active ? "1" : "0"}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#6b8a7a" }}>
        = <span style={{ color: "#00ff88", fontSize: 24, fontWeight: 700 }}>{total}</span>
        <span style={{ color: "#3a5040", marginLeft: 8 }}>decimal</span>
      </div>
    </div>
  );
}

function ByteDiagram() {
  return (
    <div>
      <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
        {[7, 6, 5, 4, 3, 2, 1, 0].map((b) => (
          <div
            key={b}
            style={{
              flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 4,
              fontSize: 10, fontFamily: "JetBrains Mono",
              background: b >= 4 ? "#05161a" : "#1a1400",
              border: `1px solid ${b >= 4 ? "#00d4ff30" : "#ffb80030"}`,
              color: b >= 4 ? "#00d4ff" : "#ffb800",
            }}
          >
            b{b}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", marginBottom: 6 }}>
        <span style={{ flex: 4, textAlign: "center", color: "#00d4ff80" }}>← high nybble (bits 7–4) →</span>
        <span style={{ flex: 4, textAlign: "center", color: "#ffb80080" }}>← low nybble (bits 3–0) →</span>
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", textAlign: "center" }}>
        1 byte = 8 bits = 2 nybbles = 256 possible values (0–255)
      </div>
    </div>
  );
}

function AsciiGrid() {
  const chars = [
    ["A", 65], ["B", 66], ["Z", 90], ["a", 97], ["z", 122],
    ["0", 48], ["9", 57], [" ", 32], ["!", 33], ["~", 126],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
      {chars.map(([ch, code]) => (
        <div
          key={code}
          style={{
            background: "#080b0e", border: "1px solid #1a2030",
            borderRadius: 5, padding: "8px 4px", textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: "#00ff88", marginBottom: 3 }}>
            {ch === " " ? "·" : ch}
          </div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#ffb800" }}>{code}</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 8, color: "#3a5040", marginTop: 2 }}>
            {code.toString(2).padStart(8, "0")}
          </div>
        </div>
      ))}
    </div>
  );
}

function HexMap() {
  const entries = [
    ["0","0000"],["1","0001"],["2","0010"],["3","0011"],
    ["4","0100"],["5","0101"],["6","0110"],["7","0111"],
    ["8","1000"],["9","1001"],["A","1010"],["B","1011"],
    ["C","1100"],["D","1101"],["E","1110"],["F","1111"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
      {entries.map(([h, b]) => (
        <div
          key={h}
          style={{
            display: "flex", gap: 8, background: "#080b0e",
            border: "1px solid #1a2030", borderRadius: 4,
            padding: "4px 8px", alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#ffb800", fontWeight: 700, width: 14 }}>
            {h}
          </span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#00d4ff" }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function IpBuilder() {
  const [ip, setIp] = useState("192.168.1.1");
  const octets = ip.split(".").map(Number);
  const valid = octets.length === 4 && octets.every((o) => !isNaN(o) && o >= 0 && o <= 255);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input
        className="terminal-input"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="e.g. 192.168.1.1"
        style={{ fontSize: 13 }}
      />
      {valid && (
        <div style={{ display: "flex", gap: 4 }}>
          {octets.map((oct, i) => (
            <div
              key={i}
              style={{
                flex: 1, background: "#080b0e", border: "1px solid #1a2030",
                borderRadius: 5, padding: "8px 4px", textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#e8f5ef" }}>{oct}</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#00d4ff", marginTop: 4, letterSpacing: "0.05em" }}>
                {oct.toString(2).padStart(8, "0")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubnetSlider() {
  const [prefix, setPrefix] = useState(24);
  const mask = Array.from({ length: 32 }, (_, i) => (i < prefix ? 1 : 0));
  const octets = [0, 8, 16, 24].map((s) =>
    parseInt(mask.slice(s, s + 8).join(""), 2)
  );
  const hosts = Math.pow(2, 32 - prefix);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040" }}>Prefix:</span>
        <input
          type="range" min={1} max={32} value={prefix}
          onChange={(e) => setPrefix(+e.target.value)}
          style={{ flex: 1 }}
        />
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: "#00d4ff", fontWeight: 700, width: 32 }}>
          /{prefix}
        </span>
      </div>
      <div style={{ display: "flex", gap: 2, flexWrap: "nowrap", overflowX: "auto" }}>
        {mask.map((bit, i) => (
          <div
            key={i}
            style={{
              width: 13, height: 20, borderRadius: 2, flexShrink: 0,
              background: bit ? "#00d4ff25" : "#ff335515",
              border: `1px solid ${bit ? "#00d4ff40" : "#ff335530"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "JetBrains Mono", fontSize: 9,
              color: bit ? "#00d4ff" : "#ff3355",
              marginLeft: i > 0 && i % 8 === 0 ? 4 : 0,
            }}
          >
            {bit}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a" }}>
        Mask: <span style={{ color: "#00d4ff" }}>{octets.join(".")}</span>
        &nbsp;·&nbsp; Addresses: <span style={{ color: "#00ff88" }}>{hosts.toLocaleString()}</span>
        &nbsp;·&nbsp; Usable: <span style={{ color: "#00ff88" }}>{Math.max(0, hosts - 2).toLocaleString()}</span>
      </div>
    </div>
  );
}

const VISUALS = {
  "binary-count":  BinaryCount,
  "bit-weights":   BitWeights,
  "byte-diagram":  ByteDiagram,
  "ascii-grid":    AsciiGrid,
  "hex-map":       HexMap,
  "ip-builder":    IpBuilder,
  "subnet-slider": SubnetSlider,
};


function MiniQuiz({ questions, onPass, onFail }) {
  const [qi, setQi]           = useState(0);
  const [chosen, setChosen]   = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone]       = useState(false);

  const q      = questions[qi];
  const isLast = qi === questions.length - 1;
  const score  = answers.filter(Boolean).length;

  const advance = () => {
    const correct   = chosen === q.a;
    const newAnswers = [...answers, correct];
    if (isLast) {
      setAnswers(newAnswers);
      setDone(true);
      newAnswers.filter(Boolean).length / questions.length >= 0.67
        ? onPass(newAnswers)
        : onFail(newAnswers);
    } else {
      setAnswers(newAnswers);
      setQi(qi + 1);
      setChosen(null);
    }
  };

  if (done) {
    const passed = score / questions.length >= 0.67;
    return (
      <div style={{
        background: passed ? "#0d1f14" : "#0e1117",
        border: `1px solid ${passed ? "#00ff8830" : "#1a2030"}`,
        borderRadius: 8, padding: "20px", textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{passed ? "🎉" : "📖"}</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: passed ? "#00ff88" : "#ffb800", fontWeight: 600, marginBottom: 6 }}>
          {passed ? "Lesson complete!" : "Review and try again"}
        </div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", marginBottom: passed ? 0 : 14 }}>
          {score}/{questions.length} correct
        </div>
        {!passed && (
          <button
            className="btn-ghost"
            onClick={() => { setQi(0); setAnswers([]); setChosen(null); setDone(false); }}
          >
            Try again →
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Question {qi + 1} of {questions.length}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background:
                  i < qi  ? (answers[i] ? "#00ff88" : "#ff3355")
                  : i === qi ? "#ffb800"
                  : "#1a2030",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ background: "#080b0e", border: "1px solid #1a2030", borderRadius: 8, padding: "16px" }}>
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#a8c8b8", marginBottom: 14, lineHeight: 1.75 }}>
          {q.q}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {q.opts.map((opt) => {
            let bg = "none", border = "#1a2030", color = "#6b8a7a";
            if (chosen) {
              if (opt === q.a)           { bg = "#0d1f14"; border = "#00ff88"; color = "#00ff88"; }
              else if (opt === chosen)   { bg = "#1a0a0d"; border = "#ff3355"; color = "#ff3355"; }
              else                       { color = "#2a3a2a"; }
            }
            return (
              <button
                key={opt}
                onClick={() => !chosen && setChosen(opt)}
                disabled={!!chosen}
                style={{
                  textAlign: "left", background: bg, border: `1px solid ${border}`,
                  borderRadius: 6, padding: "10px 14px",
                  fontFamily: "JetBrains Mono", fontSize: 12, color,
                  cursor: chosen ? "default" : "pointer", transition: "all 0.12s",
                  lineHeight: 1.4,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className="panel-animate" style={{ marginTop: 14 }}>
            <p style={{
              fontFamily: "JetBrains Mono", fontSize: 11, marginBottom: 6,
              color: chosen === q.a ? "#00ff88" : "#ff3355",
            }}>
              {chosen === q.a ? "✓ Correct!" : `✗ Answer: ${q.a}`}
            </p>
            {q.explain && (
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", lineHeight: 1.75, marginBottom: 14 }}>
                {q.explain}
              </p>
            )}
            <button className="btn-primary" onClick={advance}>
              {isLast ? "Finish →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function LessonView({ lesson, mod, completed, onComplete, onNextLesson, nextLesson }) {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="panel-animate" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "16px 20px" }}>
        <div style={{
          fontFamily: "JetBrains Mono", fontSize: 10, color: mod.color,
          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6,
        }}>
          {mod.emoji} {mod.title}
        </div>
        <h2 style={{ fontFamily: "Share Tech Mono", fontSize: 20, color: "#e8f5ef", marginBottom: 10, letterSpacing: "0.04em" }}>
          {lesson.title}
        </h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>🕐 {lesson.duration}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#ffb800" }}>+{lesson.xp} XP</span>
          {completed && (
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#00ff88" }}>✓ completed</span>
          )}
        </div>
      </div>

      {lesson.sections.map((sec, i) => {
        const Visual = sec.visual ? VISUALS[sec.visual] : null;
        return (
          <div
            key={i}
            style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "16px 20px" }}
          >
            <h3 style={{
              fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8f5ef",
              fontWeight: 600, marginBottom: 12,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: mod.color, opacity: 0.5 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {sec.heading}
            </h3>
            <div style={{
              fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a",
              lineHeight: 1.9, whiteSpace: "pre-line",
              marginBottom: Visual ? 16 : 0,
            }}>
              {sec.body}
            </div>
            {Visual && (
              <div style={{ borderTop: "1px solid #1a2030", paddingTop: 14 }}>
                <div style={{
                  fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040",
                  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
                }}>
                  ▸ Interactive
                </div>
                <Visual />
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background: "#0e1117", border: "1px solid #1a2030", borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: quizOpen ? 16 : 0, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8f5ef", fontWeight: 600 }}>
              Check your understanding
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginTop: 3 }}>
              Answer {Math.ceil(lesson.quiz.length * 0.67)}/{lesson.quiz.length} correctly to complete this lesson
            </div>
          </div>
          {!quizOpen && (
            <button className="btn-primary" onClick={() => setQuizOpen(true)}>
              {completed ? "Review quiz" : "Start quiz →"}
            </button>
          )}
        </div>
        {quizOpen && (
          <MiniQuiz
            questions={lesson.quiz}
            onPass={(a) => onComplete(true, a)}
            onFail={(a) => onComplete(false, a)}
          />
        )}
      </div>

      {completed && nextLesson && (
        <button
          onClick={() => onNextLesson(nextLesson.lesson, nextLesson.mod)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#0d1f14", border: "1px solid #00ff8830",
            borderRadius: 8, padding: "14px 18px", cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              Next lesson
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#00ff88" }}>
              {nextLesson.lesson.title} →
            </div>
          </div>
          <span style={{ color: "#00ff88", fontSize: 20 }}>→</span>
        </button>
      )}
    </div>
  );
}


function Welcome({ onStart }) {
  return (
    <div className="panel-animate" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        background: "#0e1117", border: "1px solid #1a2030",
        borderRadius: 8, padding: "32px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>💡</div>
        <h2
          className="font-display glow-green"
          style={{ color: "#00ff88", fontSize: 22, letterSpacing: "0.1em", marginBottom: 12 }}
        >
          Welcome to Learn
        </h2>
        <p style={{
          fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a",
          lineHeight: 1.85, maxWidth: 460, margin: "0 auto 24px",
        }}>
          A structured guide for complete beginners. No experience needed — start
          from zero and work through binary, text encoding, networking, and
          bitwise operations step by step.
        </p>
        <button
          className="btn-primary"
          style={{ fontSize: 13, padding: "10px 28px" }}
          onClick={onStart}
        >
          Begin Lesson 1 →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
        {MODULES.map((mod) => (
          <div
            key={mod.id}
            style={{
              background: "#0e1117", border: `1px solid ${mod.color}20`,
              borderRadius: 8, padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{mod.emoji}</span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: mod.color, fontWeight: 600 }}>
                {mod.title}
              </span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginBottom: 6 }}>
              {mod.tagline}
            </p>
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>
              {mod.lessons.length} lessons
            </span>
          </div>
        ))}
      </div>

      <div style={{
        background: "#080b0e", border: "1px solid #1a2030",
        borderRadius: 7, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 16 }}>☰</span>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040", lineHeight: 1.6 }}>
          Tap the <strong style={{ color: "#6b8a7a" }}>☰ menu</strong> to browse all lessons and jump directly to any topic.
        </span>
      </div>
    </div>
  );
}


export default function Learn({ selected, onSelect, progress, onProgressChange }) {

  const handleComplete = (passed) => {
    if (!selected) return;
    onProgressChange(selected.lesson.id, passed);
  };

  const getNextLesson = () => {
    if (!selected) return null;
    const { lesson, module: mod } = selected;
    const mIdx = MODULES.findIndex((m) => m.id === mod.id);
    const lIdx = mod.lessons.findIndex((l) => l.id === lesson.id);

    if (lIdx < mod.lessons.length - 1) {
      const next = mod.lessons[lIdx + 1];
      if (isUnlocked(next.id, mod.id, progress)) {
        return { lesson: next, mod };
      }
    }
    if (mIdx < MODULES.length - 1) {
      const nextMod = MODULES[mIdx + 1];
      const first   = nextMod.lessons[0];
      if (isUnlocked(first.id, nextMod.id, progress)) {
        return { lesson: first, mod: nextMod };
      }
    }
    return null;
  };

  const firstLesson = MODULES[0].lessons[0];
  const firstMod    = MODULES[0];
  const nextLesson  = selected && progress[selected.lesson.id]?.passed
    ? getNextLesson()
    : null;

  return (
    <div className="panel-animate">
      {selected ? (
        <LessonView
          key={selected.lesson.id}
          lesson={selected.lesson}
          mod={selected.module}
          completed={!!progress[selected.lesson.id]?.passed}
          onComplete={handleComplete}
          nextLesson={nextLesson}
          onNextLesson={(lesson, mod) => onSelect(lesson, mod)}
        />
      ) : (
        <Welcome onStart={() => onSelect(firstLesson, firstMod)} />
      )}
    </div>
  );
}
