import { parseCookies } from "../../lib/cookieParser.js";
import { connectDB } from "../../lib/mongo.js";
import { verifyAccessToken } from "../../lib/jwt.js";
import { cors } from "../../lib/cors.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  parseCookies(req);
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const payload = verifyAccessToken(token);
  if (!payload) return res.status(401).json({ error: "Unauthorized" });

  try {
    const db = await connectDB();
    const sessions = await db
      .collection("quiz_sessions")
      .find({ userId: payload.userId })
      .sort({ date: -1 })
      .limit(30)
      .toArray();

    const summary = sessions.map((s) => ({
      date: s.date,
      total: s.questions.length,
      correct: s.questions.filter((q) => q.isCorrect).length,
      xpEarned: s.questions.reduce((acc, q) => acc + (q.xpGained || 0), 0),
      byCategory: s.questions.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = { correct: 0, total: 0 };
        acc[q.category].total++;
        if (q.isCorrect) acc[q.category].correct++;
        return acc;
      }, {}),
    }));

    return res.status(200).json({ sessions: summary });
  } catch (err) {
    console.error("History error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
