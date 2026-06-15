import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function WebLayout({ children }) {
  const { theme } = useTheme();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={[styles.outer, { backgroundColor: theme.background }]}>
      {/* 左グラデーション */}
      <View style={[styles.side, styles.left, {
        background: `linear-gradient(to right, ${theme.background}, ${theme.primary}22, ${theme.accent}33)`,
      }]} />

      {/* スマホ枠 390px */}
      <View style={[styles.phone, {
        backgroundColor: theme.background,
        boxShadow: `0 0 80px ${theme.primary}44, 0 0 0 1px ${theme.border}`,
      }]}>
        {children}
      </View>

      {/* 右グラデーション */}
      <View style={[styles.side, styles.right, {
        background: `linear-gradient(to left, ${theme.background}, ${theme.primary}22, ${theme.accent}33)`,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: '100vh',
  },
  side: {
    flex: 1,
  },
  left: {},
  right: {},
  phone: {
    width: 390,
    minHeight: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
});
