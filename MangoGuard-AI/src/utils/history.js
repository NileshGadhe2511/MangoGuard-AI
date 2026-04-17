import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@mango_scans_history';

export const saveScan = async (disease, confidence) => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    const existingHistory = data ? JSON.parse(data) : [];
    
    const newScan = {
      id: Date.now().toString(),
      disease: disease,
      confidence: confidence,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedHistory = [newScan, ...existingHistory];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log("✅ Scan saved to Nitro V15 storage");
  } catch (e) {
    console.error("Save Error:", e);
  }
};

export const getHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const clearAllHistory = async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
};