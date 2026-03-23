const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── SHARED LAYOUT WRAPPER ──
const emailLayout = (body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SummitSphere</title>
</head>
<body style="margin:0;padding:0;background:#f2ede4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:#1a3a2a;padding:28px 36px;border-radius:16px 16px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;font-style:italic;color:#ffffff;letter-spacing:-0.04em;">
                      Summit<span style="color:#52b788;">Sphere</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#52b788;">
                      India's Trail Network
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:36px;border-left:1px solid #e5ddd0;border-right:1px solid #e5ddd0;">
              ${body}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f5f0e8;padding:20px 36px;border:1px solid #e5ddd0;border-radius:0 0 16px 16px;border-top:2px solid #e5ddd0;">
              <p style="margin:0;font-size:11px;color:#8c7b65;line-height:1.6;">
                You're receiving this because you're a member of SummitSphere.<br/>
                &copy; ${new Date().getFullYear()} SummitSphere &middot; Built by Chaitanya Bhardwaj
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── SHARED ELEMENTS ──
const greenBtn = (url, label) => `
  <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background:#2d6a4f;border-radius:12px;">
        <a href="${url}" style="display:inline-block;padding:14px 28px;background:#2d6a4f;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;border-radius:12px;">${label}</a>
      </td>
    </tr>
  </table>`;

const statPill = (label, value) => `
  <td style="text-align:center;padding:0 12px;">
    <div style="background:#f2ede4;border-radius:10px;padding:12px 18px;border:1px solid #e5ddd0;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#8c7b65;margin-bottom:4px;">${label}</div>
      <div style="font-size:15px;font-weight:900;color:#1a1208;">${value}</div>
    </div>
  </td>`;

const divider = () => `<hr style="border:none;border-top:1px solid #ede8df;margin:24px 0;" />`;

// ══════════════════════════════════════════
// 1. WELCOME EMAIL
// ══════════════════════════════════════════
const sendWelcomeEmail = async (userEmail, userName) => {
  const html = emailLayout(`
    <h1 style="font-size:28px;font-weight:900;font-style:italic;color:#1a1208;letter-spacing:-0.03em;margin:0 0 8px;">
      Welcome aboard, ${userName}.
    </h1>
    <p style="font-size:13px;color:#8c7b65;margin:0 0 24px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">
      Your basecamp is ready
    </p>

    <p style="font-size:15px;color:#4a3f2f;line-height:1.75;margin:0 0 16px;">
      You've just joined thousands of trekkers who use SummitSphere to discover, plan and share India's finest mountain trails.
    </p>
    <p style="font-size:15px;color:#4a3f2f;line-height:1.75;margin:0 0 24px;">
      Here's what you can do right now:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:12px;background:#f5f0e8;border-radius:10px;border-left:3px solid #2d6a4f;margin-bottom:8px;display:block;">
          <strong style="color:#1a1208;">🏔 Explore Treks</strong>
          <span style="color:#8c7b65;font-size:13px;"> — Browse 25+ verified Himalayan expeditions</span>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px;background:#f5f0e8;border-radius:10px;border-left:3px solid #2d6a4f;">
          <strong style="color:#1a1208;">🔖 Save & Book</strong>
          <span style="color:#8c7b65;font-size:13px;"> — Bookmark treks and reserve your slot</span>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px;background:#f5f0e8;border-radius:10px;border-left:3px solid #2d6a4f;">
          <strong style="color:#1a1208;">✍️ Share Experiences</strong>
          <span style="color:#8c7b65;font-size:13px;"> — Write reviews and add your own treks</span>
        </td>
      </tr>
    </table>

    ${greenBtn('http://localhost:5173/', 'Start Exploring')}
    ${divider()}
    <p style="font-size:12px;color:#b5a48e;margin:0;">Happy trails, ${userName}. The mountains are waiting.</p>
  `);

  return transporter.sendMail({
    from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Welcome to SummitSphere, ${userName} 🏔`,
    html,
  });
};

// ══════════════════════════════════════════
// 2. TREK CREATED EMAIL (Admin notification)
// ══════════════════════════════════════════
const sendTrekCreatedEmail = async (adminEmail, trekName) => {
  const html = emailLayout(`
    <div style="display:inline-block;padding:4px 12px;background:#d8f3dc;border-radius:20px;margin-bottom:16px;">
      <span style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2d6a4f;">New Trek Published</span>
    </div>
    <h1 style="font-size:26px;font-weight:900;font-style:italic;color:#1a1208;letter-spacing:-0.03em;margin:0 0 20px;">
      "${trekName}" is now live.
    </h1>
    <p style="font-size:15px;color:#4a3f2f;line-height:1.75;margin:0 0 20px;">
      A new expedition has been successfully published to the SummitSphere database and is visible to all explorers.
    </p>
    ${greenBtn('http://localhost:5173/', 'View on SummitSphere')}
  `);

  return transporter.sendMail({
    from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Trek Published: ${trekName}`,
    html,
  });
};

// ══════════════════════════════════════════
// 3. BOOKING CONFIRMED EMAIL
// ══════════════════════════════════════════
const sendBookingEmail = async (userEmail, userName, trekName, trekDetails = {}) => {
  const { duration, difficulty, maxAltitude, trekDate, groupSize } = trekDetails;

  const html = emailLayout(`
    <div style="display:inline-block;padding:4px 12px;background:#d8f3dc;border-radius:20px;margin-bottom:16px;">
      <span style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2d6a4f;">Booking Confirmed ✓</span>
    </div>
    <h1 style="font-size:26px;font-weight:900;font-style:italic;color:#1a1208;letter-spacing:-0.03em;margin:0 0 6px;">
      You're on the roster, ${userName}.
    </h1>
    <p style="font-size:14px;color:#8c7b65;margin:0 0 24px;">${trekName}</p>

    ${(duration || difficulty || maxAltitude) ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        ${duration    ? statPill('Duration', `${duration} Days`) : ''}
        ${difficulty  ? statPill('Difficulty', difficulty)       : ''}
        ${maxAltitude ? statPill('Altitude', `${maxAltitude} ft`) : ''}
        ${groupSize   ? statPill('Group', groupSize)             : ''}
      </tr>
    </table>` : ''}

    ${trekDate ? `<p style="font-size:13px;color:#4a3f2f;margin:0 0 24px;padding:12px 16px;background:#f5f0e8;border-radius:10px;border-left:3px solid #2d6a4f;">
      <strong>Trek Date:</strong> ${new Date(trekDate).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
    </p>` : ''}

    <p style="font-size:15px;color:#4a3f2f;line-height:1.75;margin:0 0 20px;">
      Our team will be in touch with a final briefing pack before your expedition. In the meantime, download your field manual from the trek page for packing and safety guides.
    </p>
    ${greenBtn('http://localhost:5173/', 'View Your Booking')}
    ${divider()}
    <p style="font-size:12px;color:#b5a48e;margin:0;">Gear up and get ready. The summit is waiting.</p>
  `);

  return transporter.sendMail({
    from: `"SummitSphere" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Booking Confirmed: ${trekName} 🏔`,
    html,
  });
};

// ══════════════════════════════════════════
// 4. PASSWORD RESET EMAIL
// ══════════════════════════════════════════
const sendResetEmail = async (userEmail, userName, resetUrl) => {
  const html = emailLayout(`
    <div style="display:inline-block;padding:4px 12px;background:#fde8e6;border-radius:20px;margin-bottom:16px;">
      <span style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#c0392b;">Security Alert</span>
    </div>
    <h1 style="font-size:26px;font-weight:900;font-style:italic;color:#1a1208;letter-spacing:-0.03em;margin:0 0 6px;">
      Reset your password
    </h1>
    <p style="font-size:14px;color:#8c7b65;margin:0 0 24px;">Hi ${userName}, we received a password reset request for your account.</p>

    <p style="font-size:15px;color:#4a3f2f;line-height:1.75;margin:0 0 24px;">
      Click the button below to set a new password. This link is valid for <strong>60 minutes</strong> only.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background:#c0392b;border-radius:12px;">
          <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background:#c0392b;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;border-radius:12px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    ${divider()}
    <p style="font-size:12px;color:#b5a48e;margin:0;line-height:1.6;">
      If you didn't request this, you can safely ignore this email — your password will remain unchanged.<br/>
      For security, never share this link with anyone.
    </p>
  `);

  return transporter.sendMail({
    from: `"SummitSphere Security" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Reset your SummitSphere password`,
    html,
  });
};

module.exports = { sendWelcomeEmail, sendTrekCreatedEmail, sendBookingEmail, sendResetEmail };