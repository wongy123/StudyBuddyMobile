import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useTheme, ActivityIndicator, Text, Surface } from "react-native-paper";
import EventCard from "./EventCard";

const QUTEventsScreen = () => {
  const { colors } = useTheme();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://n11941073.ifn666.com/StudyBuddy/api/qut-events"
        );
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Failed to load events");
        setEvents(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Surface style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={[styles.center, { backgroundColor: colors.background }]}>
        <Text variant="bodyLarge" style={{ color: colors.error }}>
          {error}
        </Text>
      </Surface>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <EventCard event={item} />}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: colors.background },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});

export default QUTEventsScreen;
