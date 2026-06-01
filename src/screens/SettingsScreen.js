import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, themeKey, setTheme, themes } = useTheme();
  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>テーマ設定</Text>
      <Text style={s.subtitle}>アプリの見た目を変更できます</Text>

      <View style={s.grid}>
        {Object.entries(themes).map(([key, t]) => (
          <TouchableOpacity
            key={key}
            style={[s.themeCard, themeKey === key && s.themeCardActive]}
            onPress={() => setTheme(key)}
          >
            <View style={[s.palette, { backgroundColor: t.background }]}>
              <View style={[s.paletteDot, { backgroundColor: t.primary }]} />
              <View style={[s.paletteDot, { backgroundColor: t.accent }]} />
              <View style={[s.paletteDot, { backgroundColor: t.card }]} />
            </View>
            <Text style={s.themeName}>{t.name}</Text>
            {themeKey === key && (
              <View style={s.checkWrap}>
                <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.infoSection}>
        <Text style={s.sectionTitle}>アプリについて</Text>
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="moon-outline" size={18} color={theme.primary} />
            <Text style={s.infoLabel}>アプリ名</Text>
            <Text style={s.infoValue}>夜 (Yoru)</Text>
          </View>
          <View style={s.divider} />
          <View style={s.infoRow}>
            <Ionicons name="code-slash-outline" size={18} color={theme.primary} />
            <Text style={s.infoLabel}>バージョン</Text>
            <Text style={s.infoValue}>1.0.0</Text>
          </View>
          <View style={s.divider} />
          <View style={s.infoRow}>
            <Ionicons name="heart-outline" size={18} color={theme.primary} />
            <Text style={s.infoLabel}>作成</Text>
            <Text style={s.infoValue}>React Native + Expo</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: theme.textSecondary, marginBottom: 28 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 36 },
  themeCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    width: '44%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
    position: 'relative',
  },
  themeCardActive: { borderColor: theme.primary },
  palette: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: theme.border,
  },
  paletteDot: { width: 12, height: 12, borderRadius: 6 },
  themeName: { fontSize: 14, fontWeight: 'bold', color: theme.text },
  checkWrap: { position: 'absolute', top: 8, right: 8 },
  infoSection: { marginTop: 4 },
  sectionTitle: { fontSize: 14, color: theme.textSecondary, marginBottom: 12 },
  infoCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  infoLabel: { flex: 1, color: theme.textSecondary, fontSize: 14 },
  infoValue: { color: theme.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.border },
});
