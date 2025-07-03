import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('✅ Supabase connection successful!');
        console.log('❌ Profiles table does not exist. Please run the SQL setup script.');
        return { success: false, message: 'Table does not exist' };
      } else {
        console.log('❌ Supabase connection failed:', error.message);
        return { success: false, message: error.message };
      }
    }
    
    console.log('✅ Supabase connection and table access successful!');
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    console.log('❌ Connection test failed:', error);
    return { success: false, message: 'Connection failed' };
  }
}; 