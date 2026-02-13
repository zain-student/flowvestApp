import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  OnBoarding: undefined;
  Register: undefined;
  Login: undefined;
};

const { width, height } = Dimensions.get("window");

export const OnBoardingFinal = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.headerSpacer} />
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../../../assets/images/onBoard3.png")}
          style={styles.illustration}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Stay on top of your finance with us.</Text>

        <Text style={styles.subtitle}>
          We are your new financial Advisors to recommed the best investments
          for you.
        </Text>
      </View>
      <Button
        title="Create Account"
        onPress={() => navigation.navigate("Register")}
        style={styles.payButton}
        textStyle={styles.footerButtonText}
        variant="primary"
      />
      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.secondaryButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnBoardingFinal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
    paddingTop: 50,
  },
  illustration: {
    // width: width * 0.82,
    // height: height * 0.38,
    width: "90%",
    height: "100%",
    // Optional: add subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.secondary,
    letterSpacing: -0.5,
    marginBottom: 16,
    textAlign: "center",
    marginHorizontal: 15,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "400",
    color: Colors.secondary, // Softer light purple-gray
    textAlign: "center",
    lineHeight: 28,
    opacity: 0.92,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 80,
  },
  payButton: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // marginHorizontal: 5,
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 80,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  trustText: {
    marginTop: 24,
    fontSize: 13,
    color: "#A0AEC0",
    textAlign: "center",
    opacity: 0.8,
  },
});
