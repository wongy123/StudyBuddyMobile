import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Divider, useTheme, Button } from 'react-native-paper';
import { formatDate } from '@utils/formatDate';
import { useUser } from '@hooks/useUser';
import { useRouter } from 'expo-router';

const StudySessionDetails = ({ session, onDelete, onEdit }) => {
  const { colors } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const isOwner = user?.id === session.createdBy?._id;

  const navigateToProfile = (targetId) => {
    if (!targetId) return;
    router.push(targetId === user?.id ? '/my_profile' : `/profile/${targetId}`);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this study session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete?.() },
      ],
      { cancelable: true }
    );
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
            {isOwner && (
        <View style={styles.actions}>
          <Button
            icon="pencil"
            mode="outlined"
            onPress={() => onEdit?.()}
            textColor={colors.primary}
          >
            Edit
          </Button>
          <Button
            icon="delete"
            mode="contained"
            onPress={confirmDelete}
            buttonColor={colors.error}
            textColor={colors.onError}
          >
            Delete
          </Button>
        </View>
      )}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});

export default StudySessionDetails;
