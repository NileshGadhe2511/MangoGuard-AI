import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// --- SCREEN IMPORTS ---
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EncyclopediaScreen from './src/screens/EncyclopediaScreen';
import PlantCareScreen from './src/screens/PlantCareScreen';
import ResultScreen from './src/screens/ResultScreen';
import { COLORS } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

/**
 * 1. AnalysisStack: 
 * Manages the flow from the Scanner to the Result page.
 */
function AnalysisStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalysisMain" component={AnalysisScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}

/**
 * 2. MainTabNavigator: 
 * The core 5-tab structure of your MangoGuard app.
 */
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          height: 65, 
          paddingBottom: 10, 
          paddingTop: 10,
          backgroundColor: '#FFFFFF'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Analysis') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Encyclopedia') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'PlantCare') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analysis" component={AnalysisStack} />
      <Tab.Screen name="Encyclopedia" component={EncyclopediaScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="PlantCare" component={PlantCareScreen} />
    </Tab.Navigator>
  );
}

/**
 * 3. Root App:
 * The entry point that decides if you see the Login/Register or the Main App.
 */
export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        
        {/* Main Application (After Login) */}
        <RootStack.Screen name="MainApp" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}