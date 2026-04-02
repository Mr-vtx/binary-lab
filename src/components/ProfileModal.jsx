import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import api from '../api';
import { X } from 'lucide-react';

const STAGE_COLORS = {
  green:  { text: 'text-terminal-green',  bg: 'bg-terminal-green-muted',  border: 'border-terminal-green/40' },
  cyan:   { text: 'text-terminal-cyan',   bg: 'bg-cyan-900/30',           border: 'border-terminal-cyan/40' },
  amber:  { text: 'text-terminal-amber',  bg: 'bg-yellow-900/30',         border: 'border-terminal-amber/40' },
  purple: { text: 'text-purple-400',      bg: 'bg-purple-900/30',         border: 'border-purple-400/40' },
  red:    { text: 'text-terminal-red',    bg: 'bg-red-900/30',            border: 'border-terminal-red/40' },
};

function Bar({ label, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = pct >= 80 ? 'bg-terminal-green' : pct >= 60 ? 'bg-terminal-amber' : 'bg-terminal-red';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-mono">
        <span className="text-terminal-text-secondary">{label}</span>
        <span className={pct >= 60 ? 'text-terminal-text-primary' : 'text-terminal-red'}>{pct}% <span className="text-terminal-text-muted">({correct}/{total})</span></span>
      </div>
      <div className="h-1.5 bg-terminal-border rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ProfileModal({ onClose }) {
  const { profile, user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    api.get('/quiz/history')
      .then(({ data }) => setHistory(data.sessions))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  if (!profile || !user) return null;

  const { stage, nextStage, stageProgress, xpToNext, accuracy, weakSpots, allStages } = profile;
  const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.green;

  // Week grid — last 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1);
    const hasActivity = history.some(s => s.date === key);
    return { key, label, hasActivity };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-terminal-panel border border-terminal-border rounded-lg overflow-hidden max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-terminal-border bg-terminal-bg sticky top-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-terminal-green text-sm tracking-widest glow-green">BINARY_LAB</span>
            <span className="text-[11px] font-mono text-terminal-text-muted">/ profile</span>
          </div>
          <button onClick={onClose} className="text-terminal-text-muted hover:text-terminal-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* User + Stage */}
          <div className="flex items-start gap-4 flex-wrap">
            <div className={`px-4 py-3 rounded border ${colors.bg} ${colors.border} flex-1 min-w-48`}>
              <div className={`text-lg font-display tracking-widest ${colors.text}`}>{stage.name}</div>
              <div className="text-xs font-mono text-terminal-text-muted mt-0.5">{stage.description}</div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-terminal-text-muted">
                  <span>{user.xp} XP</span>
                  {nextStage && <span>{nextStage.xpRequired} XP</span>}
                </div>
                <div className="h-1.5 bg-terminal-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${STAGE_COLORS[stage.color]?.bg.replace('bg-', 'bg-').replace('/30','') || 'bg-terminal-green'}`}
                    style={{ width: `${stageProgress}%`, background: stage.color === 'green' ? '#00ff88' : stage.color === 'cyan' ? '#00d4ff' : stage.color === 'amber' ? '#ffb800' : stage.color === 'purple' ? '#a78bfa' : '#ff3355' }}
                  />
                </div>
                {nextStage && <div className="text-[10px] font-mono text-terminal-text-muted">{xpToNext} XP to {nextStage.name}</div>}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 flex-1 min-w-48">
              {[
                { label: 'Accuracy', val: `${accuracy}%`, color: accuracy >= 70 ? 'text-terminal-green' : 'text-terminal-amber' },
                { label: 'Best Streak', val: user.streak?.best || 0, color: 'text-terminal-text-primary' },
                { label: 'Daily Streak', val: `${user.streak?.daily || 0}d`, color: 'text-terminal-amber' },
                { label: 'Answered', val: user.stats?.totalAnswered || 0, color: 'text-terminal-text-primary' },
                { label: 'Correct', val: user.stats?.totalCorrect || 0, color: 'text-terminal-green' },
                { label: 'Total XP', val: user.xp, color: 'text-terminal-cyan' },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-terminal-bg border border-terminal-border rounded p-2 text-center">
                  <div className="text-[9px] text-terminal-text-muted uppercase tracking-widest">{label}</div>
                  <div className={`text-base font-mono font-semibold mt-0.5 ${color}`}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly activity */}
          <div>
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-2">This week</div>
            <div className="flex gap-2">
              {weekDays.map(({ key, label, hasActivity }) => (
                <div key={key} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-full h-6 rounded border transition-all ${hasActivity ? 'bg-terminal-green-muted border-terminal-green/50' : 'bg-terminal-bg border-terminal-border'}`} />
                  <span className="text-[10px] font-mono text-terminal-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          {Object.keys(user.stats?.byCategory || {}).length > 0 && (
            <div>
              <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-2">Accuracy by category</div>
              <div className="space-y-2">
                {Object.entries(user.stats.byCategory).map(([cat, { correct, total }]) => (
                  <Bar key={cat} label={cat} correct={correct} total={total} />
                ))}
              </div>
            </div>
          )}

          {/* Weak spots */}
          {weakSpots?.length > 0 && (
            <div className="bg-red-900/10 border border-terminal-red/20 rounded p-3">
              <div className="text-[10px] text-terminal-red uppercase tracking-widest mb-2">⚠ Weak spots — needs practice</div>
              <div className="flex flex-wrap gap-2">
                {weakSpots.map(({ category, accuracy }) => (
                  <span key={category} className="text-xs font-mono px-2 py-1 rounded border border-terminal-red/30 text-terminal-red bg-red-900/20">
                    {category} · {accuracy}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stage map */}
          <div>
            <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-2">Stage roadmap</div>
            <div className="space-y-1.5">
              {allStages.map(s => {
                const c = STAGE_COLORS[s.color] || STAGE_COLORS.green;
                const isReached = user.xp >= s.xpRequired;
                const isCurrent = s.id === stage.id;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded border transition-all
                      ${isCurrent ? `${c.bg} ${c.border}` : isReached ? 'bg-terminal-bg border-terminal-border opacity-60' : 'bg-terminal-bg border-terminal-border opacity-30'}`}
                  >
                    <span className={`text-xs font-mono w-4 ${isCurrent ? c.text : 'text-terminal-text-muted'}`}>{isReached ? '✓' : s.id}</span>
                    <div className="flex-1">
                      <div className={`text-xs font-mono font-semibold ${isCurrent ? c.text : 'text-terminal-text-secondary'}`}>{s.name}</div>
                      <div className="text-[10px] text-terminal-text-muted">{s.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-terminal-text-muted">{s.xpRequired} XP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent sessions */}
          {!loadingHistory && history.length > 0 && (
            <div>
              <div className="text-[10px] text-terminal-text-secondary uppercase tracking-widest mb-2">Recent sessions</div>
              <div className="space-y-1.5">
                {history.slice(0, 7).map((s, i) => {
                  const acc = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs font-mono bg-terminal-bg border border-terminal-border rounded px-3 py-2">
                      <span className="text-terminal-text-muted w-20">{s.date}</span>
                      <span className="text-terminal-text-secondary flex-1">{s.correct}/{s.total} correct</span>
                      <span className={acc >= 70 ? 'text-terminal-green' : 'text-terminal-amber'}>{acc}%</span>
                      <span className="text-terminal-cyan">+{s.xpEarned} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
