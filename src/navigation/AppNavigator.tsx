import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient'; 
import TabNavigator from './TabNavigator';
import AuthStackNavigator from './AuthStackNavigator'; 
export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
     return null;   }

  return (
    <NavigationContainer>
        <TabNavigator />        
    </NavigationContainer>
  );
}
