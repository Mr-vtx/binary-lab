import { useState, useEffect } from "react";
import api from "../api";

export default function VerifyEmailPage({ onSuccess }) {
  const token = new URLSearchParams(window.location.search).get("token");
  const [status, setStatus] = useState("verifying"); // verifying | success | already | error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    api
      .get(`/auth/verify-email?token=${token}`)
      .then(({ data }) => {
        if (data.alreadyVerified) {
          setStatus("already");
          return;
        }
        if (data.token) {
          // Auto-login with the returned token
          localStorage.setItem("bl_token", data.token);
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        }
        setStatus("success");
        setTimeout(() => {
          window.history.pushState({}, "", "/");
          onSuccess?.();
        }, 2000);
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const states = {
    verifying: {
      icon: null,
      title: "Verifying your email",
      desc: null,
      blink: true,
    },
    success: {
      icon: "✓",
      iconColor: "text-terminal-green glow-green",
      title: "Email verified.",
      desc: "Your account is active. Logging you in…",
      action: null,
    },
    already: {
      icon: "✓",
      iconColor: "text-terminal-cyan",
      title: "Already verified.",
      desc: "Your email is already confirmed. Head back to the app.",
      action: {
        label: "→ Go to app",
        fn: () => {
          window.history.pushState({}, "", "/");
          onSuccess?.();
        },
      },
    },
    error: {
      icon: "⛔",
      iconColor: "text-terminal-red",
      title: "Link is invalid or expired.",
      desc: "Verification links expire after 24 hours. Log in and request a new one.",
      action: {
        label: "→ Back to login",
        fn: () => {
          window.history.pushState({}, "", "/");
          onSuccess?.();
        },
      },
    },
  };

  const s = states[status];

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="font-display text-terminal-green text-2xl tracking-widest glow-green mb-1">
            BINARY_LAB
          </div>
        </div>

        <div className="bg-terminal-panel border border-terminal-border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-bg">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[11px] font-mono text-terminal-text-muted ml-2">
              auth --verify-email
            </span>
          </div>

          <div className="p-8 text-center space-y-4 fade-slide">
            {s.icon && (
              <div className={`text-4xl font-mono font-bold ${s.iconColor}`}>
                {s.icon}
              </div>
            )}

            <p className="text-sm font-mono text-terminal-text-primary font-semibold">
              {s.title}
              {s.blink && <span className="cursor-blink ml-1">▊</span>}
            </p>

            {s.desc && (
              <p className="text-xs font-mono text-terminal-text-muted leading-relaxed">
                {s.desc}
              </p>
            )}

            {s.action && (
              <button
                onClick={s.action.fn}
                className="mt-2 text-xs font-mono text-terminal-green hover:glow-green transition-all border border-terminal-green/40 px-4 py-2 rounded bg-terminal-green-muted"
              >
                {s.action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
