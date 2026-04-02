import { verifyAccessToken } from "../_lib/jwt.js";

export default async function handler(req, res) {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ user: null });

  const payload = verifyAccessToken(token);
  if (!payload) return res.status(401).json({ user: null });

  return res.status(200).json({ user: payload });
}