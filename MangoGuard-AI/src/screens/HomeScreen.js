import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../theme';

// ... (rest of your imports)

export default function HomeScreen({ navigation, route }) {
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('guest'); // 🔑 Store email for history key
  const [showMenu, setShowMenu] = useState(false);
  const [totalScans, setTotalScans] = useState(0);
  const [latestScan, setLatestScan] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadUserData();
    }
  }, [isFocused]);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user_credentials');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name || 'User');

        // 🔑 Capture the email to build the correct history key
        const email = parsedUser.email?.toLowerCase() || 'guest';
        setUserEmail(email);

        // Now load stats using this specific email
        loadStats(email);
      }
    } catch (e) {
      console.log("Error loading user data:", e);
    }
  };

  // Inside HomeScreen.js -> loadStats function
  const loadStats = async () => {
    try {
      // 1. First, find out WHO is logged in
      const storedUser = await AsyncStorage.getItem('@user_credentials');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email.toLowerCase();
        setUserName(parsedUser.name || 'User');

        // 2. Now look for THAT user's history key
        const historyKey = `history_${email}`;
        const historyData = await AsyncStorage.getItem(historyKey);

        if (historyData) {
          const parsedHistory = JSON.parse(historyData);
          setTotalScans(parsedHistory.length);
          setLatestScan(parsedHistory.length > 0 ? parsedHistory[0] : null);
          console.log("SUCCESS: Loaded scans for", email, parsedHistory.length);
        } else {
          setTotalScans(0);
          setLatestScan(null);
        }
      }
    } catch (e) {
      console.log("Error loading stats:", e);
    }
  };

  // ... (rest of your component)

  const handleLogout = () => {
    setShowMenu(false);
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.userNameText}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => setShowMenu(true)}
          >
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={26} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* STATS CARDS */}
        {/* STATS CARDS */}
        <View style={styles.statsRow}>
          {/* TOTAL SCANS (GREEN) */}
          <View style={styles.statCard}>
            <View style={styles.centeredContent}>
              <Text style={styles.statNumber}>{totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
          </View>

          {/* VIEW HISTORY (YELLOW) */}
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: COLORS.secondary || '#FFB703' }]}
            onPress={() => navigation.navigate('History')}
          >
            <View style={styles.centeredContent}>
              <Ionicons name="time" size={32} color="white" style={styles.iconStyle} />
              <Text style={styles.statLabel}>View History</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* LATEST DIAGNOSIS SECTION */}
        <Text style={styles.sectionTitle}>Latest Diagnosis</Text>
        {latestScan ? (
          <View style={styles.recentCard}>
            <View style={styles.recentIcon}>
              <Ionicons name="leaf" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>{latestScan.disease}</Text>
              <Text style={styles.recentDate}>{latestScan.date} • {latestScan.time}</Text>
            </View>
            <View style={styles.confBadge}>
              <Text style={styles.recentConf}>{latestScan.confidence}%</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="cloud-upload-outline" size={40} color="#CCC" />
            <Text style={styles.emptyText}>No scans yet. Start by analyzing a leaf!</Text>
          </View>
        )}

        {/* MAIN ACTION BUTTON */}
        <TouchableOpacity
          style={styles.mainAction}
          onPress={() => navigation.navigate('Analysis')}
        >
          <Ionicons name="scan" size={24} color="white" />
          <Text style={styles.actionText}>Start New Diagnosis</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- LOGOUT BOTTOM SHEET --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
        />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>Account Menu</Text>
          <Text style={styles.sheetUserEmail}>{userName}</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
            <Ionicons name="settings-outline" size={22} color="#444" />
            <Text style={styles.menuText}>App Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
            <Text style={[styles.menuText, { color: COLORS.error }]}>Logout Session</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowMenu(false)}>
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 30 },
  welcome: { fontSize: 16, color: '#666' },
  userNameText: { fontSize: 28, fontWeight: 'bold', color: '#1B4332' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F7F4', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },

  // ... other styles ...
  
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 20, 
    width: '100%' 
  },
  
  statCard: { 
    width: '47%', 
    aspectRatio: 1, // 📏 This makes them PERFECT SQUARES automatically
    backgroundColor: '#2D6A4F', 
    borderRadius: 25, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden' // Keeps everything inside the rounded corners
  },

  centeredContent: {
    flex: 1, // 🎯 This is the secret—it fills the card and centers everything
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },

  statNumber: { 
    fontSize: 34, 
    fontWeight: 'bold', 
    color: 'white',
    marginBottom: -5, // Fine-tune if the number feels too high
    includeFontPadding: false // 🛠️ Removes hidden Android padding
  },

  statLabel: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center',
    includeFontPadding: false
  },

  iconStyle: {
    marginBottom: 5
  },

  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B4332', marginBottom: 15 },
  recentCard: { backgroundColor: 'white', padding: 18, borderRadius: 22, flexDirection: 'row', alignItems: 'center', elevation: 3, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  recentIcon: { width: 45, height: 45, backgroundColor: '#EAF4F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  recentTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  recentDate: { fontSize: 12, color: '#999', marginTop: 2 },
  confBadge: { backgroundColor: '#EAF4F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  recentConf: { fontWeight: 'bold', color: '#2D6A4F', fontSize: 14 },
  emptyCard: { padding: 40, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 25, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 10 },
  mainAction: { backgroundColor: '#2D6A4F', padding: 20, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 15, marginBottom: 40, elevation: 5 },
  actionText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheetContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#EEE', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B4332', textAlign: 'center' },
  sheetUserEmail: { textAlign: 'center', color: '#666', marginBottom: 20, fontSize: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 15 },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  logoutItem: { borderBottomWidth: 0 },
  cancelBtn: { marginTop: 15, backgroundColor: '#F8F9FA', padding: 18, borderRadius: 20, alignItems: 'center' },
  cancelText: { color: '#666', fontWeight: 'bold' }
});