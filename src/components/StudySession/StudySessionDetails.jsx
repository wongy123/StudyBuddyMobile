import React from "react";
import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import {
  Text,
  Avatar,
  Divider,
  useTheme,
  Button,
  ActivityIndicator,
  Menu,
  IconButton,
} from "react-native-paper";
import { formatDate } from "@utils/formatDate";
import { useUser } from "@hooks/useUser";
import { useRouter } from "expo-router";
import { useJoinOrLeaveSession } from "@hooks/useJoinOrLeaveSession";
import { baseUrl } from "@constants/api";


const StudySessionDetails = ({
  session,
  onDelete,
  onEdit,
  onJoinSuccess,
  onShare,
}) => {
  const { colors } = useTheme();
  const { user, token } = useUser();
  const router = useRouter();

  const isOwner = user?.id === session.createdBy?._id;
  const isParticipant = session.participants.some((p) => p._id === user?.id);

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigateToProfile = (targetId) => {
    if (!targetId) return;
    router.push(targetId === user?.id ? "/my_profile" : `/profile/${targetId}`);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this study session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete?.() },
      ],
      { cancelable: true }
    );
  };

  const { handleJoinOrLeave, loading } = useJoinOrLeaveSession({
    sessionId: session._id,
    isParticipant,
    onSuccess: () => {
      onJoinSuccess?.();
      setSnack({
        open: true,
        message: `Successfully ${
          isParticipant ? "left" : "joined"
        } the session!`,
        severity: "success",
      });
    },
    onError: (msg) => {
      setSnack({ open: true, message: msg, severity: "error" });
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={{ color: colors.onBackground }}>
        {session.title}
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: colors.onSurfaceVariant, marginBottom: 8 }}
      >
        📘 {session.courseCode}
      </Text>

      <Divider style={{ marginVertical: 8 }} />

      <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
        {session.description}
      </Text>

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
        <TouchableOpacity
          onPress={() => navigateToProfile(session.createdBy._id)}
        >
          <View style={styles.creatorInfo}>
            {session.createdBy.profilePic ? (
              <Image
                source={{
                  uri: `${baseUrl}/api${session.createdBy.profilePic}?v=${session.createdBy.profilePicVersion}`,
                }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : (
              <Avatar.Text
                size={32}
                label={session.createdBy.userName[0].toUpperCase()}
                style={{ backgroundColor: colors.secondaryContainer }}
                labelStyle={{ color: colors.onSecondaryContainer }}
              />
            )}
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
          <TouchableOpacity
            key={p._id}
            onPress={() => navigateToProfile(p._id)}
          >
            <View style={styles.participant}>
              {p.profilePic ? (
                <Image
                  source={{
                    uri: `${baseUrl}/api${p.profilePic}?v=${p.profilePicVersion}`,
                  }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
              ) : (
                <Avatar.Text
                  size={32}
                  label={p.userName[0].toUpperCase()}
                  style={{ backgroundColor: colors.secondaryContainer }}
                  labelStyle={{ color: colors.onSecondaryContainer }}
                />
              )}
              <Text style={{ color: colors.onSurface, marginLeft: 8 }}>
                {p.displayName} (@{p.userName})
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Divider style={{ marginVertical: 8 }} />
      {token && (
        <View style={styles.bottomActions}>
          <Button
            mode="contained"
            onPress={handleJoinOrLeave}
            loading={loading}
            disabled={loading}
            icon={isParticipant ? "account-minus" : "account-plus"}
            buttonColor={isParticipant ? colors.error : colors.primary}
            textColor={colors.onPrimary}
          >
            {isParticipant ? "Leave" : "Join"}
          </Button>
          <View style={styles.rightButtons}>
          <Button
            icon="share-variant"
            onPress={() => {
              onShare();
            }}
            textColor={colors.primary}
          >
            Share
          </Button>
          {isOwner && (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={openMenu}
                  iconColor={colors.onBackground}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onEdit?.();
                }}
                leadingIcon="pencil"
                title="Edit"
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  confirmDelete();
                }}
                leadingIcon="delete"
                title="Delete"
              />
            </Menu>
          )}
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  participants: {
    gap: 8,
    marginBottom: 8,
  },
  participant: {
    flexDirection: "row",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightButtons: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
},
});

export default StudySessionDetails;
