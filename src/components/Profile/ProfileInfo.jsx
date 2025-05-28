import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useUser } from '@hooks/useUser';

const ProfileInfo = ({ user, isOwner }) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge">{user.displayName}</Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            @{user.userName}
          </Text>
        </View>

        {isOwner && (
          <Button mode="outlined" onPress={() => router.push('/my_profile/edit')}>
            Edit
          </Button>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>Degree</Text>
        <Text variant="bodyLarge">{user.degree || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>Bio</Text>
        <Text
          variant="bodyLarge"
          style={{ color: user.profileBio ? colors.onSurface : colors.onSurfaceVariant }}
        >
          {user.profileBio || 'This user hasn’t written a bio yet.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    gap: 4,
  },
});

export default ProfileInfo;
