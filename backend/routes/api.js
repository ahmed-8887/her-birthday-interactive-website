import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const messagesDir = path.join(__dirname, '..', 'messages');

// Ensure local messages storage directory exists
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

const router = express.Router();

// Simple in-memory rate limiter: max 10 requests per 15 minutes per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const userRecord = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - userRecord.startTime > RATE_LIMIT_WINDOW_MS) {
    userRecord.count = 1;
    userRecord.startTime = now;
  } else {
    userRecord.count += 1;
  }

  rateLimitMap.set(ip, userRecord);

  if (userRecord.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: 'Too many messages sent. Please wait a few minutes before trying again 💌',
    });
  }

  next();
};

// Helper: Sanitize string against HTML/Script/Header injection
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Health Check Route
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Her Birthday API Service',
    timestamp: new Date().toISOString(),
  });
});

// API Info Endpoint
router.get('/info', (req, res) => {
  res.json({
    name: 'Her Birthday API',
    version: '0.2.0',
    description: 'Multimedia Backend service for Her Birthday interactive website',
  });
});

// In-memory visitor analytics store for local development
const localSessions = new Map();
const localEvents = [];

// Helper: Format timestamp into Pakistan Standard Time (PKT - Asia/Karachi, UTC+05:00)
const formatPakistanDateTime = (timestamp) => {
  try {
    const d = new Date(timestamp || Date.now());
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return {
      time: timeFormatter.format(d),
      date: dateFormatter.format(d),
      timezone: 'PKT (UTC+05:00)',
    };
  } catch {
    return {
      time: '12:00 PM',
      date: 'Today',
      timezone: 'PKT (UTC+05:00)',
    };
  }
};

// Canonical sections of the Birthday Experience
const CANONICAL_SECTIONS = [
  { key: 'Intro', name: '1. Welcome (Intro)' },
  { key: 'Star Journey', name: '2. Interactive Star Journey' },
  { key: 'Gift', name: '3. Secret Gift Box' },
  { key: 'Memories', name: '4. Heartfelt Message (Memories)' },
  { key: 'Messages', name: '5. Personal Messages Sequence' },
  { key: 'Birthday Reveal', name: '6. Birthday Candle Reveal' },
  { key: 'Message Form', name: '7. Message & Voice Note Form' },
  { key: 'Universe', name: '8. Our Little Universe' },
];

// Helper: Format duration in readable string (e.g., "3 minutes 42 seconds")
const formatDurationString = (seconds) => {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return `${mins} minute${mins === 1 ? '' : 's'}`;
  }
  return `${mins} minute${mins === 1 ? '' : 's'} ${secs} second${secs === 1 ? '' : 's'}`;
};

