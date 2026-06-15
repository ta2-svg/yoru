import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import TimerScreen from '../screens/TimerScreen';
import RecordScreen from '../screens/RecordScreen';
import SleepAidScreen from '../screens/SleepAidScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home',     component: HomeScreen,     label: 'ホーム',   emoji: '🏠' },
  { name: 'Timer',    component: TimerScreen,    label: 'タイマー', emoji: '⏰' },
  { name: 'Record',   component: RecordScreen,   label: '録音',     emoji: '🎙️' },
  { name: 'SleepAid', component: SleepAidScreen, label: '睡眠導入', emoji: '🌙' },
  { name: 'Settings', component: SettingsScreen, label: '設定',     emoji: '🎨' },
];

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            height: 70,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarIcon: ({ color, size }) => {
            const cfg = TAB_CONFIG.find((t) => t.name === route.name);
            return (
              <Text style={{ fontSize: size, opacity: 1 }}>{cfg.emoji}</Text>
            );
          },
          tabBarLabel: TAB_CONFIG.find((t) => t.name === route.name)?.label,
        })}
      >
        {TAB_CONFIG.map((tab) => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
