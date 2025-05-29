import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider, useTheme } from 'react-native-paper';
import { formatDate } from '@utils/formatDate';
import { useUser } from '@hooks/useUser';
import { useRouter } from 'expo-router';

const StudySessionDetails = ({ session }) => {
  const { colors } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const navigateToProfile = (targetId) => {
    if (!targetId) return;
    router.push(targetId === user?.id ? '/my_profile' : `/profile/${targetId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={{ color: colors.onBackground }}>
        {session.title}
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginBottom: 8 }}>
        📘 {session.courseCode}
      </Text>

      <Divider style={{ marginVertical: 8 }} />

      <Text variant="bodyLarge" style={{ color: colors.onSurface }}>{session.description}</Text>

      <View style={styles.detailGroup}>
        <Text style={{ color: colors.onSurfaceVariant }}>
          📅 {formatDate(session.date)}
        </Text>
        <Text style={{ color: colors.onSurfaceVariant }}>
          🕑 {session.startTime} – {session.endTime}
        </Text>
        <Text style={{ color: colors.onSurfaceVariant }}>
          📍 {session.location}
        </Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <Text style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>
        🎓 Created by
      </Text>
      {session.createdBy ? (
        <TouchableOpacity onPress={() => navigateToProfile(session.createdBy._id)}>
          <View style={styles.creatorInfo}>
            <Avatar.Text
              size={36}
              label={session.createdBy.displayName[0]}
              style={{ backgroundColor: colors.secondaryContainer }}
              labelStyle={{ color: colors.onSecondaryContainer }}
            />
            <Text style={{ color: colors.onSurface, marginLeft: 8 }}>
              {session.createdBy.displayName} (@{session.createdBy.userName})
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={{ color: colors.onSurfaceVariant }}>Deleted User</Text>
      )}

      <Text style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>
        👥 Participants ({session.participants.length})
      </Text>
      <View style={styles.participants}>
        {session.participants.map((p) => (
          <TouchableOpacity key={p._id} onPress={() => navigateToProfile(p._id)}>
            <View style={styles.participant}>
              <Avatar.Text
                size={32}
                label={p.displayName[0]}
                style={{ backgroundColor: colors.secondaryContainer }}
                labelStyle={{ color: colors.onSecondaryContainer }}
              />
              <Text style={{ color: colors.onSurface, marginLeft: 8 }}>
                {p.displayName} (@{p.userName})
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Divider style={{ marginVertical: 16 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  detailGroup: {
    marginTop: 12,
    marginBottom: 12,
    gap: 4,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participants: {
    gap: 8,
    marginBottom: 8,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StudySessionDetails;
