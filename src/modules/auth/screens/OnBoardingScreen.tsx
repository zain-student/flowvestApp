import Colors from "@/shared/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { onboardingData } from "../components/onboardingData";
import { OnboardingItem } from "./OnboardingItem";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  OnBoardingFinal: undefined;
  Register: undefined;
  Login: undefined;
};

export const OnBoardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex =
        currentIndex + 1 < onboardingData.length ? currentIndex + 1 : 0;
      setCurrentIndex(nextIndex);
      slidesRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace("OnBoardingFinal");
    }
  };

  const handleSkip = () => {
    navigation.replace("OnBoardingFinal");
  };

  const updateCurrentIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content" // or "dark-content"
        // backgroundColor="#000" // set to match your theme
      />
      <FlatList
        data={onboardingData}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={updateCurrentIndex}
        ref={slidesRef}
      />

      {/* Pagination & buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {onboardingData.map((_: any, index: any) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                currentIndex === index && { backgroundColor: Colors.primary },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 30,
    marginTop: 10,
  },
  skipText: { fontSize: 16, color: Colors.primary, fontWeight: "bold" },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
});
