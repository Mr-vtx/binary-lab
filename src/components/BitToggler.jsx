import { useState, useRef } from 'react';
import { Card, OutputBox, Label } from './UI';
import { toBin, toHex } from '../utils';

export default function BitToggler() {
  const [bits, setBits] = useState(new Array(8).fill(0));

  const value = bits.reduce((acc, b, i) => acc + b * (1 << (7 - i)), 0);
  const binStr = bits.join('');
  const hexStr = toHex(value);
  const ascii = value >= 32 && value < 127 ? String.fromCharCode(value) : value === 0 ? 'NUL' : value < 32 ? 'CTRL' : 'DEL';

  const toggle = (i) => {
    const next = [...bits];
    next[i] = next[i] ? 0 : 1;
    setBits(next);
  };

  const reset = () => setBits(new Array(8).fill(0));
  const setAll = () => setBits(new Array(8).fill(1));

  return (
    <div className="space-y-4 panel-animate">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-terminal-text-secondary">Click bits to toggle · MSB left → LSB right</p>
        <div className="flex gap-2">
          <button onClick={setAll} className="text-xs font-mono px-2 py-1 rounded border border-terminal-border text-terminal-text-secondary hover:border-terminal-green/30 hover:text-terminal-green transition-all">11111111</button>
          <button onClick={reset} className="text-xs font-mono px-2 py-1 rounded border border-terminal-border text-terminal-text-secondary hover:border-red-500/30 hover:text-red-400 transition-all">reset</button>
        </div>
      </div>

      <Card>
        <div className="flex gap-2 flex-wrap justify-center mb-5">
          {bits.map((b, i) => {
            const pos = 7 - i;
            const isOn = b === 1;
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`
                  relative w-12 h-14 rounded-md border font-mono font-bold text-xl
                  flex flex-col items-center justify-center gap-0.5
                  transition-all duration-150 select-none
                  ${isOn
                    ? 'bg-terminal-green-muted border-terminal-green text-terminal-green shadow-glow-green'
                    : 'bg-terminal-bg border-terminal-border text-terminal-text-muted hover:border-terminal-green/30 hover:text-terminal-text-secondary'}
                `}
              >
                <span className="leading-none">{b}</span>
                <span className="text-[9px] font-normal opacity-50">2<sup>{pos}</sup></span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {bits.map((_, i) => {
            const pos = 7 - i;
            const weight = 1 << pos;
            return (
              <div key={i} className="w-12 text-center text-[10px] text-terminal-text-muted font-mono">
                {weight}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-2">
          <div className="bg-terminal-bg rounded border border-terminal-border p-3 text-center">
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">Decimal</div>
            <div className="text-2xl font-mono font-semibold text-terminal-text-primary">{value}</div>
          </div>
          <div className="bg-terminal-bg rounded border border-terminal-border p-3 text-center">
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">Binary</div>
            <div className="text-lg font-mono font-semibold text-terminal-text-primary tracking-wide">{binStr}</div>
          </div>
          <div className="bg-terminal-bg rounded border border-terminal-border p-3 text-center">
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">Hex</div>
            <div className="text-2xl font-mono font-semibold text-terminal-amber glow-amber">{hexStr}</div>
          </div>
          <div className="bg-terminal-bg rounded border border-terminal-border p-3 text-center">
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">ASCII</div>
            <div className="text-2xl font-mono font-semibold text-terminal-green glow-green">{ascii}</div>
          </div>
        </div>
      </Card>

      <Card title="Quick Presets" accent="amber">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'A (65)', val: 65 },
            { label: 'a (97)', val: 97 },
            { label: '0 (48)', val: 48 },
            { label: 'Space (32)', val: 32 },
            { label: 'DEL (127)', val: 127 },
            { label: 'NULL (0)', val: 0 },
            { label: '255', val: 255 },
            { label: '128', val: 128 },
          ].map(({ label, val }) => (
            <button
              key={val}
              onClick={() => {
                const b = val.toString(2).padStart(8, '0').split('').map(Number);
                setBits(b);
              }}
              className="text-xs font-mono px-3 py-1.5 rounded border border-terminal-border text-terminal-text-secondary hover:border-terminal-amber/40 hover:text-terminal-amber transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
