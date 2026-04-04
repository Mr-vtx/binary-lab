export function resetPasswordTemplate({ appName, username, resetLink }) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="background:#0a0c0f;color:#e8f5ef;font-family:monospace;">
  <div style="max-width:480px;margin:40px auto;">
    <div style="padding:20px;border:1px solid #1a2030;">
      <h2 style="color:#00ff88">${appName}</h2>

      <p>Hello ${username},</p>

      <p>Reset your password using the link below:</p>

      <a href="${resetLink}" 
         style="display:inline-block;padding:10px 20px;
         background:#004d2a;color:#00ff88;border:1px solid #00ff88;text-decoration:none;">
         Reset Password
      </a>

      <p style="margin-top:20px;font-size:12px;">
        If you didn’t request this, ignore this email.
      </p>

      <p style="font-size:10px;word-break:break-all;">
        ${resetLink}
      </p>
    </div>
  </div>
</body>
</html>
`;
}
