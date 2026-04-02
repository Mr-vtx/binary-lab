import { Resend } from "resend";
import nodemailer from "nodemailer";
import { resetPasswordTemplate } from "../emails/templates/resetPassword.js";

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

export async function sendPasswordResetEmail(email, username, token) {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

  const html = resetPasswordTemplate({
    appName: process.env.APP_NAME || "BINARY_LAB",
    username,
    resetLink,
  });

  if (process.env.USE_NODEMAILER === "true") {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Reset your ${process.env.APP_NAME} password`,
      html,
    });
  } else {
    await resend.emails.send({
      from: `${process.env.APP_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: `Reset your ${process.env.APP_NAME} password`,
      html,
    });
  }
}