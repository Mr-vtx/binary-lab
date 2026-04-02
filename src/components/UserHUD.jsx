import { useAuth } from '../AuthContext';

const STAGE_COLORS = {
  green:  { text: 'text-terminal-green',  bg: 'bg-terminal-green-muted',  border: 'border-terminal-green/40',  bar: 'bg-terminal-green' },
  cyan:   { text: 'text-terminal-cyan',   bg: 'bg-cyan-900/30',           border: 'border-terminal-cyan/40',   bar: 'bg-terminal-cyan' },
  amber:  { text: 'text-terminal-amber',  bg: 'bg-yellow-900/30',         border: 'border-terminal-amber/40',  bar: 'bg-terminal-amber' },
  purple: { text: 'text-purple-400',      bg: 'bg-purple-900/30',         border: 'border-purple-400/40',      bar: 'bg-purple-400' },
  red:    { text: 'text-terminal-red',    bg: 'bg-red-900/30',            border: 'border-terminal-red/40',    bar: 'bg-terminal-red' },
};

export default function UserHUD({ onOpenProfile }) {
  const { user, profile, logout } = useAuth();

  if (!user || !profile) return null;

  const { stage, nextStage, stageProgress } = profile;
  const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.green;
  const streak = user.streak?.current || 0;
  const daily = user.streak?.daily || 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={onOpenProfile}
        className={`flex items-center gap-2 px-2.5 py-1 rounded border ${colors.bg} ${colors.border} transition-all hover:opacity-80`}
      >
        <span className={`text-[10px] font-mono uppercase tracking-wider ${colors.text}`}>
          {stage.name}
        </span>
        <span className="text-[10px] font-mono text-terminal-text-muted">{user.xp} XP</span>
      </button>

      <div className="hidden sm:flex items-center gap-1.5">
        <div className="w-20 h-1.5 bg-terminal-border rounded-full overflow-hidden">
          <div className={`h-full ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${stageProgress}%` }} />
        </div>
        {nextStage && <span className="text-[10px] font-mono text-terminal-text-muted">{stageProgress}%</span>}
      </div>

      {streak > 0 && (
        <div className="flex items-center gap-1 text-[11px] font-mono text-terminal-amber">
          <span>⚡</span>
          <span>{streak}</span>
        </div>
      )}

      {daily > 0 && (
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-terminal-text-secondary">
          <span>🔥</span>
          <span>{daily}d</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={onOpenProfile} className="text-[11px] font-mono text-terminal-text-secondary hover:text-terminal-green transition-colors">
          {user.username}
        </button>
        <button onClick={logout} className="text-[10px] font-mono text-terminal-text-muted hover:text-terminal-red transition-colors px-1.5 py-0.5 rounded border border-transparent hover:border-terminal-red/30">
          exit
        </button>
      </div>
    </div>
  );
}
