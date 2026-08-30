/**
 * Cloudflare Worker Entry Point
 * 
 * Handles:
 * - /api/send-message: User message delivery (Text, Voice Note, Video) via Gmail SMTP
 * - /api/track: Anonymous visitor tracking + D1 persistence (silent during visit)
 * - /api/finalize-sessions: Inactivity finalization trigger (automated via cron + request hooks)
 * - /api/journey/:sessionId: Session journey query
 * - /api/sessions: List recent sessions
 * - /api/health: Health check
 * - SPA Asset Fallback: env.ASSETS.fetch(request)
 * - scheduled: Cron trigger for periodic session finalization
 */

import {
  recordVisitorEvent,
  recordMessageSubmission,
  getInactiveUnnotifiedSessions,
  claimAndFinalizeSession,
  getSessionJourneySummary,
  listRecentSessions,
} from './db.js';
import { sendVisitorCompletedEmail, sendUserMessageEmail } from './notify.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Inactivity threshold: 3 minutes (180,000 ms) before a session is considered completed
const INACTIVITY_THRESHOLD_MS = 3 * 60 * 1000;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Sweep and finalize inactive sessions, sending exactly ONE completed journey email per session
 */
export async function finalizeInactiveSessions(env) {
  if (!env.DB) return { processed: 0, finalized: 0 };

  try {
    const inactiveSessions = await getInactiveUnnotifiedSessions(env.DB, INACTIVITY_THRESHOLD_MS);
    let finalizedCount = 0;

    for (const session of inactiveSessions) {
      const endedAt = session.last_activity;
      const durationMs = Math.max(0, session.last_activity - session.started_at);

      // Atomic claim to guarantee strict idempotency (no duplicate emails)
      const claimed = await claimAndFinalizeSession(env.DB, session.session_id, endedAt, durationMs);
      if (claimed) {
        finalizedCount++;
        const summary = await getSessionJourneySummary(env.DB, session.session_id);
        if (summary) {
          await sendVisitorCompletedEmail(env, summary);
        }
      }
    }

    return { processed: inactiveSessions.length, finalized: finalizedCount };
  } catch (err) {
    console.error('[Worker finalizeInactiveSessions Error]:', err);
    return { processed: 0, finalized: 0, error: err.message };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 1. POST /api/send-message - User Message & Media Submission Endpoint
    if (url.pathname === '/api/send-message' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const { type = 'text', message = '', mediaData = '', mimeType = '', sessionId = '' } = body;

        // Validation
        if (type === 'voice') {
          if (!mediaData || typeof mediaData !== 'string') {
            return jsonResponse({
              success: false,
              error: 'Please record a voice message first 🎙️',
            }, 400);
          }
        } else if (type === 'video') {
          if (!mediaData || typeof mediaData !== 'string') {
            return jsonResponse({
              success: false,
              error: 'Please record a video message first 🎥',
            }, 400);
          }
        } else {
          if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return jsonResponse({
              success: false,
              error: 'Please write a little message first 💌',
            }, 400);
          }
          if (message.length > 3000) {
            return jsonResponse({
              success: false,
              error: 'Message exceeds the maximum limit of 3000 characters.',
            }, 400);
          }
        }

        // Flag message submission in session tracking if sessionId provided
        if (sessionId && env.DB) {
          ctx.waitUntil(recordMessageSubmission(env.DB, sessionId));
        }

        const emailResult = await sendUserMessageEmail(env, {
          type,
          message,
          mediaData,
          mimeType,
        });

        return jsonResponse({
          success: true,
          message: 'Your words have safely reached me. Thank you for leaving a little piece of your heart here. 💌',
          type: type,
          recipient: emailResult?.recipient || env.MESSAGE_RECEIVER_EMAIL || 'Configured Inbox',
        });
      } catch (err) {
        console.error('[Worker Send Message Error]:', err);
        return jsonResponse({
          success: false,
          error: 'Something went wrong while sending your message. Please try again.',
        }, 500);
      }
    }

    // 2. POST /api/track - Visitor Journey Tracking Endpoint (Silent & Resilient)
    if (url.pathname === '/api/track' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const { sessionId, event, section, deviceType, timestamp } = body;

        if (!sessionId || typeof sessionId !== 'string') {
          return jsonResponse({ success: false, error: 'Invalid sessionId' }, 400);
        }

        // Detect country safely from Cloudflare edge request metadata
        const country = request.cf?.country || request.headers.get('cf-ipcountry') || null;

        await recordVisitorEvent(env.DB, {
          sessionId,
          event: event || 'section_viewed',
          section: section || 'Intro',
          deviceType: deviceType || 'desktop',
          country,
          timestamp: timestamp || Date.now(),
        });

        // Passively sweep and finalize any expired inactive sessions in the background
        ctx.waitUntil(finalizeInactiveSessions(env));

        return jsonResponse({ success: true });
      } catch (err) {
        console.error('[Worker Track Error]:', err);
        return jsonResponse({ success: false, error: 'Failed to record tracking' }, 200);
      }
    }

    // 3. GET/POST /api/finalize-sessions - Inactivity sweeper endpoint (manual or monitoring)
    if (url.pathname === '/api/finalize-sessions') {
      const result = await finalizeInactiveSessions(env);
      return jsonResponse({ success: true, ...result });
    }

    // 4. GET /api/journey/:sessionId - Query a visitor's journey summary
    if (url.pathname.startsWith('/api/journey/') && request.method === 'GET') {
      const sessionId = url.pathname.replace('/api/journey/', '');
      const journey = await getSessionJourneySummary(env.DB, sessionId);
      if (!journey) {
        return jsonResponse({ success: false, error: 'Session not found' }, 404);
      }
      return jsonResponse({ success: true, journey });
    }

    // 5. GET /api/sessions - List recent sessions
    if (url.pathname === '/api/sessions' && request.method === 'GET') {
      const sessions = await listRecentSessions(env.DB, 50);
      return jsonResponse({ success: true, sessions });
    }

    // 6. GET /api/health - Worker Health Check
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'Her Birthday Worker & Visitor Tracking',
        timestamp: new Date().toISOString(),
      });
    }

    // 7. Fallback to Cloudflare Workers Static Assets (React SPA)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },

  // 8. Cron Scheduled Handler - Fires periodically (every minute) to finalize inactive sessions
  async scheduled(event, env, ctx) {
    ctx.waitUntil(finalizeInactiveSessions(env));
  },
};
