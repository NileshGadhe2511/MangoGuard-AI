import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../theme';

export default function HistoryScreen({ route }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  
  // 🔑 NILESH: In a real app, 'user' comes from your Login Context.
  // For the demo, ensure your Navigation passes the user email here.
  const userEmail = route?.params?.email?.toLowerCase() || "guest"; 
  const historyKey = `history_${userEmail}`;

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(historyKey);
      if (data) {
        setHistory(JSON.parse(data));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    Alert.alert("Clear History", `Delete all scans for ${userEmail}?`, [
      { text: "Cancel", style: 'cancel' },
      { 
        text: "Delete All", 
        style: 'destructive', 
        onPress: async () => {
          await AsyncStorage.removeItem(historyKey);
          setHistory([]);
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: item.confidence > 70 ? '#2D6A4F' : '#FFB703' }]} />
      <View style={styles.info}>
        <Text style={styles.disease}>{item.disease}</Text>
        <Text style={styles.date}>{item.date || "Today"}</Text>
      </View>
      <View style={styles.rightSide}>
         <Text style={styles.percentage}>{item.confidence}%</Text>
         <Ionicons name="chevron-forward" size={16} color="#CCC" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Scan History</Text>
          <Text style={styles.subtitle}>{userEmail}</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.trashBtn}>
            <Ionicons name="trash-bin-outline" size={22} color="#E63946" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={60} color="#DDD" />
          <Text style={styles.emptyText}>No scans found for this account.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', marginTop: 60, marginBottom: 25 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B4332' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  trashBtn: { padding: 10, backgroundColor: '#FFE3E3', borderRadius: 12 },
  listContent: { paddingBottom: 30 },
  card: { 
    flexDirection: 'row', backgroundColor: 'white', padding: 16, 
    borderRadius: 18, marginBottom: 12, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4
  },
  indicator: { width: 6, height: 40, borderRadius: 3, marginRight: 15 },
  info: { flex: 1 },
  disease: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 13, color: '#999', marginTop: 3 },
  rightSide: { alignItems: 'flex-end', flexDirection: 'row', gap: 5 },
  percentage: { fontSize: 18, fontWeight: 'bold', color: '#2D6A4F' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.6 },
  emptyText: { marginTop: 10, fontSize: 16, color: '#999' }
});