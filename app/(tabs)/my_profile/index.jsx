import React, { useCallback, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, useTheme, Button, ActivityIndicator } from "react-native-paper";
import { useUser } from "@hooks/useUser";
import { useAuth } from "@context/authContext";
import { useRouter, useFocusEffect } from "expo-router";
import ProfileInfo from "@components/Profile/ProfileInfo";
import JoinedSessions from "@components/Profile/JoinedSessions";
import { baseUrl } from "@constants/api";

const MyProfileScreen = () => {
  const { token, user } = useUser();
  const { logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${baseUrl}/api/users/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (!res.ok)
            throw new Error(result.message || "Failed to load profile");
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (user?.id && token) fetchProfile();
    }, [user, token])
  );

  if (!user || !token) {
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
      {loading ? (
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <ActivityIndicator animating size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <Text style={{ color: colors.error, textAlign: "center" }}>
          {error}
        </Text>
      ) : (
        <>
          <View style={styles.header}>
            <Button
              mode="outlined"
              onPress={() => router.push("/my_profile/edit")}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                logout();
                router.replace("/(tabs)/(home)");
              }}
              buttonColor={colors.error}
            >
              Log Out
            </Button>
          </View>

          <ProfileInfo userId={user.id} token={token} currentUser={user} />
          <JoinedSessions userId={user.id} token={token} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 16,
    marginHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default MyProfileScreen;
