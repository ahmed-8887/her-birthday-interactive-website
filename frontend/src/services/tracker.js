/**
 * Anonymous Visitor Journey Tracking Service
 * 
 * Provides privacy-first client-side session management, activity heartbeats, and event dispatching.
 * - Anonymous session ID stored in sessionStorage (persists across page reloads in the same tab)
 * - Section view deduplication to prevent React re-renders from dispatching duplicate events
 * - Categorizes device type as 'mobile', 'tablet', or 'desktop'
 * - Visibility and pagehide listeners to accurately track session activity
 * - Periodic heartbeat every 30s while visible to prevent active visitors from timing out
 * - Completely silent error handling to guarantee zero UI interruption
 */

const SESSION_KEY = 'birthday_session_id';
const VISITED_KEY = 'birthday_visited_sections';
const VISIT_STARTED_KEY = 'birthday_visit_started';

// Detect general device category
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  
  const isMobileUA = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTabletUA = /tablet|ipad|playbook|silk/i.test(ua) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /macintosh/i.test(ua));

  if (isTabletUA || (width >= 640 && width <= 1024 && isMobileUA)) {
    return 'tablet';
  }
  if (isMobileUA || width < 640) {
    return 'mobile';
  }
  return 'desktop';
};

// Retrieve or generate an anonymous session ID
export const getSessionId = () => {
  if (typeof window === 'undefined') return 'anonymous-session';
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionId = crypto.randomUUID();
      } else {
        sessionId = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      }
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (err) {
    return 'sess_fallback_' + Date.now();
  }
};

// Retrieve set of visited sections in current session
const getVisitedSections = () => {
  try {
    const raw = sessionStorage.getItem(VISITED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

// Save set of visited sections
const saveVisitedSections = (visitedSet) => {
  try {
    sessionStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(visitedSet)));
  } catch {}
};

/**
 * Dispatch tracking event to server
 */
export const sendTrackEvent = async (eventName, sectionName) => {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const payload = {
      sessionId,
      event: eventName,
      section: sectionName || 'Intro',
      deviceType,
      timestamp: Date.now(),
    };

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

    // Prefer fetch with keepalive; fallback to sendBeacon if fetch unavailable
    if (typeof fetch === 'function') {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } else if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', blob);
    }
  } catch (err) {
    // Fail silently: analytics must NEVER interrupt the birthday website experience
  }
};

/**
 * Send lightweight keepalive ping to update last_activity
 */
export const sendActivityPing = (reason = 'heartbeat') => {
  if (typeof window === 'undefined') return;
  try {
    const sessionId = getSessionId();
    const payload = {
      sessionId,
      event: 'heartbeat',
      section: reason,
      deviceType: getDeviceType(),
      timestamp: Date.now(),
    };

    if (typeof fetch === 'function') {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } else if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    }
  } catch {}
};

/**
 * Track section view with deduplication
 */
export const trackSectionView = (eventName, sectionName) => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Check if visit_started has been dispatched for this browser session
    const visitStarted = sessionStorage.getItem(VISIT_STARTED_KEY);
    if (!visitStarted) {
      sessionStorage.setItem(VISIT_STARTED_KEY, 'true');
      sendTrackEvent('visit_started', sectionName);
    }

    // 2. Prevent duplicate section events across React re-renders & re-visits in the same session
    const visitedSet = getVisitedSections();
    if (visitedSet.has(eventName)) {
      // Still update activity ping so the session remains fresh
      sendActivityPing(sectionName);
      return;
    }

    visitedSet.add(eventName);
    saveVisitedSections(visitedSet);

    // 3. Dispatch the unique section view event
    sendTrackEvent(eventName, sectionName);
  } catch (err) {
    // Fail silently
  }
};

/**
 * Track message submission event
 */
export const trackMessageSubmitted = (messageType = 'text') => {
  sendTrackEvent('message_submitted', 'Message Form');
};

let heartbeatInterval = null;
let isListenersInitialized = false;

/**
 * Start periodic heartbeat (every 30 seconds) while page is visible
 */
export const startHeartbeat = () => {
  if (typeof window === 'undefined') return;
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      sendActivityPing('heartbeat_tick');
    }
  }, 30000);
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

/**
 * Initialize lifecycle listeners (visibilitychange, pagehide)
 */
export const initializeActivityTracker = () => {
  if (typeof window === 'undefined' || isListenersInitialized) return;
  isListenersInitialized = true;

  startHeartbeat();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendActivityPing('page_hidden');
      stopHeartbeat();
    } else if (document.visibilityState === 'visible') {
      sendActivityPing('page_visible');
      startHeartbeat();
    }
  });

  window.addEventListener('pagehide', () => {
    sendActivityPing('page_hide');
    stopHeartbeat();
  });
};

export default {
  getSessionId,
  getDeviceType,
  sendTrackEvent,
  sendActivityPing,
  trackSectionView,
  trackMessageSubmitted,
  initializeActivityTracker,
  startHeartbeat,
  stopHeartbeat,
};
