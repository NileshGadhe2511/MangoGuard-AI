import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Use your Nitro V15 IP address
      const response = await fetch('http://10.21.204.10:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account saved in users.json!", [
          { text: "Login Now", onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        // This will show if the email is already in the JSON file
        Alert.alert("Registration Failed", result.error || "Try again.");
      }
    } catch (e) {
      Alert.alert("Server Error", "Ensure your Flask server is running on your Nitro V15.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the MangoGuard community</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Full Name" 
          value={name} 
          onChangeText={setName} 
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
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
        style={[styles.registerBtn, loading && { opacity: 0.7 }]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.registerBtnText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFF', padding: 30, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1B4332', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F5', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55 },
  registerBtn: { backgroundColor: COLORS.primary, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  registerBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});