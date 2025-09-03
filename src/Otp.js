import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';

// Try to import LinearGradient, fallback to View if not available
let LinearGradient;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch (error) {
  LinearGradient = View;
}

const { width, height } = Dimensions.get('window');

export default function Otp({ route }) {
  const navigation = useNavigation();
  const { phoneNumber, verificationId: initialVerificationId } = route.params || { phoneNumber: '+91', verificationId: null };
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verificationId, setVerificationId] = useState(initialVerificationId);
  const inputs = useRef([]);

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);

    if (sanitized && index < 5) {
      const nextRef = inputs.current[index + 1];
      nextRef && nextRef.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }
    if (!verificationId) {
      Alert.alert('Error', 'Verification ID missing. Please resend OTP.');
      return;
    }

    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, otpString);
      await auth().signInWithCredential(credential);
      Alert.alert('Success', 'OTP verified successfully!');
      navigation.navigate('Dashboard');
    } catch (error) {
      const message = error?.code === 'auth/invalid-verification-code' ? 'Invalid OTP. Please try again.' : 'Failed to verify OTP. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
      Alert.alert('Success', 'OTP resent successfully!');
      // Focus first input
      inputs.current[0] && inputs.current[0].focus();
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* OTP Card */}
      <View style={styles.card}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter the OTP you received on</Text>
        <Text style={styles.phone}>{phoneNumber}</Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={value}
              onChangeText={(text) => handleOtpChange(text, index)}
              returnKeyType={index === 5 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index === 5) handleVerifyOtp();
              }}
            />
          ))}
        </View>

        {/* Resend OTP */}
        <TouchableOpacity onPress={handleResendOtp} disabled={!canResend}>
          <Text style={[styles.resend, !canResend && { opacity: 0.4 }]}>
            {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
          </Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          <Text style={styles.buttonText}>Verify</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
  phone: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    marginTop: 4,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: "#000",
    width: 50,
    height: 50,
    fontSize: 20,
    textAlign: "center",
  },
  resend: {
    fontSize: 14,
    color: "#000",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 6,
  },
});