import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function MyProfileLayout() {
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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Profile" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
    </Stack>
  );
}
