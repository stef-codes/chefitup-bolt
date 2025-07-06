# Analytics Queries for ChefItUp Event Logging

This document contains SQL queries to analyze user behavior, feature usage, and app performance using the event logging data from Supabase.

## 📊 User Behavior Analytics

### Most Popular Recipes
```sql
SELECT 
  properties->>'recipe_name' as recipe_name,
  COUNT(*) as view_count,
  COUNT(DISTINCT user_id) as unique_users
FROM events 
WHERE event_name = 'recipe_clicked'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY properties->>'recipe_name'
ORDER BY view_count DESC
LIMIT 10;
```

### User Engagement by Day
```sql
SELECT 
  DATE(timestamp) as date,
  COUNT(DISTINCT user_id) as daily_active_users,
  COUNT(*) as total_events,
  COUNT(*) / COUNT(DISTINCT user_id) as events_per_user
FROM events 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date;
```

### Screen Navigation Patterns
```sql
SELECT 
  properties->>'from_screen' as from_screen,
  properties->>'to_screen' as to_screen,
  COUNT(*) as navigation_count
FROM events 
WHERE event_name = 'screen_navigation'
  AND timestamp > NOW() - INTERVAL '7 days'
GROUP BY properties->>'from_screen', properties->>'to_screen'
ORDER BY navigation_count DESC;
```

## 🍽️ Feature Usage Analytics

### Carb Tracking Activity
```sql
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as carb_entries,
  AVG(CAST(properties->>'carbs' AS INTEGER)) as avg_carbs_per_entry,
  SUM(CAST(properties->>'carbs' AS INTEGER)) as total_carbs_logged
FROM feature_usage 
WHERE feature_name = 'carb_tracking'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date;
```

### Meal Type Distribution for Carb Tracking
```sql
SELECT 
  properties->>'meal_type' as meal_type,
  COUNT(*) as entry_count,
  AVG(CAST(properties->>'carbs' AS INTEGER)) as avg_carbs
FROM feature_usage 
WHERE feature_name = 'carb_tracking'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY properties->>'meal_type'
ORDER BY entry_count DESC;
```

### Blood Sugar Tracking Patterns
```sql
SELECT 
  properties->>'reading_type' as reading_type,
  COUNT(*) as reading_count,
  AVG(CAST(properties->>'value' AS INTEGER)) as avg_blood_sugar,
  MIN(CAST(properties->>'value' AS INTEGER)) as min_blood_sugar,
  MAX(CAST(properties->>'value' AS INTEGER)) as max_blood_sugar
FROM feature_usage 
WHERE feature_name = 'blood_sugar_tracking'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY properties->>'reading_type'
ORDER BY reading_count DESC;
```

### Meal Planning Activity
```sql
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as meal_plan_actions,
  COUNT(DISTINCT user_id) as active_planners
FROM feature_usage 
WHERE feature_name = 'meal_planning'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date;
```

## 🔍 Error Analysis

### Error Frequency by Type
```sql
SELECT 
  error_type,
  COUNT(*) as error_count,
  COUNT(DISTINCT user_id) as affected_users,
  AVG(EXTRACT(EPOCH FROM (NOW() - timestamp))) / 3600 as avg_hours_since_error
FROM error_logs 
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY error_type 
ORDER BY error_count DESC;
```

### Error Trends Over Time
```sql
SELECT 
  DATE(timestamp) as date,
  error_type,
  COUNT(*) as error_count
FROM error_logs 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp), error_type
ORDER BY date, error_count DESC;
```

### Platform-Specific Errors
```sql
SELECT 
  platform,
  error_type,
  COUNT(*) as error_count
FROM error_logs 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY platform, error_type
ORDER BY error_count DESC;
```

## 👥 User Segmentation

### Guest vs Authenticated User Behavior
```sql
SELECT 
  guest_mode,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_events,
  COUNT(*) / COUNT(DISTINCT user_id) as events_per_user
FROM events 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY guest_mode;
```

### Most Active Users
```sql
SELECT 
  user_id,
  COUNT(*) as event_count,
  COUNT(DISTINCT event_name) as unique_actions,
  MIN(timestamp) as first_activity,
  MAX(timestamp) as last_activity
FROM events 
WHERE timestamp > NOW() - INTERVAL '30 days'
  AND user_id IS NOT NULL
GROUP BY user_id
ORDER BY event_count DESC
LIMIT 20;
```

### User Retention Analysis
```sql
WITH user_activity AS (
  SELECT 
    user_id,
    DATE(timestamp) as activity_date
  FROM events 
  WHERE user_id IS NOT NULL
    AND timestamp > NOW() - INTERVAL '90 days'
  GROUP BY user_id, DATE(timestamp)
),
user_cohorts AS (
  SELECT 
    user_id,
    MIN(activity_date) as first_date
  FROM user_activity
  GROUP BY user_id
)
SELECT 
  DATE_TRUNC('week', first_date) as cohort_week,
  COUNT(DISTINCT uc.user_id) as cohort_size,
  COUNT(DISTINCT CASE WHEN ua.activity_date >= first_date + INTERVAL '7 days' THEN ua.user_id END) as week_1_retained,
  COUNT(DISTINCT CASE WHEN ua.activity_date >= first_date + INTERVAL '14 days' THEN ua.user_id END) as week_2_retained,
  COUNT(DISTINCT CASE WHEN ua.activity_date >= first_date + INTERVAL '30 days' THEN ua.user_id END) as week_4_retained
FROM user_cohorts uc
LEFT JOIN user_activity ua ON uc.user_id = ua.user_id
GROUP BY DATE_TRUNC('week', first_date)
ORDER BY cohort_week;
```

