import { ChangePasswordFormData, changePasswordSchema, validateFormData } from "@/modules/auth/utils/authValidation"; // adjust path if needed
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
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        // // For now just validation UI
        // const newErrors: Record<string, string> = {};
        // if (!formData.current_password) newErrors.currentPassword = 'Current password is required';
        // if (!formData.password) newErrors.newPassword = 'New password is required';
        // if (formData.password !== formData.password_confirmation) {
        //     newErrors.confirmPassword = 'Passwords do not match';
        // }

        // if (Object.keys(newErrors).length > 0) {
        //     setErrors(newErrors);
        //     return;
        // }

        // // later: dispatch API call here
        // console.log('Password form submitted', formData);
        const result = validateFormData(changePasswordSchema, formData);

        if (!result.success) {
            setErrors(result.errors || {});
            return;
        }

        setErrors({});
        console.log("Password form submitted ✅", result.data);
        // TODO: call API here
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
                    value={formData.current_password}
                    onChangeText={(value) => handleInputChange('current_password', value)}
                    error={errors.current_password}
                    required
                />

                <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    error={errors.password}
                    required
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter your new password"
                    value={formData.password_confirmation}
                    onChangeText={(value) => handleInputChange('password_confirmation', value)}
                    error={errors.password_confirmation}
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
