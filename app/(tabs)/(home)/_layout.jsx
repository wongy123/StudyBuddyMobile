import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";

const HomeLayout = () => {
  const theme = useTheme();

  return (
    <Stack
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
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="study_session/[id]" options={{ title: "Study Session" }} />
      <Stack.Screen name="study_session/edit/[id]" options={{ title: "Edit Session" }} />
      <Stack.Screen name="profile/[id]" options={{ title: "Profile" }} />
    </Stack>
  );
};

export default HomeLayout;
