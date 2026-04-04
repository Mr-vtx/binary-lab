import { Resend } from "resend";
import nodemailer from "nodemailer";
import { resetPasswordTemplate as resetTpl } from "../emails/templates/resetPassword.js";
import { welcomeVerifyTemplate } from "../emails/templates/welcomeEmail.js";

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

export async function sendWelcomeAndVerificationEmail(email, username, token) {
  const verifyLink = `${process.env.APP_URL}/verify-email?token=${token}`;
  const appUrl = process.env.APP_URL;

  const html = welcomeVerifyTemplate({
    appName: APP_NAME,
    username,
    verifyLink,
    appUrl,
  });

  const mailOptions = {
    from: FROM_RESEND,
    to: email,
    subject: `Welcome to ${APP_NAME} — Verify your account`,
    html,
  };

  if (process.env.USE_NODEMAILER === "true") {
    await transporter.sendMail(mailOptions);
  } else {
    await resend.emails.send(mailOptions);
  }
}