import { useState } from 'react';
import { Card, CopyButton } from './UI';
import { toBin, toHex } from '../utils';

const CATEGORIES = [
  { label: 'All (32–126)', min: 32, max: 126 },
  { label: 'Letters A–Z', min: 65, max: 90 },
  { label: 'Letters a–z', min: 97, max: 122 },
  { label: 'Digits 0–9', min: 48, max: 57 },
  { label: 'Symbols', custom: true },
];

const SYMBOLS = [...Array(126 - 32 + 1)].map((_,i)=>i+32).filter(n => (n < 48) || (n > 57 && n < 65) || (n > 90 && n < 97) || n > 122);

export default function AsciiTable() {
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState(0);
  const [search, setSearch] = useState('');

  const activeCategory = CATEGORIES[cat];
  let chars = activeCategory.custom
    ? SYMBOLS
    : [...Array(activeCategory.max - activeCategory.min + 1)].map((_,i)=>i+activeCategory.min);

  if (search) {
    const s = search.toLowerCase();
    chars = chars.filter(n => {
      const ch = String.fromCharCode(n);
      return ch.toLowerCase().includes(s) || String(n).includes(s) || n.toString(16).includes(s) || toBin(n).includes(s);
    });
  }

  return (
    <div className="space-y-4 panel-animate">

      {selected !== null && (
        <Card className="border-terminal-green/30 fade-slide">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-5xl font-mono font-bold text-terminal-green glow-green w-16 text-center">
              {selected === 32 ? '·' : String.fromCharCode(selected)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              {[
                { label: 'Char', val: selected === 32 ? 'SPACE' : String.fromCharCode(selected) },
                { label: 'Decimal', val: String(selected) },
                { label: 'Binary', val: toBin(selected) },
                { label: 'Hex', val: toHex(selected) },
              ].map(({ label, val }) => (
                <div key={label} className="bg-terminal-bg rounded border border-terminal-border p-2 text-center">
                  <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-sm font-mono text-terminal-text-primary flex items-center justify-center gap-1">
                    {val}
                    <CopyButton text={val} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="text-terminal-text-muted hover:text-terminal-text-secondary text-xs font-mono ml-auto">✕ close</button>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="terminal-input !w-48"
          placeholder="Search char / dec / hex…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => { setCat(i); setSearch(''); }}
              className={`text-xs font-mono px-2.5 py-1 rounded border transition-all
                ${cat === i
                  ? 'bg-terminal-green-muted border-terminal-green text-terminal-green'
                  : 'border-terminal-border text-terminal-text-secondary hover:border-terminal-green/30 hover:text-terminal-green/70'
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
        {chars.map(n => {
          const ch = n === 32 ? '·' : String.fromCharCode(n);
          const isSelected = selected === n;
          return (
            <button
              key={n}
              onClick={() => setSelected(isSelected ? null : n)}
              className={`
                rounded border py-2 px-1 text-center transition-all duration-100 group
                ${isSelected
                  ? 'bg-terminal-green-muted border-terminal-green shadow-glow-green'
                  : 'bg-terminal-bg border-terminal-border hover:border-terminal-green/40 hover:bg-terminal-panel'}
              `}
            >
              <div className={`text-base font-mono font-semibold ${isSelected ? 'text-terminal-green glow-green' : 'text-terminal-text-primary group-hover:text-terminal-green/80'}`}>{ch}</div>
              <div className="text-[10px] font-mono text-terminal-text-muted mt-0.5">{n}</div>
              <div className="text-[9px] font-mono text-terminal-text-muted opacity-60">{n.toString(16).toUpperCase()}</div>
            </button>
          );
        })}
      </div>

      {chars.length === 0 && (
        <div className="text-center text-terminal-text-muted font-mono text-sm py-8">no matches</div>
      )}
    </div>
  );
}
