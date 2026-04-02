import { connectDB } from '../_lib/mongo.js';
import { requireAuth } from '../_lib/auth.js';
import { cors } from '../_lib/cors.js';
import { getStageForXP, getNextStage, STAGES } from '../_lib/progression.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = requireAuth(req);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(auth.userId) },
      { projection: { passwordHash: 0 } }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    const stage = getStageForXP(user.xp);
    const nextStage = getNextStage(user.xp);

    const xpToNext = nextStage ? nextStage.xpRequired - user.xp : 0;
    const xpInCurrentStage = user.xp - stage.xpRequired;
    const xpNeededForStage = nextStage ? nextStage.xpRequired - stage.xpRequired : 1;
    const stageProgress = nextStage ? Math.min(100, Math.round((xpInCurrentStage / xpNeededForStage) * 100)) : 100;

    const weakSpots = Object.entries(user.stats.byCategory)
      .filter(([, s]) => s.total >= 3 && (s.correct / s.total) < 0.6)
      .map(([cat, s]) => ({ category: cat, accuracy: Math.round((s.correct / s.total) * 100) }));

    const accuracy = user.stats.totalAnswered > 0
      ? Math.round((user.stats.totalCorrect / user.stats.totalAnswered) * 100)
      : 0;

    return res.status(200).json({
      user,
      stage,
      nextStage,
      xpToNext,
      stageProgress,
      accuracy,
      weakSpots,
      allStages: STAGES,
    });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
