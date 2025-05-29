import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  ActivityIndicator,
  Text,
  useTheme,
  Snackbar,
} from "react-native-paper";
import StudySessionCard from "@components/StudySessionCard";
import { useUser } from "@hooks/useUser";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

const JoinedSessions = ({ userId, token }) => {
  const { user: currentUser } = useUser();
  const { colors } = useTheme();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") =>
    setSnack({ open: true, message, severity });

  const hideSnack = () => setSnack((prev) => ({ ...prev, open: false }));

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/sessions/joined/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to load sessions");
      setSessions(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) fetchSessions();
  }, [fetchSessions]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return <Text style={[styles.text, { color: colors.error }]}>{error}</Text>;
  }

  if (sessions.length === 0) {
    return (
      <Text style={[styles.text, { color: colors.onSurfaceVariant }]}>
        This user hasn’t joined any sessions yet.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        variant="titleMedium"
        style={{ marginBottom: 8, marginHorizontal: 16 }}
      >
        👥 Joined Sessions
      </Text>
      {sessions.map((session) => (
        <StudySessionCard
          key={session._id}
          {...session}
          user={currentUser} 
          token={token}
          onJoinSuccess={fetchSessions}
          showSnack={showSnack}
        />
      ))}
      <Snackbar
        visible={snack.open}
        onDismiss={hideSnack}
        duration={2500}
        style={{
          position: "absolute",
          bottom: Platform.OS === "android" ? 0 : 32,
          left: 16,
          right: 16,
          backgroundColor: snack.severity === "error" ? colors.error : "green",
        }}
        action={{
          label: "Close",
          onPress: hideSnack,
          labelStyle: { color: "white" },
        }}
      >
        <Text style={{ color: "white" }}>{snack.message}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  text: { marginTop: 12, textAlign: "center" },
  center: { paddingVertical: 32, alignItems: "center" },
});

export default JoinedSessions;
