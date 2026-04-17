import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, 
  ActivityIndicator, Animated, Easing, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { useIsFocused } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';
import { predictDisease } from '../services/api';

export default function AnalysisScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Ready to Scan");
  const scanAnim = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  // 🔑 CRITICAL: Get user email from navigation params (passed from Login)
  const userEmail = route.params?.email?.toLowerCase() || "guest";

  useEffect(() => {
    if (isFocused) {
      setImage(null);
      setLoading(false);
      setStatusText("Ready to Scan");
    }
  }, [isFocused]);

  // Animation Logic
  useEffect(() => {
    let animation;
    if (loading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 320, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1500, easing: Easing.linear, useNativeDriver: true })
        ])
      );
      animation.start();
    } else {
      scanAnim.stopAnimation();
      scanAnim.setValue(0);
    }
    return () => animation?.stop();
  }, [loading]);

const handleUpload = async (uri) => {
    setLoading(true);
    setStatusText("🛡️ Verifying Leaf...");
    
    try {
      const res = await predictDisease(uri);
      
      if (res.status === "Success") {
        setStatusText("✅ Saving to History...");

        // 🔑 THE SYNC FIX: Get the email from the EXACT same key the Home screen uses
        const userData = await AsyncStorage.getItem('@user_credentials');
        const parsedUser = userData ? JSON.parse(userData) : null;
        
        // Use lowercase to avoid "Email@gmail.com" vs "email@gmail.com" mismatch
        const email = parsedUser?.email?.toLowerCase() || 'guest';
        
        // 1. Create the Scan Object (Add time for the Latest Diagnosis UI)
        const newScan = {
          id: Date.now().toString(),
          disease: res.disease,
          confidence: res.confidence,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // 2. Save to the USER-SPECIFIC Key
        const historyKey = `history_${email}`;
        console.log("DEBUG: Saving to key ->", historyKey); // Check your terminal!

        const existingData = await AsyncStorage.getItem(historyKey);
        const history = existingData ? JSON.parse(existingData) : [];
        const updatedHistory = [newScan, ...history];
        
        await AsyncStorage.setItem(historyKey, JSON.stringify(updatedHistory));

        setLoading(false);
        // Important: Navigate to Result
        navigation.navigate('Result', { data: res });
      } else {
        setLoading(false);
        Alert.alert("AI Notice", res.details || "Invalid image detected.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Upload Error:", error);
      Alert.alert("Connection Error", "Nitro V15 server is unreachable.");
    }
  };

  const pickImage = async (useCamera = false) => {
    const result = useCamera 
      ? await ImagePicker.launchCameraAsync({ quality: 0.5, allowsEditing: true }) 
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.5, allowsEditing: true });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      handleUpload(selectedUri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnosis</Text>
      <Text style={styles.userLabel}>Scanning as: {userEmail}</Text>
      
      <View style={styles.preview}>
        {image ? (
          <View style={styles.imgWrapper}>
            <Image source={{ uri: image }} style={styles.img} resizeMode="cover" />
            {loading && (
              <Animated.View style={[styles.line, { transform: [{ translateY: scanAnim }] }]} />
            )}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="leaf-outline" size={80} color="#CCC" />
            <Text style={styles.placeholderText}>Ready for new scan</Text>
          </View>
        )}
      </View>

      <View style={styles.actionArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{statusText}</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={() => pickImage(true)}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.btnTxt}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.secondary}]} onPress={() => pickImage(false)}>
              <Ionicons name="images" size={24} color="white" />
              <Text style={styles.btnTxt}>Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 50, color: '#1B4332' },
  userLabel: { fontSize: 12, color: '#666', marginBottom: 10 },
  preview: { width: 320, height: 320, backgroundColor: 'white', borderRadius: 30, elevation: 10, overflow: 'hidden', marginTop: 20 },
  imgWrapper: { flex: 1, position: 'relative' },
  img: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#AAA', marginTop: 10, fontSize: 16 },
  line: { position: 'absolute', width: '100%', height: 4, backgroundColor: '#2D6A4F', zIndex: 10, elevation: 15 },
  actionArea: { marginTop: 40, width: '100%', alignItems: 'center' },
  loadingContainer: { alignItems: 'center', gap: 10 },
  loadingText: { color: '#2D6A4F', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 20 },
  btn: { backgroundColor: '#2D6A4F', paddingVertical: 18, paddingHorizontal: 25, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 140, justifyContent: 'center' },
  btnTxt: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});