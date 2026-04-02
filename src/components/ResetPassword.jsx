import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api";
import { useAuth } from "../AuthContext";

function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-mono text-terminal-text-secondary uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-green/40 font-mono text-sm select-none">
          ›
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="terminal-input pl-7 pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && (
        <p className="text-[11px] text-terminal-red font-mono">⚠ {error}</p>
      )}
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "min 6 chars", pass: password.length >= 6 },
    { label: "uppercase", pass: /[A-Z]/.test(password) },
    { label: "number", pass: /[0-9]/.test(password) },
    { label: "special", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const bar = [
    "bg-terminal-red",
    "bg-terminal-red",
    "bg-terminal-amber",
    "bg-terminal-cyan",
    "bg-terminal-green",
  ][score];
  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1 items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? bar : "bg-terminal-border"}`}
          />
        ))}
        <span
          className={`text-[10px] font-mono ml-1 ${score >= 4 ? "text-terminal-green" : score >= 3 ? "text-terminal-cyan" : "text-terminal-amber"}`}
        >
          {["", "Weak", "Weak", "Fair", "Strong", "Strong"][score]}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-[10px] font-mono ${c.pass ? "text-terminal-green" : "text-terminal-text-muted"}`}
          >
            {c.pass ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResetPasswordPage({ onSuccess }) {
  // Get token from URL: /reset-password?token=xxxx
  const token = new URLSearchParams(window.location.search).get("token");

  const [status, setStatus] = useState("validating"); // validating | valid | invalid | submitting | done
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const { login } = useAuth();

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    api
      .get(`/auth/reset-password?token=${token}`)
      .then(({ data }) => {
        setStatus("valid");
        setUsername(data.username);
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const validate = () => {
    const e = {};
    if (password.length < 6) e.password = "At least 6 characters";
    if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("submitting");
    setServerError("");

    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });
      // Auto-login with the returned token
      localStorage.setItem("bl_token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setStatus("done");
      setTimeout(() => onSuccess?.(), 1500);
    } catch (err) {
      setServerError(err?.response?.data?.error || "Something went wrong.");
      setStatus("valid");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") submit();
  };

  const Shell = ({ title, children }) => (
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
              {title}
            </span>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );

  if (status === "validating") {
    return (
      <Shell title="auth --reset-password">
        <div className="text-center py-4 font-mono text-terminal-text-muted text-sm">
          Validating link<span className="cursor-blink">▊</span>
        </div>
      </Shell>
    );
  }

  if (status === "invalid") {
    return (
      <Shell title="auth --reset-password">
        <div className="text-center space-y-3 py-2">
          <div className="text-2xl">⛔</div>
          <p className="text-sm font-mono text-terminal-red">
            Link is invalid or has expired.
          </p>
          <p className="text-xs font-mono text-terminal-text-muted">
            Reset links expire after 1 hour and can only be used once.
          </p>
          <button
            onClick={() => {
              window.history.pushState({}, "", "/");
              onSuccess?.();
            }}
            className="text-xs font-mono text-terminal-green hover:glow-green transition-all mt-2"
          >
            Request a new link →
          </button>
        </div>
      </Shell>
    );
  }

  if (status === "done") {
    return (
      <Shell title="auth --reset-password">
        <div className="text-center space-y-3 py-2 fade-slide">
          <div className="text-2xl">✓</div>
          <p className="text-sm font-mono text-terminal-green glow-green">
            Password reset successfully.
          </p>
          <p className="text-xs font-mono text-terminal-text-muted">
            Logging you in<span className="cursor-blink">▊</span>
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="auth --reset-password">
      <div className="space-y-4" onKeyDown={handleKey}>
        {username && (
          <p className="text-xs font-mono text-terminal-text-muted">
            Setting new password for{" "}
            <span className="text-terminal-green">{username}</span>
          </p>
        )}

        <div className="space-y-1">
          <PasswordField
            label="New Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••"
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••"
          error={errors.confirmPassword}
        />

        {serverError && (
          <div className="bg-red-900/20 border border-terminal-red/30 rounded px-3 py-2 text-sm font-mono text-terminal-red">
            ✗ {serverError}
          </div>
        )}

        <button
          onClick={submit}
          disabled={status === "submitting"}
          className={`w-full py-3 rounded border font-mono text-sm uppercase tracking-wider transition-all
            ${
              status === "submitting"
                ? "border-terminal-border text-terminal-text-muted cursor-wait"
                : "border-terminal-green text-terminal-green bg-terminal-green-muted hover:shadow-glow-green cursor-pointer"
            }`}
        >
          {status === "submitting" ? "..." : "→ Reset password"}
        </button>
      </div>
    </Shell>
  );
}
