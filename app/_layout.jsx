import { AuthProvider } from "@context/authContext";
import { Slot } from "expo-router";
import {
  PaperProvider,
  MD3DarkTheme as DefaultTheme,
} from "react-native-paper";
import { darkTheme } from "@constants/theme";

const RootLayout = () => {
  const theme = {
    ...DefaultTheme,
    colors: { ...darkTheme.colors },
  };

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </AuthProvider>
  );
};

export default RootLayout;
