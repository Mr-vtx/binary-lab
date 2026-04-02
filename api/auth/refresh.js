import { connectDB } from "../_lib/mongo.js";
import { cors } from "../_lib/cors.js";
import { parseCookies } from "../_lib/cookieParser.js";
import { signAccessToken } from "../_lib/jwt.js";
import {
  hashToken,
  generateToken,
  getFingerprint,
} from "../_lib/securefalc.js";
import { setAuthCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  parseCookies(req);

  if (req.method !== "POST") return res.status(405).end();

  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const db = await connectDB();
    const hashed = hashToken(refreshToken);

    const session = await db.collection("sessions").findOne({
      token: hashed,
      expiresAt: { $gt: new Date() },
    });

    if (!session) return res.status(401).json({ error: "Session expired" });

    await db.collection("sessions").deleteOne({ token: hashed });

    const newAccess = signAccessToken({ userId: session.userId.toString() });
    const newRefresh = generateToken();
    const newCsrf = generateToken();
    const fingerprint = getFingerprint(req);

    await db.collection("sessions").insertOne({
      userId: session.userId,
      token: hashToken(newRefresh),
      fingerprint,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 86400000),
    });

    setAuthCookies(res, newAccess, newRefresh, newCsrf);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
