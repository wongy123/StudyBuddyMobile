import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import StudySessionDetails from "@components/StudySession/StudySessionDetails";
import CommentList from "@components/StudySession/CommentList";
import CommentForm from "@components/StudySession/CommentForm";
import { useUser } from "@hooks/useUser";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

export default function StudySessionScreen() {
  const { id: sessionId } = useLocalSearchParams();
  const { colors } = useTheme();
  const { token } = useUser();

  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

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

    setRefreshFlag((prev) => !prev); // Trigger refresh
  };

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 104}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.wrapper}>
          <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <StudySessionDetails session={session} />
            <CommentList
              sessionId={sessionId}
              token={token}
              refreshKey={refreshFlag}
            />
          </ScrollView>

          <View style={[styles.fixedBottom, { backgroundColor: colors.elevation.level1 }]}>
            <CommentForm onSubmit={handleCommentSubmit} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

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