// Helper: Send Gmail notification when visitor completes/ends the show
const sendVisitorCompletedNotification = async (session) => {
  if (!session || session.completedEmailSent) return;
  session.completedEmailSent = true;

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const recipientEmail = process.env.MESSAGE_RECEIVER_EMAIL || smtpUser;

  const durationSeconds = Math.max(0, Math.round(((session.lastActivity || Date.now()) - session.startedAt) / 1000));
  const durationStr = formatDurationString(durationSeconds);
  const startFormatted = formatPakistanDateTime(session.startedAt);
  const endFormatted = formatPakistanDateTime(session.lastActivity || Date.now());

  const deviceStr = (session.deviceType || 'Desktop').charAt(0).toUpperCase() + (session.deviceType || 'Desktop').slice(1);
  const countryStr = session.country || 'Local / Unknown';
  const sessionIdStr = session.sessionId;

  // Gather unique visited sections
  const eventsForSession = localEvents.filter((e) => e.sessionId === session.sessionId);
  const visitedSet = new Set(eventsForSession.map((e) => e.sectionName));

  const checklist = CANONICAL_SECTIONS.map((sec) => {
    const visited = visitedSet.has(sec.key) || visitedSet.has(sec.name) || Array.from(visitedSet).some((v) => v.toLowerCase().includes(sec.key.toLowerCase()));
    return { name: sec.name, visited };
  });

  const openedPortionsCount = checklist.filter((c) => c.visited).length;
  const totalPortions = CANONICAL_SECTIONS.length;

  if (!smtpUser || !smtpPass) {
    console.log(`[Local Notification Notice] Visitor ended show: ${sessionIdStr}, Duration: ${durationStr}, Portions: ${openedPortionsCount}/${totalPortions}. (Add SMTP credentials to send real Gmail)`);
    return;
  }

  const checklistHtml = checklist.map((item) => {
    const isVisited = item.visited;
    const icon = isVisited ? '✓' : '✗';
    const iconColor = isVisited ? '#10B981' : '#EF4444';
    const textColor = isVisited ? '#FFFFFF' : '#9A9AA5';
    const bgBadge = isVisited ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)';

    return `
      <tr style="border-bottom: 1px solid #1F1F2E;">
        <td style="padding: 10px 14px; width: 32px; text-align: center;">
          <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; border-radius: 50%; background-color: ${bgBadge}; color: ${iconColor}; font-weight: bold; font-size: 13px;">${icon}</span>
        </td>
        <td style="padding: 10px 14px; color: ${textColor}; font-size: 14px; font-weight: ${isVisited ? '600' : '400'};">
          ${item.name}
        </td>
        <td style="padding: 10px 14px; text-align: right; font-size: 12px; color: ${isVisited ? '#10B981' : '#EF4444'};">
          ${isVisited ? 'Opened' : 'Not Opened'}
        </td>
      </tr>
    `;
  }).join('');

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #FF4F81; border-radius: 16px; background-color: #0B0B0F; color: #FFFFFF;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #1F1F2E;">
        <h2 style="color: #FF4F81; margin: 0 0 6px 0; font-size: 24px;">🎂 Visitor Journey Summary</h2>
        <p style="color: #9A9AA5; font-size: 13px; margin: 0;">Her Birthday Interactive Website — Show Ended</p>
      </div>

      <!-- Quick Metrics Highlight -->
      <table style="width: 100%; border-collapse: separate; border-spacing: 12px; margin-bottom: 10px;">
        <tr>
          <td style="padding: 14px; background-color: #161622; border-radius: 10px; text-align: center; border: 1px solid rgba(255, 79, 129, 0.3); width: 50%;">
            <div style="color: #9A9AA5; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Total Time Spent</div>
            <div style="color: #FF4F81; font-size: 18px; font-weight: bold; margin-top: 4px;">${durationStr}</div>
          </td>
          <td style="padding: 14px; background-color: #161622; border-radius: 10px; text-align: center; border: 1px solid rgba(255, 79, 129, 0.3); width: 50%;">
            <div style="color: #9A9AA5; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Portions Opened</div>
            <div style="color: #10B981; font-size: 18px; font-weight: bold; margin-top: 4px;">${openedPortionsCount} / ${totalPortions}</div>
          </td>
        </tr>
      </table>

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #FFFFFF; background-color: #12121A; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5; width: 140px;">Time Started</td>
          <td style="padding: 10px 14px; font-weight: 500;">${startFormatted.time} (${startFormatted.date})</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Time Ended</td>
          <td style="padding: 10px 14px; font-weight: 500;">${endFormatted.time} (${endFormatted.date})</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Duration</td>
          <td style="padding: 10px 14px; font-weight: 600; color: #FF4F81;">${durationStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Portions Opened</td>
          <td style="padding: 10px 14px; font-weight: bold; color: #10B981;">${openedPortionsCount} of ${totalPortions} sections</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Device</td>
          <td style="padding: 10px 14px;">${deviceStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1F1F2E;">
          <td style="padding: 10px 14px; color: #9A9AA5;">Last Section</td>
          <td style="padding: 10px 14px; color: #FF4F81;">${session.lastSection || 'Universe'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #9A9AA5;">Session ID</td>
          <td style="padding: 10px 14px; font-family: monospace; font-size: 11px; color: #9A9AA5;">${sessionIdStr}</td>
        </tr>
      </table>

      <!-- Portions Opened Checklist -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #FF4F81; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Portions Opened Checklist</h3>
        <table style="width: 100%; border-collapse: collapse; background-color: #12121A; border-radius: 10px; overflow: hidden;">
          ${checklistHtml}
        </table>
      </div>

      <p style="color: #6B7280; font-size: 12px; text-align: center; margin-top: 24px;">
        Her Birthday Interactive Website ✦ Automatic Summary Notification
      </p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass.replace(/\s+/g, ''),
      },
    });

    await transporter.sendMail({
      from: `"Birthday Website" <${smtpUser}>`,
      to: recipientEmail,
      subject: `🎂 Visitor Journey Summary — ${openedPortionsCount}/${totalPortions} Portions Opened (${durationStr})`,
      html: htmlBody,
    });
    console.log(`[Gmail Summary Sent] Delivered to ${recipientEmail} for session: ${sessionIdStr} (Duration: ${durationStr}, Portions: ${openedPortionsCount}/${totalPortions})`);
  } catch (err) {
    console.error('[Gmail Summary Error]:', err.message);
  }
};

