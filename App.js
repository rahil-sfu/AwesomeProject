import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ScrollView 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Maps from './Components/Maps'; // Import your Maps component

const Stack = createStackNavigator();

// A reusable component for the gradient background
function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={['#FF6F61', '#FF9472', '#FFD3B6']}
      style={styles.gradientContainer}
    >
      {children}
    </LinearGradient>
  );
}

// Login Screen
function LoginScreen({ navigation }) {
  return (
    <GradientBackground>
      <StatusBar hidden />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Pawsitively</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Phone, Username or Email"
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => {
            console.log('Logging in');
            // Navigate to the Maps screen upon login
            navigation.navigate('Maps');
          }}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <View style={styles.signUpRow}>
          <Text style={styles.signUpQuestion}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}

// Sign Up Screen (for dog and owner)
function SignUpScreen({ navigation }) {
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAge, setDogAge] = useState('');

  const handleSignUp = () => {
    console.log('Owner Name:', ownerName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Dog Name:', dogName);
    console.log('Dog Breed:', dogBreed);
    console.log('Dog Age:', dogAge);
    navigation.navigate('Login');
  };

  return (
    <GradientBackground>
      <StatusBar hidden />
      <ScrollView contentContainerStyle={styles.signUpContainer}>
        <Text style={styles.title}>Sign Up</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          placeholderTextColor="#666"
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Dog Name"
          placeholderTextColor="#666"
          value={dogName}
          onChangeText={setDogName}
        />
        <TextInput
          style={styles.input}
          placeholder="Dog Breed"
          placeholderTextColor="#666"
          value={dogBreed}
          onChangeText={setDogBreed}
        />
        <TextInput
          style={styles.input}
          placeholder="Dog Age"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={dogAge}
          onChangeText={setDogAge}
        />

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleSignUp}
        >
          <Text style={styles.loginButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.forgotText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientBackground>
  );
}

// Forgot Password Screen
function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    console.log('Reset password for:', email);
    navigation.navigate('Login');
  };

  return (
    <GradientBackground>
      <StatusBar hidden />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handlePasswordReset}
        >
          <Text style={styles.loginButtonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.forgotText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

// Main App Component with Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Maps" component={Maps} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  signUpContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpQuestion: {
    color: '#fff',
    fontSize: 16,
  },
  signUpLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
