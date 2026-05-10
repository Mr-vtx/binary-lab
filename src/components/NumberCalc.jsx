import { useState, useMemo } from "react";

const BASES = [
  { id: 2,  label: "Binary",      prefix: "0b", chars: "01",                    color: "#00ff88" },
  { id: 8,  label: "Octal",       prefix: "0o", chars: "0-7",                   color: "#00d4ff" },
  { id: 10, label: "Decimal",     prefix: "",   chars: "0-9",                   color: "#e8f5ef" },
  { id: 16, label: "Hexadecimal", prefix: "0x", chars: "0-9, A-F",              color: "#ffb800" },
];

function isValidForBase(str, base) {
  if (!str) return true;
  const patterns = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-fA-F]+$/ };
  return patterns[base]?.test(str.replace(/^0[bBxXoO]/, "")) ?? false;
}

function parseInput(str, base) {
  const clean = str.trim().replace(/^0[bBxXoO]/i, "");
  const n = parseInt(clean, base);
  return isNaN(n) ? null : n;
}

function decToBaseSteps(dec, base) {
  if (dec === 0) return [{ quotient: 0, remainder: 0, digit: "0" }];
  const steps = [];
  let n = dec;
  while (n > 0) {
    const r = n % base;
    steps.push({ quotient: Math.floor(n / base), remainder: r, digit: r.toString(base).toUpperCase() });
    n = Math.floor(n / base);
  }
  return steps.reverse();
}

function baseToDec_steps(str, base) {
  const digits = str.toUpperCase().split("").reverse();
  return digits.map((d, i) => ({
    digit: d,
    pos: i,
    weight: Math.pow(base, i),
    value: parseInt(d, base) * Math.pow(base, i),
  })).reverse();
}

function CopyBtn({ value }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1400); }}
      style={{ fontFamily: "JetBrains Mono", fontSize: 9, padding: "2px 8px", border: "1px solid #1a2030", borderRadius: 3, color: "#3a5040", background: "none", cursor: "pointer" }}
    >
      {done ? "✓" : "copy"}
    </button>
  );
}

