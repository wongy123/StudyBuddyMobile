import { Slot } from "expo-router";
import { useTheme, MD3DarkTheme } from "react-native-paper";
import { View } from "react-native";

const ProfileLayout = () => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Slot />
    </View>
  );
};

export default ProfileLayout;
