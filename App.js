import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import WebLayout from './src/components/WebLayout';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        <WebLayout>
          <AppNavigator />
        </WebLayout>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
