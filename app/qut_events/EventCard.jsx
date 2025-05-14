import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Text, useTheme, Card } from "react-native-paper";

const EventCard = ({ event }) => {
  const { title, date, startTime, endTime, where, description, link, image } =
    event;

  const { colors } = useTheme();

  const openLink = () => {
    if (link) Linking.openURL(link);
  };

  return (
    <TouchableOpacity
      onPress={openLink}
      style={{ marginVertical: 8, marginHorizontal: 12 }}
    >
      <Card
        style={[styles.card, { backgroundColor: colors.surfaceVariant }]}
        mode="elevated"
      >
        {image ? (
          <Card.Cover
            source={{ uri: image }}
            resizeMode="contain"
            style={{ backgroundColor: colors.onSurfaceVariant }}
          />
        ) : null}

        <Card.Content style={styles.content}>
          <Text
            variant="titleMedium"
            style={[styles.title, { color: colors.onSurface }]}
          >
            {title}
          </Text>

          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {date}
            {startTime
              ? ` • ${startTime}${endTime ? ` – ${endTime}` : ""}`
              : ""}
          </Text>

          {where ? (
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {where}
            </Text>
          ) : null}

          {description ? (
            <Text
              variant="bodyMedium"
              style={[styles.description, { color: colors.onSurface }]}
            >
              {description}
            </Text>
          ) : null}

          <Text
            variant="bodySmall"
            style={[styles.link, { color: colors.primary }]}
          >
            Tap to learn more ↗︎
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  content: {
    paddingTop: 12,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginTop: 6,
  },
  link: {
    marginTop: 10,
  },
});

export default EventCard;
