import { useState } from 'react';
import { Card, OutputBox, CopyButton } from './UI';
import { MORSE_MAP, MORSE_REVERSE } from '../utils';

function MorseDot() {
  return <span className="inline-block w-2 h-2 rounded-full bg-terminal-green mx-0.5" style={{ boxShadow: '0 0 4px #00ff88' }} />;
}
function MorseDash() {
  return <span className="inline-block w-5 h-2 rounded-full bg-terminal-green mx-0.5" style={{ boxShadow: '0 0 4px #00ff88' }} />;
}

function MorseSymbol({ code }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {code.split('').map((s, i) => s === '.' ? <MorseDot key={i} /> : <MorseDash key={i} />)}
    </span>
  );
}

export default function MorseCode() {
  const [textIn, setTextIn] = useState('');
  const [morseIn, setMorseIn] = useState('');

  // Text → Morse
  const upper = textIn.toUpperCase();
  const encoded = Array.from(upper).map(ch => {
    if (ch === ' ') return '/';
    return MORSE_MAP[ch] || '?';
  }).join(' ');
  const charBreakdown = Array.from(upper).filter(c => c !== ' ');

  // Morse → Text
  const morseWords = morseIn.trim().split(/\s+\/\s+|\s*\/\s*/);
  const decoded = morseWords.map(word =>
    word.split(/\s+/).map(sym => MORSE_REVERSE[sym] || (sym ? '?' : '')).join('')
  ).join(' ').trim();

  return (
    <div className="space-y-4 panel-animate">

      {/* Encoder */}
      <Card title="Text → Morse">
        <div className="space-y-3">
          <input
            className="terminal-input"
            placeholder="Type text to encode..."
            value={textIn}
            onChange={e => setTextIn(e.target.value)}
          />

          {encoded && (
            <>
              <div className="bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 flex items-center justify-between gap-2">
                <span className="font-mono text-terminal-green text-sm tracking-widest break-all">{encoded}</span>
                <CopyButton text={encoded} />
              </div>

              {/* Visual dots/dashes */}
              {textIn.trim() && (
                <div className="flex flex-wrap gap-3">
                  {Array.from(upper).filter(c => c !== ' ' && MORSE_MAP[c]).map((ch, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center h-4">
                        <MorseSymbol code={MORSE_MAP[ch]} />
                      </div>
                      <span className="text-[10px] font-mono text-terminal-text-secondary">{ch}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Decoder */}
      <Card title="Morse → Text" accent="amber">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">Morse input</div>
            <div className="text-[10px] text-terminal-text-muted mb-2">separate letters with spaces · separate words with /</div>
            <input
              className="terminal-input"
              placeholder="... --- ... / .... . .-.. .-.. ---"
              value={morseIn}
              onChange={e => setMorseIn(e.target.value)}
            />
          </div>
          <OutputBox label="Decoded text" value={decoded} accent />
        </div>
      </Card>

      {/* Reference */}
      <Card title="Reference Chart" accent="cyan">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 max-h-64 overflow-y-auto pr-1">
          {Object.entries(MORSE_MAP).map(([ch, code]) => (
            <div
              key={ch}
              onClick={() => setTextIn(prev => prev + ch)}
              className="flex items-center gap-2 bg-terminal-bg border border-terminal-border rounded px-2 py-1.5 cursor-pointer hover:border-terminal-cyan/40 hover:bg-terminal-panel transition-all"
              title={`Click to add "${ch}"`}
            >
              <span className="text-sm font-mono font-semibold text-terminal-text-primary w-4">{ch}</span>
              <div className="flex items-center gap-0.5 flex-1">
                {code.split('').map((s, i) => s === '.' ? <MorseDot key={i} /> : <MorseDash key={i} />)}
              </div>
              <span className="text-[10px] font-mono text-terminal-text-muted tracking-wider">{code}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-terminal-text-muted mt-2">↑ Click any character to append it to the encoder</p>
      </Card>
    </div>
  );
}
