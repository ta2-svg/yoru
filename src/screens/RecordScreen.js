import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const isWeb = Platform.OS === 'web';

function pad(n) { return String(n).padStart(2, '0'); }
function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

export default function RecordScreen() {
  const { theme } = useTheme();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [playingUri, setPlayingUri] = useState(null);
  const soundRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    loadRecordings();
    if (!isWeb) Audio.requestPermissionsAsync();
    return () => {
      clearInterval(timerRef.current);
      soundRef.current?.unloadAsync();
    };
  }, []);

  const loadRecordings = async () => {
    const raw = await AsyncStorage.getItem('recordings');
    if (raw) setRecordings(JSON.parse(raw));
  };

  const saveRecordings = async (list) => {
    await AsyncStorage.setItem('recordings', JSON.stringify(list));
  };

  const startRecording = async () => {
    if (isWeb) {
      Alert.alert('お知らせ', '録音機能はモバイルアプリのみ対応しています');
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((p) => p + 1000), 1000);
    } catch (e) {
      Alert.alert('エラー', 'マイクへのアクセスを許可してください');
    }
  };

  const stopRecording = async () => {
    clearInterval(timerRef.current);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const entry = {
      uri,
      date: new Date().toLocaleString('ja-JP'),
      duration: elapsed,
    };
    const updated = [entry, ...recordings];
    setRecordings(updated);
    await saveRecordings(updated);
    setRecording(null);
    setIsRecording(false);
    setElapsed(0);
  };

  const playRecording = async (uri) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (playingUri === uri) {
      setPlayingUri(null);
      return;
    }
    const { sound } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;
    setPlayingUri(uri);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) setPlayingUri(null);
    });
  };

  const deleteRecording = async (index) => {
    const updated = recordings.filter((_, i) => i !== index);
    setRecordings(updated);
    await saveRecordings(updated);
  };

  const s = styles(theme);
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>睡眠録音</Text>
      <Text style={s.desc}>睡眠中のいびきや寝言を記録します</Text>

      <View style={s.recCircle}>
        {isRecording && <View style={s.recDot} />}
        <Text style={s.recTime}>{formatDuration(elapsed)}</Text>
        <Text style={s.recStatus}>{isRecording ? '録音中...' : '待機中'}</Text>
      </View>

      <TouchableOpacity
        style={[s.mainButton, isRecording ? s.stopBtn : s.startBtn]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={s.mainButtonText}>{isRecording ? '⏹ 録音停止' : '🎙 録音開始'}</Text>
      </TouchableOpacity>

      {recordings.length > 0 && (
        <View style={s.listSection}>
          <Text style={s.sectionTitle}>録音一覧</Text>
          {recordings.map((r, i) => (
            <View key={i} style={s.item}>
              <View style={s.itemInfo}>
                <Text style={s.itemDate}>{r.date}</Text>
                <Text style={s.itemDuration}>{formatDuration(r.duration)}</Text>
              </View>
              <View style={s.itemActions}>
                <TouchableOpacity onPress={() => playRecording(r.uri)} style={s.actionBtn}>
                  <Text style={{ fontSize: 26 }}>{playingUri === r.uri ? '⏸' : '▶️'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecording(i)} style={s.actionBtn}>
                  <Text style={{ fontSize: 22 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
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
  title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
  desc: { fontSize: 13, color: theme.textSecondary, marginBottom: 32, textAlign: 'center' },
  recCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.card,
    borderWidth: 3,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  recDot: {
    position: 'absolute',
    top: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.danger,
  },
  recTime: { fontSize: 32, fontWeight: 'bold', color: theme.primary },
  recStatus: { fontSize: 13, color: theme.textSecondary, marginTop: 6 },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginBottom: 32,
  },
  startBtn: { backgroundColor: theme.primary },
  stopBtn: { backgroundColor: theme.danger },
  mainButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  listSection: { width: '100%' },
  sectionTitle: { fontSize: 14, color: theme.textSecondary, marginBottom: 12 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  itemInfo: { flex: 1 },
  itemDate: { fontSize: 13, color: theme.textSecondary },
  itemDuration: { fontSize: 15, color: theme.text, fontWeight: 'bold', marginTop: 2 },
  itemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 4 },
});
