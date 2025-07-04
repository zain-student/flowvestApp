/**
 * Register Screen
 * Role-based user registration with dynamic form fields
 */

import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select, SelectOption } from '@components/ui/Select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/index';
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
import { AuthStackParamList } from '../AuthStack';
import { clearError, registerUser, selectAuthError, selectIsLoading } from '../store/authSlice';
import {
    createRegistrationSchema,
    validateFormData
} from '../utils/authValidation';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

// Company type options for independent users
const companyTypeOptions: SelectOption[] = [
  {
    label: 'Individual',
    value: 'individual',
    description: 'Personal investment account',
  },
  {
    label: 'Private Company',
    value: 'private',
    description: 'Private limited company',
  },
  {
    label: 'Silent Partnership',
    value: 'silent',
    description: 'Silent partner investment',
  },
  {
    label: 'Holding Company',
    value: 'holding',
    description: 'Investment holding company',
  },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const authError = useAppSelector(selectAuthError);

  // Form state - starts with basic fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    registration_type: '',
    company_name: '',
    company_type: '',
    invitation_token: '',
    terms_accepted: false,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Current step in multi-step form
  const [currentStep, setCurrentStep] = useState(1);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear auth error when user makes changes
    if (authError) {
      dispatch(clearError());
    }
  };

  // Handle role selection
  const handleRoleSelect = (option: SelectOption) => {
    const newFormData = {
      ...formData,
      role: option.value,
      // Reset dependent fields when role changes
      registration_type: '',
      company_name: '',
      company_type: '',
      invitation_token: '',
    };
    setFormData(newFormData);
    setCurrentStep(2);
  };

  // Handle registration type selection (for users)
  const handleRegistrationTypeSelect = (option: SelectOption) => {
    const newFormData = {
      ...formData,
      registration_type: option.value,
      // Reset dependent fields when registration type changes
      company_name: '',
      company_type: '',
      invitation_token: '',
    };
    setFormData(newFormData);
    setCurrentStep(3);
  };

  // Handle company type selection
  const handleCompanyTypeSelect = (option: SelectOption) => {
    handleInputChange('company_type', option.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Get the appropriate schema based on role and registration type
    const schema = createRegistrationSchema(formData.role, formData.registration_type);
    
    // Validate form data
    const validation = validateFormData(schema, formData);
    
    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    if (!validation.data) return;

    try {
      // Dispatch register action
      const result = await dispatch(registerUser(validation.data));
      
      if (registerUser.fulfilled.match(result)) {
        // Registration successful
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully. Please check your email for verification.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else if (registerUser.rejected.match(result)) {
        // Registration failed - error will be shown via authError
        console.log('Registration failed:', result.error.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Navigate back to login
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  // Render role selection step
  const renderRoleSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Role</Text>
      <Text style={styles.stepDescription}>
        Select how you'll be using FlowVest
      </Text>

      <Select
        label="Role"
        placeholder="Select your role..."
        value={formData.role}
        onSelect={handleRoleSelect}
        error={errors.role}
        required
        options={[
          {
            label: 'Investment Manager',
            value: 'admin',
            description: 'Manage company investments, invite team members, and oversee payouts.',
          },
          {
            label: 'Investor / Partner',
            value: 'user',
            description: 'Invest in opportunities and track your payouts.',
          },
        ]}
      />
    </View>
  );

  // Render registration type selection (for users)
  const renderRegistrationTypeSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Registration Type</Text>
      <Text style={styles.stepDescription}>
        How would you like to join FlowVest?
      </Text>

      <Select
        label="Registration Type"
        placeholder="Select registration type..."
        value={formData.registration_type}
        onSelect={handleRegistrationTypeSelect}
        error={errors.registration_type}
        required
        options={[
          {
            label: 'Invited by Company',
            value: 'invited',
            description: 'I have an invitation token from a company',
          },
          {
            label: 'Independent Registration',
            value: 'independent',
            description: 'I want to create my own investment account',
          },
        ]}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentStep(1)}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  // Render main form fields
  const renderMainForm = () => {
    const isAdmin = formData.role === 'admin';
    const isInvitedUser = formData.role === 'user' && formData.registration_type === 'invited';
    const isIndependentUser = formData.role === 'user' && formData.registration_type === 'independent';

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Create Your Account</Text>
        <Text style={styles.stepDescription}>
          Fill in your details to get started
        </Text>

        {/* Personal Information */}
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={formData.first_name}
          onChangeText={(value) => handleInputChange('first_name', value)}
          error={errors.first_name}
          required
        />

        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.last_name}
          onChangeText={(value) => handleInputChange('last_name', value)}
          error={errors.last_name}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.password_confirmation}
          onChangeText={(value) => handleInputChange('password_confirmation', value)}
          error={errors.password_confirmation}
          required
        />

        {/* Admin-specific fields */}
        {isAdmin && (
          <Input
            label="Company Name"
            placeholder="Enter your company name"
            value={formData.company_name}
            onChangeText={(value) => handleInputChange('company_name', value)}
            error={errors.company_name}
            required
          />
        )}

        {/* Invited user fields */}
        {isInvitedUser && (
          <Input
            label="Invitation Token"
            placeholder="Enter your invitation token"
            value={formData.invitation_token}
            onChangeText={(value) => handleInputChange('invitation_token', value)}
            error={errors.invitation_token}
            required
          />
        )}

        {/* Independent user fields */}
        {isIndependentUser && (
          <>
            <Input
              label="Company Name"
              placeholder="Enter your company name"
              value={formData.company_name}
              onChangeText={(value) => handleInputChange('company_name', value)}
              error={errors.company_name}
              required
            />

            <Select
              label="Company Type"
              placeholder="Select company type..."
              value={formData.company_type}
              onSelect={handleCompanyTypeSelect}
              error={errors.company_type}
              required
              options={companyTypeOptions}
            />
          </>
        )}

        {/* Terms and Conditions */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => handleInputChange('terms_accepted', !formData.terms_accepted)}
        >
          <View style={[styles.checkbox, formData.terms_accepted && styles.checkboxChecked]}>
            {formData.terms_accepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </TouchableOpacity>
        {errors.terms_accepted && (
          <Text style={styles.fieldError}>{errors.terms_accepted}</Text>
        )}

        {/* Show auth error */}
        {authError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}

        {/* Submit Button */}
        <Button
          title="Create Account"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          style={styles.submitButton}
        />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep(formData.role === 'admin' ? 1 : 2)}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Determine which step to show
  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return renderRoleSelection();
    }
    if (currentStep === 2 && formData.role === 'user') {
      return renderRegistrationTypeSelection();
    }
    return renderMainForm();
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Join FlowVest</Text>
            <Text style={styles.subtitle}>Create your investment account</Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentStep / (formData.role === 'user' ? 3 : 2)) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep} of {formData.role === 'user' ? 3 : 2}
            </Text>
          </View>

          {/* Current Step Content */}
          {renderCurrentStep()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.footerLink}>Sign In</Text>
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
    marginTop: 20,
    marginBottom: 30,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  progressContainer: {
    marginBottom: 30,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  stepContent: {
    flex: 1,
  },
  
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  
  checkboxChecked: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  termsText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  
  fieldError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
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
  
  backButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  backButtonText: {
    fontSize: 14,
    color: '#2563EB',
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
    color: '#2563EB',
    fontWeight: '600',
  },
}); 