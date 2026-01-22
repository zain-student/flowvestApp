// src/screens/OnBoardingScreen.tsx

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      <LinearGradient
        colors={['#5C6EF8', '#252556']} // Modern purple/blue gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Logo / Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/images/splash.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Heading */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Invstrhub</Text>
          <Text style={styles.subtitle}>
            Grow your investments, automate payouts, and track your portfolio effortlessly.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#252556',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  imageContainer: {
    width: width * 0.7,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D1E0',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '80%',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#5C6EF8',
    fontWeight: '700',
    fontSize: 16,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
