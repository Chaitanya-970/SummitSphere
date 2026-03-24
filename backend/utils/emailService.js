const nodemailer = require('nodemailer');
const net = require('net');

// ── SETUP ────────────────────────────────────────────────────────────────────
// Required env vars on Render backend:
//   EMAIL_USER=you@gmail.com
//   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx   ← Gmail App Password (not your login password)
//   FRONTEND_URL=https://summitsphere-gamma.vercel.app
//
// The error "ENETUNREACH IPv6" happens because Render's free tier blocks outbound
// IPv6. Gmail SMTP resolves to IPv6 by default. Fix: force IPv4 with family:4.

const SITE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4, // ← CRITICAL: forces IPv4, fixes ENETUNREACH on Render free tier
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

transporter.verify((err) => {
  if (err) {
    console.error('📧 Email error:', err.message);
  } else {
    console.log('📧 Email ready →', process.env.EMAIL_USER);
  }
});

// ── LAYOUT ───────────────────────────────────────────────────────────────────
const emailLayout = (body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f2ede4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#1a3a2a;padding:28px 36px;border-radius:16px 16px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><span style="font-family:Georgia,serif;font-style:italic;font-weight:900;font-size:22px;color:#fff;letter-spacing:-0.03em;">Summit<span style="color:#52b788;">Sphere</span></span></td>
              <td align="right"><span style="font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);">HIMALAYAN TRAILS</span></td>
            </tr></table>
          </td>
        </tr>
        <tr><td style="background:#ffffff;padding:36px;border-radius:0 0 16px 16px;">${body}</td></tr>
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="font-size:11px;color:#b5a48e;margin:0;">
              SummitSphere · India's Trekking Community<br/>
              <span style="color:#d0c9be;">You're receiving this because you're a member of SummitSphere.</span>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── WELCOME ──────────────────────────────────────────────────────────────────
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to SummitSphere 🏔️',
      html: emailLayout(`
        <h2 style="font-family:Georgia,serif;font-style:italic;font-weight:900;font-size:26px;color:#1a1208;margin:0 0 8px;">Welcome, ${userName}!</h2>
        <p style="font-size:14px;color:#8c7b65;margin:0 0 24px;">Your basecamp is ready. Start exploring India's finest treks.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          ${['Discover 25+ verified Himalayan treks','Save treks to your personal radar','Download field manuals as PDF','Write reviews and share experiences'].map(f => `
          <tr><td style="padding:8px 0;border-bottom:1px solid #ede8df;">
            <span style="font-size:16px;margin-right:10px;">✓</span>
            <span style="font-size:14px;color:#4a3f2f;font-weight:600;">${f}</span>
          </td></tr>`).join('')}
        </table>
        <a href="${SITE_URL}" style="display:inline-block;padding:13px 28px;background:#2d6a4f;color:white;border-radius:10px;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">Explore Treks →</a>
      `),
    });
    console.log('✅ Welcome email sent to', userEmail);
  } catch (err) {
    console.error('❌ Welcome email failed:', err.message);
  }
};

// ── BOOKING ──────────────────────────────────────────────────────────────────
const sendBookingEmail = async (userEmail, userName, trekName, trekDetails = {}) => {
  const { duration, difficulty, maxAltitude, trekDate, groupSize } = trekDetails;
  const formattedDate = trekDate ? new Date(trekDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD';
  try {
    await transporter.sendMail({
      from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed — ${trekName} 🏔️`,
      html: emailLayout(`
        <div style="display:inline-block;padding:4px 12px;background:#d8f3dc;border-radius:20px;margin-bottom:16px;">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2d6a4f;">Booking Confirmed ✓</span>
        </div>
        <h2 style="font-family:Georgia,serif;font-style:italic;font-weight:900;font-size:26px;color:#1a1208;margin:0 0 4px;">${trekName}</h2>
        <p style="font-size:14px;color:#8c7b65;margin:0 0 24px;">Hi ${userName}, your slot has been logged.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:12px;padding:20px;margin-bottom:24px;">
          ${[['Trek Date',formattedDate],['Duration',duration?`${duration} Days`:'—'],['Difficulty',difficulty||'—'],['Max Altitude',maxAltitude?`${maxAltitude} ft`:'—'],['Group Size',groupSize?`${groupSize} people`:'—']].map(([l,v]) => `
          <tr>
            <td style="padding:7px 0;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#b5a48e;width:140px;">${l}</td>
            <td style="padding:7px 0;font-size:14px;font-weight:700;color:#1a1208;">${v}</td>
          </tr>`).join('')}
        </table>
        <a href="${SITE_URL}" style="display:inline-block;padding:12px 24px;background:#2d6a4f;color:white;border-radius:10px;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">View on SummitSphere →</a>
      `),
    });
    console.log('✅ Booking email sent to', userEmail);
  } catch (err) {
    console.error('❌ Booking email failed:', err.message);
  }
};

// ── TREK CREATED ─────────────────────────────────────────────────────────────
const sendTrekCreatedEmail = async (adminEmail, trekName) => {
  try {
    await transporter.sendMail({
      from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Trek Submitted — ${trekName}`,
      html: emailLayout(`
        <h2 style="font-family:Georgia,serif;font-style:italic;font-weight:900;font-size:24px;color:#1a1208;margin:0 0 8px;">New Trek in Queue</h2>
        <p style="font-size:14px;color:#8c7b65;margin:0 0 20px;"><strong style="color:#1a1208;">${trekName}</strong> is awaiting review.</p>
        <a href="${SITE_URL}/admin" style="display:inline-block;padding:12px 24px;background:#2d6a4f;color:white;border-radius:10px;font-weight:700;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">Review in Dashboard →</a>
      `),
    });
  } catch (err) {
    console.error('❌ Trek created email failed:', err.message);
  }
};

// ── PASSWORD RESET ────────────────────────────────────────────────────────────
const sendResetEmail = async (userEmail, userName, resetUrl) => {
  try {
    await transporter.sendMail({
      from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Reset Your SummitSphere Password',
      html: emailLayout(`
        <h2 style="font-family:Georgia,serif;font-style:italic;font-weight:900;font-size:24px;color:#1a1208;margin:0 0 8px;">Password Reset</h2>
        <p style="font-size:14px;color:#8c7b65;margin:0 0 24px;">Hi ${userName}, click below to reset your password. This link expires in 60 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:13px 28px;background:#c0392b;color:white;border-radius:10px;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;margin-bottom:20px;">Reset Password →</a>
        <p style="font-size:12px;color:#b5a48e;margin:16px 0 0;">If you didn't request this, ignore this email.</p>
      `),
    });
    console.log('✅ Reset email sent to', userEmail);
  } catch (err) {
    console.error('❌ Reset email failed:', err.message);
  }
};

module.exports = { sendWelcomeEmail, sendTrekCreatedEmail, sendBookingEmail, sendResetEmail };