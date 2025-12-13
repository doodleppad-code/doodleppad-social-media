import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Details from '../Details';
import Dashboard from '../Dashboard';
import ChatScreen from '../ChatScreen';
import ChatList from '../ChatList';
import Profile from '../Profile';
import ProfileUI from '../ProfileUI';
import SearchScreen from '../SearchScreen';
import NotificationScreen from '../NotificationScreen';
import Imagepost from '../Imagepost';
import Audiopost from '../Audiopost';
import CommentsScreen from '../CommentsScreen';

const Stack = createStackNavigator();

// Lazy-safe wrapper for DoodlePad: require the module at render time
// and show a fallback UI if the module or its native deps are unavailable.
function DoodlePadWrapper(props) {
  try {
    // require at render time to avoid crashing the app during module import
    // when native modules (like Skia) are missing in the current build.
    // eslint-disable-next-line global-require
    const DoodlePad = require('../Doodlepad').default;
    return <DoodlePad {...props} />;
  } catch (e) {
    // Avoid passing raw error objects to console.warn/LogBox which can
    // sometimes cause internal conversion errors when they contain
    // unexpected native values. Log a safe string instead.
    const msg = e && e.message ? e.message : String(e);
    console.warn('DoodlePad module failed to load:', msg);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center' }}>
          Doodlepad is unavailable in this build. Native dependencies may be missing.
        </Text>
      </View>
    );
  }
}

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Detail" component={Details} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Doodlepad" component={DoodlePadWrapper} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileUI" component={ProfileUI} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="ImagePost" component={Imagepost} />
      <Stack.Screen name="AudioPost" component={Audiopost} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} />

    </Stack.Navigator>
  );
}


