import { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import BitToggler from "./components/BitToggler";
import Converter from "./components/Converter";
import AsciiTable from "./components/AsciiTable";
import MorseCode from "./components/MorseCode";
import Quiz from "./components/Quiz";
import AuthPage from "./components/AuthPage";
import UserHUD from "./components/UserHUD";
import ProfileModal from "./components/ProfileModal";
import ResetPasswordPage from "./components/ResetPassword";
import VerifyEmailPage from "./components/VerifyEmail";
import VerifyEmailBanner from "./components/VerifyEmailBanner";
import LandingPage from "./components/LandingPage";
import { Analytics } from "@vercel/analytics/react";

const TABS = [
  {
    id: "bits",
    label: "Bit Toggler",
    short: "01",
    desc: "Toggle individual bits and see live values",
  },
  {
    id: "conv",
    label: "Converter",
    short: "02",
    desc: "Binary / Text / Decimal / Hex conversions",
  },
  {
    id: "ascii", 
    label: "ASCII Table",
    short: "03",
    desc: "Browse and inspect all printable ASCII chars",
  },
  {
    id: "morse",
    label: "Morse Code",
    short: "04",
    desc: "Encode and decode Morse code",
  },
  {
    id: "quiz",
    label: "Practice",
    short: "05",
    desc: "Test your knowledge · earn XP · unlock stages",
  },
];

const PANELS = {
  bits: BitToggler,
  conv: Converter,
  ascii: AsciiTable,
  morse: MorseCode,
  quiz: Quiz,
};

function Shell() {
  const { user, loading, refreshProfile } = useAuth();
  const [view, setView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [active, setActive] = useState("bits");
  const [showProfile, setShowProfile] = useState(false);
  const Panel = PANELS[active];

  const path = window.location.pathname;

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
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="font-display text-terminal-green text-xl tracking-widest glow-green">
          BINARY_LAB<span className="cursor-blink ml-1">▊</span>
        </div>
      </div>
    );
  }

  if (view === "landing" && !user) {
    return (
      <LandingPage
        onEnter={() => setView("app")}
        onAuth={(mode) => {
          setAuthMode(mode);
          setView("auth");
        }}
      />
    );
  }

  if (view === "auth" && !user) {
    return <AuthPage initialMode={authMode} onSuccess={() => setView("app")} />;
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {user && user.emailVerified === false && (
        <VerifyEmailBanner email={user.email} />
      )}

      <header className="border-b border-terminal-border bg-terminal-panel/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <button
              onClick={() => !user && setView("landing")}
              className="text-left"
            >
              <div className="font-display text-terminal-green text-base tracking-widest glow-green">
                BINARY_LAB
              </div>
              <div className="text-[10px] text-terminal-text-muted tracking-widest hidden sm:block">
                v1.0.0 · encoding toolkit
              </div>
            </button>
          </div>

          <div className="flex-1" />

          {user ? (
            <UserHUD onOpenProfile={() => setShowProfile(true)} />
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setView("auth");
              }}
              className="text-xs font-mono px-3 py-1.5 rounded border border-terminal-green/40 text-terminal-green hover:shadow-glow-green transition-all"
            >
              → Login / Register
            </button>
          )}
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b border-terminal-border bg-terminal-panel/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-xs font-mono whitespace-nowrap transition-all duration-150 border-b-2
                    ${
                      isActive
                        ? "border-terminal-green text-terminal-green bg-terminal-green-muted/30"
                        : "border-transparent text-terminal-text-secondary hover:text-terminal-text-primary hover:bg-terminal-panel/60"
                    }`}
                >
                  <span
                    className={`text-[10px] ${isActive ? "text-terminal-green/60" : "text-terminal-text-muted"}`}
                  >
                    {tab.short}
                  </span>
                  <span className="uppercase tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2">
        <span className="text-terminal-green/40 text-xs font-mono">~/lab/</span>
        <span className="text-terminal-text-muted text-xs font-mono">
          {TABS.find((t) => t.id === active)?.id}
        </span>
        <span className="text-terminal-text-muted/40 text-xs mx-1">·</span>
        <span className="text-terminal-text-muted text-xs font-mono">
          {TABS.find((t) => t.id === active)?.desc}
        </span>
      </div>

      {/* Guest quiz nudge */}
      {!user && active === "quiz" && (
        <div className="max-w-5xl mx-auto px-4 mb-3">
          <div className="flex items-center gap-3 bg-terminal-green-muted/30 border border-terminal-green/20 rounded px-4 py-2.5 text-xs font-mono">
            <span className="text-terminal-green">⚡</span>
            <span className="text-terminal-text-secondary flex-1">
              Sign in to save your streak, earn XP, and unlock harder stages as
              you improve.
            </span>
            <button
              onClick={() => {
                setAuthMode("register");
                setView("auth");
              }}
              className="text-terminal-green hover:glow-green transition-all"
            >
              Create account →
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        <Panel key={active} />
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border mt-8 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-mono text-terminal-text-muted">
            BINARY_LAB · by{" "}
            <a
              href="https://github.com/mr-vtx"
              className="text-terminal-green/60 hover:text-terminal-green transition-colors"
            >
              mr-vtx
            </a>
          </span>
          <button
            onClick={() => !user && setView("landing")}
            className="text-[11px] font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
          >
            ← back to landing
          </button>
        </div>
      </footer>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
      <Analytics />
    </AuthProvider>
  );
}
