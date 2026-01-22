import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RootStackParamList = {
  OnBoarding: undefined;
  Register: undefined;
  Login: undefined;
};

const { width, height } = Dimensions.get('window');

export const OnBoardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#4F46E5', '#1E1B4B', '#0F0F1A']} // Softer indigo → deep navy → near-black (premium fintech vibe)
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.8, y: 1.0 }}
        style={styles.gradient}
      >
        {/* Top spacing for safe area / notch */}
        <View style={styles.headerSpacer} />

        {/* Hero Illustration / Logo Area – larger & centered */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../../assets/images/splash.png')}
            style={styles.illustration}
            resizeMode="contain" // Better for logos/illustrations – prevents stretching
          />
        </View>

        {/* Main Content – better spacing & typography */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Invstrhub</Text>

          <Text style={styles.subtitle}>
            Grow your investments smarter.{'\n'}
            Automate payouts, track your portfolio — effortlessly.
          </Text>
        </View>

        {/* CTA Buttons – professional, elevated styles */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Optional subtle trust note – common in fintech onboarding */}
          <Text style={styles.trustText}>
            Secure • Encrypted • Your data stays private
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerSpacer: {
    height: StatusBar.currentHeight || 44, // Handles notch / status bar
  },
  illustrationContainer: {
    flex: 1.1, // Gives more breathing room to illustration
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: width * 0.82,
    height: height * 0.38,
    // Optional: add subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#D1D5FF', // Softer light purple-gray
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.92,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#6366F1', // Indigo accent – vibrant but professional
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    // Modern shadow
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.70)',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  trustText: {
    marginTop: 24,
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
    opacity: 0.8,
  },
});