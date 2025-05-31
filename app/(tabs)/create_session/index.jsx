import React, { useState, useRef } from "react";
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
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "@hooks/useUser";
import { baseUrl } from "@constants/api";
import { scheduleSessionReminder } from '@utils/notification';


const CreateSessionScreen = () => {
  const router = useRouter();
  const { token } = useUser();
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const locationRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseCode: "",
    date: "",         // for display
    rawDate: null,    // for backend
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

  const [loading, setLoading] = useState(false);

  const showPicker = (mode, field) => {
    setPicker({ show: true, mode, field });
  };

  const onDateTimeChange = (event, selectedDate) => {
    setPicker({ show: false, mode: "date", field: "" });
    if (event.type !== "set" || !selectedDate) return;

    const field = picker.field;

    if (picker.mode === "date") {
      const formatted = selectedDate.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      setForm((prev) => ({
        ...prev,
        date: formatted,
        rawDate: selectedDate,
      }));
    } else {
      const timeStr = selectedDate.toTimeString().slice(0, 5);
      setForm((prev) => ({ ...prev, [field]: timeStr }));
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!form.rawDate) throw new Error("Date is missing or invalid");

      const isoDate = form.rawDate.getFullYear() +
  "-" + String(form.rawDate.getMonth() + 1).padStart(2, "0") +
  "-" + String(form.rawDate.getDate()).padStart(2, "0"); // YYYY-MM-DD

      const payload = {
        ...form,
        date: isoDate,
      };
      delete payload.rawDate;

      const res = await fetch(`${baseUrl}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          result.errors?.[0]?.msg ||
            result.message ||
            "Failed to create session"
        );
      }

      setSnack({
        open: true,
        message: "Session created successfully!",
        error: false,
      });
      await scheduleSessionReminder(result);
      setForm({
        title: "",
        description: "",
        courseCode: "",
        date: "",
        rawDate: null,
        startTime: "",
        endTime: "",
        location: "",
      });

      router.replace(`/study_session/${result._id}`);
    } catch (err) {
      setSnack({ open: true, message: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

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
              Create Study Session
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
                value={form.date}
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

            <View
              ref={locationRef}
              onLayout={({ nativeEvent }) => {
                locationRef.current = nativeEvent.layout;
              }}
            >
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
              disabled={loading}
              loading={loading}
            >
              Create Session
            </Button>
          </ScrollView>

          {picker.show && (
            <DateTimePicker
              mode={picker.mode}
              value={new Date()}
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

export default CreateSessionScreen;
