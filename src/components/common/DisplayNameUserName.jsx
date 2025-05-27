import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';

const DisplayNameUserName = ({ userName, displayName, id }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={{ color: colors.onSurface }}>
        {displayName}{' '}
      </Text>
      <Link href={`/profile/${id}`} asChild>
        <Text variant="bodySmall" style={{ color: colors.primary }}>
          (@{userName})
        </Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default DisplayNameUserName;
