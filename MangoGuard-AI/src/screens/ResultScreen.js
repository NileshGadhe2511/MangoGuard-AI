import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function ResultScreen({ route, navigation }) {
  const { data } = route.params;

  // Treatment Data for all 8 Diseases
  const TREATMENT_TIPS = {
    'Anthracnose': 'Apply Neem oil or copper-based fungicides. Prune and destroy infected leaves to prevent spreading.',
    'Bacterial Canker': 'Remove infected branches and apply Bordeaux paste on the cuts. Avoid wounding the tree during rain.',
    'Cutting Weevil': 'Spray appropriate insecticides during new leaf flush. Clear and burn fallen leaves from the ground.',
    'Die Back': 'Prune affected twigs 3 inches below the dead area. Spray copper oxychloride after pruning.',
    'Gall Midge': 'Maintain proper tree spacing for air circulation. Use systemic insecticides if the infestation is heavy.',
    'Healthy': 'Your mango leaf is healthy! Continue regular organic fertilization and monitoring.',
    'Powdery Mildew': 'Use sulfur-based sprays. Ensure the tree gets maximum sunlight and avoid high nitrogen fertilizers.',
    'Sooty Mould': 'Wash the leaves with a mild soap solution. Control aphids and hoppers that produce honeydew.'
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Mango Leaf Diagnosis: ${data.disease} (${data.confidence}% Confidence). Check your crop health!`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnosis Result</Text>
        <TouchableOpacity onPress={onShare}>
          <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Result Card */}
      <View style={styles.resultCard}>
        <View style={styles.iconCircle}>
          <Ionicons 
            name={data.disease === 'Healthy' ? "checkmark-circle" : "alert-circle"} 
            size={60} 
            color={data.disease === 'Healthy' ? "#2D6A4F" : "#D90429"} 
          />
        </View>
        <Text style={styles.diseaseLabel}>Detected Condition:</Text>
        <Text style={styles.diseaseName}>{data.disease}</Text>
        
        <View style={styles.confRow}>
          <Text style={styles.confText}>AI Confidence Score:</Text>
          <Text style={styles.confValue}>{data.confidence}%</Text>
        </View>
      </View>

      {/* Treatment Section */}
      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medkit-outline" size={22} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Recommended Treatment</Text>
        </View>
        <Text style={styles.treatmentText}>
          {TREATMENT_TIPS[data.disease] || "Please consult an agricultural expert for specific chemical recommendations."}
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('PlantCare')}
        >
          <Text style={styles.btnText}>Full Care Guide</Text>
          <Ionicons name="chevron-forward" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('AnalysisMain')}
        >
          <Text style={styles.secondaryBtnText}>Scan Another Leaf</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginTop: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B4332' },
  resultCard: { backgroundColor: 'white', margin: 20, padding: 30, borderRadius: 30, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F7F4', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  diseaseLabel: { fontSize: 14, color: '#666', textTransform: 'uppercase', letterSpacing: 1 },
  diseaseName: { fontSize: 28, fontWeight: 'bold', color: '#1B4332', marginVertical: 10, textAlign: 'center' },
  confRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  confText: { color: '#999', marginRight: 5 },
  confValue: { fontWeight: 'bold', color: COLORS.primary },
  infoSection: { padding: 25, backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35, flex: 1, minHeight: 300 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B4332' },
  treatmentText: { fontSize: 16, color: '#444', lineHeight: 24 },
  footer: { padding: 20, gap: 15 },
  primaryBtn: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { padding: 15, alignItems: 'center' },
  secondaryBtnText: { color: COLORS.primary, fontWeight: '600' }
});