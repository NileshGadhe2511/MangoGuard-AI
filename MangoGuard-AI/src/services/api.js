import axios from 'axios';

// 🔑 MATCH THIS TO YOUR TERMINAL LOG EXACTLY
const BASE_URL = 'http://10.116.202.10:5000'; 

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response; // Handled in LoginScreen.js
  } catch (error) {
    throw new Error("Network Error: Check Nitro V15 Connection");
  }
};

export const predictDisease = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'leaf_scan.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Validation Failed");
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw error;
  }
};