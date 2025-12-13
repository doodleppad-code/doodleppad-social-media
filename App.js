
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
<<<<<<< HEAD
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">

      <Stack.Screen

        name="Login"

        component={Login}

        options={{ headerShown: false }} />
        <Stack.Screen
        name="PhoneAuth"
        component={PhoneAuth}
        options={{ headerShown: false }} />
        <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ headerShown: false }} /> 
      <Stack.Screen
        name="Detail"
        component={Details}
        options={{ headerShown: false }} />

      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }} />

      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerShown: false }} />

      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }} />
        
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="Doodlepad"
        component={DoodlePad}
        options={{ headerShown: false }} />
        <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }} />
        <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }} />
        <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }} />
        <Stack.Screen
        name="ProfileUI"
        component={ProfileUI}
     options={{ headerShown: false }}/>
     <Stack.Screen
      name="ImagePost"
      component={Imagepost}
        options={{ headerShown: false }} />
    </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
=======
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
>>>>>>> af138d7b188736ea574fdb0dec19a2d413c46c12
  );
}