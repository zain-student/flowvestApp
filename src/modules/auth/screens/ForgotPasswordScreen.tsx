/**
 * Forgot Password Screen
 * Password reset request form
 */

import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../../navigation/AuthStack';
import { ForgotPasswordFormData, forgotPasswordSchema, validateFormData } from '../utils/authValidation';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  // Form state
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success state
  const [emailSent, setEmailSent] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData((prev: ForgotPasswordFormData) => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field as string]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form data
    const validation = validateFormData(forgotPasswordSchema, formData);
    
    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    if (!validation.data) return;

    setIsLoading(true);

    try {
      // Simulate API call for password reset
      // In a real app, this would call your forgot password API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll just show success
      setEmailSent(true);
      
      Alert.alert(
        'Email Sent',
        'If an account with that email exists, we\'ve sent you a password reset link.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate back to login
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  // Navigate to register
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✉️</Text>
          </View>
          
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We've sent a password reset link to {formData.email}
          </Text>
          
          <Button
            title="Back to Login"
            onPress={navigateToLogin}
            fullWidth
            style={styles.successButton}
          />
          
          <TouchableOpacity
            style={styles.resendContainer}
            onPress={() => setEmailSent(false)}
          >
            <Text style={styles.resendText}>Didn't receive the email? Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              required
              autoFocus
            />

            {/* Submit Button */}
            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backContainer}
              onPress={navigateToLogin}
            >
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  form: {
    flex: 1,
  },
  
  submitButton: {
    marginBottom: 24,
  },
  
  backContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  backText: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '500',
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  footerLink: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '600',
  },
  
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  
  successIconText: {
    fontSize: 40,
  },
  
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  
  successButton: {
    marginBottom: 16,
  },
  
  resendContainer: {
    alignItems: 'center',
  },
  
  resendText: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '500',
  },
}); 