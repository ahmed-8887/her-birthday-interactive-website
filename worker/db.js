/**
 * Cloudflare D1 Database Helper Module for Visitor Journey Tracking
 * 
 * Handles:
 * - Session tracking and chronological event logging
 * - Strict deduplication of canonical sections
 * - Atomic session finalization for completed visits
 */

// Exactly 8 Canonical Sections of the Her Birthday Interactive Experience
export const CANONICAL_SECTIONS = [
  'Intro',
  'Star Journey',
  'Gift',
  'Memories',
  'Messages',
  'Birthday Reveal',
  'Universe',
  'Message Form',
];

/**
 * Normalizes any route path or event section into one of the 8 canonical section names
 */
export function normalizeSectionName(section) {
  if (!section || typeof section !== 'string') return 'Intro';
  const clean = section.trim();
  const lower = clean.toLowerCase().replace(/\/$/, '');

  if (lower === 'intro' || lower === '' || lower === '/' || lower === '/svg') return 'Intro';
  if (lower === 'star journey' || lower === 'star_journey' || lower === 'stars' || lower === '/stars' || lower === '/starssvg') return 'Star Journey';
  if (lower === 'gift' || lower === '/gift' || lower === '/giftsvg') return 'Gift';
  if (lower === 'memories' || lower === '/memories') return 'Memories';
  if (lower === 'messages' || lower === '/messages') return 'Messages';
  if (lower === 'birthday reveal' || lower === 'birthday_reveal' || lower === 'birthday' || lower === '/birthday') return 'Birthday Reveal';
  if (lower === 'universe' || lower === '/universe') return 'Universe';
  if (lower === 'message form' || lower === 'message_form' || lower === 'message' || lower === '/message') return 'Message Form';

  const canonicalMatch = CANONICAL_SECTIONS.find(
    (cs) => cs.toLowerCase() === lower
  );
  if (canonicalMatch) return canonicalMatch;

  return clean;
}

/**
 * Calculate the distinct canonical sections visited from a collection of raw events
 */
export function calculateUniqueCanonicalSections(events = []) {
  const visitedSet = new Set();
  const chronologicalUniqueSections = [];

  for (const ev of events) {
    const rawSection = ev.section_name || ev.section || '';
    const norm = normalizeSectionName(rawSection);
    if (CANONICAL_SECTIONS.includes(norm)) {
      if (!visitedSet.has(norm)) {
        visitedSet.add(norm);
        chronologicalUniqueSections.push(norm);
      }
    }
  }

  return {
    uniqueCount: visitedSet.size,
    totalCanonical: CANONICAL_SECTIONS.length, // 8
    visitedSet,
    chronologicalUniqueSections,
  };
}

/**
 * Format duration into human-readable text
 */