// Helper: Send Gmail notification for new visitor session
const sendNewVisitorNotification = async (session) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const recipientEmail = process.env.MESSAGE_RECEIVER_EMAIL || smtpUser;

  const { time, date, timezone } = formatPakistanDateTime(session.startedAt);
  const deviceStr = (session.deviceType || 'Desktop').charAt(0).toUpperCase() + (session.deviceType || 'Desktop').slice(1);
  const countryStr = session.country || 'Local / Unknown';

  if (!smtpUser || !smtpPass) {
    console.log(`[Local Notification Notice] New visitor session started: ${session.sessionId} at ${time} (${timezone}, ${session.deviceType}, section: ${session.lastSection}). (Add SMTP credentials to .env to send real Gmail notification to ${recipientEmail})`);
    return;
  }

  const textBody = [
    'A new visitor has started the birthday experience.',
    '',
    `Time: ${time}`,
    `Date: ${date}`,
    `Timezone: ${timezone}`,
    `Device: ${deviceStr}`,
    `Country: ${countryStr}`,
    `Current section: ${session.lastSection || 'Intro'}`,
    `Sections viewed: ${session.sectionCount || 1}`,
    `Session ID: ${session.sessionId}`,
    '',
    '---',
    'Her Birthday Interactive Website ✦',
  ].join('\n');

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass.replace(/\s+/g, ''),
      },
    });

    await transporter.sendMail({
      from: `"Birthday Website" <${smtpUser}>`,
      to: recipientEmail,
      subject: '🎂 New Visitor — Her Birthday Website',
      text: textBody,
    });
    console.log(`[Gmail Notification Sent] New visitor email delivered to ${recipientEmail}`);
  } catch (err) {
    console.error('[Gmail Notification Error]:', err.message);
  }
};

// POST /api/track Endpoint
router.post('/track', async (req, res) => {
  try {
    const { sessionId, event = 'visit_started', section = 'Intro', deviceType = 'desktop', timestamp = Date.now() } = req.body;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid sessionId' });
    }

    const safeSessionId = String(sessionId).slice(0, 100);
    const safeEvent = String(event).slice(0, 100);
    const safeSection = String(section).slice(0, 100);
    const safeDevice = String(deviceType).slice(0, 50);

    const isExisting = localSessions.has(safeSessionId);

    if (!isExisting) {
      // 1. New Visitor Session
      const sessionData = {
        sessionId: safeSessionId,
        startedAt: timestamp,
        lastActivity: timestamp,
        deviceType: safeDevice,
        country: 'Local',
        sectionCount: 1,
        lastSection: safeSection,
        completedEmailSent: false,
      };

      localSessions.set(safeSessionId, sessionData);
      localEvents.push({
        sessionId: safeSessionId,
        eventName: safeEvent,
        sectionName: safeSection,
        timestamp,
      });

      // Send ONE Gmail notification asynchronously
      sendNewVisitorNotification(sessionData).catch(() => {});

      return res.json({ success: true, isNewSession: true });
    }

    // 2. Existing Session
    const session = localSessions.get(safeSessionId);
    session.lastActivity = timestamp;

    const alreadyRecorded = localEvents.some(
      (e) => e.sessionId === safeSessionId && e.eventName === safeEvent && e.sectionName === safeSection
    );

    if (!alreadyRecorded) {
      localEvents.push({
        sessionId: safeSessionId,
        eventName: safeEvent,
        sectionName: safeSection,
        timestamp,
      });
      session.sectionCount += 1;
      session.lastSection = safeSection;
    }

    // Check if visitor ended the show / closed universe
    if (safeEvent === 'show_ended' || safeSection === 'Universe Close' || safeSection === 'Universe End') {
      sendVisitorCompletedNotification(session).catch(() => {});
    }

    return res.json({ success: true, isNewSession: false });
  } catch (err) {
    console.error('[Track Error]:', err);
    return res.status(200).json({ success: false, error: err.message });
  }
});

