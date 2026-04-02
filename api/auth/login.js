import { parseCookies } from "../_lib/cookieParser.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../_lib/mongo.js";
import { cors } from "../_lib/cors.js";
import { signAccessToken } from "../_lib/jwt.js";
import { setAuthCookies } from "../_lib/cookies.js";
import {
  generateToken,
  hashToken,
  getFingerprint,
} from "../_lib/securefalc.js";
import { checkRateLimit } from "../_lib/rateLimit.js";
import { validateEmail, normalizeEmail } from "../_lib/validate.js";

const FAKE_HASH =
  "$2b$12$tIBXZVkCy5cv//8AF024uOV8rv3abYXXqqIkQ9A4jlAMK/ecOTEzy";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!validateEmail(email) || !password) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const db = await connectDB();
  const cleanEmail = normalizeEmail(email);

  const allowed = await checkRateLimit(
    db,
    `login:${cleanEmail}:${req.headers["x-forwarded-for"] || ""}`,
    5,
    60000,
  );
  if (!allowed)
    return res.status(429).json({ error: "Too many attempts. Wait a minute." });

  const user = await db.collection("users").findOne({ email: cleanEmail });

  if (user?.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({ error: "Account locked. Try again later." });
  }

  const hash = user ? user.passwordHash : FAKE_HASH;
  const valid = await bcrypt.compare(password, hash);

  if (!user || !valid) {
    if (user) {
      const attempts = (user.loginAttempts || 0) + 1;
      const lock = attempts >= 5 ? Date.now() + 15 * 60 * 1000 : null;
      await db
        .collection("users")
        .updateOne(
          { _id: user._id },
          { $set: { loginAttempts: attempts, lockUntil: lock } },
        );
    }
    return res.status(401).json({ error: "Invalid credentials" });
  }

  await db
    .collection("users")
    .updateOne(
      { _id: user._id },
      { $set: { loginAttempts: 0, lockUntil: null } },
    );

  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = generateToken();
  const csrfToken = generateToken();
  const fingerprint = getFingerprint(req);

  await db.collection("sessions").insertOne({
    userId: user._id,
    token: hashToken(refreshToken),
    fingerprint,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 86400000),
  });

  setAuthCookies(res, accessToken, refreshToken, csrfToken);

  const { passwordHash, emailVerification, ...safeUser } = user;
  return res.status(200).json({ success: true, user: safeUser });
}
