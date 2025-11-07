/**
 * Login Screen
 * User authentication login form with validation
 */

import Colors from '@/shared/colors/Colors';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/index';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../../navigation/AuthStack';
import { clearError, loginUser, selectAuthError, selectIsLoading } from '../store/authSlice';
import { LoginFormData, loginSchema, validateFormData } from '../utils/authValidation';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const authError = useAppSelector(selectAuthError);

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email:
    // 'zainma4989@gmail.com',
    'abc123@gmail.com',
    password:
    // 'Zain,4321',
    'Zainmalik,4989',
    remember: false,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev: LoginFormData) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field as string]: '' }));
    }

    // Clear auth error when user makes changes
    if (authError) {
      dispatch(clearError());
    }
  };
useEffect(()=>{
  
})
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form data
    const validation = validateFormData(loginSchema, formData);

    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    if (!validation.data) return;

    try {
      // Dispatch login action
      const result = await dispatch(loginUser(validation.data));

      if (loginUser.fulfilled.match(result)) {
        // Login successful - navigation will be handled by RootNavigator
        console.log('Login successful');
      } else if (loginUser.rejected.match(result)) {
        // Login failed - error will be shown via authError
        console.log('Login failed:', result.error.message);
        // ToastAndroid.show(
        //   `Login failed: ${result.payload || result.error.message}`,
        //   ToastAndroid.LONG
        // );
      }
    } catch (error) {
      // console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Navigate to register screen
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  // Navigate to forgot password screen
  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

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
          <StatusBar
            barStyle="dark-content" // or "dark-content"
          // backgroundColor="#000" // set to match your theme
          />
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your FlowVest account</Text>
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

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              error={errors.password}
              required
            />

            {/* Remember Me - Simple implementation */}
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => handleInputChange('remember', !formData.remember)}
            >
              <View style={[styles.checkbox, formData.remember && styles.checkboxChecked]}>
                {formData.remember &&
                  //  <Text style={styles.checkmark}>✓</Text>
                  <Ionicons name='checkmark' size={16} color={"white"} />
                }
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            {/* Show auth error */}
            {/* {authError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            )} */}

            {/* Submit Button */}
            <Button
              title="Sign In"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={navigateToForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
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
    backgroundColor: Colors.background,
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
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },

  form: {
    flex: 1,
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
  },

  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  rememberText: {
    fontSize: 14,
    color: Colors.secondary,
  },

  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },

  submitButton: {
    marginBottom: 16,
  },

  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  forgotPasswordText: {
    fontSize: 14,
    // color: '#2563EB',
    color: Colors.secondary,
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,

  },

  footerText: {
    fontSize: 14,
    color: Colors.gray,
  },

  footerLink: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '600',
  },
}); 