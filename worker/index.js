/**
 * Cloudflare Worker Entry Point
 * 
 * Handles:
 * - /api/track: Anonymous visitor tracking + D1 persistence + Gmail notification
 * - /api/health: Health check
 * - /api/journey/:sessionId: Session journey query
 * - SPA Asset Fallback: env.ASSETS.fetch(request)
 */

import { recordVisitorEvent, getSessionJourney, listRecentSessions } from './db.js';
import { sendNewVisitorEmail } from './notify.js';

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

    // 1. POST /api/track - Visitor Journey Tracking Endpoint
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

    // 2. GET /api/journey/:sessionId - Query a visitor's journey
    if (url.pathname.startsWith('/api/journey/') && request.method === 'GET') {
      const sessionId = url.pathname.replace('/api/journey/', '');
      const journey = await getSessionJourney(env.DB, sessionId);
      if (!journey) {
        return jsonResponse({ success: false, error: 'Session not found' }, 404);
      }
      return jsonResponse({ success: true, journey });
    }

    // 3. GET /api/sessions - List recent sessions
    if (url.pathname === '/api/sessions' && request.method === 'GET') {
      const sessions = await listRecentSessions(env.DB, 50);
      return jsonResponse({ success: true, sessions });
    }

    // 4. GET /api/health - Worker Health Check
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'Her Birthday Worker & Visitor Tracking',
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Fallback to Cloudflare Workers Static Assets (React SPA)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
