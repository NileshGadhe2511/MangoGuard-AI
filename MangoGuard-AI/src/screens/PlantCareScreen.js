import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function PlantCareScreen() {
  const Tip = ({ icon, title, text }) => (
    <View style={styles.tipCard}>
      <Ionicons name={icon} size={30} color={COLORS.primary} />
      <View style={{flex: 1, marginLeft: 15}}>
        <Text style={styles.tipTitle}>{title}</Text>
        <Text style={styles.tipText}>{text}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Plant Care Tips</Text>
      
      <Tip 
        icon="water" 
        title="Proper Irrigation" 
        text="Young trees need watering 2-3 times a week. Mature trees need less." 
      />
      <Tip 
        icon="sunny" 
        title="Sunlight" 
        text="Mango trees need at least 6-8 hours of direct sunlight daily." 
      />
      <Tip 
        icon="cut" 
        title="Pruning" 
        text="Remove dead or diseased branches to allow better air circulation." 
      />
      <Tip 
        icon="bug" 
        title="Pest Control" 
        text="Regularly check for leaf hoppers and mealybugs." 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 40, marginBottom: 20, color: '#1B4332' },
  tipCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 2 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B4332' },
  tipText: { color: '#666', fontSize: 13, marginTop: 4 }
});