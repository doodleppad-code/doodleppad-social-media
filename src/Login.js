import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // ✅ import missing icon

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ added state

  const handleSignup = () => {
    navigation.navigate("SignUp");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://mobserv-0din.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
        return;
      }

      Alert.alert("Success", "Login successful!");
      console.log("User:", data.user);
      navigation.navigate("Dashboard", { user: data.user });
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Unable to connect to server");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo2.png")} style={styles.logo} />

      {/* Card */}
      <View style={styles.card}>
        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password with Eye Toggle */}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={showPassword ? password : "*".repeat(password.length)} // Show * when hidden
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.signInText}>SIGN IN</Text>
        )}
      </TouchableOpacity>

      {/* Signup Link */}
      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  // passwordContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#000",
  //   marginBottom: 20,
  // },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 10,
    paddingVertical: 4,
  },

  passwordInput: {
    flex: 1,
    color: '#000',
    paddingVertical: 8,
    fontSize: 16,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },

  forgotText: {
    color: 'gray',
    fontSize: 14,
  },
  signInButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  signupRow: {
    flexDirection: "row",
  },
  signupText: {
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
});