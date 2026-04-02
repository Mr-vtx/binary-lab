export function welcomeTemplate({ appName, username, appUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>

<body style="margin:0;padding:0;background:#0a0c0f;color:#e8f5ef;font-family:monospace;">

  <div style="max-width:520px;margin:40px auto;padding:20px;">

    <div style="border:1px solid #1a2030;border-radius:8px;overflow:hidden;">

      <!-- Header -->
      <div style="background:#080b0e;padding:16px 24px;border-bottom:1px solid #1a2030;">
        <h2 style="margin:0;color:#00ff88;letter-spacing:0.1em;">
          ${appName}
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:24px;">
        <p style="color:#6b8a7a;font-size:12px;margin-bottom:16px;">
          // system_boot.sh
        </p>

        <p style="margin-bottom:12px;">
          Hey <strong>${username}</strong>,
        </p>

        <p style="color:#6b8a7a;line-height:1.6;">
          Your account is ready. You're now part of <strong>${appName}</strong>.
          Start learning, tracking progress, and unlocking levels as you go.
        </p>

        <!-- Stage -->
        <div style="margin:20px 0;padding:16px;background:#004d2a;border:1px solid #00ff8844;border-radius:6px;">
          <p style="margin:0;color:#00ff88;font-size:13px;">
            ⚡ Stage 1 — Bit Rookie
          </p>
          <p style="margin:6px 0 0;color:#6b8a7a;font-size:11px;">
            Learn the basics of binary and build your foundation.
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:24px;">
          <a href="${appUrl}"
             style="display:inline-block;padding:12px 24px;
             background:#004d2a;border:1px solid #00ff88;
             color:#00ff88;text-decoration:none;font-size:13px;
             letter-spacing:0.08em;">
            → Start Practicing
          </a>
        </div>

        <p style="margin-top:24px;font-size:11px;color:#6b8a7a;">
          If you didn’t create this account, you can safely ignore this email.
        </p>

      </div>

      <!-- Footer -->
      <div style="padding:16px 24px;border-top:1px solid #1a2030;font-size:10px;color:#3a5040;">
        ${appName} · learning platform · no reply email
      </div>

    </div>
  </div>

</body>
</html>
`;
}
