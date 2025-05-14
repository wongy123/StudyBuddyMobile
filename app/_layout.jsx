import React from "react";

import { Tabs } from "expo-router";
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { darkTheme } from "../constants/theme";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
  const theme = {
    ...DefaultTheme,
    colors: { ...darkTheme.colors },
  };

  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={{
          statusBarStyle: "auto",
          headerStyle: { backgroundColor: theme.colors.elevation.level1 },
          headerTintColor: theme.colors.onBackground,
          tabBarStyle: {
            backgroundColor: theme.colors.elevation.level1,
            borderTopWidth: 0
          },
        }}
      >
        <Tabs.Screen name="(home)" options={{ title: "Home", headerShown: false }}/>
        <Tabs.Screen name="qut_events" options={{ title: "QUT Events" }} />
      </Tabs>
    </PaperProvider>
  );
};

export default RootLayout;
