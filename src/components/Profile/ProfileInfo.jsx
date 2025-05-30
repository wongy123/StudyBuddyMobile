import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme, ActivityIndicator, Avatar } from 'react-native-paper';
import { baseUrl } from "@constants/api";

const ProfileInfo = ({ userId, token, currentUser }) => {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = currentUser?.id === userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to load user');
        setUser(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="small" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <Text style={{ color: colors.error, textAlign: 'center' }}>{error}</Text>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {user.profilePic ? (
          <Image
            source={{ uri: `${baseUrl}/api/uploads/profile-pic/${userId}/${user.profilePic}` }}
            style={styles.profileImage}
          />
        ) : (
          <Avatar.Text
            label={user.displayName[0]}
            size={96}
            style={{ backgroundColor: colors.secondaryContainer }}
            labelStyle={{ color: colors.onSecondaryContainer }}
          />
        )}
      </View>

      <Text variant="titleLarge" style={styles.displayName}>
        {user.displayName}
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        @{user.userName}
      </Text>

      <View style={styles.section}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          Degree
        </Text>
        <Text variant="bodyLarge">{user.degree || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          Bio
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            color: user.profileBio ? colors.onSurface : colors.onSurfaceVariant,
          }}
        >
          {user.profileBio || 'This user hasn’t written a bio yet.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  center: {
    padding: 16,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginBottom: 8,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: 'cover',
  },
  displayName: {
    marginTop: 4,
  },
  section: {
    width: '100%',
    gap: 4,
  },
});

export default ProfileInfo;
