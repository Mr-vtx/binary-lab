import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "../_lib/mongo.js";
import { cors } from "../_lib/cors.js";
import { signAccessToken } from "../_lib/jwt.js";
import { setAuthCookies } from "../_lib/cookies.js";
import {
  generateToken,
  hashToken,
  getFingerprint,
} from "../_lib/securefalc.js";
import { sendWelcomeEmail, sendVerificationEmail } from "../_lib/email.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  normalizeEmail,
} from "../_lib/validate.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, confirmPassword, username } = req.body;

  if (
    !validateEmail(email) ||
    !validatePassword(password) ||
    !validateUsername(username)
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const db = await connectDB();
    const users = db.collection("users");
    const normalizedEmail = normalizeEmail(email);

    const existing = await users.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });
    if (existing) {
      const field = existing.email === normalizedEmail ? "Email" : "Username";
      return res.status(409).json({ error: `${field} already taken` });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = {
      email: normalizedEmail,
      username: username.trim(),
      passwordHash,
      createdAt: new Date(),
      emailVerified: false,
      emailVerification: { token: verifyToken, expires: verifyExpires },
      xp: 0,
      streak: { current: 0, best: 0, daily: 0, lastActiveDate: null },
      stats: { totalAnswered: 0, totalCorrect: 0, byCategory: {} },
      stageHistory: [],
    };

    const result = await users.insertOne(user);

    const accessToken = signAccessToken({
      userId: result.insertedId.toString(),
    });
    const refreshToken = generateToken();
    const csrfToken = generateToken();
    const fingerprint = getFingerprint(req);

    await db.collection("sessions").insertOne({
      userId: result.insertedId,
      token: hashToken(refreshToken),
      fingerprint,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 86400000),
    });

    setAuthCookies(res, accessToken, refreshToken, csrfToken);

 await Promise.allSettled([
   sendWelcomeEmail(user.email, user.username),
   sendVerificationEmail(user.email, user.username, verifyToken),
 ]);
    const { passwordHash: _, emailVerification: __, ...safeUser } = user;
    return res.status(201).json({
      success: true,
      user: { ...safeUser, _id: result.insertedId },
      emailVerificationSent: true,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}