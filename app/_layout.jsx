import React from "react";

import { Tabs } from "expo-router";
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { darkTheme } from "../constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const RootLayout = () => {
  const theme = {
    ...DefaultTheme,
    colors: { ...darkTheme.colors },
  };

  const loggedIn = false;

  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={{
          statusBarStyle: "auto",
          headerStyle: { backgroundColor: theme.colors.elevation.level1 },
          headerTintColor: theme.colors.onBackground,
          tabBarStyle: {
            backgroundColor: theme.colors.elevation.level1,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create_session"
          options={{
            href: loggedIn ? "/create_session" : null,
            title: "Create Session",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="qut_events"
          options={{
            title: "QUT Events",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="city" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            href: !loggedIn ? "/login" : null,
            title: "Login",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="login" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            href: !loggedIn ? "/register" : null,
            title: "Register",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-plus"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
};

export default RootLayout;
