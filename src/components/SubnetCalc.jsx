import { useState, useMemo } from "react";

function parseOctets(ip) {
  return ip.split(".").map(Number);
}
function validIp(ip) {
  const o = parseOctets(ip);
  return o.length === 4 && o.every((n) => !isNaN(n) && n >= 0 && n <= 255);
}
function validPrefix(p) {
  return Number.isInteger(+p) && +p >= 0 && +p <= 32;
}
function toBin8(n) {
  return n.toString(2).padStart(8, "0");
}
function toIpStr(octets) {
  return octets.join(".");
}
function prefixToMaskOctets(prefix) {
  const mask = Array(32).fill(0).map((_, i) => (i < prefix ? 1 : 0));
  return [0, 8, 16, 24].map((s) => parseInt(mask.slice(s, s + 8).join(""), 2));
}
function ipToNum(octets) {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}
function numToOctets(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}
function ipClass(oct1) {
  if (oct1 < 128) return "A";
  if (oct1 < 192) return "B";
  if (oct1 < 224) return "C";
  if (oct1 < 240) return "D (Multicast)";
  return "E (Reserved)";
}
function isPrivate(octets) {
  const [a, b] = octets;
  if (a === 10) return "Private (Class A — 10.x.x.x)";
  if (a === 172 && b >= 16 && b <= 31) return "Private (Class B — 172.16–31.x.x)";
  if (a === 192 && b === 168) return "Private (Class C — 192.168.x.x)";
  if (a === 127) return "Loopback (localhost)";
  if (a === 169 && b === 254) return "Link-local (APIPA)";
  return "Public";
}

function BinRow({ label, octets, prefix, highlightHost = false, color = "#6b8a7a" }) {
  const allBits = octets.flatMap((o) => toBin8(o).split(""));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", width: 90, flexShrink: 0, textAlign: "right" }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 1 }}>
        {allBits.map((bit, i) => {
          const isNet  = prefix !== undefined ? i < prefix : true;
          const isOctetBoundary = i > 0 && i % 8 === 0;
          const bitColor = highlightHost
            ? isNet ? "#00d4ff" : "#ffb800"
            : bit === "1" ? color : "#3a5040";
          return (
            <span key={i} style={{ marginLeft: isOctetBoundary ? 6 : 0 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 13, height: 18, fontFamily: "JetBrains Mono", fontSize: 11,
                borderRadius: 2,
                color: bitColor,
                background: bit === "1" ? (highlightHost ? (isNet ? "#001a1f" : "#1a1400") : "#111620") : "transparent",
                fontWeight: bit === "1" ? 600 : 400,
              }}>
                {bit}
              </span>
            </span>
          );
        })}
      </div>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color, flexShrink: 0 }}>
        {toIpStr(octets)}
      </span>
    </div>
  );
}

