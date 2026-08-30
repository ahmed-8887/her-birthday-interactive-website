/**
 * Cloudflare D1 Database Helper Module for Visitor Journey Tracking
 */

/**
 * Record a visitor event and update/create session metadata in D1
 */
export async function recordVisitorEvent(db, { sessionId, event, section, deviceType, country, timestamp }) {
  if (!db) {
    console.warn('[D1 Warning] Database binding "DB" is not available.');
    return { isNewSession: false, error: 'Database unavailable' };
  }

  const now = timestamp || Date.now();
  const safeSessionId = String(sessionId).slice(0, 100);
  const safeEvent = String(event).slice(0, 100);
  const safeSection = String(section || 'Unknown').slice(0, 100);
  const safeDevice = String(deviceType || 'desktop').slice(0, 50);
  const safeCountry = country ? String(country).slice(0, 10) : null;

  try {
    // 1. Check if session already exists
    const existingSession = await db
      .prepare('SELECT session_id, section_count, last_section FROM visitor_sessions WHERE session_id = ?')
      .bind(safeSessionId)
      .first();

    if (!existingSession) {
      // 2. New Visitor Session: Insert session and initial event
      await db.batch([
        db.prepare(`
          INSERT INTO visitor_sessions (
            session_id, started_at, last_activity, device_type, country, section_count, last_section
          ) VALUES (?, ?, ?, ?, ?, 1, ?)
        `).bind(safeSessionId, now, now, safeDevice, safeCountry, safeSection),

        db.prepare(`
          INSERT INTO visitor_events (
            session_id, event_name, section_name, timestamp
          ) VALUES (?, ?, ?, ?)
        `).bind(safeSessionId, safeEvent, safeSection, now)
      ]);

      return {
        isNewSession: true,
        session: {
          sessionId: safeSessionId,
          startedAt: now,
          deviceType: safeDevice,
          country: safeCountry,
          lastSection: safeSection,
          sectionCount: 1,
        },
      };
    }

    // 3. Existing Session: Check if this specific event was already recorded to avoid duplicates
    const existingEvent = await db
      .prepare('SELECT id FROM visitor_events WHERE session_id = ? AND event_name = ? AND section_name = ?')
      .bind(safeSessionId, safeEvent, safeSection)
      .first();

    if (!existingEvent) {
      // Insert new unique event in the journey and bump section_count & last_section
      await db.batch([
        db.prepare(`
          INSERT INTO visitor_events (
            session_id, event_name, section_name, timestamp
          ) VALUES (?, ?, ?, ?)
        `).bind(safeSessionId, safeEvent, safeSection, now),

        db.prepare(`
          UPDATE visitor_sessions
          SET last_activity = ?, section_count = section_count + 1, last_section = ?
          WHERE session_id = ?
        `).bind(now, safeSection, safeSessionId)
      ]);
    } else {
      // Just update last activity timestamp
      await db
        .prepare('UPDATE visitor_sessions SET last_activity = ? WHERE session_id = ?')
        .bind(now, safeSessionId)
        .run();
    }

    return { isNewSession: false };
  } catch (err) {
    console.error('[D1 Error]:', err);
    return { isNewSession: false, error: err.message };
  }
}

/**
 * Retrieve a visitor's full journey and timeline
 */
export async function getSessionJourney(db, sessionId) {
  if (!db) return null;

  try {
    const session = await db
      .prepare('SELECT * FROM visitor_sessions WHERE session_id = ?')
      .bind(sessionId)
      .first();

    if (!session) return null;

    const eventsResult = await db
      .prepare('SELECT event_name, section_name, timestamp FROM visitor_events WHERE session_id = ? ORDER BY timestamp ASC, id ASC')
      .bind(sessionId)
      .all();

    const durationSeconds = Math.max(0, Math.round((session.last_activity - session.started_at) / 1000));

    return {
      sessionId: session.session_id,
      startedAt: new Date(session.started_at).toISOString(),
      lastActivity: new Date(session.last_activity).toISOString(),
      durationSeconds,
      deviceType: session.device_type,
      country: session.country,
      sectionCount: session.section_count,
      lastSection: session.last_section,
      events: eventsResult.results || [],
    };
  } catch (err) {
    console.error('[D1 getSessionJourney Error]:', err);
    return null;
  }
}

/**
 * List recent visitor sessions
 */
export async function listRecentSessions(db, limit = 50) {
  if (!db) return [];

  try {
    const result = await db
      .prepare('SELECT * FROM visitor_sessions ORDER BY started_at DESC LIMIT ?')
      .bind(limit)
      .all();

    return result.results || [];
  } catch (err) {
    console.error('[D1 listRecentSessions Error]:', err);
    return [];
  }
}
