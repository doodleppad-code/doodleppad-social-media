import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Native Firebase auth was removed from project to avoid native plugin dependencies.
// Provide a safe stub so the app can run without the native Firebase modules.
const auth = (() => {
  const impl = {
    onAuthStateChanged: () => () => {},
    signInWithPhoneNumber: async () => { throw new Error('Native Firebase auth not installed'); },
  };
  const fn = () => impl;
  Object.assign(fn, impl);
  return fn;
})();
import { Ionicons } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';

// Try to import LinearGradient, fallback to View if not available
let LinearGradient;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch (error) {
  LinearGradient = View;
}

const { width, height } = Dimensions.get('window');

export default function PhoneAuth() {
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [phone, setPhone] = useState('');

  const addDebugInfo = (message) => {
    console.log(`[PhoneAuth] ${new Date().toLocaleTimeString()}: ${message}`);
  };

  function handleAuthStateChanged(user) {
    if (user) {
      addDebugInfo(`User signed in: ${user.phoneNumber}`);
      Alert.alert('Success', 'Phone number verified successfully!');
      // Navigate to main app or dashboard
     
    }
  }

  useEffect(() => {
    if (typeof auth === 'function' && auth().onAuthStateChanged) {
      const subscriber = auth().onAuthStateChanged(handleAuthStateChanged);
      return subscriber;
    }
    return () => {};
  }, []);

  async function handleSendOTP() {
    const fullPhoneNumber = `+${callingCode}${phone}`;
    
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // If native Firebase auth isn't installed, inform the user (or developer) and bail.
    setLoading(true);
    try {
      await auth().signInWithPhoneNumber(fullPhoneNumber);
      // If this resolves, it means native auth is present. But in our stub it will throw.
    } catch (error) {
      Alert.alert('Unavailable', 'Native Firebase phone auth is not installed in this build.');
      addDebugInfo(`Native auth not available: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  }



  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={handleBackToLogin}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Phone Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Phone Number</Text>

        <View style={styles.inputRow}>
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withCallingCode
            withFilter
            withEmoji
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Text style={styles.helperText}>
          A 4 digit OTP will be sent via SMS to verify your mobile number
        </Text>

        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
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
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 6,
  },
});