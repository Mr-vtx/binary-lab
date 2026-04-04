export function verifyEmailTemplate({ appName, username, verifyLink }) {
  return `
    <div style="font-family:monospace;background:#0a0c0f;color:#e8f5ef;padding:20px;">
      <h2 style="color:#00ff88">${appName}</h2>

      <p>Hello ${username},</p>

      <p>Please verify your email to activate your account:</p>

      <a href="${verifyLink}" 
         style="display:inline-block;margin-top:10px;padding:10px 15px;background:#00ff88;color:#000;text-decoration:none;">
         Verify Email
      </a>

      <p style="margin-top:20px;font-size:12px;color:#aaa;">
        If you didn’t request this, you can ignore this email.
      </p>
    </div>
  `;
}
