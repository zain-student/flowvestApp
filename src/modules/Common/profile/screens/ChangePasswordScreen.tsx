import Colors from '@/shared/colors/Colors';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    // For now just validation UI
    const newErrors: Record<string, string> = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // later: dispatch API call here
    console.log('Password form submitted', formData);
  };

  return (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar barStyle="dark-content" />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Please enter your current and new password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChangeText={(value) => handleInputChange('currentPassword', value)}
              error={errors.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange('newPassword', value)}
              error={errors.newPassword}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              title="Update Password"
              onPress={handleSubmit}
              fullWidth
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 80,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
  },
});
