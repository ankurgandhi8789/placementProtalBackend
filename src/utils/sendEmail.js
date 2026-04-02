const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Maa Savitri Consultancy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563EB; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Maa Savitri Consultancy</h1>
      </div>
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #111827;">Reset Your Password</h2>
        <p style="color: #374151;">You requested a password reset. Click the button below to reset your password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0;">Reset Password</a>
        <p style="color: #6B7280; font-size: 14px;">This link expires in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
  await sendEmail({ to: email, subject: 'Password Reset - Maa Savitri Consultancy', html });
};

module.exports = { sendEmail, sendPasswordResetEmail };
