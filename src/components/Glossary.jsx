import { useState, useMemo } from "react";

const TERMS = [
  { term: "Bit", tag: "basics", definition: "The smallest unit of data in computing. A single binary digit — either 0 (off) or 1 (on). Every piece of digital data is ultimately made of bits.", also: "Binary digit" },
  { term: "Byte", tag: "basics", definition: "A group of 8 bits. One byte can store 256 different values (0–255). It's the standard unit for measuring data size and is large enough to hold one ASCII character.", also: "8 bits = 256 values" },
  { term: "Nybble", tag: "basics", definition: "Half a byte — 4 bits. Can hold 16 values (0–15). Each hexadecimal digit represents exactly one nybble. Sometimes spelled 'nibble'.", also: "4 bits · 16 values" },
  { term: "Binary", tag: "basics", definition: "A base-2 number system using only two digits: 0 and 1. Computers use binary because electronic circuits reliably distinguish two voltage levels (on/off). Also called base-2.", also: "Base-2" },
  { term: "Decimal", tag: "basics", definition: "The everyday base-10 number system using digits 0–9. What humans use naturally. Computers convert to/from decimal for human display, but work in binary internally.", also: "Base-10" },
  { term: "Hexadecimal", tag: "encoding", definition: "Base-16 number system using digits 0–9 and letters A–F. Compact shorthand for binary — one hex digit = exactly 4 bits. Written with 0x prefix (e.g. 0xFF = 255).", also: "Hex · Base-16 · 0x prefix" },
  { term: "Octal", tag: "encoding", definition: "Base-8 number system using digits 0–7. Less common than hex today but still appears in Unix file permissions (e.g. chmod 755).", also: "Base-8 · Unix permissions" },
  { term: "ASCII", tag: "encoding", definition: "American Standard Code for Information Interchange. A 1963 standard mapping 128 characters to numbers 0–127. 'A'=65, 'a'=97, '0'=48, Space=32. Still the foundation of modern text encoding.", also: "American Standard Code for Information Interchange" },
  { term: "Unicode", tag: "encoding", definition: "A universal character standard assigning unique code points to over 140,000 characters from all human writing systems. Solves ASCII's English-only limitation. Written as U+XXXX (e.g. U+1F600 = 😀).", also: "Code point · U+XXXX notation" },
  { term: "UTF-8", tag: "encoding", definition: "The dominant text encoding on the web (98%+ of websites). Stores Unicode characters using 1–4 bytes each. ASCII-compatible — any ASCII file is valid UTF-8. Variable-length avoids wasting space.", also: "Unicode Transformation Format · Variable-width encoding" },
  { term: "MSB", tag: "basics", definition: "Most Significant Bit — the leftmost bit in a binary number, which has the highest place value. In an 8-bit byte the MSB has value 128 (2⁷). Changing the MSB has the biggest effect on the number's value.", also: "Most Significant Bit · Leftmost bit" },
  { term: "LSB", tag: "basics", definition: "Least Significant Bit — the rightmost bit, which has the lowest place value (always 1 = 2⁰). Determines whether a number is odd (1) or even (0).", also: "Least Significant Bit · Rightmost bit" },
  { term: "IP Address", tag: "networking", definition: "A 32-bit (IPv4) or 128-bit (IPv6) number that uniquely identifies a device on a network. Written in dotted decimal (192.168.1.1) for humans but stored and processed as binary by routers.", also: "Internet Protocol address · IPv4 · IPv6" },
  { term: "Subnet Mask", tag: "networking", definition: "A 32-bit number that splits an IP address into network and host parts. All the 1-bits indicate the network portion, 0-bits indicate the host portion. Written as 255.255.255.0 or /24 in CIDR notation.", also: "Netmask · Network mask" },
  { term: "CIDR", tag: "networking", definition: "Classless Inter-Domain Routing. A notation for expressing IP addresses and their subnet masks: 192.168.1.0/24 means the first 24 bits are the network. More flexible than the older class-based system.", also: "Slash notation · /24 · /16 · /8" },
  { term: "Octet", tag: "networking", definition: "A group of 8 bits — exactly one byte. IPv4 addresses are written as four octets in dotted decimal: 192.168.1.1 has octets 192, 168, 1, and 1. Each ranges 0–255.", also: "8 bits · One byte · Used in IP notation" },
  { term: "Broadcast Address", tag: "networking", definition: "The last IP address in a subnet, used to send data to all devices on that network simultaneously. Not usable as a host address. In 192.168.1.0/24, the broadcast is 192.168.1.255.", also: "All-hosts address" },
  { term: "Network Address", tag: "networking", definition: "The first IP address in a subnet, representing the subnet itself (not a device). Also called the 'wire address'. In 192.168.1.0/24 the network address is 192.168.1.0.", also: "Wire address · Subnet identifier" },
  { term: "Localhost", tag: "networking", definition: "A hostname that always refers to your own machine. The IP address 127.0.0.1 is the loopback address — any data sent to it loops back without leaving the computer. Used for local development servers.", also: "127.0.0.1 · Loopback · ::1 (IPv6)" },
  { term: "IPv4", tag: "networking", definition: "Internet Protocol version 4. Uses 32-bit addresses written in dotted decimal. Supports ~4.3 billion unique addresses (2³²). Running out due to internet growth, being replaced by IPv6.", also: "32-bit · 4.3 billion addresses" },
  { term: "IPv6", tag: "networking", definition: "Internet Protocol version 6. Uses 128-bit addresses written in colon-separated hex (e.g. 2001:0db8::1). Supports 2¹²⁸ ≈ 340 undecillion addresses — enough to give every grain of sand on Earth a unique address.", also: "128-bit · 340 undecillion addresses" },
  { term: "AND", tag: "operations", definition: "A bitwise operation where the result is 1 only if both input bits are 1. Used in subnet calculations: IP AND Mask = Network Address. Rule: 1&1=1, 1&0=0, 0&0=0.", also: "Bitwise AND · & operator" },
  { term: "OR", tag: "operations", definition: "A bitwise operation where the result is 1 if either input bit is 1. Rule: 1|1=1, 1|0=1, 0|0=0. Used to set specific bits in a value.", also: "Bitwise OR · | operator" },
  { term: "XOR", tag: "operations", definition: "Exclusive OR — result is 1 if the inputs differ, 0 if they are the same. Rule: 1^1=0, 1^0=1, 0^0=0. Used for bit toggling, checksums, and encryption.", also: "Exclusive OR · ^ operator · Toggle bits" },
  { term: "Two's Complement", tag: "operations", definition: "The standard way computers represent negative integers. Flip all bits (NOT), then add 1. A signed 8-bit integer can represent -128 to +127. Allows the same addition circuitry to handle both positive and negative numbers.", also: "Signed integers · Negative binary numbers" },
  { term: "Base64", tag: "encoding", definition: "An encoding scheme that converts binary data to a text string using 64 safe characters (A-Z, a-z, 0-9, +, /). Used to embed images in HTML, transmit binary over email, and store keys. Not encryption — easily decoded.", also: "Data encoding · Not encryption" },
  { term: "Endianness", tag: "basics", definition: "The byte order used to store multi-byte values. Big-endian stores the most significant byte first (network byte order). Little-endian stores the least significant byte first (x86 CPUs). Matters when transferring data between systems.", also: "Big-endian · Little-endian · Byte order" },
  { term: "Place Value", tag: "basics", definition: "The value a digit contributes based on its position. In decimal, positions are worth 1, 10, 100… In binary they are worth 1, 2, 4, 8, 16, 32, 64, 128… (powers of 2).", also: "Positional notation · Powers of base" },
  { term: "Wildcard Mask", tag: "networking", definition: "The inverse of a subnet mask — where the mask has 1, the wildcard has 0, and vice versa. Used in Cisco access control lists and OSPF configuration. /24 wildcard = 0.0.0.255.", also: "Inverse mask · Used in ACLs and OSPF" },
];

