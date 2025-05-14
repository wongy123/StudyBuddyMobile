import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";

const StudySessionScreen = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Link href="qut_events" asChild>
        <Button mode="contained">StudySession</Button>
      </Link>
    </View>
  );
};

export default StudySessionScreen;