export default function NumberCalc() {
  const [input, setInput]     = useState("42");
  const [fromBase, setFromBase] = useState(10);
  const [showSteps, setShowSteps] = useState(true);

  const fromCfg = BASES.find((b) => b.id === fromBase);
  const decValue = useMemo(() => parseInput(input, fromBase), [input, fromBase]);
  const valid    = input === "" || (decValue !== null && isValidForBase(input, fromBase));

  const results = useMemo(() => {
    if (decValue === null) return [];
    return BASES.filter((b) => b.id !== fromBase).map((b) => ({
      base: b,
      value: decValue.toString(b.id).toUpperCase(),
      prefixed: b.prefix + decValue.toString(b.id).toUpperCase(),
    }));
  }, [decValue, fromBase]);

  const toDecSteps  = decValue !== null && fromBase !== 10 ? baseToDec_steps(input.replace(/^0[bBxXoO]/i, ""), fromBase) : null;
  const fromDecSteps = decValue !== null && fromBase === 10 ? decToBaseSteps(decValue, 2) : null; // show bin conversion

  return (
    <div className="panel-animate space-y-5">
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>🔢</span>
          <span className="font-display" style={{ color: "#e8f5ef", fontSize: 15, letterSpacing: "0.08em" }}>
            Number Base Calculator
          </span>
        </div>
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a", lineHeight: 1.6, marginBottom: 14 }}>
          Convert between binary, octal, decimal, and hex — with full step-by-step working shown.
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", alignSelf: "center" }}>INPUT IS:</span>
          {BASES.map((b) => (
            <button
              key={b.id}
              onClick={() => { setFromBase(b.id); setInput(""); }}
              style={{
                fontFamily: "JetBrains Mono", fontSize: 11, padding: "5px 12px", borderRadius: 5,
                border: `1px solid ${fromBase === b.id ? b.color + "66" : "#1a2030"}`,
                color: fromBase === b.id ? b.color : "#6b8a7a",
                background: fromBase === b.id ? b.color + "11" : "none", cursor: "pointer",
              }}
            >
              Base {b.id} — {b.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <input
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder={`Enter ${fromCfg?.label} number (${fromCfg?.chars})`}
            style={{ borderColor: !valid ? "#ff335560" : undefined, fontSize: 15, fontWeight: 600 }}
          />
          {!valid && (
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#ff3355", marginTop: 4 }}>
              Invalid character for base {fromBase}. Allowed: {fromCfg?.chars}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", alignSelf: "center" }}>TRY:</span>
          {[
            { v: "255", b: 10 }, { v: "11111111", b: 2 }, { v: "FF", b: 16 },
            { v: "42", b: 10 }, { v: "1A", b: 16 }, { v: "377", b: 8 },
          ].map(({ v, b }) => (
            <button key={`${v}${b}`} onClick={() => { setFromBase(b); setInput(v); }}
              style={{ fontFamily: "JetBrains Mono", fontSize: 10, padding: "3px 9px", borderRadius: 4, border: "1px solid #1a2030", color: "#6b8a7a", background: "none", cursor: "pointer" }}>
              {v} <span style={{ color: "#3a5040" }}>({b})</span>
            </button>
          ))}
        </div>
      </div>

      {decValue !== null && (
        <>
          {fromBase !== 10 && (
            <div className="card" style={{ border: "1px solid #00ff8820", background: "#0d1f14" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Decimal value
              </div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 28, color: "#00ff88", fontWeight: 700 }}>
                {decValue}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {results.map(({ base, value, prefixed }) => (
              <div key={base.id} style={{ background: "#0e1117", border: `1px solid #1a2030`, borderRadius: 7, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Base {base.id} — {base.label}
                  </span>
                  <CopyBtn value={prefixed || value} />
                </div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: base.color, fontWeight: 600, wordBreak: "break-all" }}>
                  {base.prefix && <span style={{ opacity: 0.4 }}>{base.prefix}</span>}{value}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showSteps ? 14 : 0 }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Step-by-step working
              </div>
              <button onClick={() => setShowSteps((v) => !v)}
                style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", background: "none", border: "none", cursor: "pointer" }}>
                {showSteps ? "▲ hide" : "▼ show"}
              </button>
            </div>

            {showSteps && (
              <div className="panel-animate space-y-5">
                {toDecSteps && (
                  <div>
                    <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#e8f5ef", marginBottom: 10 }}>
                      Converting {fromCfg?.label} → Decimal (positional notation)
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ borderCollapse: "collapse", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th style={{ padding: "4px 12px", fontSize: 9, color: "#3a5040", textTransform: "uppercase", borderBottom: "1px solid #1a2030", textAlign: "left" }}>Digit</th>
                            <th style={{ padding: "4px 12px", fontSize: 9, color: "#3a5040", textTransform: "uppercase", borderBottom: "1px solid #1a2030", textAlign: "left" }}>Position</th>
                            <th style={{ padding: "4px 12px", fontSize: 9, color: "#3a5040", textTransform: "uppercase", borderBottom: "1px solid #1a2030", textAlign: "left" }}>Weight ({fromBase}^pos)</th>
                            <th style={{ padding: "4px 12px", fontSize: 9, color: "#3a5040", textTransform: "uppercase", borderBottom: "1px solid #1a2030", textAlign: "left" }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {toDecSteps.map((s, i) => (
                            <tr key={i}>
                              <td style={{ padding: "6px 12px", color: fromCfg?.color || "#e8f5ef", fontWeight: 700 }}>{s.digit}</td>
                              <td style={{ padding: "6px 12px", color: "#6b8a7a" }}>{s.pos}</td>
                              <td style={{ padding: "6px 12px", color: "#6b8a7a" }}>{fromBase}^{s.pos} = {s.weight}</td>
                              <td style={{ padding: "6px 12px", color: "#00ff88" }}>{s.value}</td>
                            </tr>
                          ))}
                          <tr style={{ borderTop: "1px solid #1a2030" }}>
                            <td colSpan={3} style={{ padding: "6px 12px", color: "#3a5040", textAlign: "right" }}>Total =</td>
                            <td style={{ padding: "6px 12px", color: "#00ff88", fontWeight: 700, fontSize: 14 }}>{decValue}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {fromBase === 10 && (
                  <div>
                    <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#e8f5ef", marginBottom: 10 }}>
                      Converting Decimal → Binary (repeated division by 2)
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ borderCollapse: "collapse", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                        <thead>
                          <tr>
                            {["Step", "Number ÷ 2", "Quotient", "Remainder (= bit)"].map((h) => (
                              <th key={h} style={{ padding: "4px 12px", fontSize: 9, color: "#3a5040", textTransform: "uppercase", borderBottom: "1px solid #1a2030", textAlign: "left" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {decToBaseSteps(decValue, 2).map((s, i) => (
                            <tr key={i}>
                              <td style={{ padding: "6px 12px", color: "#3a5040" }}>{i + 1}</td>
                              <td style={{ padding: "6px 12px", color: "#6b8a7a" }}>{(s.quotient * 2 + s.remainder)} ÷ 2</td>
                              <td style={{ padding: "6px 12px", color: "#6b8a7a" }}>{s.quotient}</td>
                              <td style={{ padding: "6px 12px", color: "#00ff88", fontWeight: 700 }}>{s.remainder}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a", marginTop: 10 }}>
                      Read remainders bottom-to-top: <span style={{ color: "#00ff88", fontWeight: 700 }}>
                        {decValue.toString(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {decValue <= 255 && (
            <div className="card">
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                8-bit representation
              </div>
              <div style={{ display: "flex", gap: 1, marginBottom: 8 }}>
                {decValue.toString(2).padStart(8, "0").split("").map((bit, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 4,
                    background: bit === "1" ? "#0d1f14" : "#060809",
                    border: `1px solid ${bit === "1" ? "#00ff8840" : "#1a2030"}`,
                    color: bit === "1" ? "#00ff88" : "#3a5040",
                    fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700,
                  }}>
                    {bit}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 1 }}>
                {[128, 64, 32, 16, 8, 4, 2, 1].map((w) => (
                  <div key={w} style={{ flex: 1, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040" }}>{w}</div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
