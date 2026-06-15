import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const features = [
  { emoji: '⏰', label: 'タイマー', screen: 'Timer', desc: '睡眠時間を計測・アラーム' },
  { emoji: '🎙️', label: '録音', screen: 'Record', desc: '睡眠中の音を記録' },
  { emoji: '🌙', label: '睡眠導入', screen: 'SleepAid', desc: 'ホワイトノイズ・呼吸法' },
  { emoji: '🎨', label: 'テーマ', screen: 'Settings', desc: '着せ替えカスタマイズ' },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const s = styles(theme);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 5 ? 'おやすみなさい' : hour < 12 ? 'おはようございます' : hour < 18 ? 'こんにちは' : 'こんばんは';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Text style={s.greeting}>{greeting}</Text>
        <Text style={s.appName}>夜 Yoru</Text>
        <Text style={s.subtitle}>今夜も良い眠りを</Text>
      </View>

      <View style={s.grid}>
        {features.map((f) => (
          <TouchableOpacity key={f.screen} style={s.card} onPress={() => navigation.navigate(f.screen)}>
            <View style={s.iconWrap}>
              <Text style={s.emoji}>{f.emoji}</Text>
            </View>
            <Text style={s.cardLabel}>{f.label}</Text>
            <Text style={s.cardDesc}>{f.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.tip}>
        <Text style={s.tipText}>ℹ️ 画面下のタブからも各機能にアクセスできます</Text>
      </View>
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  greeting: { fontSize: 14, color: theme.textSecondary, marginBottom: 4 },
  appName: { fontSize: 42, fontWeight: 'bold', color: theme.primary, letterSpacing: 4 },
  subtitle: { fontSize: 14, color: theme.textSecondary, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    width: '44%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  iconWrap: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  emoji: { fontSize: 32 },
  cardLabel: { fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
  cardDesc: { fontSize: 11, color: theme.textSecondary, textAlign: 'center' },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
    justifyContent: 'center',
  },
  tipText: { fontSize: 12, color: theme.textSecondary },
});
