import { useState, useEffect } from "react";
import api from "../api";

export default function VerifyEmailPage({ onSuccess }) {
  const token = new URLSearchParams(window.location.search).get("token");

  const [status, setStatus] = useState("verifying");

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

        if (data.verified) {
          setStatus("success");

          setTimeout(() => {
            onSuccess?.();
            window.location.href = "/"; // 🔥 proper redirect
          }, 1500);

          return;
        }

        // fallback
        setStatus("error");
      })
      .catch((err) => {
        // handle backend error properly
        const msg = err?.response?.data?.error;

        if (msg?.includes("expired") || msg?.includes("invalid")) {
          setStatus("expired");
        } else {
          setStatus("error");
        }
      });
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
      desc: "Your account is active. Redirecting…",
    },
    already: {
      icon: "✓",
      iconColor: "text-terminal-cyan",
      title: "Already verified.",
      desc: "Your email is already confirmed.",
      action: {
        label: "→ Go to app",
        fn: () => {
          onSuccess?.();
          window.location.href = "/";
        },
      },
    },
    expired: {
      icon: "⛔",
      iconColor: "text-terminal-red",
      title: "Link expired.",
      desc: "This verification link has expired. Request a new one.",
      action: {
        label: "→ Go to login",
        fn: () => {
          window.location.href = "/";
        },
      },
    },
    error: {
      icon: "⛔",
      iconColor: "text-terminal-red",
      title: "Verification failed.",
      desc: "Something went wrong. Try again.",
      action: {
        label: "→ Go to login",
        fn: () => {
          window.location.href = "/";
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
              <p className="text-xs font-mono text-terminal-text-muted">
                {s.desc}
              </p>
            )}

            {s.action && (
              <button
                onClick={s.action.fn}
                className="mt-2 text-xs font-mono text-terminal-green border border-terminal-green/40 px-4 py-2 rounded bg-terminal-green-muted"
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
