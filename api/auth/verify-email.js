import crypto from "crypto";
import { connectDB } from "../_lib/mongo.js";
import { cors } from "../_lib/cors.js";
import { signToken } from "../_lib/auth.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.APP_URL || "https://binarylab.dev";
const APP_NAME = process.env.APP_NAME || "BINARY_LAB";
const FROM = process.env.FROM_EMAIL || "noreply@binarylab.dev";

async function sendVerificationEmail(email, username, token) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Verify your ${APP_NAME} email`,
    html: `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{background:#0a0c0f;color:#e8f5ef;font-family:'Courier New',monospace;margin:0;padding:0}
  .wrap{max-width:480px;margin:40px auto;padding:0 20px}
  .card{background:#0e1117;border:1px solid #1a2030;border-radius:8px;overflow:hidden}
  .header{background:#080b0e;border-bottom:1px solid #1a2030;padding:16px 24px}
  .logo{color:#00ff88;font-size:18px;letter-spacing:.15em;text-shadow:0 0 10px #00ff8866}
  .body{padding:28px 24px}
  .pre{color:#6b8a7a;font-size:12px;margin-bottom:20px}
  .msg{color:#6b8a7a;font-size:13px;line-height:1.6;margin-bottom:24px}
  .btn{display:inline-block;background:#004d2a;border:1px solid #00ff88;border-radius:4px;
       color:#00ff88;font-family:'Courier New',monospace;font-size:13px;letter-spacing:.08em;
       padding:12px 28px;text-decoration:none;text-transform:uppercase}
  .footer{color:#3a5040;font-size:11px;padding:16px 24px;border-top:1px solid #1a2030}
  .fallback{color:#3a5040;font-size:11px;margin-top:20px;word-break:break-all}
  .fallback a{color:#6b8a7a}
</style></head><body>
<div class="wrap"><div class="card">
  <div class="header"><div class="logo">${APP_NAME}</div></div>
  <div class="body">
    <p class="pre">// verify_email.sh --user=${username}</p>
    <p class="msg">One step left. Verify your email to activate your account and start tracking your progress.</p>
    <a href="${link}" class="btn">→ Verify email</a>
    <p class="fallback">Link not working?<br><a href="${link}">${link}</a></p>
  </div>
  <div class="footer">${APP_NAME} · This link expires in 24 hours · Sent to ${email}</div>
</div></div>
</body></html>`,
  });
}

export default async function handler(req, res) {
  if (cors(req, res)) return;

  // POST /api/auth/verify-email — send or resend verification email
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      const db = await connectDB();
      const user = await db
        .collection("users")
        .findOne({ email: email.toLowerCase().trim() });
      if (!user)
        return res
          .status(200)
          .json({
            message: "If that account exists, a verification email was sent.",
          });
      if (user.emailVerified)
        return res.status(400).json({ error: "Email already verified." });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

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

  // GET /api/auth/verify-email?token=xxx — confirm the token
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

      // Return a fresh token so they're auto-logged in after verifying
      const authToken = signToken({
        userId: user._id.toString(),
        username: user.username,
      });
      return res
        .status(200)
        .json({ verified: true, username: user.username, token: authToken });
    } catch (err) {
      console.error("Verify email error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
