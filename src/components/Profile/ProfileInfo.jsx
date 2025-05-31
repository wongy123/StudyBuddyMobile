import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text, useTheme, ActivityIndicator, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "@constants/api";

const ProfileInfo = ({ userId, token, currentUser }) => {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = currentUser?.id === userId;

  const fetchUser = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to load user");
      setUser(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchUser();
  }, [userId, token]);

  const pickImageAndUpload = async () => {
  Alert.alert(
    "Update Profile Picture",
    "Upload an image from your library or take a new photo.",
    [
            
      { text: "Cancel", style: "cancel" },
      {
        text: "Choose from Library",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });

          if (!result.canceled) {
            await uploadImage(result.assets[0]);
          }
        },
      },
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });

          if (!result.canceled) {
            await uploadImage(result.assets[0]);
          }
        },
      },

    ],
    { cancelable: true }
  );
};

const uploadImage = async (asset) => {
  const localUri = asset.uri;
  const filename = localUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename || "");
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append("profilePic", {
    uri: localUri,
    name: filename,
    type,
  });

  try {
    const res = await fetch(`${baseUrl}/api/users/${userId}/profile-pic`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Upload failed");
    }

    await fetchUser(); // Refresh
  } catch (err) {
    Alert.alert("Upload failed", err.message);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="small" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <Text style={{ color: colors.error, textAlign: "center" }}>{error}</Text>
    );
  }

  if (!user) return null;

  const AvatarDisplay = user.profilePic ? (
    <Image
      source={{
        uri: `${baseUrl}/api${user.profilePic}?v=${user.profilePicVersion}`,
      }}
      style={styles.profileImage}
    />
  ) : (
    <Avatar.Text
      label={user.userName[0].toUpperCase()}
      size={96}
      style={{ backgroundColor: colors.secondaryContainer }}
      labelStyle={{ color: colors.onSecondaryContainer }}
    />
  );

  return (
 <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {isOwner ? (
          <TouchableOpacity onPress={pickImageAndUpload}>
            {AvatarDisplay}
          </TouchableOpacity>
        ) : (
          AvatarDisplay
        )}
      </View>

      <Text variant="titleLarge" style={styles.displayName}>
        {user.displayName}
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        @{user.userName}
      </Text>

      <View style={styles.section}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          Degree
        </Text>
        <Text variant="bodyLarge">{user.degree || "Not specified"}</Text>
      </View>

      <View style={styles.section}>
        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
          Bio
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            color: user.profileBio
              ? colors.onSurface
              : colors.onSurfaceVariant,
          }}
        >
          {user.profileBio || "This user hasn’t written a bio yet."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: "center",
  },
  center: {
    padding: 16,
    alignItems: "center",
  },
  avatarWrapper: {
    marginBottom: 8,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: "cover",
  },
  displayName: {
    marginTop: 4,
  },
  section: {
    width: "100%",
    gap: 4,
  },
});

export default ProfileInfo;
