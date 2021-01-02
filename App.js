import React, { Component } from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomDrawerComponent from "./screens/DrawerNavigator/CustomDrawerComponent";
import colors from "./assets/colors";
import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";
import LoadingScreen from "./screens/AppSwitchNavigator/LoadingScreen";
import ShopsPurchasedScreen from "./screens/HomeTabNavigator/ShopsPurchasedScreen";
import ShopsWillPurchaseScreen from "./screens/HomeTabNavigator/ShopsWillPurchaseScreen";
import { Provider } from "react-redux";
import store from "./redux/store";
import ShopsCountContainer from "./redux/containers/ShopsCountContainer";

class App extends Component {
  constructor() {
    super();
    this.initializeFirebase();
  }
  initializeFirebase = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  };
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

const HomeTabNavigator = createBottomTabNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: "Tümü",
        tabBarIcon: ({ tintColor }) => {
          return <ShopsCountContainer color={tintColor} type="shops" />;
        },
      },
    },
    ShopsWillPurchaseScreen: {
      screen: ShopsWillPurchaseScreen,
      navigationOptions: {
        tabBarLabel: "Alacaklarım",
        tabBarIcon: ({ tintColor }) => {
          return (
            <ShopsCountContainer color={tintColor} type="shopWillPurchase" />
          );
        },
      },
    },
    ShopsPurchasedScreen: {
      screen: ShopsPurchasedScreen,
      navigationOptions: {
        tabBarLabel: "Aldıklarım",
        tabBarIcon: ({ tintColor }) => {
          return <ShopsCountContainer color={tintColor} type="shopPurchased" />;
        },
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.bgMain,
      },
      tabStyle: {
        justifyContent: "center",
      },
      activeTintColor: colors.logoColor,
      inactiveTintColor: colors.bgTextInput,
    },
  }
);

HomeTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  switch (routeName) {
    case "HomeScreen":
      return {
        headerTitle: "Alışveriş Listem",
      };
    case "ShopsWillPurchaseScreen":
      return {
        headerTitle: "Alacaklarım",
      };
    case "ShopsPurchasedScreen":
      return {
        headerTitle: "Aldıklarım",
      };
    default:
      return {
        headerTitle: "Alışveriş Listem",
      };
  }
};

const HomeStackNavigator = createStackNavigator(
  {
    HomeTabNavigator: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons
              name="ios-menu"
              size={30}
              color={colors.logoColor}
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          ),
        };
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain,
      },
      headerTintColor: colors.txtWhite,
    },
  }
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    HomeStackNavigator: {
      screen: HomeStackNavigator,
      navigationOptions: {
        title: "Ana Sayfa",
        drawerIcon: () => <Ionicons name="ios-home" size={24} />,
      },
    },
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: {
        title: "Ayarlar",
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />,
      },
    },
  },
  {
    contentComponent: CustomDrawerComponent,
  }
);

const LoginStackNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {},
    },
  },
  {
    mode: "modal",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain,
      },
    },
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  LoginStackNavigator,
  AppDrawerNavigator,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;
