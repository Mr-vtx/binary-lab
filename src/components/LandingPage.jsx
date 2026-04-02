import { useState, useEffect } from "react";
import {
  ArrowRight,
  Zap,
  Binary,
  Hash,
  Radio,
  Brain,
  ChevronRight,
} from "lucide-react";

function GithubIcon({ size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

const DEMOS = [
  { input: "01000001", label: "binary", output: '65 → "A"', accent: "green" },
  {
    input: "72 101 108 108 111",
    label: "decimal",
    output: '"Hello"',
    accent: "cyan",
  },
  { input: "0x48", label: "hex", output: '72 → "H"', accent: "amber" },
  { input: "SOS", label: "morse", output: "... --- ...", accent: "purple" },
  {
    input: "11000000.10101000.00000001.00000001",
    label: "ip addr",
    output: "192.168.1.1",
    accent: "green",
  },
];

const ACCENT = {
  green: {
    text: "text-terminal-green",
    border: "border-terminal-green/30",
    bg: "bg-terminal-green-muted",
  },
  cyan: {
    text: "text-terminal-cyan",
    border: "border-terminal-cyan/30",
    bg: "bg-cyan-900/20",
  },
  amber: {
    text: "text-terminal-amber",
    border: "border-terminal-amber/30",
    bg: "bg-yellow-900/20",
  },
  purple: {
    text: "text-purple-400",
    border: "border-purple-400/30",
    bg: "bg-purple-900/20",
  },
};

const FEATURES = [
  {
    icon: Binary,
    title: "Bit Toggler",
    desc: "Click individual bits. Watch decimal, hex, and ASCII update live. The most tactile way to understand binary.",
    accent: "green",
    demo: "0 1 0 0 0 0 0 1  →  65  →  A",
  },
  {
    icon: Hash,
    title: "Converter",
    desc: "Binary ↔ text ↔ decimal ↔ hex. Paste anything, get everything. Copy with one click.",
    accent: "cyan",
    demo: '"Hi"  →  01001000 01101001',
  },
  {
    icon: Brain,
    title: "ASCII Table",
    desc: "Every printable character with its decimal, binary, and hex value. Filterable. Searchable. Clickable.",
    accent: "amber",
    demo: "A=65  a=97  0=48  Space=32",
  },
  {
    icon: Radio,
    title: "Morse Code",
    desc: "Encode and decode Morse with live dot/dash visuals. Full reference chart, clickable.",
    accent: "purple",
    demo: "SOS  →  ... --- ...",
  },
  {
    icon: Zap,
    title: "Practice Quiz",
    desc: "Six question types. XP system. Stage unlocks. Streak tracking. Built for repetition.",
    accent: "green",
    demo: "Stage 1 → 2 → 3 → 4 → 5",
  },
];

const STAGES = [
  {
    id: 1,
    name: "Bit Rookie",
    xp: 0,
    color: "text-terminal-green",
    cats: "BIN↔DEC",
  },
  {
    id: 2,
    name: "ASCII Initiate",
    xp: 100,
    color: "text-terminal-cyan",
    cats: "+ ASCII",
  },
  {
    id: 3,
    name: "Hex Hacker",
    xp: 300,
    color: "text-terminal-amber",
    cats: "+ HEX",
  },
  {
    id: 4,
    name: "Signal Operator",
    xp: 600,
    color: "text-purple-400",
    cats: "+ MORSE",
  },
  {
    id: 5,
    name: "Network Architect",
    xp: 1200,
    color: "text-terminal-red",
    cats: "MASTERED",
  },
];

function LiveDemo() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % DEMOS.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const demo = DEMOS[idx];
  const a = ACCENT[demo.accent];

  return (
    <div
      className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] font-mono text-terminal-text-muted ml-1">
            binary_lab — {demo.label}
          </span>
        </div>
        <div className="p-5 space-y-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-terminal-green/40 text-sm">$</span>
            <span className="text-terminal-text-secondary text-sm">encode</span>
            <span className={`text-sm font-semibold ${a.text}`}>
              {demo.input}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-text-muted text-sm">→</span>
            <span
              className={`text-base font-bold ${a.text}`}
              style={{
                textShadow:
                  demo.accent === "green"
                    ? "0 0 10px #00ff8866"
                    : demo.accent === "cyan"
                      ? "0 0 10px #00d4ff66"
                      : demo.accent === "amber"
                        ? "0 0 10px #ffb80066"
                        : "0 0 10px #a78bfa66",
              }}
            >
              {demo.output}
            </span>
          </div>
          <div className="flex gap-1 pt-1">
            {DEMOS.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i === idx ? "bg-terminal-green" : "bg-terminal-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent, demo, index }) {
  const a = ACCENT[accent];
  return (
    <div
      className={`group relative bg-terminal-panel border border-terminal-border rounded-lg p-5 hover:border-current transition-all duration-300 cursor-default float-up-${Math.min(index + 1, 5)}`}
      style={{ "--tw-border-opacity": 1 }}
    >
      <div
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
        style={{
          boxShadow: `inset 0 0 0 1px ${accent === "green" ? "#00ff8830" : accent === "cyan" ? "#00d4ff30" : accent === "amber" ? "#ffb80030" : "#a78bfa30"}`,
        }}
      />

      <div
        className={`inline-flex p-2 rounded-md ${a.bg} ${a.border} border mb-3`}
      >
        <Icon size={16} className={a.text} />
      </div>
      <h3 className="text-sm font-mono font-semibold text-terminal-text-primary mb-1.5">
        {title}
      </h3>
      <p className="text-xs font-mono text-terminal-text-secondary leading-relaxed mb-3">
        {desc}
      </p>
      <div
        className={`text-[10px] font-mono px-2 py-1.5 rounded ${a.bg} ${a.text} border ${a.border}`}
      >
        {demo}
      </div>
    </div>
  );
}

export default function LandingPage({ onEnter, onAuth }) {
  const [hoveredStage, setHoveredStage] = useState(null);

  return (
    <div className="min-h-screen bg-terminal-bg dot-grid">
      <div className="scan-line" />

      <nav className="sticky top-0 z-40 border-b border-terminal-border bg-terminal-bg/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/60" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <span className="w-2 h-2 rounded-full bg-green-500/60" />
            </div>
            <span className="font-display text-terminal-green text-sm tracking-widest glow-green">
              BINARY_LAB
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/mr-vtx/binary-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
            >
              <GithubIcon size={13} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              onClick={() => onAuth("login")}
              className="text-[11px] font-mono text-terminal-text-secondary hover:text-terminal-green transition-colors px-3 py-1.5 rounded border border-terminal-border hover:border-terminal-green/30"
            >
              Login
            </button>
            <button
              onClick={() => onAuth("register")}
              className="text-[11px] font-mono text-terminal-green bg-terminal-green-muted border border-terminal-green/40 px-3 py-1.5 rounded hover:shadow-glow-green transition-all pulse-glow"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6">
        <section className="pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="float-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-terminal-green/30 bg-terminal-green-muted text-terminal-green text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
              Free · Open source · AGPL-3.0
            </div>

            <div className="float-up-1 space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl text-terminal-text-primary tracking-wide leading-tight">
                Understand how computers
                <br />
                <span className="text-terminal-green glow-green">
                  actually speak.
                </span>
              </h1>
              <p className="text-sm font-mono text-terminal-text-secondary leading-relaxed max-w-md">
                Binary. ASCII. Hex. Morse. The layer below the code most
                developers never fully grasp — made interactive, tactile, and
                actually fun to learn.
              </p>
            </div>

            <div className="float-up-2 border-l-2 border-terminal-green/30 pl-4">
              <p className="text-xs font-mono text-terminal-text-muted leading-relaxed italic">
                "I was in networking, staring at IP addresses, wondering why{" "}
                <span className="text-terminal-green not-italic">
                  192.168.1.1
                </span>{" "}
                is just{" "}
                <span className="text-terminal-green not-italic">
                  11000000.10101000.00000001.00000001
                </span>{" "}
                in disguise. I built this to figure it out."
              </p>
              <p className="text-[10px] font-mono text-terminal-text-muted mt-2">
                — Vans (mr-vtx), builder
              </p>
            </div>

            <div className="float-up-3 flex items-center gap-3 flex-wrap">
              <button
                onClick={onEnter}
                className="flex items-center gap-2 px-5 py-2.5 rounded border border-terminal-green text-terminal-green bg-terminal-green-muted font-mono text-sm hover:shadow-glow-green transition-all group"
              >
                Launch app
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
              <button
                onClick={() => onAuth("register")}
                className="flex items-center gap-2 px-5 py-2.5 rounded border border-terminal-border text-terminal-text-secondary font-mono text-sm hover:border-terminal-green/30 hover:text-terminal-green transition-all"
              >
                Create account
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="float-up-4 flex items-center gap-6">
              {[
                { val: "5", label: "tools" },
                { val: "5", label: "stages" },
                { val: "6", label: "quiz types" },
                { val: "∞", label: "free" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-mono font-bold text-terminal-green glow-green">
                    {val}
                  </div>
                  <div className="text-[10px] font-mono text-terminal-text-muted uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="float-up-2 space-y-3">
            <p className="text-[10px] font-mono text-terminal-text-muted uppercase tracking-widest">
              // live preview
            </p>
            <LiveDemo />
            <p className="text-[10px] font-mono text-terminal-text-muted text-center">
              cycles through real conversions · try them yourself inside →
            </p>
          </div>
        </section>

        <div className="border-t border-terminal-border" />

        <section className="py-14">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: "Networking people",
                desc: "Finally understand why IP addresses, subnet masks, and MAC addresses look the way they do.",
                tag: "← probably you",
                accent: "green",
              },
              {
                title: "CS students",
                desc: "Stop memorising. Start understanding. The quiz system builds the pattern recognition you need.",
                tag: "exam prep",
                accent: "cyan",
              },
              {
                title: "Self-taught devs",
                desc: "Fill the gap most bootcamps skip. The low-level stuff that makes everything else make sense.",
                tag: "fundamentals",
                accent: "amber",
              },
            ].map(({ title, desc, tag, accent }) => {
              const a = ACCENT[accent];
              return (
                <div
                  key={title}
                  className={`bg-terminal-panel border border-terminal-border rounded-lg p-5 hover:${a.border} transition-colors`}
                >
                  <div
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${a.bg} ${a.text} ${a.border} inline-block mb-3`}
                  >
                    {tag}
                  </div>
                  <h3 className="text-sm font-mono font-semibold text-terminal-text-primary mb-2">
                    {title}
                  </h3>
                  <p className="text-xs font-mono text-terminal-text-muted leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="border-t border-terminal-border" />

        <section className="py-14">
          <div className="mb-8">
            <p className="text-[10px] font-mono text-terminal-text-muted uppercase tracking-widest mb-2">
              // tools
            </p>
            <h2 className="text-xl font-display text-terminal-text-primary tracking-wide">
              Five tools. Zero fluff.
            </h2>
            <p className="text-xs font-mono text-terminal-text-muted mt-1">
              Everything opens instantly. No accounts required to use the tools.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </section>

        <div className="border-t border-terminal-border" />

        <section className="py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[10px] font-mono text-terminal-text-muted uppercase tracking-widest mb-2">
                // progression
              </p>
              <h2 className="text-xl font-display text-terminal-text-primary tracking-wide mb-3">
                XP. Stages. Streaks.
              </h2>
              <p className="text-xs font-mono text-terminal-text-secondary leading-relaxed mb-4">
                The quiz isn't random busywork. It tracks what you get wrong,
                pushes you on weak spots, and unlocks harder question types as
                your understanding deepens.
              </p>
              <p className="text-xs font-mono text-terminal-text-muted leading-relaxed">
                Streak resets on wrong answer — not on logout, not on refresh.
                Your XP is permanent. Come back tomorrow and pick up exactly
                where you left off.
              </p>
            </div>

            <div className="space-y-2">
              {STAGES.map((s, i) => (
                <div
                  key={s.id}
                  onMouseEnter={() => setHoveredStage(s.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-all duration-200 cursor-default
                    ${
                      hoveredStage === s.id
                        ? "bg-terminal-panel border-terminal-border/60 scale-[1.01]"
                        : "bg-terminal-bg border-terminal-border"
                    }`}
                >
                  <div
                    className={`text-sm font-mono font-bold w-5 text-center ${s.color}`}
                  >
                    {s.id}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-xs font-mono font-semibold ${s.color}`}
                    >
                      {s.name}
                    </div>
                    <div className="text-[10px] font-mono text-terminal-text-muted">
                      {s.cats}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-terminal-text-muted">
                    {s.xp} XP
                  </div>
                  {i < STAGES.length - 1 && (
                    <ChevronRight
                      size={12}
                      className="text-terminal-text-muted"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-terminal-border" />

        <section className="py-20 text-center">
          <p className="text-[10px] font-mono text-terminal-text-muted uppercase tracking-widest mb-4">
            // ready?
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-terminal-text-primary tracking-wide mb-3">
            Start free.
            <br />
            <span className="text-terminal-green glow-green">
              No card. No catch.
            </span>
          </h2>
          <p className="text-xs font-mono text-terminal-text-muted mb-8 max-w-sm mx-auto leading-relaxed">
            Create an account to save progress, track streaks, and unlock
            stages. Or just launch the app and explore — no signup needed for
            the tools.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => onAuth("register")}
              className="flex items-center gap-2 px-6 py-3 rounded border border-terminal-green text-terminal-green bg-terminal-green-muted font-mono text-sm hover:shadow-glow-green transition-all pulse-glow group"
            >
              Create free account
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
            <button
              onClick={onEnter}
              className="text-xs font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors underline underline-offset-4"
            >
              or launch without account
            </button>
          </div>
        </section>
      </div>

      <footer className="border-t border-terminal-border py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="font-display text-terminal-green text-sm tracking-widest">
              BINARY_LAB
            </span>
            <span className="text-[10px] font-mono text-terminal-text-muted ml-3">
              built by{" "}
              <a
                href="https://github.com/mr-vtx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-green/60 hover:text-terminal-green transition-colors"
              >
                mr-vtx
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mr-vtx/binary-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
            >
              <GithubIcon size={12} />
              Open source · AGPL-3.0
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
