import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Details from '../Details';
import Dashboard from '../Dashboard';
import ChatScreen from '../ChatScreen';
import ChatList from '../ChatList';
import DoodlePad from '../Doodlepad';
import Profile from '../Profile';
import ProfileUI from '../ProfileUI';
import SearchScreen from '../SearchScreen';
import NotificationScreen from '../NotificationScreen';
import Imagepost from '../Imagepost';
import Audiopost from '../Audiopost';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Detail" component={Details} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Doodlepad" component={DoodlePad} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileUI" component={ProfileUI} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="ImagePost" component={Imagepost} />
      <Stack.Screen name="AudioPost" component={Audiopost} />
    </Stack.Navigator>
  );
}
