import { useState } from 'react';
import { Card, OutputBox, Label } from './UI';
import { toBin, toHex } from '../utils';

function Section({ title, children }) {
  return (
    <Card title={title} className="mb-4">
      {children}
    </Card>
  );
}

export default function Converter() {
  // Binary → Decimal + ASCII
  const [binIn, setBinIn] = useState('');
  const binGroups = binIn.trim().split(/\s+/).filter(Boolean);
  const binResults = binGroups.map(g => {
    if (!/^[01]+$/.test(g)) return { valid: false, g };
    const d = parseInt(g, 2);
    return { valid: true, g, dec: d, char: d >= 32 && d < 127 ? String.fromCharCode(d) : `[${d}]` };
  });
  const binDecOut = binResults.filter(r => r.valid).map(r => r.dec).join('  ');
  const binAsciiOut = binResults.filter(r => r.valid).map(r => r.char).join('');
  const binHasErr = binResults.some(r => !r.valid);

  // Text → Binary + Decimal
  const [txtIn, setTxtIn] = useState('');
  const txtCodes = Array.from(txtIn).map(c => c.charCodeAt(0));
  const txtBinOut = txtCodes.map(c => toBin(c)).join(' ');
  const txtDecOut = txtCodes.join('  ');
  const txtHexOut = txtCodes.map(c => toHex(c)).join('  ');

  // Decimal → Binary
  const [decIn, setDecIn] = useState('');
  const decVal = parseInt(decIn);
  const decBinOut = !isNaN(decVal) && decVal >= 0 && decVal <= 255 ? toBin(decVal) : '';
  const decHexOut = !isNaN(decVal) && decVal >= 0 && decVal <= 255 ? toHex(decVal) : '';
  const decAsciiOut = !isNaN(decVal) && decVal >= 32 && decVal < 127 ? String.fromCharCode(decVal) : '';

  // Hex → Decimal + Binary
  const [hexIn, setHexIn] = useState('');
  const hexClean = hexIn.replace(/^0x/i, '').trim();
  const hexVal = parseInt(hexClean, 16);
  const hexDecOut = !isNaN(hexVal) ? String(hexVal) : '';
  const hexBinOut = !isNaN(hexVal) ? toBin(hexVal) : '';

  return (
    <div className="space-y-4 panel-animate">

      <Section title="Binary → Text">
        <div className="space-y-3">
          <div>
            <Label>Binary input (space-separated bytes)</Label>
            <input
              className="terminal-input"
              placeholder="01000001 01001000 01001001"
              value={binIn}
              onChange={e => setBinIn(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OutputBox label="Decimal" value={binDecOut} />
            <OutputBox label="ASCII text" value={binAsciiOut || (binHasErr ? '⚠ Invalid binary' : '')} accent={!binHasErr} />
          </div>
        </div>
      </Section>

      <Section title="Text → Binary / Decimal / Hex">
        <div className="space-y-3">
          <div>
            <Label>Text input</Label>
            <input
              className="terminal-input"
              placeholder="Type anything..."
              value={txtIn}
              onChange={e => setTxtIn(e.target.value)}
            />
          </div>
          <OutputBox label="Binary (8-bit per char)" value={txtBinOut} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OutputBox label="Decimal" value={txtDecOut} />
            <OutputBox label="Hex" value={txtHexOut} accent />
          </div>
        </div>
      </Section>

      <Section title="Decimal → Binary / Hex">
        <div className="space-y-3">
          <div>
            <Label>Decimal (0 – 255)</Label>
            <input
              type="number"
              className="terminal-input"
              placeholder="0 – 255"
              min={0} max={255}
              value={decIn}
              onChange={e => setDecIn(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OutputBox label="Binary" value={decBinOut} />
            <OutputBox label="Hex" value={decHexOut} accent />
            <OutputBox label="ASCII char" value={decAsciiOut} />
          </div>
        </div>
      </Section>

      <Section title="Hex → Decimal / Binary" accent="amber">
        <div className="space-y-3">
          <div>
            <Label>Hex input (e.g. 0x41 or 41)</Label>
            <input
              className="terminal-input"
              placeholder="0x41"
              value={hexIn}
              onChange={e => setHexIn(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OutputBox label="Decimal" value={hexDecOut} />
            <OutputBox label="Binary" value={hexBinOut} />
          </div>
        </div>
      </Section>

    </div>
  );
}
