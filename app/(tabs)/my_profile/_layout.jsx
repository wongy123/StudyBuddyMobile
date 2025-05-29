import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

const MyProfileLayout = () => {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        statusBarStyle: "auto",
        headerStyle: { backgroundColor: theme.colors.elevation.level1 },
        headerTintColor: theme.colors.onBackground,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Profile" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
    </Stack>
  );
};

export default MyProfileLayout;
