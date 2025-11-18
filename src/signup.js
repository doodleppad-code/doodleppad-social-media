import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Ionicons } from "@expo/vector-icons";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ====== API call to backend ====
const handleSignUp = async () => {
  if (!firstName || !lastName || !username || !password || !rePassword) {
    Alert.alert("Error", "Please fill in all field");
    return;
  }

  if (password !== rePassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  if (!isChecked) {
    Alert.alert("Notice", "You must agree to the terms and conditions");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch("https://mobserv-0din.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`,
        email: username, // assuming username is actually email
        password,
      }),
    });

    // Get raw text (not JSON yet)
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text); // Try to parse JSON
    } catch (e) {
      console.warn("⚠️ Non-JSON response from server:", text);
      setLoading(false);
      Alert.alert("Error", "Server error. Please try again later.");
      return;
    }

    setLoading(false);

    if (response.ok) {
      Alert.alert("Success", "Signup successful!");
      navigation.navigate("Login");
    } else {
      Alert.alert("Error", data.error || "Signup failed");
    }
  } catch (error) {
    setLoading(false);
    console.error("Signup error:", error);
    Alert.alert("Error", error.message || "Something went wrong. Please try again.");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Sign up</Text>

        {/* First & Last Name */}
        <View style={styles.row}>
          <View style={styles.inputContainerHalf}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainerHalf}>
            <TextInput
              style={styles.input}
             placeholder= "Last Name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        {/* Username / Email */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            // value={password}
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

        {/* Re-enter Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Re-enter Password"         
            placeholderTextColor="#888"
            secureTextEntry={!showRePassword}
            // value={rePassword}
            value={showRePassword ? rePassword : "*".repeat(rePassword.length)}
            onChangeText={setRePassword}
          />
          <TouchableOpacity onPress={() => setShowRePassword(!showRePassword)}>
            <Ionicons
              name={showRePassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            tintColors={{ true: "black", false: "#ccc" }}
          />
          <Text style={styles.checkboxText}>
            By signing up you agree to our{" "}
            <Text style={styles.link}>conditions</Text> and{" "}
            <Text style={styles.link}>privacy policy</Text>
          </Text>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.nextButton, { opacity: isChecked ? 1 : 0.6 }]}
          disabled={!isChecked || loading}
          onPress={handleSignUp}
        >
          <Text style={styles.nextText}>
            {loading ? "Creating Account..." : "Sign Up →"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  backText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    marginVertical: 10,
  
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainerHalf: {
    width: "48%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
     color: '#000',
    fontSize: 16,
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    marginLeft: 8,
    color: "#555",
    flex: 1,
  },
  link: {
    color: "red",
  },
  nextButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
