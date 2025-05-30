import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  Card,
  Text,
  Button,
  Avatar,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useJoinOrLeaveSession } from "@hooks/useJoinOrLeaveSession";
import { formatDate } from "@utils/formatDate";
import { baseUrl } from "@constants/api";

const StudySessionCard = ({
  _id,
  title,
  description,
  courseCode,
  date,
  startTime,
  endTime,
  location,
  createdBy,
  participants,
  user,
  token,
  onJoinSuccess,
  showSnack,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const userId = user?.id;

  const isParticipant = useMemo(
    () => participants.some((p) => String(p._id) === String(userId)),
    [participants, userId]
  );

  const { handleJoinOrLeave, loading } = useJoinOrLeaveSession({
    sessionId: _id,
    isParticipant,
    onSuccess: () => {
      onJoinSuccess?.();
      showSnack?.(
        `Successfully ${isParticipant ? "left" : "joined"} the session!`,
        "success"
      );
    },
    onError: (msg) => showSnack?.(msg, "error"),
  });

  const shortDesc =
    description.length > 100 ? `${description.slice(0, 100)}…` : description;

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surfaceVariant }]}
      elevation={2}
    >
      <TouchableOpacity
        onPress={() => token && router.push(`/study_session/${_id}`)}
        disabled={!token}
      >
        <Card.Title
          title={title}
          subtitle={`📘 ${courseCode}`}
          titleStyle={{ color: colors.onSurface }}
          subtitleStyle={{ color: colors.onSurfaceVariant }}
          right={() =>
            createdBy && (
              <TouchableOpacity
      onPress={() => {
        requestAnimationFrame(() =>
          router.push(
            createdBy._id === userId
              ? "/my_profile"
              : `/profile/${createdBy._id}`
          )
        );
      }}
    >
                {createdBy.profilePic ? (
                  <Image
                    source={{
                      uri: `${baseUrl}/api${createdBy.profilePic}?v=${createdBy.profilePicVersion}`,
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      marginHorizontal: 16,
                    }}
                  />
                ) : (
                  <Avatar.Text
                    size={36}
                    label={createdBy.userName[0].toUpperCase()}
                    style={{
                      backgroundColor: colors.secondaryContainer,
                      marginHorizontal: 16,
                    }}
                    labelStyle={{ color: colors.onSecondaryContainer }}
                  />
                )}
              </TouchableOpacity>
            )
          }
        />
        <Card.Content>
          <Text
            variant="bodyMedium"
            style={{ color: colors.onSurface, marginBottom: 8 }}
          >
            {shortDesc}
          </Text>
          <View style={styles.detailColumn}>
            <Text style={{ color: colors.onSurfaceVariant }}>
              📅 {formatDate(date)}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }}>
              🕑 {startTime} – {endTime}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }}>
              📍 {location}
            </Text>
          </View>
          <Text style={{ color: colors.onSurfaceVariant, marginBottom: 8 }}>
            👥 Participants:{" "}
            {participants.length +
              (isParticipant &&
              !participants.some((p) => String(p._id) === String(userId))
                ? 1
                : 0)}
          </Text>
        </Card.Content>
      </TouchableOpacity>

      {token && (
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => router.push(`/study_session/${_id}`)}
            textColor={colors.primary}
          >
            View
          </Button>
          <Button
            mode="contained"
            onPress={handleJoinOrLeave}
            buttonColor={isParticipant ? colors.error : colors.primary}
            disabled={loading}
            icon={
              loading
                ? () => (
                    <ActivityIndicator
                      animating
                      color={colors.onPrimary}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                  )
                : undefined
            }
          >
            {isParticipant ? "Leave" : "Join"}
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingBottom: 8,
  },
  detailColumn: {
    gap: 4,
    marginBottom: 4,
  },
  actions: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
});

export default StudySessionCard;
