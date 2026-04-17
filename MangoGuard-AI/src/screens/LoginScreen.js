import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // 1. Start Spinner

    try {
      const url = "http://10.116.202.10:5000/login";

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        })
      });

      // 2. Debug: If the server is online, we MUST get a response here
      console.log("Response Status:", response.status);

      const data = await response.json();

      if (response.ok) {
        // 🔑 CRITICAL: Use the exact key we used for the Home Screen sync
        await AsyncStorage.setItem('@user_credentials', JSON.stringify(data.user));
        setLoading(false); // 3. Stop Spinner BEFORE navigating
        navigation.replace('MainApp');
      } else {
        setLoading(false);
        alert(data.error || "Invalid Credentials");
      }

    } catch (error) {
      setLoading(false); // 4. Stop Spinner if network fails
      console.error("Login Error:", error);
      alert("Network Error: Could not reach the server logic.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={60} color="white" />
        </View>
        <Text style={styles.title}>MangoGuard AI</Text>
        <Text style={styles.subtitle}>Smart Disease Detection System</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.loginBtnText}>Login</Text>
              <Ionicons name="log-in-outline" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B4332', marginTop: 15 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEE' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55, fontSize: 16 },
  loginBtn: { backgroundColor: COLORS.primary, height: 55, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 10, elevation: 3 },
  loginBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666' },
  registerLink: { color: COLORS.primary, fontWeight: 'bold' }
});