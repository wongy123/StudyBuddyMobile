import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Pressable,
  View,
} from "react-native";
import {
  TextInput,
  Button,
  useTheme,
  Text,
  Snackbar,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "@hooks/useUser";

const baseUrl = "https://n11941073.ifn666.com/StudyBuddy";

const EditSessionScreen = () => {
  const router = useRouter();
  const { id: sessionId } = useLocalSearchParams();
  const { token } = useUser();
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const locationRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseCode: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    location: "",
  });

  const [picker, setPicker] = useState({
    show: false,
    mode: "date",
    field: "",
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    error: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch session");

      setForm({
        title: result.title,
        description: result.description,
        courseCode: result.courseCode || "",
        date: new Date(result.date),
        startTime: result.startTime,
        endTime: result.endTime,
        location: result.location,
      });
    } catch (err) {
      setSnack({ open: true, message: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId && token) fetchSession();
  }, [sessionId, token]);

  const showPicker = (mode, field) => {
    setPicker({ show: true, mode, field });
  };

  const onDateTimeChange = (event, selectedDate) => {
    setPicker({ show: false, mode: "date", field: "" });
    if (event.type !== "set" || !selectedDate) return;
    setForm((prev) => ({ ...prev, [picker.field]: selectedDate }));
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const isoDate = form.date.toISOString().slice(0, 10);

      const payload = {
        ...form,
        date: isoDate,
      };

      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update session");

      setSnack({
        open: true,
        message: "Session updated successfully!",
        error: false,
      });
      router.replace(`/study_session/${sessionId}`);
    } catch (err) {
      setSnack({ open: true, message: err.message, error: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 16,
              paddingBottom: 96,
              paddingTop: 24,
              gap: 12,
            }}
          >
            <Text
              variant="headlineMedium"
              style={{ color: colors.onBackground }}
            >
              Edit Study Session
            </Text>

            <TextInput
              label="Title *"
              mode="outlined"
              value={form.title}
              onChangeText={(t) => handleChange("title", t)}
            />
            <TextInput
              label="Description *"
              mode="outlined"
              value={form.description}
              onChangeText={(t) => handleChange("description", t)}
              multiline
              style={{ minHeight: 100 }}
            />
            <TextInput
              label="Course Code (optional)"
              mode="outlined"
              value={form.courseCode}
              onChangeText={(t) => handleChange("courseCode", t)}
            />

            <Pressable onPress={() => showPicker("date", "date")}>
              <TextInput
                label="Date *"
                mode="outlined"
                value={form.date.toLocaleDateString("en-AU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => showPicker("date", "date")}
                  />
                }
              />
            </Pressable>

            <Pressable onPress={() => showPicker("time", "startTime")}>
              <TextInput
                label="Start Time *"
                mode="outlined"
                value={form.startTime}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="clock-start"
                    onPress={() => showPicker("time", "startTime")}
                  />
                }
              />
            </Pressable>
            <Pressable onPress={() => showPicker("time", "endTime")}>
              <TextInput
                label="End Time *"
                mode="outlined"
                value={form.endTime}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="clock-end"
                    onPress={() => showPicker("time", "endTime")}
                  />
                }
              />
            </Pressable>

            <View ref={locationRef}>
              <TextInput
                label="Location *"
                mode="outlined"
                value={form.location}
                onChangeText={(t) => handleChange("location", t)}
                onFocus={() => {
                  if (locationRef.current) {
                    scrollRef.current?.scrollTo({
                      y: locationRef.current.y - 100,
                      animated: true,
                    });
                  }
                }}
              />
            </View>

            <Button
              mode="contained"
              style={{ marginTop: 8 }}
              onPress={handleSubmit}
              disabled={saving}
              loading={saving}
            >
              Save Changes
            </Button>
          </ScrollView>

          {picker.show && (
            <DateTimePicker
              mode={picker.mode}
              value={form[picker.field] || new Date()}
              display="default"
              is24Hour
              onChange={onDateTimeChange}
            />
          )}

          <Snackbar
            visible={snack.open}
            onDismiss={() => setSnack({ ...snack, open: false })}
            duration={3000}
            style={{
              backgroundColor: snack.error ? colors.error : "green",
              marginBottom: Platform.OS === "android" ? 48 : 0,
            }}
          >
            <Text style={{ color: "white" }}>{snack.message}</Text>
          </Snackbar>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditSessionScreen;
