import { parseCookies } from "../../lib/cookieParser.js";
import { connectDB } from "../../lib/mongo.js";
import { cors } from "../../lib/cors.js";
import { hashToken } from "../../lib/securefalc.js";
import { clearAuthCookies } from "../../lib/cookies.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  parseCookies(req);

  if (req.method !== "POST") return res.status(405).end();

  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const db = await connectDB();
      await db
        .collection("sessions")
        .deleteOne({ token: hashToken(refreshToken) });
    }
  } catch (err) {
    console.error("Logout DB error:", err);
  }

  clearAuthCookies(res);
  return res.status(200).json({ success: true });
}
