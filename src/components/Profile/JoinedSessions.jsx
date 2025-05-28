import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import StudySessionCard from "@components/StudySessionCard";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

const JoinedSessions = ({ user, token }) => {
  const { colors } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/sessions/joined/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to load sessions");
        setSessions(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) fetchSessions();
  }, [user?.id, token]);

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
      <Text variant="titleMedium" style={{ marginBottom: 8, marginHorizontal: 16 }}>
        👥 Joined Sessions
      </Text>
      {sessions.map((session) => (
        <StudySessionCard
          key={session._id}
          {...session}
          user={user}
          token={token}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  text: {
    marginTop: 12,
    textAlign: "center",
  },
  center: {
    paddingVertical: 32,
    alignItems: "center",
  },
});

export default JoinedSessions;
