import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Card,
  IconButton,
  Avatar,
  Menu,
} from "react-native-paper";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@hooks/useUser";
import { useRouter } from "expo-router";

const CommentCard = ({
  user: author,
  createdAt,
  content,
  onDelete,
  onUpdate,
}) => {
  const { colors } = useTheme();
  const { user: currentUser } = useUser();
  const router = useRouter();

  const isOwner = currentUser?.id === author?._id;
  const isModmin = ["admin", "moderator"].includes(currentUser?.role);

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSave = () => {
    if (editedContent.trim() && editedContent !== content) {
      onUpdate(editedContent.trim());
    }
    setEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: onDelete, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  const navigateToProfile = () => {
    if (!author?._id) return;
    router.push(
      author._id === currentUser?.id ? "/my_profile" : `/profile/${author._id}`
    );
  };

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surfaceVariant }]}
      elevation={2}
    >
      <Card.Title
        title={
          author ? (
            <Text>
              <TouchableOpacity onPress={navigateToProfile}>
                <Text variant="titleMedium">
                  {author.displayName} (@{author.userName})
                </Text>
              </TouchableOpacity>
            </Text>
          ) : (
            <Text>
              <Text variant="titleMedium">'Deleted User'</Text>
            </Text>
          )
        }
        subtitle={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        left={(props) =>
          author ? (
            <TouchableOpacity onPress={navigateToProfile}>
              <Avatar.Text
                {...props}
                label={author.displayName[0]}
                style={{ backgroundColor: colors.secondaryContainer }}
                labelStyle={{ color: colors.onSecondaryContainer }}
              />
            </TouchableOpacity>
          ) : null
        }
        right={() =>
          (isOwner || isModmin) &&
          !editing && (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={openMenu}
                  iconColor={colors.onSurfaceVariant}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  setEditing(true);
                }}
                title="Edit"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  confirmDelete();
                }}
                title="Delete"
                leadingIcon="delete"
              />
            </Menu>
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
              <Button
                mode="contained"
                onPress={handleSave}
                disabled={!editedContent.trim()}
              >
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
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});

export default CommentCard;