const TAGS = ["all", "basics", "encoding", "networking", "operations"];
const TAG_COLORS = {
  basics:     "#00ff88",
  encoding:   "#ffb800",
  networking: "#00d4ff",
  operations: "#c084fc",
};

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [tag, setTag]       = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TERMS.filter((t) => {
      const matchTag  = tag === "all" || t.tag === tag;
      const matchText = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.also?.toLowerCase().includes(q);
      return matchTag && matchText;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, tag]);

  return (
    <div className="panel-animate space-y-5">
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>📖</span>
          <span className="font-display" style={{ color: "#e8f5ef", fontSize: 15, letterSpacing: "0.08em" }}>Glossary</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>{TERMS.length} terms</span>
        </div>
        <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#6b8a7a", marginBottom: 12, lineHeight: 1.6 }}>
          Every term used across BinaryLab, explained in plain English. No assumed knowledge.
        </p>
        <input
          className="terminal-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms… e.g. 'subnet', 'byte', 'ASCII'"
          style={{ marginBottom: 10 }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              style={{
                fontFamily: "JetBrains Mono", fontSize: 10, padding: "4px 10px", borderRadius: 4,
                border: `1px solid ${tag === t ? (TAG_COLORS[t] || "#00ff88") + "66" : "#1a2030"}`,
                color: tag === t ? (TAG_COLORS[t] || "#00ff88") : "#6b8a7a",
                background: tag === t ? (TAG_COLORS[t] || "#00ff88") + "11" : "none",
                cursor: "pointer", textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>
        {filtered.length} term{filtered.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.map((item) => {
          const isOpen = expanded === item.term;
          const tagColor = TAG_COLORS[item.tag] || "#6b8a7a";
          return (
            <div
              key={item.term}
              style={{
                background: isOpen ? "#0d1208" : "#0e1117",
                border: `1px solid ${isOpen ? "#00ff8820" : "#1a2030"}`,
                borderRadius: 7, overflow: "hidden",
                transition: "background 0.12s, border-color 0.12s",
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : item.term)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#e8f5ef", fontWeight: 600, flex: 1 }}>
                  {item.term}
                </span>
                <span style={{
                  fontFamily: "JetBrains Mono", fontSize: 8, padding: "2px 7px", borderRadius: 3,
                  border: `1px solid ${tagColor}44`, color: tagColor, textTransform: "uppercase", letterSpacing: "0.08em"
                }}>
                  {item.tag}
                </span>
                <span style={{ color: isOpen ? "#00ff88" : "#3a5040", fontFamily: "JetBrains Mono", fontSize: 12 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid #1a203050" }} className="panel-animate">
                  <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#6b8a7a", lineHeight: 1.8, marginTop: 12 }}>
                    {item.definition}
                  </p>
                  {item.also && (
                    <div style={{ marginTop: 8, fontFamily: "JetBrains Mono", fontSize: 10, color: "#3a5040" }}>
                      Also known as: <span style={{ color: "#4a6a5a" }}>{item.also}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 24, color: "#1a2030", marginBottom: 8 }}>?</div>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "#3a5040" }}>
            No terms found for "{search}"
          </p>
        </div>
      )}
    </div>
  );
}
