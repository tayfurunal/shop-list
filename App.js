import React from "react";
import { View, Text } from "react-native";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
} from "react-navigation";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SettingsScreen from "./screens/SettingsScreen";
const App = () => {
  return <AppContainer />;
};

const AppDrawerNavigator = createDrawerNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: "Home",
      drawerIcon: () => <Ionicons name="ios-home" size={24} />,
    },
  },
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: {
      title: "Settings",
      drawerIcon: () => <Ionicons name="ios-settings" size={24} />,
    },
  },
});

const LoginStackNavigator = createStackNavigator({
  WelcomeScreen: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  SignUpScreen: {
    screen: SignUpScreen,
    navigationOptions: {},
  },
});

const AppSwitchNavigator = createSwitchNavigator({
  LoginStackNavigator,
  AppDrawerNavigator,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;
