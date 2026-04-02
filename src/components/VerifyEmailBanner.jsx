import { useState } from "react";
import { X, Mail } from "lucide-react";
import api from "../api";

export default function VerifyEmailBanner({ email }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const resend = async () => {
    setSending(true);
    try {
      await api.post("/auth/verify-email", { email });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-900/15 border-b border-terminal-amber/20">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
        <Mail size={13} className="text-terminal-amber flex-shrink-0" />
        {sent ? (
          <span className="text-[11px] font-mono text-terminal-amber flex-1">
            Verification email sent to{" "}
            <span className="text-terminal-text-secondary">{email}</span> —
            check your inbox.
          </span>
        ) : (
          <>
            <span className="text-[11px] font-mono text-terminal-amber flex-1">
              Verify your email to secure your account.{" "}
              <button
                onClick={resend}
                disabled={sending}
                className="underline underline-offset-2 hover:text-terminal-text-primary transition-colors disabled:opacity-50"
              >
                {sending ? "Sending…" : "Resend verification email"}
              </button>
            </span>
          </>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-terminal-text-muted hover:text-terminal-text-secondary transition-colors flex-shrink-0"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
