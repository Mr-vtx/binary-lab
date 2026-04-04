import { Resend } from "resend";
import nodemailer from "nodemailer";
import { resetPasswordTemplate as resetTpl } from "../emails/templates/resetPassword.js";
import { welcomeTemplate as welcomeTpl } from "../emails/templates/welcomeEmail.js";
import { verifyEmailTemplate as verifyTpl } from "../emails/templates/verifyEmail.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const APP_NAME = process.env.APP_NAME || "Binary-Lab";

const FROM_GMAIL = `"${APP_NAME}" <${process.env.EMAIL_USER}>`;
const FROM_RESEND = `${APP_NAME} <${process.env.FROM_EMAIL}>`;

export async function sendPasswordResetEmail(email, username, token) {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

  const html = resetTpl({
    appName: APP_NAME,
    username,
    resetLink,
  });

  if (process.env.USE_NODEMAILER === "true") {
    await transporter.sendMail({
      from: FROM_GMAIL,
      to: email,
      subject: `Reset your ${APP_NAME} password`,
      html,
    });
  } else {
    await resend.emails.send({
      from: FROM_RESEND,
      to: email,
      subject: `Reset your ${APP_NAME} password`,
      html,
    });
  }
}

export async function sendWelcomeEmail(email, username) {
  const appUrl = process.env.APP_URL;

  const html = welcomeTpl({
    appName: APP_NAME,
    username,
    appUrl,
  });

  if (process.env.USE_NODEMAILER === "true") {
    await transporter.sendMail({
      from: FROM_GMAIL,
      to: email,
      subject: `Welcome to ${APP_NAME}`,
      html,
    });
  } else {
    await resend.emails.send({
      from: FROM_RESEND,
      to: email,
      subject: `Welcome to ${APP_NAME}`,
      html,
    });
  }
}

export async function sendVerificationEmail(email, username, token) {
  const verifyLink = `${process.env.APP_URL}/verify-email?token=${token}`;

  const html = verifyTpl({
    appName: APP_NAME,
    username,
    verifyLink,
  });

  try {
    if (process.env.USE_NODEMAILER === "true") {
      const res = await transporter.sendMail({
        from: FROM_GMAIL,
        to: email,
        subject: `Verify your ${APP_NAME} account`,
        html,
      });
      console.log("Gmail email sent:", res.messageId);
    } else {
      const res = await resend.emails.send({
        from: FROM_RESEND,
        to: email,
        subject: `Verify your ${APP_NAME} account`,
        html,
      });
      console.log("Resend email sent:", res);
    }
  } catch (err) {
    console.error("Verification email failed:", err);
  }
}
