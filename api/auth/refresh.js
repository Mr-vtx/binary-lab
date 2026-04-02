import { connectDB } from "../_lib/mongo.js";
import { hashToken } from "../_lib/securefalc.js";
import { signAccessToken } from "../_lib/jwt.js";

export default async function handler(req, res) {
  const db = await connectDB();

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).end();

  const hashed = hashToken(refreshToken);
  const session = await db.collection("sessions").findOne({ token: hashed });

  if (!session) return res.status(401).end();

  const newAccess = signAccessToken({ userId: session.userId });

  res.setHeader(
    "Set-Cookie",
    `accessToken=${newAccess}; HttpOnly; Path=/; Max-Age=900`,
  );

  return res.status(200).json({ success: true });
}