function ResultCard({ label, value, sub, color = "#6b8a7a", highlight }) {
  return (
    <div style={{
      background: highlight ? "#0d1f14" : "#0e1117",
      border: `1px solid ${highlight ? "#00ff8830" : "#1a2030"}`,
      borderRadius: 7, padding: "11px 14px",
    }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 14, color, fontWeight: 600, wordBreak: "break-all" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040", marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

const COMMON_CIDRS = [
  { cidr: "/8",  mask: "255.0.0.0",     hosts: "16,777,214", use: "Large ISP / enterprise" },
  { cidr: "/16", mask: "255.255.0.0",   hosts: "65,534",     use: "University / big office" },
  { cidr: "/24", mask: "255.255.255.0", hosts: "254",        use: "Typical home/office LAN" },
  { cidr: "/25", mask: "255.255.255.128",hosts: "126",       use: "Split /24 into 2 halves" },
  { cidr: "/26", mask: "255.255.255.192",hosts: "62",        use: "Smaller departmental LAN" },
  { cidr: "/28", mask: "255.255.255.240",hosts: "14",        use: "Small office / router link" },
  { cidr: "/30", mask: "255.255.255.252",hosts: "2",         use: "Point-to-point link" },
  { cidr: "/32", mask: "255.255.255.255",hosts: "1",         use: "Host route (single device)" },
];

const PRESETS = [
  { label: "Home network",   ip: "192.168.1.100",  prefix: 24 },
  { label: "Office",         ip: "10.0.1.50",      prefix: 16 },
  { label: "Point-to-point", ip: "172.16.0.1",     prefix: 30 },
  { label: "Loopback",       ip: "127.0.0.1",      prefix: 8  },
];

export default function SubnetCalc() {
  const [ip, setIp]       = useState("192.168.1.100");
  const [prefix, setPrefix] = useState(24);
  const [tab, setTab]     = useState("calc"); 

  const calc = useMemo(() => {
    if (!validIp(ip) || !validPrefix(prefix)) return null;
    const p        = +prefix;
    const ipOcts   = parseOctets(ip);
    const maskOcts = prefixToMaskOctets(p);
    const ipNum    = ipToNum(ipOcts);
    const maskNum  = ipToNum(maskOcts);
    const netNum   = ipNum & maskNum;
    const bcastNum = netNum | (~maskNum >>> 0);
    const firstNum = netNum + 1;
    const lastNum  = bcastNum - 1;
    const hosts    = Math.max(0, bcastNum - netNum - 1);
    const wildOcts = maskOcts.map((o) => 255 - o);

    return {
      ip:        ipOcts,
      mask:      maskOcts,
      network:   numToOctets(netNum),
      broadcast: numToOctets(bcastNum),
      first:     numToOctets(firstNum),
      last:      numToOctets(lastNum),
      wild:      wildOcts,
      hosts,
      prefix:    p,
      ipClass:   ipClass(ipOcts[0]),
      scope:     isPrivate(ipOcts),
      totalAddrs: Math.pow(2, 32 - p),
    };
  }, [ip, prefix]);

  const Tabs = ["calc", "ref", "learn"].map((t) => ({
    id: t, label: { calc: "Calculator", ref: "Subnet Reference", learn: "How It Works" }[t],
  }));

  return (
    <div className="panel-animate space-y-5">
      <div className="card" style={{ paddingBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>🌐</span>
          <span className="font-display glow-cyan" style={{ color: "#00d4ff", fontSize: 15, letterSpacing: "0.1em" }}>
            IP Subnet Calculator
          </span>
        </div>
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a", marginBottom: 14, lineHeight: 1.6 }}>
          Enter an IP address and prefix length to calculate the full subnet — with binary breakdown showing how it all works.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ flex: "3 1 180px" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.1em", marginBottom: 4 }}>IP ADDRESS</div>
            <input
              className="terminal-input"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 192.168.1.100"
            />
          </div>
          <div style={{ flex: "1 1 90px" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.1em", marginBottom: 4 }}>PREFIX /{prefix}</div>
            <input
              type="range" min={1} max={32} value={prefix}
              onChange={(e) => setPrefix(+e.target.value)}
              style={{ width: "100%", marginTop: 6 }}
            />
          </div>
          <div style={{ flex: "1 1 80px" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.1em", marginBottom: 4 }}>CIDR</div>
            <input
              className="terminal-input"
              value={prefix}
              onChange={(e) => setPrefix(Math.min(32, Math.max(0, +e.target.value)))}
              style={{ textAlign: "center" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", alignSelf: "center" }}>PRESETS:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setIp(p.ip); setPrefix(p.prefix); }}
              style={{ fontFamily: "JetBrains Mono", fontSize: 10, padding: "3px 9px", borderRadius: 4, border: "1px solid #1a2030", color: "#6b8a7a", background: "none", cursor: "pointer" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1a2030" }}>
        {Tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontFamily: "JetBrains Mono", fontSize: 11, padding: "8px 16px",
              background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #00d4ff" : "2px solid transparent",
              color: tab === t.id ? "#00d4ff" : "#6b8a7a", cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "calc" && calc && (
        <div className="panel-animate space-y-5">
          <div className="card">
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              Binary Breakdown
            </div>
            <BinRow label="IP address"   octets={calc.ip}        prefix={calc.prefix} highlightHost color="#e8f5ef" />
            <BinRow label="Subnet mask"  octets={calc.mask}      prefix={calc.prefix} highlightHost />
            <div style={{ height: 1, background: "#1a2030", margin: "8px 0" }} />
            <BinRow label="AND result"   octets={calc.network}   color="#00ff88" />
            <BinRow label="Broadcast"    octets={calc.broadcast} color="#ffb800" />

            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#00d4ff" }}>■ Network bits</span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#ffb800" }}>■ Host bits</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", gap: 1, height: 8 }}>
                {Array(32).fill(0).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, borderRadius: 1,
                    background: i < calc.prefix ? "#00d4ff" : "#1a2030",
                    marginLeft: i > 0 && i % 8 === 0 ? 3 : 0,
                  }} />
                ))}
              </div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", marginTop: 4 }}>
                {calc.prefix} network bits + {32 - calc.prefix} host bits = 32 total
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
            <ResultCard label="Network Address"  value={toIpStr(calc.network)}   highlight color="#00ff88" sub="(first address — not usable)" />
            <ResultCard label="Broadcast Address" value={toIpStr(calc.broadcast)} color="#ffb800" sub="(last address — not usable)" />
            <ResultCard label="Subnet Mask"       value={toIpStr(calc.mask)}      color="#00d4ff" sub={`/${calc.prefix} CIDR notation`} />
            <ResultCard label="Wildcard Mask"     value={toIpStr(calc.wild)}      color="#6b8a7a" sub="Inverse of subnet mask" />
            <ResultCard label="First Usable Host" value={toIpStr(calc.first)}     color="#e8f5ef" />
            <ResultCard label="Last Usable Host"  value={toIpStr(calc.last)}      color="#e8f5ef" />
            <ResultCard label="Usable Hosts"      value={calc.hosts.toLocaleString()} color="#00ff88" highlight sub={`${calc.totalAddrs.toLocaleString()} total addresses`} />
            <ResultCard label="IP Class"          value={`Class ${calc.ipClass}`} color="#6b8a7a" sub={calc.scope} />
          </div>
        </div>
      )}

      {!calc && tab === "calc" && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#3a5040" }}>
            Enter a valid IP address to see the full breakdown
          </p>
        </div>
      )}

      {tab === "ref" && (
        <div className="panel-animate space-y-4">
          <div className="card">
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              Common Subnet Sizes
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "JetBrains Mono", fontSize: 12 }}>
              <thead>
                <tr>
                  {["CIDR", "Subnet Mask", "Usable Hosts", "Common Use"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "5px 10px", fontSize: 9, color: "#3a5040", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid #1a2030" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMMON_CIDRS.map((row, i) => (
                  <tr key={row.cidr} style={{ background: i % 2 === 0 ? "transparent" : "#111620" }}>
                    <td style={{ padding: "7px 10px", color: "#00d4ff", fontWeight: 600 }}>{row.cidr}</td>
                    <td style={{ padding: "7px 10px", color: "#6b8a7a" }}>{row.mask}</td>
                    <td style={{ padding: "7px 10px", color: "#00ff88" }}>{row.hosts}</td>
                    <td style={{ padding: "7px 10px", color: "#3a5040" }}>{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#3a5040", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              Private IP Ranges (RFC 1918)
            </div>
            {[
              { range: "10.0.0.0/8",       hosts: "16,777,214", use: "Large enterprise / cloud VPCs" },
              { range: "172.16.0.0/12",     hosts: "1,048,574",  use: "Medium networks" },
              { range: "192.168.0.0/16",    hosts: "65,534",     use: "Home routers (most common)" },
              { range: "127.0.0.0/8",       hosts: "—",          use: "Loopback (localhost)" },
              { range: "169.254.0.0/16",    hosts: "65,024",     use: "Link-local / APIPA (auto-assigned)" },
            ].map((r) => (
              <div key={r.range} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: "1px solid #1a203030", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#00d4ff", minWidth: 160 }}>{r.range}</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a", flex: 1 }}>{r.use}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "learn" && (
        <div className="panel-animate space-y-4">
          {[
            {
              heading: "What is subnetting?",
              body: `An IP address has two parts: a network ID and a host ID. Subnetting is dividing a large network into smaller, more manageable pieces.

Think of it like a street address: the street name = network ID, the house number = host ID. All houses on the same street share the same street name (network), but each has a unique number (host).`,
            },
            {
              heading: "How the subnet mask works",
              body: `A subnet mask is 32 bits of 1s followed by 0s:
  /24 = 11111111.11111111.11111111.00000000

The 1-bits cover the network part, the 0-bits cover the host part.

To find the network address: AND the IP with the mask.
AND rule: 1 AND 1 = 1, anything AND 0 = 0.

The AND operation zeroes out the host bits, leaving just the network address.`,
            },
            {
              heading: "CIDR notation explained",
              body: `/24 means the first 24 bits are the network — equivalently, the last 8 bits are hosts.

8 host bits = 2⁸ = 256 addresses.
Subtract network (.0) and broadcast (.255) = 254 usable hosts.

/25 splits a /24 in half: two networks of 126 usable hosts each.
/30 gives exactly 2 usable hosts — used for router-to-router links.`,
            },
            {
              heading: "IPv4 address classes (legacy)",
              body: `Before CIDR, addresses were split into classes:
  Class A: 1–126.x.x.x    /8 default  — huge networks
  Class B: 128–191.x.x.x  /16 default — medium networks  
  Class C: 192–223.x.x.x  /24 default — small networks
  Class D: 224–239.x.x.x  — multicast
  Class E: 240–255.x.x.x  — reserved

Modern routing uses CIDR which ignores classes and assigns prefix lengths freely — more efficient use of the address space.`,
            },
          ].map((section, i) => (
            <div key={i} className="card">
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#e8f5ef", fontWeight: 600, marginBottom: 10 }}>
                {section.heading}
              </div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {section.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
