import React, { useCallback, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useUser } from "@hooks/useUser";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import ProfileInfo from "@components/Profile/ProfileInfo";
import JoinedSessions from "@components/Profile/JoinedSessions";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

const PublicProfileScreen = () => {
  const { user, token } = useUser();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (!token || !user) return;
      if (id === user.id) {
        router.replace("/my_profile"); // Redirect to own profile tab
        return;
      }

      const fetchUser = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${baseUrl}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "User not found");
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [id, user, token])
  );

  if (!user || !token) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }}
    >
      <ProfileInfo userId={id} token={token} />
      <JoinedSessions key={id} userId={id} token={token} />
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
