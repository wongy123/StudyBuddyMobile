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
import { useRouter } from 'expo-router';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const RootLayout = () => {
  const router = useRouter();
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

  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const sessionId = response.notification.request.content.data.sessionId;
      if (sessionId) {
        router.push(`/study_session/${sessionId}`);
      }
    });

    return () => subscription.remove();
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
