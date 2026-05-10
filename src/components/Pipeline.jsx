import { useState, useMemo } from "react";
import { toBin, toHex, MORSE_MAP, copyToClipboard } from "../utils";

function textToBinary(text) {
  return Array.from(text).map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0")).join("  ");
}
function textToDecimal(text) {
  return Array.from(text).map((ch) => ch.charCodeAt(0)).join("   ");
}
function textToHex(text) {
  return Array.from(text).map((ch) => "0x" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")).join("  ");
}
function textToOctal(text) {
  return Array.from(text).map((ch) => "0" + ch.charCodeAt(0).toString(8)).join("  ");
}
function textToBase64(text) {
  try { return btoa(unescape(encodeURIComponent(text))); } catch { return "—"; }
}
function textToUrl(text) {
  try { return encodeURIComponent(text); } catch { return "—"; }
}
function textToMorse(text) {
  return text.toUpperCase().split("").map((ch) => {
    if (ch === " ") return "/";
    return MORSE_MAP[ch] || "?";
  }).join(" ");
}
function binaryToText(bin) {
  const bytes = bin.trim().split(/\s+/);
  if (bytes.some((b) => !/^[01]{1,8}$/.test(b))) return null;
  try { return bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join(""); } catch { return null; }
}
function hexToText(hex) {
  const clean = hex.replace(/0x/gi, "").replace(/\s+/g, "");
  if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) return null;
  try { return (clean.match(/.{2}/g) || []).map((b) => String.fromCharCode(parseInt(b, 16))).join(""); } catch { return null; }
}
function detectType(input) {
  const t = input.trim();
  if (!t) return "empty";
  if (/^[01]+(\s+[01]+)*$/.test(t) && !/[2-9]/.test(t) && t.replace(/\s/g, "").length >= 4) return "binary";
  if (/^([0-9a-fA-F]{2}\s*)+$/.test(t) && !/[g-zG-Z]/.test(t) && t.length >= 2) return "hex";
  if (/^\d+$/.test(t) && parseInt(t) <= 127) return "decimal";
  return "text";
}
function toCanonical(input, type) {
  const t = input.trim();
  switch (type) {
    case "text":    return input;
    case "binary":  return binaryToText(input);
    case "hex":     return hexToText(input);
    case "decimal": {
      const n = parseInt(t);
      return !isNaN(n) && n >= 0 && n <= 127 ? String.fromCharCode(n) : null;
    }
    default: return null;
  }
}

function CopyBtn({ value }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { copyToClipboard(value); setDone(true); setTimeout(() => setDone(false), 1400); }}
      style={{
        fontFamily: "JetBrains Mono", fontSize: 9, padding: "2px 8px",
        border: "1px solid #1a2030", borderRadius: 3, color: done ? "#00ff88" : "#3a5040",
        background: "none", cursor: "pointer", flexShrink: 0,
        transition: "color 0.15s, border-color 0.15s",
        borderColor: done ? "#00ff8840" : "#1a2030",
      }}
    >
      {done ? "✓ copied" : "copy"}
    </button>
  );
}

const ROW_THEMES = {
  green:  { bg: "#0d1f14", border: "#00ff8825", labelColor: "#00ff88" },
  amber:  { bg: "#1a140a", border: "#ffb80025", labelColor: "#ffb800" },
  cyan:   { bg: "#05161a", border: "#00d4ff25", labelColor: "#00d4ff" },
  purple: { bg: "#120a1f", border: "#c084fc25", labelColor: "#c084fc" },
  plain:  { bg: "#0e1117", border: "#1a2030",   labelColor: "#3a5040" },
};

