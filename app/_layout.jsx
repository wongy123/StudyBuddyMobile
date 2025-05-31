import { AuthProvider } from "@context/authContext";
import { Slot } from "expo-router";
import {
  PaperProvider,
  MD3DarkTheme as DefaultTheme,
} from "react-native-paper";
import { darkTheme } from "@constants/theme";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const RootLayout = () => {
  const theme = {
    ...DefaultTheme,
    colors: { ...darkTheme.colors },
  };

useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for notifications!');
        }
      } else {
        console.warn('Must use physical device for push notifications');
      }
    };

    registerForPushNotifications();
  }, []);


  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </AuthProvider>
  );
};

export default RootLayout;
