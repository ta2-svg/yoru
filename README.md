# 🌙 夜 (Yoru) — 睡眠記録アプリ

<div align="center">

**React Native (Expo) で作った睡眠管理モバイルアプリです。**

[![GitHub Pages](https://img.shields.io/badge/デモを見る-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://ta2-svg.github.io/yoru)

</div>

---

## 📱 アプリの機能

| 機能 | 説明 |
|------|------|
| ⏰ **睡眠タイマー** | 睡眠時間を自動計測。6〜8時間後にアラームを設定できる |
| 🧩 **二度寝防止** | アラームを止めるには計算問題を解く必要がある |
| 🎙️ **睡眠録音** | 睡眠中の音を録音・再生・削除できる |
| 🌬️ **睡眠導入** | 呼吸法アニメーション（4-7-8呼吸など）と環境音 |
| 🎨 **テーマ着せ替え** | 5種類のカラーテーマを選べる |

---

## 🖼️ 画面構成

```
ホーム画面
├── タイマー画面      ← 睡眠計測・アラーム・履歴
├── 録音画面          ← 録音・再生・削除
├── 睡眠導入画面      ← 呼吸法・環境音
└── 設定画面          ← テーマ選択
```

---

## 🎨 テーマ一覧

| テーマ名 | イメージ |
|---------|--------|
| 夜空 (Midnight) | 深い紺色 × 青紫 |
| オーロラ (Aurora) | 深緑 × シアン |
| 桜 (Sakura) | 深紅 × ピンク |
| 深林 (Forest) | 深緑 × ライトグリーン |
| 深海 (Ocean) | 黒 × 水色 |

---

## 🛠️ 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native (Expo SDK 56) |
| 言語 | JavaScript |
| ナビゲーション | React Navigation v6 (Bottom Tabs) |
| 音声 | expo-av |
| 通知 | expo-notifications |
| ストレージ | AsyncStorage |
| アイコン | Ionicons (@expo/vector-icons) |

---

## 📁 ファイル構成

```
yoru/
├── App.js                              # エントリーポイント
├── app.json                            # Expo設定
└── src/
    ├── context/
    │   └── ThemeContext.js             # テーマのグローバル管理
    ├── themes/
    │   └── themes.js                   # 5種類のテーマ定義
    ├── navigation/
    │   └── AppNavigator.js             # タブナビゲーション
    ├── screens/
    │   ├── HomeScreen.js               # ホーム画面
    │   ├── TimerScreen.js              # 睡眠タイマー画面
    │   ├── RecordScreen.js             # 録音画面
    │   ├── SleepAidScreen.js           # 睡眠導入画面
    │   └── SettingsScreen.js           # テーマ設定画面
    └── components/
        └── AntiSnoozeChallenge.js      # 二度寝防止コンポーネント
```

---

## 🚀 ローカルで動かす方法

```bash
# リポジトリをクローン
git clone https://github.com/ta2-svg/yoru.git
cd yoru

# 依存関係インストール
yarn install

# 起動
npx expo start
```

スマホに **Expo Go** アプリを入れてQRコードを読み取ると動作確認できます。

---

## 👤 作成者

- GitHub: [@ta2-svg](https://github.com/ta2-svg)
