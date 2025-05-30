import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useUser } from "@hooks/useUser";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProfileInfo from "@components/Profile/ProfileInfo";
import JoinedSessions from "@components/Profile/JoinedSessions";

const PublicProfileScreen = () => {
  const { user, token } = useUser();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  // If viewing own profile, redirect
  if (user && id === user.id) {
    router.replace("/my_profile");
    return null;
  }

  if (!user || !token || !id) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }}
    >
      <ProfileInfo userId={id} token={token} currentUser={user} />
      <JoinedSessions userId={id} token={token} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default PublicProfileScreen;
