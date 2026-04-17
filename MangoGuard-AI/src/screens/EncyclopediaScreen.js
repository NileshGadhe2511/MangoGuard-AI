import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const DISEASE_INFO = [
  { 
    id: '1', 
    name: 'Anthracnose', 
    desc: 'Dark, sunken lesions on leaves, stems, and fruit. It spreads rapidly in high humidity and rainy conditions, often causing blossom blight.',
    icon: 'umbrella-outline'
  },
  { 
    id: '2', 
    name: 'Bacterial Canker', 
    desc: 'Identified by water-soaked, angular lesions that eventually turn black and crack. It can cause severe fruit drop and weaken the tree structure.',
    icon: 'bug-outline'
  },
  { 
    id: '3', 
    name: 'Cutting Weevil', 
    desc: 'Adult weevils cut the leaves near the base, causing them to hang or fall. This typically affects new flushes of leaves during the growing season.',
    icon: 'cut-outline'
  },
  { 
    id: '4', 
    name: 'Die Back', 
    desc: 'A serious fungal disease where twigs and branches begin to dry from the tip downwards. The leaves turn brown and roll upwards before falling.',
    icon: 'trending-down-outline'
  },
  { 
    id: '5', 
    name: 'Gall Midge', 
    desc: 'Small insects puncture the leaves to lay eggs, creating small "galls" or swellings. This reduces the leaf area available for photosynthesis.',
    icon: 'analytics-outline'
  },
  { 
    id: '6', 
    name: 'Healthy', 
    desc: 'The leaf shows a vibrant green color, clear veins, and no spots. This is the baseline for a productive and well-maintained mango tree.',
    icon: 'checkmark-done-outline'
  },
  { 
    id: '7', 
    name: 'Powdery Mildew', 
    desc: 'A whitish, powdery fungal growth appearing on leaves and flower stalks. It is most common during cool, dry mornings followed by warm afternoons.',
    icon: 'snow-outline'
  },
  { 
    id: '8', 
    name: 'Sooty Mould', 
    desc: 'A black, velvety fungal film that covers the leaf surface. It grows on the "honeydew" secreted by insects like hoppers and aphids.',
    icon: 'color-palette-outline'
  },
];

export default function EncyclopediaScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={20} color={COLORS.primary} />
        <Text style={styles.diseaseName}>{item.name}</Text>
      </View>
      <Text style={styles.desc}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mango Encyclopedia</Text>
      <FlatList
        data={DISEASE_INFO}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 40, marginBottom: 20, color: '#1B4332' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  diseaseName: { fontSize: 18, fontWeight: 'bold', color: '#2D6A4F' },
  desc: { color: '#666', lineHeight: 20 }
});