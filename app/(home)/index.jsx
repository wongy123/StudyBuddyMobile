import React from "react";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { useAuth } from "../../context/authContext";

const Home = () => {

  const { logout } = useAuth();

    const theme = useTheme();

  return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.colors.background
 }}>
        <Link href="study_session" push asChild>
        <Button mode="contained">Home to StudySession</Button>
        </Link>
        <Button mode="contained" onPress={logout}>Logout</Button>
      </View>
  );
};

export default Home;
