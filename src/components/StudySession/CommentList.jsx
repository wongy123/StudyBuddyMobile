import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Snackbar, useTheme } from "react-native-paper";
import CommentCard from "./CommentCard";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

const CommentList = ({ sessionId, token, refreshKey }) => {
  const { colors } = useTheme();

  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const hideSnack = () => setSnack((prev) => ({ ...prev, open: false }));

  const fetchComments = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setComments(result.data.comments);
        setError(null);
      } else {
        setError(result.message || "Failed to load comments.");
      }
    } catch {
      setError("Network error loading comments.");
    }
  };

  useEffect(() => {
    if (token && sessionId) fetchComments();
  }, [refreshKey]);

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/sessions/${sessionId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const text = await res.text();
      const result = text ? JSON.parse(text) : {};

      if (res.ok) {
        showSnack(result.message || "Comment deleted.");
        fetchComments();
      } else {
        showSnack(result.message || "Failed to delete comment.", "error");
      }
    } catch {
      showSnack("Network error deleting comment.", "error");
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/sessions/${sessionId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      const result = await res.json();

      if (res.ok) {
        showSnack("Comment updated.");
        fetchComments();
      } else {
        showSnack(result.message || "Failed to update comment.", "error");
      }
    } catch {
      showSnack("Network error updating comment.", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Text
        variant="titleMedium"
        style={{ marginBottom: 8, color: colors.onSurface }}
      >
        💬 Comments
      </Text>

      {error && <Text style={{ color: colors.error }}>{error}</Text>}

      {comments.length === 0 && !error ? (
        <Text style={{ color: colors.onSurfaceVariant }}>
          No one has commented yet.
        </Text>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment._id}
            {...comment}
            onDelete={() => handleDelete(comment._id)}
            onUpdate={(updatedContent) =>
              handleUpdate(comment._id, updatedContent)
            }
          />
        ))
      )}

      <Snackbar
        visible={snack.open}
        onDismiss={hideSnack}
        duration={2500}
        style={{
          backgroundColor:
            snack.severity === "error" ? colors.errorContainer : "green",
        }}
        action={{
          label: "Close",
          onPress: hideSnack,
          labelStyle: {
            color:
              snack.severity === "error" ? colors.onErrorContainer : "white",
          },
        }}
      >
        <Text
          style={{
            color:
              snack.severity === "error" ? colors.onErrorContainer : "white",
          }}
        >
          {snack.message}
        </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 16,
  },
});

export default CommentList;
