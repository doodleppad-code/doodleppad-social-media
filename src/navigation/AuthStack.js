import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Login';
import SignUp from '../signup';
import PhoneAuth from '../PhoneAuth';
import Otp from '../Otp';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
      <Stack.Screen name="Otp" component={Otp} />
    </Stack.Navigator>
  );
}