export function formatDuration(durationSeconds) {
  const total = Math.max(0, Math.round(durationSeconds));
  if (total < 60) {
    return `${total} second${total === 1 ? '' : 's'}`;
  }
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (minutes < 60) {
    if (seconds === 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    return `${minutes} min ${seconds} sec`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${hours} hr ${remMinutes} min`;
}

/**
 * Record a visitor event and update session metadata silently in D1
 */
export async function recordVisitorEvent(db, { sessionId, event, section, deviceType, country, timestamp }) {
  if (!db) {
    console.warn('[D1 Warning] Database binding "DB" is not available.');
    return { success: false, error: 'Database unavailable' };
  }

  const now = timestamp || Date.now();
  const safeSessionId = String(sessionId).slice(0, 100);
  const safeEvent = String(event || 'section_viewed').slice(0, 100);
  const canonicalSection = normalizeSectionName(section);
  const safeDevice = String(deviceType || 'desktop').slice(0, 50);
  const safeCountry = country ? String(country).slice(0, 10) : null;
  const isMessageSubmit = safeEvent === 'message_submitted';

  try {
    // 1. Check if session exists
    const existingSession = await db
      .prepare('SELECT session_id, message_submitted, notification_sent FROM visitor_sessions WHERE session_id = ?')
      .bind(safeSessionId)
      .first();

    if (!existingSession) {
      // 2. Insert new session silently
      const initialSectionCount = CANONICAL_SECTIONS.includes(canonicalSection) ? 1 : 0;
      await db.batch([
        db.prepare(`
          INSERT INTO visitor_sessions (
            session_id, started_at, last_activity, device_type, country,
            section_count, last_section, notification_sent, message_submitted, duration_ms
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0)
        `).bind(
          safeSessionId,
          now,
          now,
          safeDevice,
          safeCountry,
          initialSectionCount,
          canonicalSection,
          isMessageSubmit ? 1 : 0
        ),

        db.prepare(`
          INSERT INTO visitor_events (
            session_id, event_name, section_name, timestamp
          ) VALUES (?, ?, ?, ?)
        `).bind(safeSessionId, safeEvent, canonicalSection, now),
      ]);

      return { success: true, isNew: true };
    }

    // 3. Existing Session: Record event and update session activity
    const isHeartbeat = safeEvent === 'heartbeat' || safeEvent === 'ping';

    if (isHeartbeat) {
      await db
        .prepare('UPDATE visitor_sessions SET last_activity = ? WHERE session_id = ?')
        .bind(now, safeSessionId)
        .run();
      return { success: true };
    }

    // Record non-heartbeat event into visitor_events
    await db
      .prepare('INSERT INTO visitor_events (session_id, event_name, section_name, timestamp) VALUES (?, ?, ?, ?)')
      .bind(safeSessionId, safeEvent, canonicalSection, now)
      .run();

    // Query all distinct section names logged so far for accurate unique canonical section counting
    const distinctSectionsResult = await db
      .prepare('SELECT DISTINCT section_name FROM visitor_events WHERE session_id = ?')
      .bind(safeSessionId)
      .all();

    const distinctEvents = (distinctSectionsResult.results || []).map((r) => ({ section_name: r.section_name }));
    const { uniqueCount } = calculateUniqueCanonicalSections(distinctEvents);

    const messageSubmittedVal = (existingSession.message_submitted || isMessageSubmit) ? 1 : 0;

    await db
      .prepare(`
        UPDATE visitor_sessions
        SET last_activity = ?,
            last_section = ?,
            section_count = ?,
            message_submitted = ?
        WHERE session_id = ?
      `)
      .bind(now, canonicalSection, uniqueCount, messageSubmittedVal, safeSessionId)
      .run();

    return { success: true, isNew: false };
  } catch (err) {
    console.error('[D1 recordVisitorEvent Error]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Flag message submitted for a session in D1
 */
export async function recordMessageSubmission(db, sessionId) {
  if (!db || !sessionId) return;
  try {
    const now = Date.now();
    await db
      .prepare(`
        UPDATE visitor_sessions
        SET message_submitted = 1, last_activity = ?
        WHERE session_id = ?
      `)
      .bind(now, sessionId)
      .run();

    await db
      .prepare('INSERT INTO visitor_events (session_id, event_name, section_name, timestamp) VALUES (?, ?, ?, ?)')
      .bind(sessionId, 'message_submitted', 'Message Form', now)
      .run();
  } catch (err) {
    console.error('[D1 recordMessageSubmission Error]:', err);
  }
}

/**
 * Retrieve unnotified sessions that have exceeded the inactivity window
 */
export async function getInactiveUnnotifiedSessions(db, inactivityThresholdMs = 180000) {
  if (!db) return [];

  const now = Date.now();
  const cutoffTime = now - inactivityThresholdMs;

  try {
    const result = await db
      .prepare(`
        SELECT session_id, started_at, last_activity, device_type, country, section_count, last_section, message_submitted
        FROM visitor_sessions
        WHERE notification_sent = 0 AND last_activity <= ?
        ORDER BY last_activity ASC
        LIMIT 10
      `)
      .bind(cutoffTime)
      .all();

    return result.results || [];
  } catch (err) {
    console.error('[D1 getInactiveUnnotifiedSessions Error]:', err);
    return [];
  }
}

/**
 * Atomically claim and finalize a session to guarantee exactly ONE notification
 */
export async function claimAndFinalizeSession(db, sessionId, endedAt, durationMs) {
  if (!db || !sessionId) return false;

  try {
    const result = await db
      .prepare(`
        UPDATE visitor_sessions
        SET notification_sent = 1,
            ended_at = ?,
            duration_ms = ?
        WHERE session_id = ? AND notification_sent = 0
      `)
      .bind(endedAt, durationMs, sessionId)
      .run();

    const changes = result?.meta?.changes ?? (result?.changes || 0);
    return changes > 0;
  } catch (err) {
    console.error('[D1 claimAndFinalizeSession Error]:', err);
    return false;
  }
}

/**
 * Retrieve a visitor's full journey and calculated summary for final notification
 */
export async function getSessionJourneySummary(db, sessionId) {
  if (!db || !sessionId) return null;

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

    const events = eventsResult.results || [];
    const { uniqueCount, totalCanonical, visitedSet, chronologicalUniqueSections } = calculateUniqueCanonicalSections(events);

    const endedAt = session.ended_at || session.last_activity;
    const durationMs = session.duration_ms || Math.max(0, endedAt - session.started_at);
    const durationSeconds = Math.round(durationMs / 1000);

    const checklist = CANONICAL_SECTIONS.map((name) => ({
      name,
      visited: visitedSet.has(name),
    }));

    const hasMessageSubmitted = Boolean(
      session.message_submitted || events.some((e) => e.event_name === 'message_submitted')
    );

    return {
      sessionId: session.session_id,
      startedAt: session.started_at,
      endedAt: endedAt,
      durationMs,
      durationSeconds,
      durationFormatted: formatDuration(durationSeconds),
      deviceType: session.device_type || 'desktop',
      country: session.country || 'Unknown',
      uniqueSectionsCount: uniqueCount,
      totalCanonicalSections: totalCanonical,
      lastSection: normalizeSectionName(session.last_section),
      messageSubmitted: hasMessageSubmitted,
      checklist,
      chronologicalUniqueSections,
      allEvents: events,
    };
  } catch (err) {
    console.error('[D1 getSessionJourneySummary Error]:', err);
    return null;
  }
}

/**
 * Retrieve a visitor's full journey and timeline (API view)
 */
export async function getSessionJourney(db, sessionId) {
  return getSessionJourneySummary(db, sessionId);
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
