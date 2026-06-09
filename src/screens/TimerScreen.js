import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import AntiSnoozeChallenge from '../components/AntiSnoozeChallenge';

// モバイルのみ通知・KeepAwakeを使用
let Notifications = null;
let activateKeepAwakeAsync = () => Promise.resolve();
let deactivateKeepAwake = () => {};

if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  const keepAwake = require('expo-keep-awake');
  activateKeepAwakeAsync = keepAwake.activateKeepAwakeAsync;
  deactivateKeepAwake = keepAwake.deactivateKeepAwake;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function pad(n) { return String(n).padStart(2, '0'); }
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const ALARM_PRESETS = [
  { label: '6時間後', hours: 6 },
  { label: '7時間後', hours: 7 },
  { label: '7.5時間後', hours: 7.5 },
  { label: '8時間後', hours: 8 },
];

export default function TimerScreen() {
  const { theme } = useTheme();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [alarmHours, setAlarmHours] = useState(7);
  const [challengeVisible, setChallengeVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const notifIdRef = useRef(null);

  useEffect(() => {
    loadHistory();
    requestPermissions();
    return () => clearInterval(intervalRef.current);
  }, []);

  const requestPermissions = async () => {
    if (Notifications) await Notifications.requestPermissionsAsync();
  };

  const loadHistory = async () => {
    const raw = await AsyncStorage.getItem('sleepHistory');
    if (raw) setHistory(JSON.parse(raw));
  };

  const saveHistory = async (entry) => {
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    await AsyncStorage.setItem('sleepHistory', JSON.stringify(updated));
  };

  const start = async () => {
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);
    setRunning(true);
    await activateKeepAwakeAsync();

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    if (Notifications) {
      const trigger = new Date(now + alarmHours * 3600 * 1000);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ 起きる時間です',
          body: `${alarmHours}時間が経過しました！`,
          sound: true,
        },
        trigger,
      });
      notifIdRef.current = id;
    }
  };

  const stop = async (solved = false) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    if (notifIdRef.current && Notifications) {
      await Notifications.cancelScheduledNotificationAsync(notifIdRef.current);
      notifIdRef.current = null;
    }
    deactivateKeepAwake();
    if (elapsed > 60) {
      const entry = {
        date: new Date(startTime).toLocaleDateString('ja-JP'),
        duration: elapsed,
        formatted: formatDuration(elapsed),
      };
      await saveHistory(entry);
    }
    setElapsed(0);
    setStartTime(null);
  };

  const handleStop = () => {
    if (running) {
      setChallengeVisible(true);
    }
  };

  const onChallengeSolved = () => {
    setChallengeVisible(false);
    stop(true);
  };

  const s = styles(theme);
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <AntiSnoozeChallenge visible={challengeVisible} onSolve={onChallengeSolved} />

      <Text style={s.title}>睡眠タイマー</Text>

      <View style={s.timerCircle}>
        <Text style={s.timerText}>{formatDuration(elapsed)}</Text>
        <Text style={s.timerLabel}>{running ? '睡眠中...' : '停止中'}</Text>
      </View>

      {!running && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>アラーム設定</Text>
          <View style={s.presets}>
            {ALARM_PRESETS.map((p) => (
              <TouchableOpacity
                key={p.hours}
                style={[s.preset, alarmHours === p.hours && s.presetActive]}
                onPress={() => setAlarmHours(p.hours)}
              >
                <Text style={[s.presetText, alarmHours === p.hours && s.presetTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[s.mainButton, running ? s.stopButton : s.startButton]}
        onPress={running ? handleStop : start}
      >
        <Ionicons
          name={running ? 'stop-circle-outline' : 'play-circle-outline'}
          size={28}
          color="#fff"
        />
        <Text style={s.mainButtonText}>
          {running ? '停止（二度寝防止）' : '睡眠開始'}
        </Text>
      </TouchableOpacity>

      {history.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>最近の睡眠記録</Text>
          {history.slice(0, 5).map((h, i) => (
            <View key={i} style={s.historyItem}>
              <Text style={s.historyDate}>{h.date}</Text>
              <Text style={s.historyDuration}>{h.formatted}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 32 },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.card,
    borderWidth: 3,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: { fontSize: 36, fontWeight: 'bold', color: theme.primary, letterSpacing: 2 },
  timerLabel: { fontSize: 14, color: theme.textSecondary, marginTop: 6 },
  section: { width: '100%', marginBottom: 24 },
  sectionTitle: { fontSize: 14, color: theme.textSecondary, marginBottom: 12 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  preset: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  presetActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  presetText: { color: theme.textSecondary, fontSize: 13 },
  presetTextActive: { color: '#fff', fontWeight: 'bold' },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginBottom: 32,
  },
  startButton: { backgroundColor: theme.primary },
  stopButton: { backgroundColor: theme.danger },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  historyDate: { color: theme.textSecondary, fontSize: 14 },
  historyDuration: { color: theme.primary, fontWeight: 'bold', fontSize: 14 },
});
