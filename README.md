# 夜 (Yoru) - 睡眠記録アプリ

<div align="center">
  <h3>🌙 あなたの眠りをサポートする睡眠アプリ</h3>
  <p>React Native (Expo) で作られたモバイル向け睡眠管理アプリ</p>
</div>

---

## 機能

### ⏰ 睡眠タイマー
- 睡眠時間を自動計測
- アラーム設定（6〜8時間後）
- 睡眠記録の履歴表示（直近10件）

### 🧩 二度寝防止
- アラームを止めるには計算問題を解く必要がある
- 間違えるたびに新しい問題が出題される
- 加算・減算・乗算のランダム問題

### 🎙️ 睡眠録音
- 睡眠中の音声を録音・保存
- 録音一覧から再生・削除
- いびきや寝言の確認に

### 🌬️ 睡眠導入
- **呼吸法**: 4-7-8・ボックス・ゆっくり呼吸
- **環境音**: 雨音・波音・ホワイトノイズ・森の音
- アニメーションで呼吸をガイド

### 🎨 テーマ着せ替え
- 5種類のテーマ: 夜空・オーロラ・桜・深林・深海
- 設定は端末に保存される

---

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/yoru.git
cd yoru

# 依存関係のインストール
yarn install

# Expo Go アプリで起動
npx expo start
```

### 必要な環境
- Node.js 18+
- Expo Go アプリ (iOS/Android)
- または Android Studio / Xcode

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native (Expo) |
| ナビゲーション | React Navigation v6 |
| 音声 | expo-av |
| 通知 | expo-notifications |
| ストレージ | AsyncStorage |
| アイコン | @expo/vector-icons (Ionicons) |

---

## ディレクトリ構成

```
yoru/
├── App.js                        # エントリーポイント
└── src/
    ├── context/
    │   └── ThemeContext.js       # テーマ管理
    ├── themes/
    │   └── themes.js             # テーマ定義
    ├── navigation/
    │   └── AppNavigator.js       # タブナビゲーション
    ├── screens/
    │   ├── HomeScreen.js         # ホーム画面
    │   ├── TimerScreen.js        # タイマー画面
    │   ├── RecordScreen.js       # 録音画面
    │   ├── SleepAidScreen.js     # 睡眠導入画面
    │   └── SettingsScreen.js     # テーマ設定画面
    └── components/
        └── AntiSnoozeChallenge.js # 二度寝防止コンポーネント
```

---

## ライセンス

MIT License
