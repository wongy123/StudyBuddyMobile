import React from "react";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { Link } from "expo-router";

const Home = () => {

    const theme = useTheme();

  return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.colors.background
 }}>
        <Link href="study_session" push asChild>
        <Button mode="contained">Home to StudySession</Button>
        </Link>
      </View>
  );
};

export default Home;
