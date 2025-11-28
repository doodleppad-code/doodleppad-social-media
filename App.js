
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/AuthContext';
import AuthStack from './src/navigation/AuthStack'; // Login/Signup
import AppStack from './src/navigation/AppStack';   // Dashboard, ImagePost, etc.
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
  const auth = useAuth();

  // If context is not available yet, show a loader to avoid destructuring undefined
  if (!auth) {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  const { user, loading } = auth;

  if (loading) {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}