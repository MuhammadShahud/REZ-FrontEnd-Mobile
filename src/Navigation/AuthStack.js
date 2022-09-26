import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Login, SignUp, Splash, TermsCondition} from '../Screens';

const AuthStack = createNativeStackNavigator();

const Auth = () => (
  <AuthStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Login">
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);

export default Auth;
