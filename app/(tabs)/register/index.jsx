import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import {
  TextInput,
  Button,
  Snackbar,
  Text,
  HelperText,
  useTheme,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../src/context/authContext";
import { validate as isEmail } from "email-validator";
import { baseUrl } from "@constants/api";


const RegisterScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const redirect = params?.redirect || "/";

  // ─── form state
  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // ─── field-error flags
  const [err, setErr] = useState({
    userName: false,
    email: false,
    degree: false,
    password: false,
    confirm: false,
  });

  // ─── snackbar
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const showSnack = (msg) => {
    setSnackMsg(msg);
    setSnackVisible(true);
  };

  const { login } = useAuth();

  /** Clears all inputs, errors, and snackbar */
  const resetForm = () => {
    setUserName("");
    setDisplayName("");
    setEmail("");
    setDegree("");
    setPassword("");
    setConfirm("");
    setErr({
      userName: false,
      email: false,
      degree: false,
      password: false,
      confirm: false,
    });
    setSnackVisible(false);
    setSnackMsg("");
  };

  // Reset every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

  // ─── submit handler (unchanged)
  const handleRegister = async () => {
    const newErr = {
      userName: userName.trim() === "",
      email: !isEmail(email),
      degree: degree.trim() === "",
      password: password === "",
      confirm: confirm !== password || confirm === "",
    };
    setErr(newErr);
    if (Object.values(newErr).some(Boolean)) {
      showSnack("Please fix the errors in the form");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          displayName,
          email,
          password,
          degree,
          profileBio: "",
        }),
      });
      const regData = await res.json();
      if (!res.ok) {
        showSnack(regData.message || "Registration failed");
        return;
      }

      const lgRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const lgData = await lgRes.json();
      if (!lgRes.ok) {
        showSnack(lgData.message || "Auto-login failed");
        return;
      }

      await login(lgData.token);
      router.replace(redirect);
    } catch {
      showSnack("Network error. Please try again.");
    }
  };

  // ─── UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={[
          { flex: 1 },
          Platform.OS === "android" && { paddingBottom: 96 },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
              gap: 12,
            }}
          >
            <Text
              variant="headlineMedium"
              style={{ color: colors.onBackground }}
            >
              Create account
            </Text>

            {/* Username */}
            <TextInput
              label="Username *"
              mode="outlined"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              error={err.userName}
            />
            {err.userName && (
              <HelperText type="error">Username is required</HelperText>
            )}

            {/* Display name */}
            <TextInput
              label="Display name"
              mode="outlined"
              value={displayName}
              onChangeText={setDisplayName}
            />

            {/* Email */}
            <TextInput
              label="Email *"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={err.email}
            />
            {err.email && (
              <HelperText type="error">Enter a valid email address</HelperText>
            )}

            {/* Degree */}
            <TextInput
              label="Degree *"
              mode="outlined"
              value={degree}
              onChangeText={setDegree}
              placeholder="e.g. B.IT, MCompSc"
              error={err.degree}
            />
            {err.degree && (
              <HelperText type="error">Degree is required</HelperText>
            )}

            {/* Password */}
            <TextInput
              label="Password *"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              error={err.password}
            />
            {err.password && (
              <HelperText type="error">Password cannot be empty</HelperText>
            )}

            {/* Confirm */}
            <TextInput
              label="Confirm password *"
              mode="outlined"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoCapitalize="none"
              error={err.confirm}
            />
            {err.confirm && (
              <HelperText type="error">Passwords do not match</HelperText>
            )}

            <Button mode="contained" onPress={handleRegister}>
              Register
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>

        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={2500}
          style={{
            backgroundColor: colors.error,
            marginBottom: Platform.OS === "android" ? 48 : 0,
          }}
        >
          {snackMsg}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
