import { parseCookies } from "../_lib/cookieParser.js";
import { connectDB } from "../_lib/mongo.js";
import { verifyAccessToken } from "../_lib/jwt.js";
import { cors } from "../_lib/cors.js";
import { ObjectId } from "mongodb";
import {
  calcXP,
  updateStreak,
  getStageForXP,
  getNextStage,
  calcDailyStreakUpdate,
  getDailyKey,
} from "../_lib/progression.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  parseCookies(req);
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = verifyAccessToken(token);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { category, question, answer, chosen } = req.body;
  if (!category || !question || !answer || chosen === undefined) {
    return res
      .status(400)
      .json({ error: "category, question, answer, chosen are required" });
  }

  const isCorrect = answer === chosen;

  try {
    const db = await connectDB();
    const users = db.collection("users");
    const sessions = db.collection("quiz_sessions");

    const dbUser = await users.findOne({ _id: new ObjectId(user.userId) });
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    const newCurrentStreak = updateStreak(dbUser.streak.current, isCorrect);
    const newBestStreak = Math.max(dbUser.streak.best, newCurrentStreak);

    const { dailyStreak, lastActiveDate } = calcDailyStreakUpdate(
      dbUser.streak,
      dbUser.streak.lastActiveDate,
    );

    const xpGained = calcXP({
      isCorrect,
      category,
      streakCount: newCurrentStreak,
    });
    const newXP = dbUser.xp + xpGained;

    const oldStage = getStageForXP(dbUser.xp);
    const newStage = getStageForXP(newXP);
    const stagedUp = newStage.id > oldStage.id;

    const catKey = `stats.byCategory.${category}`;
    const catStats = dbUser.stats.byCategory[category] || {
      correct: 0,
      total: 0,
    };

    const updatedUser = await users.findOneAndUpdate(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          xp: newXP,
          "streak.current": newCurrentStreak,
          "streak.best": newBestStreak,
          "streak.daily": dailyStreak,
          "streak.lastActiveDate": lastActiveDate,
          [`stats.byCategory.${category}`]: {
            correct: catStats.correct + (isCorrect ? 1 : 0),
            total: catStats.total + 1,
          },
        },
        $inc: {
          "stats.totalAnswered": 1,
          "stats.totalCorrect": isCorrect ? 1 : 0,
        },
        ...(stagedUp
          ? {
              $push: {
                stageHistory: {
                  stageId: newStage.id,
                  stageName: newStage.name,
                  reachedAt: new Date(),
                  xpAtTime: newXP,
                },
              },
            }
          : {}),
      },
      { returnDocument: "after" },
    );

    const today = getDailyKey();
    await sessions.updateOne(
      { userId: user.userId, date: today },
      {
        $push: {
          questions: {
            category,
            question,
            answer,
            chosen,
            isCorrect,
            xpGained,
            answeredAt: new Date(),
          },
        },
        $setOnInsert: {
          userId: user.userId,
          date: today,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    const nextStage = getNextStage(newXP);

    return res.status(200).json({
      isCorrect,
      xpGained,
      newXP,
      streak: {
        current: newCurrentStreak,
        best: newBestStreak,
        daily: dailyStreak,
      },
      stage: newStage,
      nextStage,
      stagedUp,
      weakSpot: !isCorrect ? category : null,
    });
  } catch (err) {
    console.error("Answer error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
