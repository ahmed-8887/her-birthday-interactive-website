/**
 * Cloudflare Worker Entry Point
 * 
 * Handles:
 * - /api/send-message: User message delivery (Text, Voice Note, Video) via Gmail SMTP
 * - /api/track: Anonymous visitor tracking + D1 persistence + Gmail notification
 * - /api/health: Health check
 * - /api/journey/:sessionId: Session journey query
 * - /api/sessions: List recent sessions
 * - SPA Asset Fallback: env.ASSETS.fetch(request)
 */

import { recordVisitorEvent, getSessionJourney, listRecentSessions } from './db.js';
import { sendNewVisitorEmail, sendUserMessageEmail } from './notify.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
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
        const { type = 'text', message = '', mediaData = '', mimeType = '' } = body;

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

    // 2. POST /api/track - Visitor Journey Tracking Endpoint
    if (url.pathname === '/api/track' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const { sessionId, event, section, deviceType, timestamp } = body;

        if (!sessionId || typeof sessionId !== 'string') {
          return jsonResponse({ success: false, error: 'Invalid sessionId' }, 400);
        }

        // Detect country safely from Cloudflare edge request metadata
        const country = request.cf?.country || request.headers.get('cf-ipcountry') || null;

        const result = await recordVisitorEvent(env.DB, {
          sessionId,
          event: event || 'visit_started',
          section: section || 'Intro',
          deviceType: deviceType || 'desktop',
          country,
          timestamp: timestamp || Date.now(),
        });

        // Trigger Gmail notification ONLY when a new visitor session is initialized
        if (result.isNewSession && result.session) {
          ctx.waitUntil(sendNewVisitorEmail(env, result.session));
        }

        return jsonResponse({ success: true });
      } catch (err) {
        console.error('[Worker Track Error]:', err);
        // Always return 200 or clean response so analytics never interrupts the frontend
        return jsonResponse({ success: false, error: 'Failed to record tracking' }, 200);
      }
    }

    // 3. GET /api/journey/:sessionId - Query a visitor's journey
    if (url.pathname.startsWith('/api/journey/') && request.method === 'GET') {
      const sessionId = url.pathname.replace('/api/journey/', '');
      const journey = await getSessionJourney(env.DB, sessionId);
      if (!journey) {
        return jsonResponse({ success: false, error: 'Session not found' }, 404);
      }
      return jsonResponse({ success: true, journey });
    }

    // 4. GET /api/sessions - List recent sessions
    if (url.pathname === '/api/sessions' && request.method === 'GET') {
      const sessions = await listRecentSessions(env.DB, 50);
      return jsonResponse({ success: true, sessions });
    }

    // 5. GET /api/health - Worker Health Check
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'Her Birthday Worker & Visitor Tracking',
        timestamp: new Date().toISOString(),
      });
    }

    // 6. Fallback to Cloudflare Workers Static Assets (React SPA)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
