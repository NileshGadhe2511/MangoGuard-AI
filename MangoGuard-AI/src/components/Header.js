// src/components/Header.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const Header = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.greeting}>Hello, Farmer</Text>
      <Text style={styles.title}>MangoGuard AI</Text>
    </View>
    <View style={styles.badge}>
      <Text style={styles.statusText}>● System Online</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#2D6A4F', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  content: { padding: 25, paddingTop: 40 },
  greeting: { color: '#D8F3DC', fontSize: 16, fontWeight: '400' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', marginLeft: 25, marginBottom: 20, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: '#B7E4C7', fontSize: 12, fontWeight: '600' }
});

export default Header;