import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

const EventCard = ({ event }) => {
  const {
    title,
    date,
    startTime,
    endTime,
    where,
    description,
    link,
    image,
  } = event;

  const openLink = () => {
    if (link) Linking.openURL(link);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openLink}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.meta}>
          {date}
          {startTime ? ` • ${startTime}${endTime ? ` – ${endTime}` : ''}` : ''}
        </Text>

        {where ? <Text style={styles.meta}>{where}</Text> : null}

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        <Text style={styles.link}>Tap to learn more ↗︎</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginVertical: 8,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f3f3',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    marginTop: 6,
  },
  link: {
    marginTop: 10,
    fontSize: 12,
    color: '#007aff',
  },
});

export default EventCard;
