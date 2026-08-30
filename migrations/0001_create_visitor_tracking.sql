-- Migration: 0001_create_visitor_tracking.sql
-- Description: Anonymous visitor session and event timeline tracking

CREATE TABLE IF NOT EXISTS visitor_sessions (
  session_id TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL,
  last_activity INTEGER NOT NULL,
  device_type TEXT NOT NULL,
  country TEXT,
  section_count INTEGER NOT NULL DEFAULT 1,
  last_section TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON visitor_sessions(started_at);

CREATE TABLE IF NOT EXISTS visitor_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_events_session_id ON visitor_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON visitor_events(timestamp);
