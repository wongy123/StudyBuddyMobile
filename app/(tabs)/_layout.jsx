import React from "react";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "@context/authContext";
import { useTheme } from "react-native-paper";

const TabsLayout = () => {
  const { token } = useAuth();
  const loggedIn = !!token;
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        statusBarStyle: "auto",
        headerStyle: { backgroundColor: theme.colors.elevation.level1 },
        headerTintColor: theme.colors.onBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level1,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
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
      <Tabs.Screen
        name="my_profile"
        options={{
          href: loggedIn ? "/my_profile" : null,
          title: "My Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-box"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