function OutputRow({ label, value, theme = "plain", tip, mono = true }) {
  if (!value || value === "—") return null;
  const t = ROW_THEMES[theme] || ROW_THEMES.plain;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 0 }}>
      <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 1, height: 6, background: "#1a2030" }} />
        <div style={{ width: 6, height: 6, border: "1px solid #1a2030", borderRadius: 1, background: "#0a0c0f" }} />
        <div style={{ width: 1, flex: 1, background: "#1a2030" }} />
      </div>
      <div style={{
        flex: 1, background: t.bg, border: `1px solid ${t.border}`,
        borderRadius: 6, padding: "10px 13px", marginBottom: 6,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: t.labelColor, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8 }}>
              {label}
            </span>
            {tip && <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>{tip}</span>}
          </div>
          <CopyBtn value={value} />
        </div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#a8c8b8", wordBreak: "break-all", lineHeight: 1.6 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function BitGrid({ text }) {
  if (!text || text.length > 3) return null;
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  return (
    <div style={{ background: "#080b0e", border: "1px solid #1a2030", borderRadius: 6, padding: "12px", marginTop: 8 }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
        Bit-level view
      </div>
      {Array.from(text).map((ch, ci) => {
        const code = ch.charCodeAt(0);
        const bits = code.toString(2).padStart(8, "0").split("");
        return (
          <div key={ci} style={{ marginBottom: ci < text.length - 1 ? 14 : 0 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginBottom: 5 }}>
              '{ch}' = {code} = 0x{code.toString(16).toUpperCase()}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {bits.map((bit, bi) => (
                <div key={bi} style={{
                  flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 4,
                  background: bit === "1" ? "#0d1f14" : "#060809",
                  border: `1px solid ${bit === "1" ? "#00ff8840" : "#1a2030"}`,
                  color: bit === "1" ? "#00ff88" : "#3a5040",
                  fontFamily: "JetBrains Mono", fontSize: 14, fontWeight: bit === "1" ? 700 : 400,
                }}>
                  {bit}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
              {weights.map((w) => (
                <div key={w} style={{ flex: 1, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 8, color: "#3a5040" }}>{w}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TYPE_CFG = {
  text:    { label: "TEXT",    color: "#00ff88" },
  binary:  { label: "BINARY",  color: "#00d4ff" },
  hex:     { label: "HEX",     color: "#ffb800" },
  decimal: { label: "DECIMAL", color: "#c084fc" },
  empty:   { label: "—",       color: "#3a5040" },
};

const EXAMPLES = [
  { label: "Hello",    value: "Hello",    base: "text" },
  { label: "A",        value: "A",        base: "text" },
  { label: "01000001", value: "01000001", base: "binary" },
  { label: "48 65",    value: "48 65",    base: "hex" },
  { label: "65",       value: "65",       base: "decimal" },
  { label: "SOS",      value: "SOS",      base: "text" },
  { label: "FF",       value: "FF",       base: "hex" },
];

export default function Pipeline() {
  const [input, setInput]     = useState("");
  const [showBits, setShowBits] = useState(false);

  const type      = detectType(input);
  const canonical = useMemo(() => toCanonical(input, type), [input, type]);
  const typeCfg   = TYPE_CFG[type] || TYPE_CFG.empty;

  const rows = useMemo(() => {
    if (!canonical) return [];
    const t = canonical;
    return [
      type !== "text"    && { label: "ASCII Text",            value: t,               theme: "green",  tip: "human-readable" },
      type !== "binary"  && { label: "Binary (8-bit/char)",   value: textToBinary(t), theme: "cyan",   tip: "base-2" },
      type !== "decimal" && { label: "Decimal (char codes)",  value: textToDecimal(t),theme: "plain",  tip: "base-10" },
      type !== "hex"     && { label: "Hexadecimal",           value: textToHex(t),    theme: "amber",  tip: "base-16" },
                            { label: "Octal",                  value: textToOctal(t),  theme: "plain",  tip: "base-8" },
                            { label: "Base64",                 value: textToBase64(t), theme: "purple", tip: "encoding" },
                            { label: "URL Encoded",            value: textToUrl(t),    theme: "plain" },
                            { label: "Morse Code",             value: textToMorse(t),  theme: "plain" },
    ].filter(Boolean);
  }, [canonical, type]);

  return (
    <div className="panel-animate" style={{ maxWidth: 720 }}>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span className="font-display glow-green" style={{ color: "#00ff88", fontSize: 14, letterSpacing: "0.1em" }}>
                Live Conversion Pipeline
              </span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 8, padding: "1px 6px", border: "1px solid #00ff8825", borderRadius: 3, color: "#00ff8880", background: "#0d1f14" }}>
                v1.2
              </span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#3a5040" }}>
              Type text, binary, hex, or decimal — every encoding updates instantly
            </p>
          </div>
          {input.trim() && (
            <div style={{
              fontFamily: "JetBrains Mono", fontSize: 9, padding: "3px 8px", borderRadius: 4,
              border: `1px solid ${typeCfg.color}33`, color: typeCfg.color, background: typeCfg.color + "0d",
              flexShrink: 0,
            }}>
              {typeCfg.label}
            </div>
          )}
        </div>

        <div style={{ position: "relative", marginBottom: 10 }}>
          <input
            className="terminal-input"
            placeholder="Type 'Hello', '01000001', '48 65', or '65'…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoFocus
            style={{ fontSize: 14, fontWeight: 600 }}
          />
          {input && (
            <button
              onClick={() => setInput("")}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#3a5040", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono", fontSize: 12 }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>TRY:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.value}
              onClick={() => setInput(ex.value)}
              style={{
                fontFamily: "JetBrains Mono", fontSize: 10, padding: "3px 9px",
                borderRadius: 4, border: "1px solid #1a2030", color: "#6b8a7a",
                background: "none", cursor: "pointer",
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length > 0 && (
        <div>
          <div style={{
            background: "#0d1f14", border: "1px solid #00ff8830",
            borderRadius: 6, padding: "10px 13px", marginBottom: 6,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>
                Input · {typeCfg.label}
              </span>
              <CopyBtn value={input} />
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: "#00ff88", fontWeight: 600, wordBreak: "break-all" }}>
              {input}
            </div>

            {canonical && canonical.length <= 3 && (
              <button
                onClick={() => setShowBits((v) => !v)}
                style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", background: "none", border: "none", cursor: "pointer", marginTop: 8 }}
              >
                {showBits ? "▲ hide bit view" : "▼ show bit-level breakdown"}
              </button>
            )}
            {showBits && canonical && <BitGrid text={canonical} />}
          </div>

          <div style={{ paddingLeft: 12 }}>
            {rows.map((row) => (
              <OutputRow key={row.label} {...row} />
            ))}
          </div>

          <div style={{
            marginTop: 8, padding: "10px 13px", border: "1px solid #1a203060",
            borderRadius: 6, background: "#0a0c0f",
            display: "flex", gap: 16, flexWrap: "wrap",
          }}>
            {[
              { color: "#00ff88", label: "Green = ASCII/text" },
              { color: "#00d4ff", label: "Cyan = Binary" },
              { color: "#ffb800", label: "Amber = Hex" },
              { color: "#c084fc", label: "Purple = Encoded" },
            ].map(({ color, label }) => (
              <span key={label} style={{ fontFamily: "JetBrains Mono", fontSize: 9, color }}>■ {label}</span>
            ))}
          </div>
        </div>
      )}

      {!input.trim() && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 48, color: "#1a2030", marginBottom: 12 }}>01→FF</div>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#3a5040" }}>
            Enter any value above to see all encodings simultaneously
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            {["text", "binary", "hex", "decimal", "base64", "morse"].map((f) => (
              <span key={f} style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#1a2030" }}>{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
