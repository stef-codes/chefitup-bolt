import { supabase } from './supabase';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export type EventType =
  | 'app_lifecycle'
  | 'authentication'
  | 'navigation'
  | 'user_interaction'
  | 'feature_usage'
  | 'data_operations'
  | 'errors'
  | 'performance';

export interface EventProperties {
  [key: string]: any;
}

export const logEvent = async (
  eventType: EventType,
  eventName: string,
  userId: string | null,
  properties: EventProperties = {},
  guestMode: boolean = false
) => {
  try {
    const eventData = {
      user_id: userId,
      event_type: eventType,
      event_name: eventName,
      properties: {
        ...properties,
        platform: Platform.OS,
        app_version: Constants.expoConfig?.version || '1.0.0',
      },
      timestamp: new Date().toISOString(),
      app_version: Constants.expoConfig?.version || '1.0.0',
      platform: Platform.OS,
      guest_mode: guestMode,
    };
    await supabase.from('events').insert(eventData);
  } catch (error) {
    console.error('Error logging event:', error);
  }
};

export const logFeatureUsage = async (
  featureName: string,
  actionType: string,
  userId: string | null,
  properties: EventProperties = {},
  guestMode: boolean = false
) => {
  try {
    const featureData = {
      user_id: userId,
      feature_name: featureName,
      action_type: actionType,
      properties,
      timestamp: new Date().toISOString(),
      guest_mode: guestMode,
    };
    await supabase.from('feature_usage').insert(featureData);
  } catch (error) {
    console.error('Error logging feature usage:', error);
  }
};

export const logError = async (
  errorType: string,
  errorMessage: string,
  userId: string | null,
  properties: EventProperties = {},
  stackTrace?: string,
  guestMode: boolean = false
) => {
  try {
    const errorData = {
      user_id: userId,
      error_type: errorType,
      error_message: errorMessage,
      stack_trace: stackTrace,
      properties,
      timestamp: new Date().toISOString(),
      app_version: Constants.expoConfig?.version || '1.0.0',
      platform: Platform.OS,
      guest_mode: guestMode,
    };
    await supabase.from('error_logs').insert(errorData);
  } catch (error) {
    console.error('Error logging error:', error);
  }
}; 