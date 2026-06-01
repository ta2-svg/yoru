import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SOUNDS = [
  { id: 'rain', label: '雨音', icon: 'rainy-outline', desc: '穏やかな雨の音' },
  { id: 'ocean', label: '波音', icon: 'water-outline', desc: '寄せては返す波' },
  { id: 'white', label: 'ホワイトノイズ', icon: 'radio-outline', desc: '一定の静音' },
  { id: 'forest', label: '森の音', icon: 'leaf-outline', desc: '虫の声・風の音' },
];

const BREATHING = [
  { id: '478', label: '4-7-8 呼吸法', inhale: 4, hold: 7, exhale: 8, desc: '緊張緩和に効果的' },
  { id: 'box', label: 'ボックス呼吸', inhale: 4, hold: 4, exhale: 4, desc: '集中・リラックス' },
  { id: 'calm', label: 'ゆっくり呼吸', inhale: 5, hold: 0, exhale: 8, desc: '自然な深呼吸' },
];

export default function SleepAidScreen() {
  const { theme } = useTheme();
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [breathingMode, setBreathingMode] = useState(null);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [breathLabel, setBreathLabel] = useState('');
  const soundRef = useRef(null);
  const breathAnim = useRef(new Animated.Value(0.4)).current;
  const breathTimerRef = useRef(null);
  const phaseTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      clearTimeout(breathTimerRef.current);
      clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const toggleSound = async (soundId) => {
    if (activeSound === soundId) {
      await soundRef.current?.unloadAsync();
      soundRef.current = null;
      setActiveSound(null);
      return;
    }
    await soundRef.current?.unloadAsync();
    soundRef.current = null;
    // In production, use actual audio URIs. Here we simulate with a silent loop.
    setActiveSound(soundId);
  };

  const startBreathing = (pattern) => {
    if (breathingMode?.id === pattern.id) {
      stopBreathing();
      return;
    }
    stopBreathing();
    setBreathingMode(pattern);
    setBreathCount(0);
    runBreathCycle(pattern, 0);
  };

  const stopBreathing = () => {
    clearTimeout(breathTimerRef.current);
    clearTimeout(phaseTimerRef.current);
    breathAnim.stopAnimation();
    breathAnim.setValue(0.4);
    setBreathingMode(null);
    setBreathPhase('inhale');
    setBreathLabel('');
    setBreathCount(0);
  };

  const runBreathCycle = (pattern, count) => {
    const phases = [];
    phases.push({ phase: 'inhale', label: '吸う', duration: pattern.inhale * 1000, toValue: 1 });
    if (pattern.hold > 0) {
      phases.push({ phase: 'hold', label: '止める', duration: pattern.hold * 1000, toValue: 1 });
    }
    phases.push({ phase: 'exhale', label: '吐く', duration: pattern.exhale * 1000, toValue: 0.4 });

    let delay = 0;
    phases.forEach(({ phase, label, duration, toValue }) => {
      phaseTimerRef.current = setTimeout(() => {
        setBreathPhase(phase);
        setBreathLabel(label);
        Animated.timing(breathAnim, {
          toValue,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, delay);
      delay += duration;
    });

    breathTimerRef.current = setTimeout(() => {
      setBreathCount(count + 1);
      runBreathCycle(pattern, count + 1);
    }, delay);
  };

  const s = styles(theme);
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>睡眠導入</Text>

      {breathingMode ? (
        <View style={s.breathSection}>
          <Animated.View style={[s.breathCircle, { transform: [{ scale: breathAnim }] }]}>
            <Text style={s.breathLabel}>{breathLabel}</Text>
            <Text style={s.breathCount}>{breathCount}回</Text>
          </Animated.View>
          <Text style={s.breathName}>{breathingMode.label}</Text>
          <TouchableOpacity style={s.stopBreathBtn} onPress={stopBreathing}>
            <Text style={s.stopBreathText}>停止</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={s.section}>
            <Text style={s.sectionTitle}>呼吸法</Text>
            {BREATHING.map((b) => (
              <TouchableOpacity key={b.id} style={s.breathCard} onPress={() => startBreathing(b)}>
                <View style={s.breathCardLeft}>
                  <Text style={s.breathCardName}>{b.label}</Text>
                  <Text style={s.breathCardDesc}>{b.desc}</Text>
                  <Text style={s.breathCardRhythm}>
                    {b.inhale}秒吸う {b.hold > 0 ? `→ ${b.hold}秒止める ` : ''}→ {b.exhale}秒吐く
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>環境音 (サウンド)</Text>
            <View style={s.soundGrid}>
              {SOUNDS.map((sound) => (
                <TouchableOpacity
                  key={sound.id}
                  style={[s.soundCard, activeSound === sound.id && s.soundCardActive]}
                  onPress={() => toggleSound(sound.id)}
                >
                  <Ionicons
                    name={sound.icon}
                    size={28}
                    color={activeSound === sound.id ? '#fff' : theme.primary}
                  />
                  <Text style={[s.soundLabel, activeSound === sound.id && s.soundLabelActive]}>
                    {sound.label}
                  </Text>
                  {activeSound === sound.id && (
                    <View style={s.playingDot} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {activeSound && (
              <Text style={s.soundNote}>
                * 実際の音源はアプリビルド後に追加されます
              </Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 24, textAlign: 'center' },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 14, color: theme.textSecondary, marginBottom: 12 },
  breathSection: { alignItems: 'center', paddingVertical: 20 },
  breathCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.primary + '33',
    borderWidth: 3,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  breathLabel: { fontSize: 24, fontWeight: 'bold', color: theme.primary },
  breathCount: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
  breathName: { fontSize: 16, color: theme.text, marginBottom: 20 },
  stopBreathBtn: {
    backgroundColor: theme.danger,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  stopBreathText: { color: '#fff', fontWeight: 'bold' },
  breathCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  breathCardLeft: { flex: 1 },
  breathCardName: { fontSize: 15, fontWeight: 'bold', color: theme.text, marginBottom: 2 },
  breathCardDesc: { fontSize: 12, color: theme.textSecondary, marginBottom: 4 },
  breathCardRhythm: { fontSize: 12, color: theme.primary },
  soundGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  soundCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 18,
    width: '46%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    position: 'relative',
  },
  soundCardActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  soundLabel: { color: theme.text, marginTop: 8, fontSize: 13, fontWeight: '600' },
  soundLabelActive: { color: '#fff' },
  playingDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  soundNote: { fontSize: 11, color: theme.textSecondary, marginTop: 8, textAlign: 'center' },
});
