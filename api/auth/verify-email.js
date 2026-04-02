import { parseCookies } from "../_lib/cookieParser.js";
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
import { sendVerificationEmail } from "../_lib/email.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  parseCookies(req);

  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      const db = await connectDB();
      const user = await db.collection("users").findOne({
        email: email.toLowerCase().trim(),
      });

      if (!user)
        return res
          .status(200)
          .json({
            message: "If that account exists, a verification email was sent.",
          });
      if (user.emailVerified)
        return res.status(400).json({ error: "Email already verified." });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await db
        .collection("users")
        .updateOne(
          { _id: user._id },
          {
            $set: {
              "emailVerification.token": token,
              "emailVerification.expires": expires,
            },
          },
        );

      await sendVerificationEmail(user.email, user.username, token);
      return res.status(200).json({ message: "Verification email sent." });
    } catch (err) {
      console.error("Send verification error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token required" });

    try {
      const db = await connectDB();
      const user = await db.collection("users").findOne({
        "emailVerification.token": token,
        "emailVerification.expires": { $gt: new Date() },
      });

      if (!user)
        return res
          .status(400)
          .json({ error: "Link is invalid or has expired." });
      if (user.emailVerified)
        return res
          .status(200)
          .json({ alreadyVerified: true, username: user.username });

      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: { emailVerified: true, emailVerifiedAt: new Date() },
          $unset: { emailVerification: "" },
        },
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
      return res.status(200).json({ verified: true, username: user.username });
    } catch (err) {
      console.error("Verify email error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
