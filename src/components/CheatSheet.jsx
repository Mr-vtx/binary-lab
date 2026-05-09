import { useState } from "react";

const POWERS = [
  [0,1],[1,2],[2,4],[3,8],[4,16],[5,32],[6,64],[7,128],
  [8,256],[9,512],[10,1024],[11,2048],[12,4096],[16,65536],[24,"16.7M"],[32,"4.3B"],
];

const ASCII_KEY = [
  [32," ","Space"],[33,"!",""],[48,"0","Digit 0"],[57,"9","Digit 9"],
  [65,"A","Uppercase A"],[90,"Z","Uppercase Z"],
  [97,"a","Lowercase a"],[122,"z","Lowercase z"],[127,"DEL","Delete"],
];

const HEX_MAP = [
  ["0","0000"],["1","0001"],["2","0010"],["3","0011"],
  ["4","0100"],["5","0101"],["6","0110"],["7","0111"],
  ["8","1000"],["9","1001"],["A","1010"],["B","1011"],
  ["C","1100"],["D","1101"],["E","1110"],["F","1111"],
];

const SUBNETS = [
  ["/8","255.0.0.0","16,777,214"],
  ["/16","255.255.0.0","65,534"],
  ["/24","255.255.255.0","254"],
  ["/25","255.255.255.128","126"],
  ["/26","255.255.255.192","62"],
  ["/27","255.255.255.224","30"],
  ["/28","255.255.255.240","14"],
  ["/29","255.255.255.248","6"],
  ["/30","255.255.255.252","2"],
  ["/32","255.255.255.255","0 (host)"],
];

const BINARY_COUNT = Array.from({length:16},(_,i)=>({dec:i,bin:i.toString(2).padStart(4,"0"),hex:i.toString(16).toUpperCase()}));

