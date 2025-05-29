import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, ActivityIndicator, useTheme, Button, TextInput } from 'react-native-paper';
import { useUser } from '@hooks/useUser';
import { useRouter, useLocalSearchParams } from 'expo-router';

const baseUrl = 'https://n11941073.ifn666.com/StudyBuddy';

const EditStudySessionScreen = () => {
  const { id: sessionId } = useLocalSearchParams();
  const { token } = useUser();
  const { colors } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseCode: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to load session');
        setFormData({
          title: result.title || '',
          description: result.description || '',
          courseCode: result.courseCode || '',
          date: result.date || '',
          startTime: result.startTime || '',
          endTime: result.endTime || '',
          location: result.location || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && token) fetchSession();
  }, [sessionId, token]);

  const handleChange = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to update session');
      router.push(`/study_session/${sessionId}`);
    } catch (err) {
      Alert.alert('Update failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background }}>
      <TextInput
        label="Title"
        mode="outlined"
        value={formData.title}
        onChangeText={handleChange('title')}
        style={styles.input}
      />
      <TextInput
        label="Description"
        mode="outlined"
        value={formData.description}
        onChangeText={handleChange('description')}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <TextInput
        label="Course Code"
        mode="outlined"
        value={formData.courseCode}
        onChangeText={handleChange('courseCode')}
        style={styles.input}
      />
      <TextInput
        label="Date"
        mode="outlined"
        value={formData.date}
        onChangeText={handleChange('date')}
        style={styles.input}
      />
      <TextInput
        label="Start Time"
        mode="outlined"
        value={formData.startTime}
        onChangeText={handleChange('startTime')}
        style={styles.input}
      />
      <TextInput
        label="End Time"
        mode="outlined"
        value={formData.endTime}
        onChangeText={handleChange('endTime')}
        style={styles.input}
      />
      <TextInput
        label="Location"
        mode="outlined"
        value={formData.location}
        onChangeText={handleChange('location')}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        disabled={saving}
        loading={saving}
      >
        Save
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
});

export default EditStudySessionScreen;
