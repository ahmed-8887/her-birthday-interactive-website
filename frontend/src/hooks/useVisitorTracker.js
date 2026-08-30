import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackSectionView, initializeActivityTracker } from '../services/tracker';

// Mapping of all application route paths to canonical event & section names
const ROUTE_SECTION_MAP = {
  '/': { event: 'intro_viewed', section: 'Intro' },
  '/svg': { event: 'intro_viewed', section: 'Intro' },
  '/stars': { event: 'star_journey_viewed', section: 'Star Journey' },
  '/starssvg': { event: 'star_journey_viewed', section: 'Star Journey' },
  '/gift': { event: 'gift_viewed', section: 'Gift' },
  '/giftsvg': { event: 'gift_viewed', section: 'Gift' },
  '/memories': { event: 'memories_viewed', section: 'Memories' },
  '/messages': { event: 'messages_viewed', section: 'Messages' },
  '/birthday': { event: 'birthday_reveal_viewed', section: 'Birthday Reveal' },
  '/universe': { event: 'universe_viewed', section: 'Universe' },
  '/message': { event: 'message_form_viewed', section: 'Message Form' },
};

/**
 * Custom hook to track navigation across the birthday experience sections.
 * Automatically triggers section tracking on route change with built-in deduplication
 * and initializes activity heartbeats and visibility/pagehide listeners.
 */
export const useVisitorTracker = () => {
  const location = useLocation();

  // Initialize heartbeat, visibilitychange, and pagehide listeners on mount
  useEffect(() => {
    initializeActivityTracker();
  }, []);

  // Track route navigation
  useEffect(() => {
    const pathname = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const match = ROUTE_SECTION_MAP[pathname] || ROUTE_SECTION_MAP['/' + pathname.split('/')[1]];

    if (match) {
      trackSectionView(match.event, match.section);
    }
  }, [location.pathname]);
};

export default useVisitorTracker;
