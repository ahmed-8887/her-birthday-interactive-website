-- Migration: 0002_add_session_finalization.sql
-- Description: Adds session finalization, duration, notification status, and message submission tracking

ALTER TABLE visitor_sessions ADD COLUMN ended_at INTEGER;
ALTER TABLE visitor_sessions ADD COLUMN notification_sent INTEGER NOT NULL DEFAULT 0;
ALTER TABLE visitor_sessions ADD COLUMN message_submitted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE visitor_sessions ADD COLUMN duration_ms INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_sessions_notification_status ON visitor_sessions(notification_sent, last_activity);
