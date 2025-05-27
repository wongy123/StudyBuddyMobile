import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { useAuth } from "@context/authContext";

const CreateSessionScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="logout" size={24} onPress={logout} />
      </View>

      <TextInput
        mode="outlined"
        label="Label"
        placeholder="Placeholder"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "flex-end",
  },
});

export default CreateSessionScreen;
