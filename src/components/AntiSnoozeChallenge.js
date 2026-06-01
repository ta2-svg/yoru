import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function generateQuestion() {
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 20;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function AntiSnoozeChallenge({ visible, onSolve }) {
  const { theme } = useTheme();
  const [qa, setQa] = useState(generateQuestion());
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (visible) {
      setQa(generateQuestion());
      setInput('');
      setError(false);
    }
  }, [visible]);

  const check = () => {
    if (parseInt(input, 10) === qa.answer) {
      onSolve();
    } else {
      setError(true);
      setInput('');
      setQa(generateQuestion());
    }
  };

  const s = styles(theme);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>起きてる？</Text>
          <Text style={s.subtitle}>計算を解いてアラームを止める</Text>
          <Text style={s.question}>{qa.question}</Text>
          {error && <Text style={s.error}>不正解！もう一度</Text>}
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            keyboardType="numeric"
            placeholder="答えを入力"
            placeholderTextColor={theme.textSecondary}
            autoFocus
          />
          <TouchableOpacity style={s.button} onPress={check}>
            <Text style={s.buttonText}>確認</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 32,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.primary, marginBottom: 6 },
  subtitle: { fontSize: 13, color: theme.textSecondary, marginBottom: 24 },
  question: { fontSize: 36, fontWeight: 'bold', color: theme.text, marginBottom: 16 },
  error: { color: theme.danger, marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: theme.surface,
    color: theme.text,
    borderRadius: 12,
    padding: 12,
    fontSize: 20,
    textAlign: 'center',
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