// GET /api/journey/:sessionId Endpoint
router.get('/journey/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = localSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }

  const events = localEvents
    .filter((e) => e.sessionId === sessionId)
    .sort((a, b) => a.timestamp - b.timestamp);

  const durationSeconds = Math.max(0, Math.round((session.lastActivity - session.startedAt) / 1000));

  res.json({
    success: true,
    journey: {
      ...session,
      startedAt: new Date(session.startedAt).toISOString(),
      lastActivity: new Date(session.lastActivity).toISOString(),
      durationSeconds,
      events,
    },
  });
});

// GET /api/sessions Endpoint
router.get('/sessions', (req, res) => {
  const sessions = Array.from(localSessions.values()).reverse();
  res.json({ success: true, sessions });
});

// POST /api/send-message Endpoint (supports text, voice recording, and video recording)
router.post('/send-message', rateLimiter, async (req, res) => {
  try {
    const { type = 'text', message = '', mediaData = '', mimeType = '' } = req.body;

    const submittedAt = new Date().toLocaleString('en-US');
    const timestamp = Date.now();

    let attachments = [];
    let savedFilePath = null;
    let textContent = '';
    let htmlContent = '';

    // Destination email strictly from server environment configuration
    const recipientEmail = process.env.MESSAGE_RECEIVER_EMAIL || 'ahmedhassanbutt8887@gmail.com';

    // 1. Handle Voice Note
    if (type === 'voice') {
      if (!mediaData || typeof mediaData !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Please record a voice message first 🎙️',
        });
      }

      // Convert base64 data to buffer
      const base64Content = mediaData.includes('base64,') ? mediaData.split('base64,')[1] : mediaData;
      const audioBuffer = Buffer.from(base64Content, 'base64');
      const filename = `voice-message-${timestamp}.webm`;
      savedFilePath = path.join(messagesDir, filename);

      fs.writeFileSync(savedFilePath, audioBuffer);
      console.log(`[Voice Note Saved] ${savedFilePath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);

      attachments.push({
        filename: filename,
        content: audioBuffer,
        contentType: mimeType || 'audio/webm',
      });

      textContent = `💌 New Voice Note from Birthday Website\n\nType: Voice Recording\nSubmitted: ${submittedAt}\nAttachment: ${filename}\n`;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FF4F81; border-radius: 12px; background-color: #0B0B0F; color: #FFFFFF;">
          <h2 style="color: #FF4F81; margin-bottom: 5px;">🎙️ New Voice Note from Birthday Website</h2>
          <p style="color: #9A9AA5; font-size: 14px; margin-bottom: 20px;">Submitted on ${submittedAt}</p>
          <div style="padding: 20px; background-color: #1A1A24; border-radius: 8px; font-size: 16px; color: #FFFFFF; text-align: center;">
            <p style="margin: 0; font-size: 18px;">A voice recording is attached to this email! 🎙️</p>
            <p style="color: #9A9AA5; font-size: 13px; margin-top: 10px;">File: ${filename}</p>
          </div>
          <p style="color: #9A9AA5; font-size: 12px; margin-top: 25px; text-align: center;">Sent from Her Birthday Website ✦</p>
        </div>
      `;
    } 
    // 2. Handle Video Message
    else if (type === 'video') {
      if (!mediaData || typeof mediaData !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Please record a video message first 🎥',
        });
      }

      // Convert base64 data to buffer
      const base64Content = mediaData.includes('base64,') ? mediaData.split('base64,')[1] : mediaData;
      const videoBuffer = Buffer.from(base64Content, 'base64');
      const filename = `video-message-${timestamp}.webm`;
      savedFilePath = path.join(messagesDir, filename);

      fs.writeFileSync(savedFilePath, videoBuffer);
      console.log(`[Video Message Saved] ${savedFilePath} (${(videoBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

      attachments.push({
        filename: filename,
        content: videoBuffer,
        contentType: mimeType || 'video/webm',
      });

      textContent = `💌 New Video Message from Birthday Website\n\nType: Video Recording\nSubmitted: ${submittedAt}\nAttachment: ${filename}\n`;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FF4F81; border-radius: 12px; background-color: #0B0B0F; color: #FFFFFF;">
          <h2 style="color: #FF4F81; margin-bottom: 5px;">🎥 New Video Message from Birthday Website</h2>
          <p style="color: #9A9AA5; font-size: 14px; margin-bottom: 20px;">Submitted on ${submittedAt}</p>
          <div style="padding: 20px; background-color: #1A1A24; border-radius: 8px; font-size: 16px; color: #FFFFFF; text-align: center;">
            <p style="margin: 0; font-size: 18px;">A video recording is attached to this email! 🎥</p>
            <p style="color: #9A9AA5; font-size: 13px; margin-top: 10px;">File: ${filename}</p>
          </div>
          <p style="color: #9A9AA5; font-size: 12px; margin-top: 25px; text-align: center;">Sent from Her Birthday Website ✦</p>
        </div>
      `;
    } 
    // 3. Handle Written Text Message
    else {
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Please write a little message first 💌',
        });
      }

      if (message.length > 3000) {
        return res.status(400).json({
          success: false,
          error: 'Message exceeds the maximum limit of 3000 characters.',
        });
      }

      const sanitizedMessage = sanitizeInput(message.trim());
      const textFilename = `text-message-${timestamp}.txt`;
      savedFilePath = path.join(messagesDir, textFilename);
      fs.writeFileSync(savedFilePath, `Submitted: ${submittedAt}\n\nMessage:\n${message.trim()}\n`);

      textContent = `💌 New Birthday Website Message\n\nSubmitted: ${submittedAt}\n\nMessage:\n----------------------------------------\n${sanitizedMessage}\n----------------------------------------\n`;
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FF4F81; border-radius: 12px; background-color: #0B0B0F; color: #FFFFFF;">
          <h2 style="color: #FF4F81; margin-bottom: 5px;">💌 New Birthday Website Message</h2>
          <p style="color: #9A9AA5; font-size: 14px; margin-bottom: 20px;">Submitted on ${submittedAt}</p>
          <div style="padding: 20px; background-color: #1A1A24; border-radius: 8px; font-size: 16px; line-height: 1.6; color: #FFFFFF; white-space: pre-wrap;">
