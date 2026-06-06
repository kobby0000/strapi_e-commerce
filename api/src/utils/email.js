const nodemailer = require("nodemailer");

const env = require("../config/env");

const createTransporter = () => {
  if (env.EMAIL_DELIVERY_MODE !== "smtp") return null;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
};

const sendEmail = async ({ to, subject, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[email:${subject}] to=${to} ${text}`);
    return;
  }

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
  });
};

const sendVerificationEmail = (user, verificationUrl) =>
  sendEmail({
    to: user.email,
    subject: "Verify your CircuitCart email",
    text: `Verify your email by opening this link: ${verificationUrl}`,
  });

const sendPasswordResetEmail = (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: "Reset your CircuitCart password",
    text: `Reset your password by opening this link: ${resetUrl}`,
  });

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
};
