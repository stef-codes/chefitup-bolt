-- Check if event logging tables exist
-- Run this in your Supabase SQL editor

-- Check if events table exists
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'events';

-- Check if feature_usage table exists
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'feature_usage';

-- Check if error_logs table exists
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'error_logs';

-- Check table structure for events
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'events'
ORDER BY ordinal_position;

-- Check table structure for feature_usage
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'feature_usage'
ORDER BY ordinal_position;

-- Check table structure for error_logs
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'error_logs'
ORDER BY ordinal_position;

-- Count records in each table
SELECT 'events' as table_name, COUNT(*) as record_count FROM events
UNION ALL
SELECT 'feature_usage' as table_name, COUNT(*) as record_count FROM feature_usage
UNION ALL
SELECT 'error_logs' as table_name, COUNT(*) as record_count FROM error_logs;

-- Check recent events (last 10)
SELECT 
  id,
  event_type,
  event_name,
  user_id,
  timestamp,
  guest_mode
FROM events 
ORDER BY timestamp DESC 
LIMIT 10;

-- Check recent feature usage (last 10)
SELECT 
  id,
  feature_name,
  action_type,
  user_id,
  timestamp,
  guest_mode
FROM feature_usage 
ORDER BY timestamp DESC 
LIMIT 10;

-- Check recent errors (last 10)
SELECT 
  id,
  error_type,
  error_message,
  user_id,
  timestamp,
  guest_mode
FROM error_logs 
ORDER BY timestamp DESC 
LIMIT 10; 