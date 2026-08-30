/**
 * Server-Side Gmail Notification & Message Delivery Service for Cloudflare Workers
 * 
 * Handles:
 * 1. sendNewVisitorEmail: Notification when a new visitor starts the journey
 * 2. sendUserMessageEmail: Delivery of text messages, voice recordings, and video notes
 * 
 * Uses Cloudflare Workers Socket API (cloudflare:sockets) with ZERO external dependencies.
 * Secrets (SMTP_USER, SMTP_PASS, MESSAGE_RECEIVER_EMAIL) remain 100% server-side.
 */

import { connect } from 'cloudflare:sockets';

/**
 * Format timestamp into human-readable 12-hour local time string
 */
function formatTime(timestamp) {
  try {
    const d = new Date(timestamp || Date.now());
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return 'Just now';
  }
}

/**
 * Helper to split base64 strings into 76-character lines (RFC 2045)
 */
function chunkBase64(str) {
  if (!str) return '';
  const lines = [];
  for (let i = 0; i < str.length; i += 76) {
    lines.push(str.substring(i, i + 76));
  }
  return lines.join('\r\n');
}

/**
 * Helper to read an SMTP response line from a TLS socket reader
 */
async function readResponse(reader) {
  const decoder = new TextDecoder();
  let result = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
    if (result.endsWith('\r\n') || result.endsWith('\n')) {
      break;
    }
  }
  return result;
}

/**
 * Helper to write a command to an SMTP TLS socket writer
 */
async function writeCommand(writer, command) {
  const encoder = new TextEncoder();
  await writer.write(encoder.encode(command + '\r\n'));
}

/**
 * Core SMTP client for sending emails through Gmail SMTP over TLS
 */