function Section({ title, color="#3a5040", children }) {
  return (
    <div style={{ breakInside: "avoid", marginBottom: 20 }}>
      <div style={{ fontFamily: "Share Tech Mono", fontSize: 11, color, letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid #1a2030", paddingBottom: 5, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function MiniTable({ headers, rows, colColors=[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "JetBrains Mono", fontSize: 11 }}>
      <thead>
        <tr>
          {headers.map((h,i)=>(
            <th key={i} style={{ textAlign:"left", padding:"3px 8px", fontSize:9, color:"#3a5040", letterSpacing:"0.1em", textTransform:"uppercase", borderBottom:"1px solid #1a2030" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,ri)=>(
          <tr key={ri} style={{ background: ri%2===0?"transparent":"#111620" }}>
            {row.map((cell,ci)=>(
              <td key={ci} style={{ padding:"4px 8px", color: colColors[ci]||"#6b8a7a" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function CheatSheet() {
  const [printMode, setPrintMode] = useState(false);

  return (
    <div className="panel-animate">
      {/* Controls */}
      <div className="no-print" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontFamily:"Share Tech Mono", color:"#e8f5ef", fontSize:16, letterSpacing:"0.08em" }}>📋 Cheat Sheet</div>
          <div style={{ fontFamily:"JetBrains Mono", fontSize:11, color:"#3a5040", marginTop:3 }}>
            Quick reference — powers of 2, ASCII, hex, subnets, binary counting
          </div>
        </div>
        <button onClick={() => window.print()} className="btn-primary">
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Sheet */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>

        {/* Powers of 2 */}
        <div className="card">
          <Section title="Powers of 2" color="#00ff88">
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"JetBrains Mono", fontSize:11 }}>
              <tbody>
                {POWERS.map(([exp,val])=>(
                  <tr key={exp}>
                    <td style={{ padding:"3px 6px", color:"#3a5040" }}>2^{exp}</td>
                    <td style={{ padding:"3px 6px", color:"#00ff88", fontWeight:600 }}>{val.toLocaleString()}</td>
                    <td style={{ padding:"3px 6px", color:"#3a5040", fontSize:10 }}>
                      {exp===10?"= 1 KB (approx)":exp===20?"= 1 MB":exp===30?"= 1 GB":exp===8?"= 1 byte (max 255)":""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>

        {/* Hex ↔ Binary */}
        <div className="card">
          <Section title="Hex ↔ Binary" color="#ffb800">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
              {HEX_MAP.map(([h,b])=>(
                <div key={h} style={{ display:"flex", gap:8, padding:"3px 6px", alignItems:"center" }}>
                  <span style={{ fontFamily:"JetBrains Mono", fontSize:12, color:"#ffb800", fontWeight:700, width:14 }}>{h}</span>
                  <span style={{ fontFamily:"JetBrains Mono", fontSize:11, color:"#00d4ff" }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, fontFamily:"JetBrains Mono", fontSize:10, color:"#3a5040", lineHeight:1.7 }}>
              1 hex digit = 4 bits<br/>
              1 byte = 2 hex digits<br/>
              0xFF = 255 = 11111111
            </div>
          </Section>
        </div>

        {/* Binary counting */}
        <div className="card">
          <Section title="Binary / Decimal / Hex" color="#00d4ff">
            <MiniTable
              headers={["Dec","Binary","Hex"]}
              rows={BINARY_COUNT.map(r=>[r.dec, r.bin, r.hex])}
              colColors={["#e8f5ef","#00ff88","#ffb800"]}
            />
          </Section>
        </div>

        {/* Key ASCII values */}
        <div className="card">
          <Section title="Key ASCII Values" color="#6b8a7a">
            <MiniTable
              headers={["Dec","Char","Note"]}
              rows={ASCII_KEY.map(([d,c,n])=>[d,c===" "?"SPACE":c,n])}
              colColors={["#ffb800","#00ff88","#3a5040"]}
            />
            <div style={{ marginTop:10, fontFamily:"JetBrains Mono", fontSize:10, color:"#3a5040", lineHeight:1.7 }}>
              'a' = 'A' + 32 (flip bit 5 for case)<br/>
              '0'–'9' = 48–57 (digit chars)<br/>
              Space = 32, Tab = 9, Newline = 10
            </div>
          </Section>
        </div>

        {/* Subnet quick ref */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <Section title="Common Subnets (IPv4)" color="#00d4ff">
            <MiniTable
              headers={["CIDR","Subnet Mask","Usable Hosts"]}
              rows={SUBNETS}
              colColors={["#00d4ff","#6b8a7a","#00ff88"]}
            />
          </Section>
        </div>

        {/* Data sizes */}
        <div className="card">
          <Section title="Data Sizes" color="#6b8a7a">
            {[
              ["1 bit", "0 or 1"],
              ["4 bits", "1 nybble"],
              ["8 bits", "1 byte = 256 values"],
              ["1 KB", "1,024 bytes (2^10)"],
              ["1 MB", "1,024 KB (2^20)"],
              ["1 GB", "1,024 MB (2^30)"],
              ["1 TB", "1,024 GB (2^40)"],
            ].map(([unit, desc]) => (
              <div key={unit} style={{ display:"flex", gap:12, padding:"4px 0", borderBottom:"1px solid #1a203030" }}>
                <span style={{ fontFamily:"JetBrains Mono", fontSize:12, color:"#00ff88", width:70, flexShrink:0 }}>{unit}</span>
                <span style={{ fontFamily:"JetBrains Mono", fontSize:11, color:"#6b8a7a" }}>{desc}</span>
              </div>
            ))}
          </Section>
        </div>

        {/* Bitwise ops */}
        <div className="card">
          <Section title="Bitwise Operations" color="#6b8a7a">
            {[
              ["AND (&)", "1&1=1, 1&0=0, 0&0=0", "Used in subnet masking"],
              ["OR  (|)", "1|0=1, 0|0=0, 1|1=1", "Setting bits"],
              ["XOR (^)", "1^1=0, 1^0=1, 0^0=0", "Toggling bits"],
              ["NOT (~)", "~1=0, ~0=1",            "Inverting bits"],
              ["SHL (<<)","n<<1 = n×2",            "Multiply by powers of 2"],
              ["SHR (>>)","n>>1 = n÷2",            "Divide by powers of 2"],
            ].map(([op,rule,use])=>(
              <div key={op} style={{ marginBottom:8 }}>
                <div style={{ fontFamily:"JetBrains Mono", fontSize:11, color:"#00d4ff" }}>{op}</div>
                <div style={{ fontFamily:"JetBrains Mono", fontSize:10, color:"#6b8a7a" }}>{rule}</div>
                <div style={{ fontFamily:"JetBrains Mono", fontSize:9, color:"#3a5040" }}>{use}</div>
              </div>
            ))}
          </Section>
        </div>

        {/* Private IP ranges */}
        <div className="card">
          <Section title="Private IP Ranges" color="#00d4ff">
            {[
              ["10.0.0.0/8",    "Class A private — 16M hosts"],
              ["172.16.0.0/12", "Class B private — 1M hosts"],
              ["192.168.0.0/16","Class C private — 65K hosts"],
              ["127.0.0.1/8",   "Loopback (localhost)"],
              ["169.254.0.0/16","Link-local (APIPA)"],
            ].map(([range, desc])=>(
              <div key={range} style={{ display:"flex", gap:12, padding:"5px 0", borderBottom:"1px solid #1a203030", flexWrap:"wrap" }}>
                <span style={{ fontFamily:"JetBrains Mono", fontSize:11, color:"#00d4ff", minWidth:160 }}>{range}</span>
                <span style={{ fontFamily:"JetBrains Mono", fontSize:10, color:"#3a5040" }}>{desc}</span>
              </div>
            ))}
          </Section>
        </div>

      </div>

      <div className="no-print" style={{ marginTop:16, fontFamily:"JetBrains Mono", fontSize:10, color:"#3a5040", textAlign:"center" }}>
        BINARY_LAB Cheat Sheet · v1.2 · Use browser Print (Ctrl+P / Cmd+P) → Save as PDF
      </div>
    </div>
  );
}
