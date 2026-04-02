import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils';

export function Card({ children, className = '', title, accent = 'green' }) {
  const borderColor = accent === 'amber' ? 'border-terminal-amber/20' : accent === 'cyan' ? 'border-terminal-cyan/20' : 'border-terminal-border';
  const titleColor = accent === 'amber' ? 'text-terminal-amber' : accent === 'cyan' ? 'text-terminal-cyan' : 'text-terminal-green';
  return (
    <div className={`bg-terminal-panel border ${borderColor} rounded-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-2 border-b border-terminal-border flex items-center gap-2">
          <span className={`text-xs font-mono uppercase tracking-widest ${titleColor} opacity-70`}>{title}</span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function CopyButton({ text, size = 'sm' }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    if (!text) return;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const sz = size === 'sm' ? 'p-1' : 'px-3 py-1.5 gap-1.5';
  return (
    <button
      onClick={handle}
      className={`${sz} rounded border border-terminal-border bg-terminal-bg hover:border-terminal-green/40 hover:text-terminal-green transition-all duration-150 text-terminal-text-secondary flex items-center`}
      title="Copy to clipboard"
    >
      {copied
        ? <Check size={14} className="text-terminal-green" />
        : <Copy size={14} />
      }
      {size !== 'sm' && <span className="text-xs font-mono">{copied ? 'Copied!' : 'Copy'}</span>}
    </button>
  );
}

export function OutputBox({ value, label, accent = false, copyable = true, className = '' }) {
  const accentClass = accent ? 'text-terminal-green glow-green' : 'text-terminal-text-primary';
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest">{label}</div>}
      <div className={`bg-terminal-bg border border-terminal-border rounded px-3 py-2.5 font-mono text-sm break-all min-h-[40px] flex items-center justify-between gap-2 ${accentClass}`}>
        <span className="flex-1 leading-relaxed">{value || <span className="text-terminal-text-muted">—</span>}</span>
        {copyable && value && <CopyButton text={value} />}
      </div>
    </div>
  );
}

export function Label({ children }) {
  return <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-1">{children}</div>;
}

export function Prompt({ prefix = '>' }) {
  return <span className="text-terminal-green opacity-50 mr-2 font-mono">{prefix}</span>;
}
