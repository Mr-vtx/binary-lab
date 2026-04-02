import { useState } from "react";
import { useAuth } from "../AuthContext";
import api from "../api";
import { Eye, EyeOff } from "lucide-react";
import { track } from "@vercel/analytics";

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  children,
}) {
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="terminal-input pl-7 pr-10"
          autoComplete={type === "password" ? "current-password" : "off"}
        />
        {children}
      </div>
      {error && (
        <p className="text-[11px] text-terminal-red font-mono">⚠ {error}</p>
      )}
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
    >
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </Field>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "min 6 chars", pass: password.length >= 6 },
    { label: "uppercase", pass: /[A-Z]/.test(password) },
    { label: "number", pass: /[0-9]/.test(password) },
    { label: "special char", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const bar = [
    "bg-terminal-red",
    "bg-terminal-red",
    "bg-terminal-amber",
    "bg-terminal-cyan",
    "bg-terminal-green",
  ][score];
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Strong", "Strong"][score];
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
          {strengthLabel}
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

export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { login, register } = useAuth();

  const reset = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (mode === "register") {
      if (username.length < 2 || username.length > 20)
        e.username = "2–20 characters";
      if (password.length < 6) e.password = "At least 6 characters";
      if (password !== confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    if (mode === "login" && !password) e.password = "Password is required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setServerError("");
    try {
      if (mode === "login") {
        await login(email, password);
        track("login", { method: "email" });
if (user) {
  onSuccess?.();
}       
      } else if (mode === "register") {
        await register(email, username, password, confirmPassword);
        track("register", { method: "email" });
        onSuccess?.();
      } else if (mode === "forgot") {
        await api.post("/auth/forgot-password", { email });
        setMode("forgot-sent");
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.error || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") submit();
  };

  const modeLabel = {
    login: "auth --login",
    register: "auth --register",
    forgot: "auth --forgot-password",
    "forgot-sent": "auth --email-sent",
  }[mode];

  if (mode === "forgot-sent") {
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
                auth --email-sent
              </span>
            </div>
            <div className="p-6 space-y-4 text-center">
              <div className="text-3xl">📬</div>
              <p className="text-sm font-mono text-terminal-text-primary">
                Reset link sent.
              </p>
              <p className="text-xs font-mono text-terminal-text-muted leading-relaxed">
                If <span className="text-terminal-green">{email}</span> has an
                account, a reset link is on its way. Check your inbox — it
                expires in 1 hour.
              </p>
              <p className="text-[11px] font-mono text-terminal-text-muted">
                Didn't get it? Check spam, or{" "}
                <button
                  onClick={() => reset("forgot")}
                  className="text-terminal-green hover:glow-green transition-all"
                >
                  try again
                </button>
                .
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => reset("login")}
              className="text-[11px] font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
            >
              ← back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="font-display text-terminal-green text-2xl tracking-widest glow-green mb-1">
            BINARY_LAB
          </div>
          <div className="text-[11px] text-terminal-text-muted font-mono tracking-widest">
            encoding toolkit · user system
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
              {modeLabel}
            </span>
          </div>

          <div className="p-6 space-y-4" onKeyDown={handleKey}>
            {(mode === "login" || mode === "register") && (
              <div className="flex rounded border border-terminal-border overflow-hidden">
                {["login", "register"].map((m) => (
                  <button
                    key={m}
                    onClick={() => reset(m)}
                    className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all
                      ${
                        mode === m
                          ? "bg-terminal-green-muted text-terminal-green"
                          : "text-terminal-text-secondary hover:text-terminal-text-primary hover:bg-terminal-bg"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {mode === "forgot" && (
              <div>
                <p className="text-sm font-mono text-terminal-text-primary mb-1">
                  Reset your password
                </p>
                <p className="text-[11px] font-mono text-terminal-text-muted">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
            )}

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              error={errors.email}
            />

            {mode === "register" && (
              <Field
                label="Username"
                value={username}
                onChange={setUsername}
                placeholder="mr-vtx"
                error={errors.username}
              />
            )}

            {(mode === "login" || mode === "register") && (
              <div className="space-y-1">
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••"
                  error={errors.password}
                />
                {mode === "register" && (
                  <PasswordStrength password={password} />
                )}
              </div>
            )}

            {mode === "register" && (
              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••"
                error={errors.confirmPassword}
              />
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  onClick={() => reset("forgot")}
                  className="text-[11px] font-mono text-terminal-text-muted hover:text-terminal-green transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {serverError && (
              <div className="bg-red-900/20 border border-terminal-red/30 rounded px-3 py-2 text-sm font-mono text-terminal-red fade-slide">
                ✗ {serverError}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className={`w-full py-3 rounded border font-mono text-sm uppercase tracking-wider transition-all
                ${
                  loading
                    ? "border-terminal-border text-terminal-text-muted cursor-wait"
                    : "border-terminal-green text-terminal-green bg-terminal-green-muted hover:shadow-glow-green cursor-pointer"
                }`}
            >
              {loading
                ? "..."
                : mode === "login"
                  ? "→ Login"
                  : mode === "register"
                    ? "→ Create account"
                    : "→ Send reset link"}
            </button>

            {mode === "forgot" && (
              <div className="text-center">
                <button
                  onClick={() => reset("login")}
                  className="text-[11px] font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
                >
                  ← back to login
                </button>
              </div>
            )}

            {mode === "register" && (
              <p className="text-[11px] text-terminal-text-muted font-mono text-center">
                Your streak, XP, and progress will be saved to your account.
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={onSuccess}
            className="text-[11px] font-mono text-terminal-text-muted hover:text-terminal-text-secondary transition-colors"
          >
            continue without account →
          </button>
        </div>
      </div>
    </div>
  );
}
