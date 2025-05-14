import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  TextInput,
  Button,
  useTheme,
  Snackbar,
  Text,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/authContext";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

const LoginScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const backgroundLocation = params?.redirect || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await login(data.token);
        router.replace(backgroundLocation);
      } else {
        setErrorMessage(data.message || "Login failed");
        setErrorVisible(true);
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
      setErrorVisible(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ gap: 12 }}>
          <Text variant="headlineMedium" style={{ color: colors.onBackground }}>
            Login
          </Text>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button mode="contained" onPress={handleLogin}>
            Login
          </Button>
        </View>

        <Snackbar
          visible={errorVisible}
          onDismiss={() => setErrorVisible(false)}
          duration={2000}
          style={{ backgroundColor: colors.error }}
        >
          {errorMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
