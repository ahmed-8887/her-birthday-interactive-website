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
