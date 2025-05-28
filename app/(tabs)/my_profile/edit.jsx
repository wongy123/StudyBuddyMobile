import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, ActivityIndicator, useTheme, Button, TextInput } from 'react-native-paper';
import { useUser } from '@hooks/useUser';
import { useRouter } from 'expo-router';

const baseUrl = 'https://n11941073.ifn666.com/StudyBuddy';

export default function EditProfileScreen() {
  const { user, token } = useUser();
  const { colors } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: '',
    degree: '',
    profileBio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to load profile');
        setFormData({
          displayName: result.data.displayName || '',
          degree: result.data.degree || '',
          profileBio: result.data.profileBio || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) fetchProfile();
  }, [user, token]);

  const handleChange = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to update profile');
      router.back(); // Go back to profile page
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
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Display Name"
        mode="outlined"
        value={formData.displayName}
        onChangeText={handleChange('displayName')}
        style={styles.input}
      />
      <TextInput
        label="Degree"
        mode="outlined"
        value={formData.degree}
        onChangeText={handleChange('degree')}
        style={styles.input}
      />
      <TextInput
        label="Bio"
        mode="outlined"
        value={formData.profileBio}
        onChangeText={handleChange('profileBio')}
        multiline
        numberOfLines={4}
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
}

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