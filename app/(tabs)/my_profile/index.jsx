import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useUser } from '@hooks/useUser';
import ProfileInfo from '@components/Profile/ProfileInfo';
import JoinedSessions from '@components/Profile/JoinedSessions';

const baseUrl = 'https://n11941073.ifn666.com/StudyBuddy';

export default function MyProfileScreen() {
  const { token, user } = useUser();
  const { colors } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || 'Failed to load profile');
        setCurrentUser(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) fetchProfile();
  }, [user, token]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container]}
      style={{ backgroundColor: colors.background }}
    >
      <ProfileInfo user={currentUser} isOwner token={token} />
      <JoinedSessions userId={currentUser._id} token={token} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
