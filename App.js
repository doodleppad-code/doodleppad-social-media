
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Login from "./src/Login"
import PhoneAuth from "./src/PhoneAuth"
import Otp from "./src/Otp"
import Details from "./src/Details"
import Dashboard from "./src/Dashboard"
import ChatScreen from "./src/ChatScreen"
import SignUp from "./src/signup"
import ChatList from "./src/ChatList"
import DoodlePad from "./src/Doodlepad" 
import Imagepost from "./src/Imagepost"


// Initialize Firebase
import '@react-native-firebase/app';

const Stack = createStackNavigator();

export default function App() {
  return (
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
        name="Imagepost"
        component={Imagepost}
        options={{ headerShown: false }} />
    </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}