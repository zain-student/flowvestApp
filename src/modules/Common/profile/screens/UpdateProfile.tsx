import Colors from '@/shared/colors/Colors';
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { updateUserProfileApi } from "@modules/auth/store/authSlice";
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from 'react-native';

export const UpdateProfile = ({navigation}:any) => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        company_name: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};

        // 🔍 Client-side validation
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.company_name.trim())
            newErrors.company_name = "Company name is required";

        const phoneRegex = /^[0-9]{10,15}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = "Enter a valid phone number";
        }

        setErrors(newErrors);

        // 🚫 Stop if any errors exist
        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            // ToastAndroid.show(firstError, ToastAndroid.SHORT);
            return;
        }

        // ✅ Proceed with API call
        try {
            await dispatch(updateUserProfileApi(formData)).unwrap();
            console.log("✅ Profile updated successfully");
            ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
            navigation.goBack(); // optional navigation
        } catch (err: any) {
            console.error("❌ Profile update failed:", err);
            ToastAndroid.show("Failed to update profile", ToastAndroid.SHORT);
        }
    };


    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Update Profile</Text>
                <Text style={styles.subtitle}>
                    Edit your personal and company details
                </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    error={errors.name}
                    required
                />

                <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    error={errors.phone}
                    required
                />

                <Input
                    label="Company Name"
                    placeholder="Enter your company name"
                    value={formData.company_name}
                    onChangeText={(value) => handleInputChange('company_name', value)}
                    error={errors.company_name}
                    required
                />

                <Button
                    title="Update Profile"
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