## 📱 App Performance Metrics

### App Version Adoption
```sql
SELECT 
  app_version,
  COUNT(DISTINCT user_id) as users,
  COUNT(*) as total_events
FROM events 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY app_version
ORDER BY users DESC;
```

### Platform Distribution
```sql
SELECT 
  platform,
  COUNT(DISTINCT user_id) as users,
  COUNT(*) as total_events,
  COUNT(*) / COUNT(DISTINCT user_id) as events_per_user
FROM events 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY platform
ORDER BY users DESC;
```

### Peak Usage Times
```sql
SELECT 
  EXTRACT(HOUR FROM timestamp) as hour_of_day,
  COUNT(*) as event_count
FROM events 
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY hour_of_day;
```

## 🎯 Business Intelligence Queries

### Feature Adoption Rate
```sql
WITH total_users AS (
  SELECT COUNT(DISTINCT user_id) as total
  FROM events 
  WHERE timestamp > NOW() - INTERVAL '30 days'
    AND user_id IS NOT NULL
),
feature_users AS (
  SELECT 
    feature_name,
    COUNT(DISTINCT user_id) as users
  FROM feature_usage 
  WHERE timestamp > NOW() - INTERVAL '30 days'
    AND user_id IS NOT NULL
  GROUP BY feature_name
)
SELECT 
  fu.feature_name,
  fu.users,
  tu.total,
  ROUND((fu.users::DECIMAL / tu.total) * 100, 2) as adoption_rate
FROM feature_users fu
CROSS JOIN total_users tu
ORDER BY adoption_rate DESC;
```

### User Journey Analysis
```sql
WITH user_journey AS (
  SELECT 
    user_id,
    event_name,
    timestamp,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY timestamp) as step_number
  FROM events 
  WHERE user_id IS NOT NULL
    AND timestamp > NOW() - INTERVAL '7 days'
)
SELECT 
  step_number,
  event_name,
  COUNT(*) as user_count
FROM user_journey
WHERE step_number <= 10
GROUP BY step_number, event_name
ORDER BY step_number, user_count DESC;
```

### Conversion Funnel (Onboarding to Active Usage)
```sql
WITH funnel_steps AS (
  SELECT 
    user_id,
    CASE 
      WHEN EXISTS (SELECT 1 FROM events e2 WHERE e2.user_id = e1.user_id AND e2.event_name = 'user_signed_up') THEN 'Signed Up'
      WHEN EXISTS (SELECT 1 FROM events e2 WHERE e2.user_id = e1.user_id AND e2.event_name = 'user_signed_in') THEN 'Signed In'
      WHEN EXISTS (SELECT 1 FROM feature_usage f WHERE f.user_id = e1.user_id AND f.feature_name = 'carb_tracking') THEN 'Used Carb Tracking'
      WHEN EXISTS (SELECT 1 FROM feature_usage f WHERE f.user_id = e1.user_id AND f.feature_name = 'meal_planning') THEN 'Used Meal Planning'
      ELSE 'Basic User'
    END as user_type
  FROM events e1
  WHERE timestamp > NOW() - INTERVAL '30 days'
    AND user_id IS NOT NULL
  GROUP BY user_id
)
SELECT 
  user_type,
  COUNT(*) as user_count
FROM funnel_steps
GROUP BY user_type
ORDER BY 
  CASE user_type
    WHEN 'Signed Up' THEN 1
    WHEN 'Signed In' THEN 2
    WHEN 'Used Carb Tracking' THEN 3
    WHEN 'Used Meal Planning' THEN 4
    ELSE 5
  END;
```

## 🔧 Maintenance Queries

### Data Cleanup (Remove Old Events)
```sql
-- Delete events older than 90 days (run periodically)
DELETE FROM events 
WHERE timestamp < NOW() - INTERVAL '90 days';

-- Delete error logs older than 30 days
DELETE FROM error_logs 
WHERE timestamp < NOW() - INTERVAL '30 days';
```

### Database Performance
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename IN ('events', 'feature_usage', 'error_logs')
ORDER BY tablename, attname;
```

## 📈 Dashboard Queries

### Daily Summary Dashboard
```sql
SELECT 
  DATE(timestamp) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_events,
  COUNT(CASE WHEN event_name = 'recipe_clicked' THEN 1 END) as recipe_views,
  COUNT(CASE WHEN event_name = 'button_clicked' THEN 1 END) as button_clicks,
  COUNT(CASE WHEN event_name = 'screen_navigation' THEN 1 END) as screen_navigations
FROM events 
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

### Real-time Activity (Last 24 Hours)
```sql
SELECT 
  EXTRACT(HOUR FROM timestamp) as hour,
  COUNT(*) as events,
  COUNT(DISTINCT user_id) as active_users
FROM events 
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY hour;
```

---

## 📝 Usage Notes

1. **Time Ranges**: Adjust the `INTERVAL` values based on your analysis needs
2. **Performance**: Add indexes for frequently queried columns
3. **Data Retention**: Implement regular cleanup of old data
4. **Privacy**: Ensure compliance with data protection regulations
5. **Monitoring**: Set up alerts for unusual error patterns

## 🚀 Next Steps

1. Set up automated dashboards using these queries
2. Create alerts for critical error patterns
3. Implement A/B testing event tracking
4. Add user feedback and satisfaction metrics
5. Create custom reports for business stakeholders 