async function executeSmtpSend({ smtpHost, smtpPort, smtpUser, smtpPass, receiverEmail, subject, htmlBody, textBody, attachments = [] }) {
  if (!smtpUser || !smtpPass) {
    console.warn('[SMTP Warning] SMTP_USER or SMTP_PASS not configured.');
    return false;
  }

  const socket = connect({ hostname: smtpHost, port: smtpPort }, { secureTransport: 'on' });
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();

  try {
    // 1. Initial Greeting
    await readResponse(reader);

    // 2. EHLO
    await writeCommand(writer, 'EHLO cloudflare.worker');
    await readResponse(reader);

    // 3. AUTH LOGIN
    await writeCommand(writer, 'AUTH LOGIN');
    await readResponse(reader);

    // 4. Base64 Username
    await writeCommand(writer, btoa(smtpUser));
    await readResponse(reader);

    // 5. Base64 Password
    await writeCommand(writer, btoa(smtpPass));
    const authRes = await readResponse(reader);
    if (!authRes.startsWith('235')) {
      throw new Error(`SMTP Auth failed: ${authRes.trim()}`);
    }

    // 6. MAIL FROM
    await writeCommand(writer, `MAIL FROM:<${smtpUser}>`);
    await readResponse(reader);

    // 7. RCPT TO
    await writeCommand(writer, `RCPT TO:<${receiverEmail}>`);
    await readResponse(reader);

    // 8. DATA
    await writeCommand(writer, 'DATA');
    await readResponse(reader);

    // 9. Construct MIME Email
    const dateHeader = new Date().toUTCString();
    let rawEmail = '';

    if (attachments.length > 0) {
      const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      rawEmail = [
        `From: "Birthday Website" <${smtpUser}>`,
        `To: <${receiverEmail}>`,
        `Subject: ${subject}`,
        `Date: ${dateHeader}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        htmlBody,
        '',
      ].join('\r\n');

      for (const att of attachments) {
        rawEmail += [
          `--${boundary}`,
          `Content-Type: ${att.contentType}; name="${att.filename}"`,
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${att.filename}"`,
          '',
          chunkBase64(att.base64Data),
          '',
        ].join('\r\n');
      }

      rawEmail += `--${boundary}--\r\n.\r\n`;
    } else {
      rawEmail = [
        `From: "Birthday Website" <${smtpUser}>`,
        `To: <${receiverEmail}>`,
        `Subject: ${subject}`,
        `Date: ${dateHeader}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        htmlBody,
        '.',
      ].join('\r\n');
    }

    await writeCommand(writer, rawEmail);
    await readResponse(reader);

    // 10. QUIT
    await writeCommand(writer, 'QUIT');
    return true;
  } finally {
    try { reader.releaseLock(); } catch {}
    try { writer.releaseLock(); } catch {}
    try { await socket.close(); } catch {}
  }
}

/**
 * Send Gmail notification email for a new visitor session
 */
export async function sendNewVisitorEmail(env, session) {
  const smtpUser = env.SMTP_USER || env.GMAIL_USER;
  const smtpPass = (env.SMTP_PASS || env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  const receiverEmail = env.MESSAGE_RECEIVER_EMAIL || smtpUser;
  const smtpHost = env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(env.SMTP_PORT || '465', 10);

  const timeStr = formatTime(session.startedAt);
  const deviceStr = (session.deviceType || 'Desktop').charAt(0).toUpperCase() + (session.deviceType || 'Desktop').slice(1);
  const countryStr = session.country || 'Unknown';
  const sectionStr = session.lastSection || 'Intro';
  const sessionIdStr = session.sessionId || 'anonymous';

  const subject = '🎂 New Visitor — Her Birthday Website';
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid rgba(255, 79, 129, 0.4); border-radius: 16px; background-color: #0B0B0F; color: #FFFFFF;">
      <h2 style="color: #FF4F81; margin: 0 0 12px 0; font-size: 20px;">🎂 New Visitor Started the Journey</h2>
      <p style="color: #9A9AA5; font-size: 13px; margin: 0 0 20px 0;">A new visitor has opened the birthday website.</p>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #FFFFFF; background-color: #12121A; border-radius: 8px; overflow: hidden;">
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5; width: 130px;">Time</td>
          <td style="padding: 10px 14px; font-weight: 500;">${timeStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Device</td>
          <td style="padding: 10px 14px; font-weight: 500;">${deviceStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Country</td>
          <td style="padding: 10px 14px; font-weight: 500;">${countryStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Current Section</td>
          <td style="padding: 10px 14px; font-weight: 500; color: #FF4F81;">${sectionStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Sections Viewed</td>
          <td style="padding: 10px 14px; font-weight: 500;">${session.sectionCount || 1}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #9A9AA5;">Session ID</td>
          <td style="padding: 10px 14px; font-family: monospace; font-size: 11px; color: #9A9AA5;">${sessionIdStr}</td>
        </tr>
      </table>

      <p style="color: #9A9AA5; font-size: 11px; margin: 24px 0 0 0; text-align: center;">Her Birthday Interactive Website ✦</p>
    </div>
  `;

  try {
    await executeSmtpSend({
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      receiverEmail,
      subject,
      htmlBody,
    });
    console.log(`[Gmail Notification Sent] Delivered to ${receiverEmail} for session: ${sessionIdStr}`);
  } catch (err) {
    console.error('[Gmail Notification Error]:', err.message || err);
  }
}

/**
 * Send user submitted message (Text, Voice Note, or Video Note) via Gmail SMTP
 */
export async function sendUserMessageEmail(env, { type = 'text', message = '', mediaData = '', mimeType = '' }) {
  const smtpUser = env.SMTP_USER || env.GMAIL_USER;
  const smtpPass = (env.SMTP_PASS || env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  const receiverEmail = env.MESSAGE_RECEIVER_EMAIL || smtpUser;
  const smtpHost = env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(env.SMTP_PORT || '465', 10);

  const submittedAt = new Date().toLocaleString('en-US');
  const timestamp = Date.now();

  let subject = '💌 New Birthday Website Message';
  let htmlBody = '';
  let attachments = [];

  if (type === 'voice') {
    subject = '🎙️ New Voice Note from Birthday Website';
    const filename = `voice-message-${timestamp}.webm`;
    const cleanBase64 = mediaData.includes('base64,') ? mediaData.split('base64,')[1] : mediaData;

    attachments.push({
      filename,
      contentType: mimeType || 'audio/webm',
      base64Data: cleanBase64,
    });

    htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #FF4F81; border-radius: 16px; background-color: #0B0B0F; color: #FFFFFF;">
        <h2 style="color: #FF4F81; margin: 0 0 8px 0; font-size: 22px;">🎙️ New Voice Note from Birthday Website</h2>
        <p style="color: #9A9AA5; font-size: 13px; margin: 0 0 20px 0;">Submitted on ${submittedAt}</p>
        <div style="padding: 24px; background-color: #1A1A24; border-radius: 10px; font-size: 16px; color: #FFFFFF; text-align: center;">
          <p style="margin: 0; font-size: 18px;">A voice recording is attached to this email! 🎙️</p>
          <p style="color: #9A9AA5; font-size: 12px; margin-top: 10px; font-family: monospace;">File: ${filename}</p>
        </div>
        <p style="color: #9A9AA5; font-size: 12px; margin-top: 24px; text-align: center;">Sent from Her Birthday Website ✦</p>
      </div>
    `;
  } else if (type === 'video') {
    subject = '🎥 New Video Message from Birthday Website';
    const filename = `video-message-${timestamp}.webm`;
    const cleanBase64 = mediaData.includes('base64,') ? mediaData.split('base64,')[1] : mediaData;

    attachments.push({
      filename,
      contentType: mimeType || 'video/webm',
      base64Data: cleanBase64,
    });

    htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #FF4F81; border-radius: 16px; background-color: #0B0B0F; color: #FFFFFF;">
        <h2 style="color: #FF4F81; margin: 0 0 8px 0; font-size: 22px;">🎥 New Video Message from Birthday Website</h2>
        <p style="color: #9A9AA5; font-size: 13px; margin: 0 0 20px 0;">Submitted on ${submittedAt}</p>
        <div style="padding: 24px; background-color: #1A1A24; border-radius: 10px; font-size: 16px; color: #FFFFFF; text-align: center;">
          <p style="margin: 0; font-size: 18px;">A video recording is attached to this email! 🎥</p>
          <p style="color: #9A9AA5; font-size: 12px; margin-top: 10px; font-family: monospace;">File: ${filename}</p>
        </div>
        <p style="color: #9A9AA5; font-size: 12px; margin-top: 24px; text-align: center;">Sent from Her Birthday Website ✦</p>
      </div>
    `;
  } else {
    // Written text message
    const sanitizedMessage = String(message)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #FF4F81; border-radius: 16px; background-color: #0B0B0F; color: #FFFFFF;">
        <h2 style="color: #FF4F81; margin: 0 0 8px 0; font-size: 22px;">💌 New Birthday Website Message</h2>
        <p style="color: #9A9AA5; font-size: 13px; margin: 0 0 20px 0;">Submitted on ${submittedAt}</p>
        <div style="padding: 20px; background-color: #1A1A24; border-radius: 10px; font-size: 16px; line-height: 1.6; color: #FFFFFF; white-space: pre-wrap;">
${sanitizedMessage}
        </div>
        <p style="color: #9A9AA5; font-size: 12px; margin-top: 24px; text-align: center;">Sent from Her Birthday Website ✦</p>
      </div>
    `;
  }

  await executeSmtpSend({
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    receiverEmail,
    subject,
    htmlBody,
    attachments,
  });

  return { success: true, recipient: receiverEmail };
}
