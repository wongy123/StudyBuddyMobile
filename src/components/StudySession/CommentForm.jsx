import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';

const MAX_LENGTH = 500;

const CommentForm = ({ onSubmit }) => {
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLimitReached = content.length >= MAX_LENGTH;

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Write a comment..."
        value={content}
        onChangeText={setContent}
        maxLength={MAX_LENGTH}
        style={styles.input}
        returnKeyType="done"
      />
      <View style={styles.footer}>
        <Text
          style={[
            styles.counter,
            {
              color: isLimitReached ? colors.error : colors.onSurfaceVariant,
            },
          ]}
        >
          {content.length} / {MAX_LENGTH}
        </Text>
        <Button
          mode="contained"
          onPress={handlePost}
          disabled={!content.trim() || loading}
          loading={loading}
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
        >
          Post
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    fontSize: 12,
  },
});

export default CommentForm;
