export const STAGES = [
  {
    id: 1,
    name: 'Bit Rookie',
    xpRequired: 0,
    description: 'Getting started with binary basics',
    unlockedCategories: ['BIN→DEC', 'DEC→BIN'],
    color: 'green',
  },
  {
    id: 2,
    name: 'ASCII Initiate',
    xpRequired: 100,
    description: 'Reading the character table',
    unlockedCategories: ['BIN→DEC', 'DEC→BIN', 'ASCII', 'DEC→ASCII'],
    color: 'cyan',
  },
  {
    id: 3,
    name: 'Hex Hacker',
    xpRequired: 300,
    description: 'Hex fluency unlocked',
    unlockedCategories: ['BIN→DEC', 'DEC→BIN', 'ASCII', 'DEC→ASCII', 'DEC→HEX'],
    color: 'amber',
  },
  {
    id: 4,
    name: 'Signal Operator',
    xpRequired: 600,
    description: 'Morse code and all encodings',
    unlockedCategories: ['BIN→DEC', 'DEC→BIN', 'ASCII', 'DEC→ASCII', 'DEC→HEX', 'MORSE'],
    color: 'purple',
  },
  {
    id: 5,
    name: 'Network Architect',
    xpRequired: 1200,
    description: 'You see the matrix',
    unlockedCategories: ['BIN→DEC', 'DEC→BIN', 'ASCII', 'DEC→ASCII', 'DEC→HEX', 'MORSE'],
    color: 'red',
  },
];

export function getStageForXP(xp) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (xp >= s.xpRequired) stage = s;
  }
  return stage;
}

export function getNextStage(xp) {
  const current = getStageForXP(xp);
  return STAGES.find(s => s.id === current.id + 1) || null;
}

export function calcXP({ isCorrect, category, streakCount }) {
  if (!isCorrect) return 0;
  const base = { 'BIN→DEC': 8, 'DEC→BIN': 8, 'ASCII': 10, 'DEC→ASCII': 10, 'DEC→HEX': 12, 'MORSE': 15 };
  const baseXP = base[category] || 8;
  const streakBonus = Math.floor(streakCount / 5) * 2;
  return baseXP + streakBonus;
}

export function updateStreak(currentStreak, isCorrect) {
  if (isCorrect) return currentStreak + 1;
  return 0; 
}

export function getDailyKey() {
  return new Date().toISOString().slice(0, 10); 
}

export function calcDailyStreakUpdate(streak, lastActiveDate) {
  const today = getDailyKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (lastActiveDate === today) {
    return { dailyStreak: streak.daily, lastActiveDate: today };
  } else if (lastActiveDate === yesterday) {
    return { dailyStreak: streak.daily + 1, lastActiveDate: today };
  } else {
    return { dailyStreak: 1, lastActiveDate: today };
  }
}