${sanitizedMessage}
          </div>
          <p style="color: #9A9AA5; font-size: 12px; margin-top: 25px; text-align: center;">Sent from Her Birthday Website ✦</p>
        </div>
      `;
    }

    // Configure Nodemailer Transport
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass.replace(/\s+/g, ''),
          },
        });

        const mailOptions = {
          from: `"Birthday Website" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: recipientEmail,
          subject: type === 'voice' ? '🎙️ New Voice Note from Birthday Website' : type === 'video' ? '🎥 New Video Message from Birthday Website' : '💌 New Birthday Website Message',
          text: textContent,
          html: htmlContent,
          attachments: attachments,
        };

        const emailInfo = await transporter.sendMail(mailOptions);
        console.log(`[Email Sent] Successfully delivered to ${recipientEmail} | MessageId: ${emailInfo.messageId}`);
      } catch (smtpErr) {
        console.error('[SMTP Delivery Warning]:', smtpErr.message);
        console.log('[Notice] Message is safely saved locally in backend/messages/');
      }
    } else {
      console.log(`[Development Notice] Message/Media saved to ${savedFilePath}. (Add SMTP credentials to .env to send real email to ${recipientEmail})`);
    }

    return res.status(200).json({
      success: true,
      message: 'Your words have safely reached me. Thank you for leaving a little piece of your heart here. 💌',
      type: type,
      recipient: recipientEmail,
    });
  } catch (error) {
    console.error('[Send Message Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong while sending your message. Please try again.',
    });
  }
});

export default router;
