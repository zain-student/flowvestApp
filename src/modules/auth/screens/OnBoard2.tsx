import Colors from '@/shared/colors/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type RootStackParamList = {
    onBoarding: undefined;
    Login: undefined;
};

const { width, height } = Dimensions.get('window');

export const OnBoard2 = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const handleNext = () => {
        navigation.replace("onBoarding"); // or Login/CreateAccount screen
    };
    const handleSkip = () => {
        navigation.replace("onBoarding"); // or Login/CreateAccount screen
    };
    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={styles.headerSpacer} />
            <View style={styles.illustrationContainer}>
                <Image
                    source={require('../../../../assets/images/onBoard2.png')}
                    style={styles.illustration}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Smart Payouts, Done Right</Text>

                <Text style={styles.subtitle}>
                    Real-time tracking and expert-led investments to keep your cash flow moving.
                </Text>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Ionicons name="chevron-forward" size={22} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnBoard2;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1, backgroundColor: Colors.background, paddingHorizontal: 12
    },
    headerSpacer: {
        height: StatusBar.currentHeight || 44, // Handles notch / status bar
    },
    illustrationContainer: {
        flex: 1, // Gives more breathing room to illustration
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 70,
        paddingTop: 50
    },
    illustration: {
        width: width * 0.70,
        height: height * 0.32,
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
        fontSize: 28,
        fontWeight: '600',
        color: Colors.secondary,
        letterSpacing: -0.5,
        marginBottom: 16,
        textAlign: 'center',
        marginHorizontal: 15
    },
    subtitle: {
        fontSize: 17,
        fontWeight: '400',
        color: Colors.secondary, // Softer light purple-gray
        textAlign: 'center',
        lineHeight: 28,
        opacity: 0.92,
    },
    bottomContainer: {
        width: "100%",
        height: '10%',
        marginBottom: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
    },
    skipText: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '900'
    },
    nextButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 80,

    },
    payButton: {
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
        // marginHorizontal: 5,
    },
    footerButtonText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 16
    },
    secondaryButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: "#E6EDFF",
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 80
    },
    secondaryButtonText: {
        color: Colors.primary,
        fontSize: 16,
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