import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import TimerScreen from '../screens/TimerScreen';
import RecordScreen from '../screens/RecordScreen';
import SleepAidScreen from '../screens/SleepAidScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home', component: HomeScreen, label: 'ホーム', icon: 'home' },
  { name: 'Timer', component: TimerScreen, label: 'タイマー', icon: 'alarm' },
  { name: 'Record', component: RecordScreen, label: '録音', icon: 'mic' },
  { name: 'SleepAid', component: SleepAidScreen, label: '睡眠導入', icon: 'moon' },
  { name: 'Settings', component: SettingsScreen, label: '設定', icon: 'color-palette' },
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
          tabBarIcon: ({ focused, color, size }) => {
            const cfg = TAB_CONFIG.find((t) => t.name === route.name);
            return (
              <Ionicons
                name={focused ? cfg.icon : `${cfg.icon}-outline`}
                size={size}
                color={color}
              />
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
