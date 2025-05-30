import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Text,
  useTheme,
  Snackbar,
} from "react-native-paper";
import StudySessionDetails from "@components/StudySession/StudySessionDetails";
import CommentList from "@components/StudySession/CommentList";
import CommentForm from "@components/StudySession/CommentForm";
import { useUser } from "@hooks/useUser";
import { baseUrl } from "@constants/api";
import { formatDate } from "@utils/formatDate";
import { useRefresh } from "@context/refreshContext";

const StudySessionScreen = () => {
  const router = useRouter();
  const { id: sessionId } = useLocalSearchParams();
  const { colors } = useTheme();
  const { token } = useUser();
  const { refreshKey, triggerRefresh } = useRefresh();

  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    if (!token) {
      router.back();
      Alert.alert("Not authenticated", "Please log in to continue.");
      router.navigate("/login");
    }
  }, [token]);

  if (!token) return null;

  const fetchSession = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setSession(result);
      } else {
        setError(result.message || "Failed to load session.");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId && token) fetchSession();
  }, [sessionId, token]);

  const handleCommentSubmit = async (content) => {
    const res = await fetch(`${baseUrl}/api/sessions/${sessionId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to post comment");
    }

    triggerRefresh();
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        const message = text
          ? JSON.parse(text).message
          : "Failed to delete session";
        throw new Error(message);
      }

      setSnackbarVisible(true);

      // Slight delay before navigating back
      setTimeout(() => {
        triggerRefresh();
        router.navigate("/");
      }, 1500);
    } catch (err) {
      Alert.alert("Delete failed", err.message);
    }
  };

  const handleEdit = () => {
    router.push(`/study_session/edit/${sessionId}`);
  };

  const handleShare = async () => {
    const shareText = `
Study Session Details

📚 ${session.title}
📘 ${session.courseCode}
🗓️ ${formatDate(session.date)}
🕑 ${session.startTime} – ${session.endTime}
📍 ${session.location}
👤 Created by: ${session.createdBy?.displayName} (@${
      session.createdBy?.userName
    })
👥 Participants: ${session.participants.length}

Join this study session in the StudyBuddy app or view it on the web:
https://n11941073.ifn666.com/StudyBuddy/session/${session._id}
`.trim();

    try {
      await Share.share({ message: shareText });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [refreshKey]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 104}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.wrapper}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator
                animating
                size="large"
                color={colors.primary}
              />
            </View>
          ) : error ? (
            <View
              style={[styles.center, { backgroundColor: colors.background }]}
            >
              <Text style={{ color: colors.error }}>{error}</Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1, backgroundColor: colors.background }}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <StudySessionDetails
                session={session}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onJoinSuccess={() => triggerRefresh()}
                onShare={handleShare}
              />
              <CommentList
                sessionId={sessionId}
                token={token}
                refreshKey={refreshKey}
              />
            </ScrollView>
          )}
          {!loading && !error && (
            <View
              style={[
                styles.fixedBottom,
                { backgroundColor: colors.elevation.level1 },
              ]}
            >
              <CommentForm onSubmit={handleCommentSubmit} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
          textColor: colors.onSecondaryContainer,
        }}
        style={{ backgroundColor: colors.secondaryContainer }}
      >
        <Text style={{ color: colors.onSecondaryContainer }}>
          Session deleted successfully
        </Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});

export default StudySessionScreen;
