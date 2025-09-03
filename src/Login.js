import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    navigation.navigate('PhoneAuth');
  };

  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <Image 
        source={require('../assets/logo2.png')} 
        style={styles.logo}
      />

      {/* Login Card */}
      <View style={styles.card}>
        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
        
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
       
        />

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity 
        style={styles.signInButton} 
       
        disabled={loading}
      >
        <Text style={styles.signInText}>SIGN IN</Text>
      </TouchableOpacity>

      {/* Sign up link */}
      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Don’t have an account? </Text>
        <TouchableOpacity 
        onPress={handleSignup}
        >
          <Text style={styles.signupLink}>Sign up</Text>
          
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  forgot: {
    alignItems: 'flex-end',
  },
  forgotText: {
    color: '#555',
    fontSize: 14,
  },
  signInButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupRow: {
    flexDirection: 'row',
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
});
