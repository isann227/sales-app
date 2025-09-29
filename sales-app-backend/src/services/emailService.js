const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail({ to, name, verifyUrl }) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verifikasi Email Akun Anda",
    html: `<p>Hi ${name},</p>
      <p>Silakan klik link berikut untuk verifikasi email Anda:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Link berlaku 1x24 jam.</p>`,
  });
}

module.exports = { sendVerificationEmail };