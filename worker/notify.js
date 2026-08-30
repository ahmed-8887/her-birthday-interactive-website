/**
 * Server-Side Gmail Notification Service for Cloudflare Workers
 * 
 * Sends a single notification email via Gmail SMTP (SSL/TLS on port 465)
 * when a new visitor starts the birthday experience.
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
 * Helper to read an SMTP response line from a TLS socket reader
 */
async function readResponse(reader) {
  const decoder = new TextDecoder();
  let result = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
    // Multi-line or single-line SMTP response completion
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
 * Send Gmail notification email for a new visitor session
 * 
 * @param {Object} env - Cloudflare Worker environment variables / secrets
 * @param {Object} session - { sessionId, startedAt, deviceType, country, lastSection, sectionCount }
 */
export async function sendNewVisitorEmail(env, session) {
  const smtpUser = env.SMTP_USER || env.GMAIL_USER;
  const smtpPass = (env.SMTP_PASS || env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  const receiverEmail = env.MESSAGE_RECEIVER_EMAIL || smtpUser;
  const smtpHost = env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(env.SMTP_PORT || '465', 10);

  if (!smtpUser || !smtpPass) {
    console.warn('[Gmail Notification] SMTP_USER or SMTP_PASS not configured. Skipping email.');
    return;
  }

  const timeStr = formatTime(session.startedAt);
  const deviceStr = (session.deviceType || 'Desktop').charAt(0).toUpperCase() + (session.deviceType || 'Desktop').slice(1);
  const countryStr = session.country || 'Unknown';
  const sectionStr = session.lastSection || 'Intro';
  const sessionIdStr = session.sessionId || 'anonymous';

  const subject = '🎂 New Visitor — Her Birthday Website';
  const textBody = [
    'A new visitor has started the birthday experience.',
    '',
    `Time: ${timeStr}`,
    `Device: ${deviceStr}`,
    `Country: ${countryStr}`,
    `Current section: ${sectionStr}`,
    `Sections viewed: ${session.sectionCount || 1}`,
    `Session ID: ${sessionIdStr}`,
    '',
    '---',
    'Her Birthday Interactive Website ✦',
  ].join('\r\n');

  try {
    // Open secure TLS connection to Gmail SMTP server
    const socket = connect({ hostname: smtpHost, port: smtpPort }, { secureTransport: 'on' });
    const reader = socket.readable.getReader();
    const writer = socket.writable.getWriter();

    try {
      // 1. Initial Greeting
      await readResponse(reader);

      // 2. EHLO
      await writeCommand(writer, `EHLO cloudflare.worker`);
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

      // 9. Send Email Message Content
      const dateHeader = new Date().toUTCString();
      const rawEmail = [
        `From: "Birthday Website" <${smtpUser}>`,
        `To: <${receiverEmail}>`,
        `Subject: ${subject}`,
        `Date: ${dateHeader}`,
        'Content-Type: text/plain; charset=UTF-8',
        'MIME-Version: 1.0',
        '',
        textBody,
        '.',
      ].join('\r\n');

      await writeCommand(writer, rawEmail);
      await readResponse(reader);

      // 10. QUIT
      await writeCommand(writer, 'QUIT');
      console.log(`[Gmail Notification Sent] Delivered to ${receiverEmail} for session: ${sessionIdStr}`);
    } finally {
      try { reader.releaseLock(); } catch {}
      try { writer.releaseLock(); } catch {}
      try { await socket.close(); } catch {}
    }
  } catch (err) {
    console.error('[Gmail Notification Error]:', err.message || err);
  }
}
