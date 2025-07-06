import { supabase } from './supabase';
import { logEvent, logFeatureUsage, logError } from './eventLogger';

export const testEventLogging = async () => {
  console.log('🧪 Testing Event Logging...');
  
  try {
    // Test 1: Check if tables exist
    console.log('📋 Checking if tables exist...');
    
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    if (eventsError) {
      console.error('❌ Events table error:', eventsError);
    } else {
      console.log('✅ Events table exists');
    }
    
    const { data: featureData, error: featureError } = await supabase
      .from('feature_usage')
      .select('count')
      .limit(1);
    
    if (featureError) {
      console.error('❌ Feature usage table error:', featureError);
    } else {
      console.log('✅ Feature usage table exists');
    }
    
    const { data: errorData, error: errorTableError } = await supabase
      .from('error_logs')
      .select('count')
      .limit(1);
    
    if (errorTableError) {
      console.error('❌ Error logs table error:', errorTableError);
    } else {
      console.log('✅ Error logs table exists');
    }
    
    // Test 2: Try to log a test event
    console.log('📝 Testing event logging...');
    await logEvent('app_lifecycle', 'test_event', 'test-user-id', {
      test_property: 'test_value',
      timestamp: new Date().toISOString()
    }, false);
    
    // Test 3: Try to log feature usage
    console.log('📊 Testing feature usage logging...');
    await logFeatureUsage('test_feature', 'test_action', 'test-user-id', {
      test_property: 'test_value'
    }, false);
    
    // Test 4: Try to log an error
    console.log('🚨 Testing error logging...');
    await logError('test_error', 'Test error message', 'test-user-id', {
      test_property: 'test_value'
    }, 'Test stack trace', false);
    
    console.log('✅ Event logging tests completed');
    
    // Test 5: Check recent events
    console.log('🔍 Checking recent events...');
    const { data: recentEvents, error: recentError } = await supabase
      .from('events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('❌ Error fetching recent events:', recentError);
    } else {
      console.log('📊 Recent events:', recentEvents?.length || 0);
      if (recentEvents && recentEvents.length > 0) {
        console.log('📋 Latest event:', recentEvents[0]);
      }
    }
    
    // Test 6: Check recent feature usage
    const { data: recentFeatures, error: recentFeatureError } = await supabase
      .from('feature_usage')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);
    
    if (recentFeatureError) {
      console.error('❌ Error fetching recent feature usage:', recentFeatureError);
    } else {
      console.log('📊 Recent feature usage:', recentFeatures?.length || 0);
      if (recentFeatures && recentFeatures.length > 0) {
        console.log('📋 Latest feature usage:', recentFeatures[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

export const checkTableStructure = async () => {
  console.log('🏗️ Checking table structure...');
  
  try {
    // Check events table structure
    const { data: eventsStructure, error: eventsStructureError } = await supabase
      .from('events')
      .select('*')
      .limit(0);
    
    if (eventsStructureError) {
      console.error('❌ Events table structure error:', eventsStructureError);
    } else {
      console.log('✅ Events table structure is valid');
    }
    
    // Check feature_usage table structure
    const { data: featureStructure, error: featureStructureError } = await supabase
      .from('feature_usage')
      .select('*')
      .limit(0);
    
    if (featureStructureError) {
      console.error('❌ Feature usage table structure error:', featureStructureError);
    } else {
      console.log('✅ Feature usage table structure is valid');
    }
    
  } catch (error) {
    console.error('❌ Structure check failed:', error);
  }
}; 