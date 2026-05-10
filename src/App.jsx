import { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./AuthContext";

import BitToggler  from "./components/BitToggler";
import Converter   from "./components/Converter";
import AsciiTable  from "./components/AsciiTable";
import MorseCode   from "./components/MorseCode";
import Quiz        from "./components/Quiz";

import Learn          from "./components/Learn";
import DailyChallenge from "./components/DailyChallenge";
import Pipeline       from "./components/Pipeline";
import SubnetCalc     from "./components/SubnetCalc";
import NumberCalc     from "./components/NumberCalc";
import CheatSheet     from "./components/CheatSheet";
import Glossary       from "./components/Glossary";

import AuthPage          from "./components/AuthPage";
import UserHUD           from "./components/UserHUD";
import ProfileModal      from "./components/ProfileModal";
import ResetPasswordPage from "./components/ResetPassword";
import VerifyEmailPage   from "./components/VerifyEmail";
import VerifyEmailBanner from "./components/VerifyEmailBanner";
import LandingPage       from "./components/LandingPage";

import { MODULES, isUnlocked, loadProg, saveProg, TOTAL_LESSONS } from "./learnData";

const NAV = [
  {
    section: "LEARN",
    items: [
      { id: "learn",     icon: "📚", label: "Lessons",         badge: "START", badgeColor: "#004d2a", badgeText: "#00ff88" },
      { id: "challenge", icon: "🎯", label: "Daily Challenge",  badge: "DAILY", badgeColor: "#1a1400", badgeText: "#ffb800" },
      { id: "quiz",      icon: "📝", label: "Practice Quiz" },
    ],
  },
  {
    section: "TOOLS",
    items: [
      { id: "pipeline", icon: "⚡", label: "Live Pipeline",  badge: "NEW", badgeColor: "#004d2a", badgeText: "#00ff88" },
      { id: "subnet",   icon: "🌐", label: "Subnet Calc",    badge: "NEW", badgeColor: "#001a1f", badgeText: "#00d4ff" },
      { id: "numcalc",  icon: "🔢", label: "Number Bases" },
      { id: "bits",     icon: "⬛", label: "Bit Toggler" },
      { id: "conv",     icon: "↔️",  label: "Converter" },
      { id: "ascii",    icon: "🔤", label: "ASCII Table" },
      { id: "morse",    icon: "📡", label: "Morse Code" },
    ],
  },
  {
    section: "REFERENCE",
    items: [
      { id: "cheatsheet", icon: "📋", label: "Cheat Sheet" },
      { id: "glossary",   icon: "📖", label: "Glossary" },
    ],
  },
];

const PAGE_META = {
  learn:      { title: "Lessons",         desc: "Structured beginner guide — binary → encoding → networking" },
  challenge:  { title: "Daily Challenge", desc: "Daily quiz + topic sprints · earn XP" },
  quiz:       { title: "Practice Quiz",   desc: "Test your knowledge · unlock harder stages" },
  pipeline:   { title: "Live Pipeline",   desc: "Type anything — see every encoding format instantly" },
  subnet:     { title: "Subnet Calc",     desc: "IP addressing & subnetting with binary breakdown" },
  numcalc:    { title: "Number Bases",    desc: "Convert between base 2, 8, 10, 16 with step-by-step working" },
  bits:       { title: "Bit Toggler",     desc: "Click bits and watch decimal / hex update live" },
  conv:       { title: "Converter",       desc: "Binary / text / decimal / hex conversions" },
  ascii:      { title: "ASCII Table",     desc: "All 128 ASCII characters with codes" },
  morse:      { title: "Morse Code",      desc: "Encode and decode Morse code" },
  cheatsheet: { title: "Cheat Sheet",     desc: "Printable quick reference" },
  glossary:   { title: "Glossary",        desc: "Every term explained in plain English" },
};

const PANELS = {
  learn:      Learn,
  challenge:  DailyChallenge,
  quiz:       Quiz,
  pipeline:   Pipeline,
  subnet:     SubnetCalc,
  numcalc:    NumberCalc,
  bits:       BitToggler,
  conv:       Converter,
  ascii:      AsciiTable,
  morse:      MorseCode,
  cheatsheet: CheatSheet,
  glossary:   Glossary,
};

function LearnCurriculumNav({ progress, selectedLesson, onSelectLesson, onClose }) {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(MODULES.map((m) => [m.id, true]))
  );

  const done  = Object.values(progress).filter((p) => p.passed).length;
  const pct   = Math.round((done / TOTAL_LESSONS) * 100);

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div>
      <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid #1a2030" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Progress
          </span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#00ff88" }}>
            {done}/{TOTAL_LESSONS}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ padding: "6px 6px 4px" }}>
        {MODULES.map((mod) => {
          const open        = expanded[mod.id];
          const modDone     = mod.lessons.every((l) => progress[l.id]?.passed);
          const firstLesson = mod.lessons[0];
          const modUnlocked = isUnlocked(firstLesson.id, mod.id, progress);

          return (
            <div key={mod.id} style={{ marginBottom: 2 }}>
              <button
                onClick={() => toggle(mod.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 8px", borderRadius: 5, background: open ? "#0d1208" : "none",
                  border: `1px solid ${open ? "#00ff8815" : "transparent"}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{mod.emoji}</span>
                <span style={{
                  fontFamily: "JetBrains Mono", fontSize: 11, flex: 1, textAlign: "left",
                  color: modUnlocked ? mod.color : "#3a5040", fontWeight: 600,
                }}>
                  {mod.title}
                </span>
                {modDone && (
                  <span style={{ color: "#00ff88", fontSize: 10, flexShrink: 0 }}>✓</span>
                )}
                {!modUnlocked && (
                  <span style={{ fontSize: 10, flexShrink: 0 }}>🔒</span>
                )}
                <span style={{ color: "#3a5040", fontSize: 10, flexShrink: 0 }}>
                  {open ? "▾" : "▸"}
                </span>
              </button>

              {open && (
                <div style={{ marginLeft: 10, paddingLeft: 10, borderLeft: `1px solid ${mod.color}25`, marginTop: 2, marginBottom: 4 }}>
                  {mod.lessons.map((lesson) => {
                    const unl   = isUnlocked(lesson.id, mod.id, progress);
                    const ldone = !!progress[lesson.id]?.passed;
                    const isSel = selectedLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        disabled={!unl}
                        onClick={() => {
                          if (unl) {
                            onSelectLesson(lesson, mod);
                            onClose?.(); 
                          }
                        }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 7,
                          padding: "6px 8px", borderRadius: 5, marginBottom: 1,
                          background: isSel ? "#0d1f14" : "none",
                          border: `1px solid ${isSel ? "#00ff8825" : "transparent"}`,
                          cursor: unl ? "pointer" : "not-allowed",
                          opacity: unl ? 1 : 0.35,
                        }}
                      >
                        <span style={{ fontSize: 10, flexShrink: 0, lineHeight: 1 }}>
                          {ldone ? "✅" : unl ? "○" : "🔒"}
                        </span>
                        <span style={{
                          fontFamily: "JetBrains Mono", fontSize: 10.5, flex: 1,
                          textAlign: "left", lineHeight: 1.35,
                          color: isSel ? "#00ff88" : unl ? "#6b8a7a" : "#3a5040",
                        }}>
                          {lesson.title}
                        </span>
                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", flexShrink: 0 }}>
                          +{lesson.xp}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ active, onSelect, user, profile,
                   onSignIn, open, onClose,
                   learnProgress, learnSelected, onLearnSelect }) {
  const totalXp = profile?.xp || 0;
  const stage   = profile?.stage?.name || "Beginner";

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 40 }}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "14px 12px 10px", borderBottom: "1px solid #1a2030", flexShrink: 0 }}>
          <div className="font-display glow-green" style={{ color: "#00ff88", fontSize: 16, letterSpacing: "0.12em" }}>
            BINARY_LAB
          </div>
          <div style={{ color: "#3a5040", fontSize: 9, letterSpacing: "0.1em", marginTop: 2, fontFamily: "JetBrains Mono" }}>
            v1.2 · LEARN · BUILD · MASTER
          </div>
        </div>

        <div style={{ padding: "10px 10px 6px", flexShrink: 0 }}>
          {user ? (
            <div style={{ background: "#0d1f14", border: "1px solid #00ff8820", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#00ff88", fontSize: 10, fontFamily: "JetBrains Mono" }}>
                  ● {user.username || user.email?.split("@")[0]}
                </span>
                <span style={{ color: "#ffb800", fontSize: 10, fontFamily: "JetBrains Mono" }}>
                  {totalXp} XP
                </span>
              </div>
              <div style={{ color: "#3a5040", fontSize: 9, fontFamily: "JetBrains Mono", marginTop: 2 }}>
                {stage}
              </div>
            </div>
          ) : (
            <button onClick={onSignIn} className="btn-primary" style={{ width: "100%", textAlign: "center", fontSize: 11 }}>
              → Sign in / Register
            </button>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "4px 8px 16px" }}>
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <div style={{
                color: "#3a5040", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "12px 4px 4px", fontFamily: "JetBrains Mono",
              }}>
                {section}
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onSelect(item.id); onClose?.(); }}
                  className={`nav-item ${active === item.id ? "active" : ""}`}
                  style={{ marginBottom: 1 }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: 8, padding: "1px 5px", borderRadius: 3,
                      background: item.badgeColor, color: item.badgeText,
                      border: `1px solid ${item.badgeText}33`,
                      letterSpacing: "0.08em", fontFamily: "JetBrains Mono",
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              {section === "LEARN" && active === "learn" && (
                <div style={{
                  marginTop: 6, marginBottom: 4,
                  background: "#080b0e", border: "1px solid #1a2030",
                  borderRadius: 7, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "6px 10px 4px",
                    fontFamily: "JetBrains Mono", fontSize: 9,
                    color: "#3a5040", letterSpacing: "0.12em", textTransform: "uppercase",
                    borderBottom: "1px solid #1a2030",
                  }}>
                    Curriculum
                  </div>
                  <LearnCurriculumNav
                    progress={learnProgress}
                    selectedLesson={learnSelected}
                    onSelectLesson={onLearnSelect}
                    onClose={onClose}
                  />
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: "10px 12px", borderTop: "1px solid #1a2030", flexShrink: 0 }}>
          <div style={{ color: "#3a5040", fontSize: 9, fontFamily: "JetBrains Mono" }}>
            made with 💚 by{" "}
            <a href="https://github.com/mr-vtx" style={{ color: "#00ff8860" }}>mr-vtx</a>
          </div>
        </div>
      </aside>
    </>
  );
}

function Shell() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [view, setView]               = useState("landing");
  const [authMode, setAuthMode]       = useState("login");
  const [active, setActive]           = useState("learn");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [learnProgress, setLearnProgress] = useState(() => loadProg(user?.id));
  const [learnSelected, setLearnSelected] = useState(null); // { lesson, module }

  useEffect(() => {
    setLearnProgress(loadProg(user?.id));
  }, [user?.id]);

  const handleLearnSelect = useCallback((lesson, mod) => {
    setLearnSelected({ lesson, module: mod });
    setActive("learn");
  }, []);

  const handleLearnProgressChange = useCallback((lessonId, passed) => {
    setLearnProgress((prev) => {
      const next = { ...prev, [lessonId]: { passed, at: Date.now() } };
      saveProg(user?.id, next);
      return next;
    });
  }, [user?.id]);

  const Panel   = PANELS[active];
  const meta    = PAGE_META[active] || {};
  const path    = window.location.pathname;

  if (path === "/reset-password") {
    return (
      <ResetPasswordPage
        onSuccess={() => {
          window.history.pushState({}, "", "/");
          refreshProfile?.();
          setView("app");
        }}
      />
    );
  }
  if (path === "/verify-email") {
    return (
      <VerifyEmailPage
        onSuccess={() => {
          window.history.pushState({}, "", "/");
          refreshProfile?.();
          setView(user ? "app" : "landing");
        }}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0c0f" }}>
        <div className="font-display glow-green" style={{ color: "#00ff88", fontSize: 20, letterSpacing: "0.14em" }}>
          BINARY_LAB<span className="cursor-blink" style={{ marginLeft: 4 }}>▊</span>
        </div>
      </div>
    );
  }

  if (view === "landing" && !user) {
    return (
      <LandingPage
        onEnter={() => setView("app")}
        onAuth={(m) => { setAuthMode(m); setView("auth"); }}
      />
    );
  }
  if (view === "auth" && !user) {
    return <AuthPage initialMode={authMode} onSuccess={() => setView("app")} />;
  }

  return (
    <div className="app-shell">
      {user && user.emailVerified === false && <VerifyEmailBanner email={user.email} />}

      <header style={{
        height: 50, flexShrink: 0,
        background: "#080b0e", borderBottom: "1px solid #1a2030",
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12, zIndex: 20,
      }}>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            color: "#6b8a7a", background: "none", border: "none",
            cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1,
            display: "flex", alignItems: "center",
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }}>
          <span style={{ color: "#00ff8840", fontFamily: "JetBrains Mono", fontSize: 11, flexShrink: 0 }}>~/lab/</span>
          <span style={{ color: "#e8f5ef", fontFamily: "JetBrains Mono", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {active}
          </span>
          <span style={{ color: "#3a5040", fontSize: 11, margin: "0 2px", flexShrink: 0 }}>—</span>
          <span style={{
            color: "#3a5040", fontFamily: "JetBrains Mono", fontSize: 10,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {active === "learn" && learnSelected
              ? learnSelected.lesson.title
              : meta.desc}
          </span>
        </div>

        {user ? (
          <UserHUD onOpenProfile={() => setShowProfile(true)} />
        ) : (
          <button
            onClick={() => { setAuthMode("login"); setView("auth"); }}
            style={{
              fontFamily: "JetBrains Mono", fontSize: 11, padding: "6px 12px",
              borderRadius: 5, border: "1px solid #00ff8840", color: "#00ff88",
              background: "transparent", cursor: "pointer", flexShrink: 0,
            }}
          >
            → Sign In
          </button>
        )}
      </header>

      <div className="app-body">
        <Sidebar
          active={active}
          onSelect={(id) => { setActive(id); setSidebarOpen(false); }}
          user={user}
          profile={profile}
          onSignIn={() => { setAuthMode("login"); setView("auth"); }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          learnProgress={learnProgress}
          learnSelected={learnSelected?.lesson}
          onLearnSelect={handleLearnSelect}
        />

        <main className="content-area">
          <div style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid #1a203025",
          }}>
            <h1 style={{ fontFamily: "Share Tech Mono", fontSize: 18, color: "#e8f5ef", letterSpacing: "0.06em" }}>
              {meta.title}
            </h1>

            {!user && ["quiz", "learn", "challenge"].includes(active) && (
              <div style={{
                marginTop: 10, display: "flex", alignItems: "center", gap: 10,
                background: "#0d1f14", border: "1px solid #00ff8820",
                borderRadius: 6, padding: "8px 12px",
              }}>
                <span style={{ color: "#00ff88", fontSize: 13, flexShrink: 0 }}>⚡</span>
                <span style={{ color: "#6b8a7a", fontFamily: "JetBrains Mono", fontSize: 11, flex: 1 }}>
                  Sign in to save progress, earn XP, and unlock all modules.
                </span>
                <button
                  onClick={() => { setAuthMode("register"); setView("auth"); }}
                  style={{
                    color: "#00ff88", fontFamily: "JetBrains Mono", fontSize: 11,
                    background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >
                  Free account →
                </button>
              </div>
            )}
          </div>

          <div style={{ padding: "20px 20px 60px" }}>
            {active === "learn" ? (
              <Learn
                key="learn"
                selected={learnSelected}
                onSelect={handleLearnSelect}
                progress={learnProgress}
                onProgressChange={handleLearnProgressChange}
              />
            ) : (
              <Panel key={active} />
            )}
          </div>
        </main>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
