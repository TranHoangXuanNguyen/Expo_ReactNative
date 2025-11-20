import 'react-native-url-polyfill/auto'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqewjctenwievhmvltxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZXdqY3RlbndpZXZobXZsdHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTc4MzcsImV4cCI6MjA3Nzk3MzgzN30.XjAqXCnubs0CKxEcIKo0QyB986uRIoo_tEKh-cjlfi4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,     
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
