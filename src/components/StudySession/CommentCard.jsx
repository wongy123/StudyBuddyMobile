import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Card,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@hooks/useUser';

const CommentCard = ({ user: author, createdAt, content, onDelete, onUpdate }) => {
  const { colors } = useTheme();
  const { user: currentUser } = useUser();
  const isOwner = currentUser?.id === author?._id;
  const isModmin = ['admin', 'moderator'].includes(currentUser?.role);

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    if (editedContent.trim() && editedContent !== content) {
      onUpdate(editedContent.trim());
    }
    setEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: onDelete, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <Card   style={[styles.card, { backgroundColor: colors.surfaceVariant }]} elevation={2}>
      <Card.Title
        title={author?.displayName || 'Deleted User'}
        subtitle={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        left={(props) =>
          author ? (
            <Avatar.Text
              {...props}
              label={author.displayName[0]}
              style={{ backgroundColor: colors.secondaryContainer }}
              labelStyle={{ color: colors.onSecondaryContainer }}
            />
          ) : null
        }
        right={(props) =>
          (isOwner || isModmin) && !editing && (
            <View style={{ flexDirection: 'row' }}>
              <IconButton {...props} icon="pencil" onPress={() => setEditing(true)} />
              <IconButton {...props} icon="delete" onPress={confirmDelete} />
            </View>
          )
        }
      />
      <Card.Content>
        {editing ? (
          <>
            <TextInput
              mode="outlined"
              value={editedContent}
              onChangeText={setEditedContent}
              maxLength={500}
              style={styles.input}
            />
            <View style={styles.actions}>
              <Button mode="text" onPress={() => setEditing(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleSave} disabled={!editedContent.trim()}>
                Save
              </Button>
            </View>
          </>
        ) : (
          <Text style={{ color: colors.onSurface }}>{content}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 2,
    marginHorizontal: 8,
  },
  input: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default CommentCard;
