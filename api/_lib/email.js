import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = process.env.APP_NAME || "BINARY_LAB";
const APP_URL = process.env.APP_URL || "https://binarylab.dev";
const FROM = process.env.FROM_EMAIL || "noreply@binarylab.dev";

export async function sendPasswordResetEmail(email, username, token) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { background:#0a0c0f; color:#e8f5ef; font-family:'Courier New',monospace; margin:0; padding:0; }
    .wrap { max-width:480px; margin:40px auto; padding:0 20px; }
    .card { background:#0e1117; border:1px solid #1a2030; border-radius:8px; overflow:hidden; }
    .header { background:#080b0e; border-bottom:1px solid #1a2030; padding:16px 24px; }
    .logo { color:#00ff88; font-size:18px; letter-spacing:0.15em; text-shadow:0 0 10px #00ff8866; }
    .body { padding:28px 24px; }
    .pre { color:#6b8a7a; font-size:12px; margin-bottom:20px; }
    .greeting { color:#e8f5ef; font-size:14px; margin-bottom:12px; }
    .msg { color:#6b8a7a; font-size:13px; line-height:1.6; margin-bottom:24px; }
    .btn { display:inline-block; background:#004d2a; border:1px solid #00ff88; border-radius:4px;
           color:#00ff88; font-family:'Courier New',monospace; font-size:13px; letter-spacing:0.08em;
           padding:12px 28px; text-decoration:none; text-transform:uppercase; }
    .link-fallback { color:#3a5040; font-size:11px; margin-top:20px; word-break:break-all; }
    .link-fallback a { color:#6b8a7a; }
    .footer { color:#3a5040; font-size:11px; padding:16px 24px; border-top:1px solid #1a2030; }
    .warn { color:#3a5040; font-size:11px; margin-top:20px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <div class="logo">${APP_NAME}</div>
      </div>
      <div class="body">
        <p class="pre">// password_reset.sh</p>
        <p class="greeting">Hey ${username},</p>
        <p class="msg">
          We received a request to reset your password.<br>
          Click the button below — this link expires in <strong style="color:#ffb800">1 hour</strong>.
        </p>
        <a href="${resetLink}" class="btn">→ Reset password</a>
        <p class="warn">If you didn't request this, ignore this email. Your password won't change.</p>
        <div class="link-fallback">
          Link not working? Copy this into your browser:<br>
          <a href="${resetLink}">${resetLink}</a>
        </div>
      </div>
      <div class="footer">${APP_NAME} · encoding toolkit · This email was sent to ${email}</div>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendWelcomeEmail(email, username) {
  await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Welcome to ${APP_NAME}, ${username}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background:#0a0c0f; color:#e8f5ef; font-family:'Courier New',monospace; margin:0; padding:0; }
    .wrap { max-width:480px; margin:40px auto; padding:0 20px; }
    .card { background:#0e1117; border:1px solid #1a2030; border-radius:8px; overflow:hidden; }
    .header { background:#080b0e; border-bottom:1px solid #1a2030; padding:16px 24px; }
    .logo { color:#00ff88; font-size:18px; letter-spacing:0.15em; text-shadow:0 0 10px #00ff8866; }
    .body { padding:28px 24px; }
    .pre { color:#6b8a7a; font-size:12px; margin-bottom:20px; }
    .greeting { color:#e8f5ef; font-size:14px; margin-bottom:12px; }
    .msg { color:#6b8a7a; font-size:13px; line-height:1.8; margin-bottom:24px; }
    .stage { background:#004d2a; border:1px solid #00ff8844; border-radius:4px; padding:12px 16px; margin:16px 0; }
    .stage-name { color:#00ff88; font-size:13px; letter-spacing:0.1em; }
    .stage-desc { color:#6b8a7a; font-size:11px; margin-top:4px; }
    .btn { display:inline-block; background:#004d2a; border:1px solid #00ff88; border-radius:4px;
           color:#00ff88; font-family:'Courier New',monospace; font-size:13px;
           padding:12px 28px; text-decoration:none; text-transform:uppercase; letter-spacing:0.08em; }
    .footer { color:#3a5040; font-size:11px; padding:16px 24px; border-top:1px solid #1a2030; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header"><div class="logo">${APP_NAME}</div></div>
      <div class="body">
        <p class="pre">// welcome.sh --user=${username}</p>
        <p class="greeting">Hey ${username}, you're in.</p>
        <p class="msg">
          Your account is set up and your progress is now tracked.<br>
          Answer questions, earn XP, unlock stages, keep your streak alive.
        </p>
        <div class="stage">
          <div class="stage-name">⚡ Stage 1 — Bit Rookie</div>
          <div class="stage-desc">Starting with binary basics. Keep going to unlock ASCII, Hex, and Morse.</div>
        </div>
        <a href="${APP_URL}" class="btn">→ Start practising</a>
      </div>
      <div class="footer">${APP_NAME} · encoding toolkit</div>
    </div>
  </div>
</body>
</html>`,
  });
}
