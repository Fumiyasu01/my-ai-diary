# My AI Diary - AIとの会話が日記になるアプリ

## 概要
カスタマイズ可能なAIエージェントとの日常会話を自動的に日記として記録・整理するWebアプリケーション。

## コンセプト
「AIとの日常会話が、自動的に自分だけの日記になるアプリ」

### 解決する課題
- AIモデルのアップデートによる性格・口調の変化への不満
- 日記を書く習慣の継続が難しい
- AIとの会話履歴が散逸してしまう
- 自分好みのAI相談相手が欲しい

## 主要機能

### ✅ 実装済み
- **基本UIレイアウト**
  - モバイルファーストのレスポンシブデザイン
  - チャット/日記のタブ切り替え
  - WhatsApp/LINE風のメッセージUI

- **AIエージェント設定**
  - 自由記述での性格・話し方のカスタマイズ
  - 設定モーダルUI
  - カスタムプロンプトの反映

- **OpenAI API連携**
  - GPT-3.5-turbo/GPT-4対応
  - APIキー検証機能
  - リアルタイムチャット機能

- **データ永続化**
  - IndexedDBによるローカル保存
  - 会話履歴の自動保存
  - エージェント設定の永続化

- **日記自動生成**
  - AIによる会話内容の自動要約
  - 感情タグの自動付与
  - キーワード自動抽出
  - カレンダービュー対応
  - リスト/カレンダー表示切り替え

### 🚧 開発中
- **追加機能**
  - データエクスポート/インポートUI
  - 音声入力（Web Speech API）
  - PWA対応
  - オンボーディング画面

### 📋 今後実装予定
- **検索・フィルター機能**
- **感情分析の精度向上**
- **複数AIモデル対応（Claude等）**

## 技術スタック
- **フロントエンド**: React 19.1.1 (TypeScript)
- **スタイリング**: Tailwind CSS 3.4
- **データ保存**: IndexedDB (idb)
- **AI連携**: OpenAI API
- **開発環境**: Create React App

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（ポート3001）
PORT=3001 npm start

# ビルド
npm run build

# テスト実行
npm test
```

## プロジェクト構造
```
src/
├── components/
│   ├── Header.tsx          # ヘッダーコンポーネント
│   ├── ChatView.tsx        # チャット画面
│   ├── MessageList.tsx     # メッセージリスト
│   ├── MessageInput.tsx    # メッセージ入力
│   ├── Message.tsx         # 個別メッセージ
│   ├── DiaryView.tsx       # 日記表示画面
│   ├── DiaryGenerator.tsx  # 日記生成コンポーネント
│   ├── CalendarView.tsx    # カレンダー表示
│   ├── AgentSettings.tsx   # AI設定モーダル
│   ├── ApiKeySettings.tsx  # APIキー設定モーダル
│   └── DebugInfo.tsx       # デバッグ情報
├── services/
│   ├── database.ts         # IndexedDB操作
│   └── openai.ts           # OpenAI API連携
├── hooks/
│   └── useDatabase.ts      # データベースフック
├── types/
│   └── index.ts            # TypeScript型定義
├── App.tsx                 # メインアプリケーション
└── index.css              # Tailwind CSS設定
```

## データ構造

### 会話データ
```typescript
{
  id: string,
  date: string,
  conversations: [{
    role: 'user' | 'assistant',
    content: string,
    timestamp: string
  }],
  diary?: {
    summary: string,
    emotion: string[],
    keywords: string[]
  },
  metadata?: {
    wordCount: number,
    conversationCount: number,
    duration: number
  }
}
```

### AIエージェント設定
```typescript
{
  agentName: string,
  personality: string,
  createdAt: string,
  lastUpdated: string,
  apiProvider?: 'openai' | 'claude',
  apiKey?: string
}
```

## 使い方

### 1. APIキーの設定
1. [OpenAI Platform](https://platform.openai.com/api-keys)でAPIキーを取得
2. アプリの設定ボタンからAPIキーを入力
3. APIキーが検証され、保存されます

### 2. AIエージェントのカスタマイズ
1. 設定画面からエージェント名と性格を設定
2. 詳しく設定するほど、好みのAIになります
3. いつでも変更可能です

### 3. 会話と日記生成
1. チャットタブで自由に会話
2. 4回以上の会話後、「日記を生成」ボタンが有効に
3. 日記タブで自動生成された日記を確認

## プライバシーとセキュリティ
- すべてのデータはブラウザのIndexedDBに保存
- APIキーはローカルストレージに保存（暗号化なし）
- サーバーへのデータ送信はOpenAI APIのみ
- データのエクスポート/インポート機能でバックアップ可能

## 料金について

### アプリの利用
- **このアプリ自体は完全無料**です
- ホスティング（Vercel等）も無料プランで利用可能

### OpenAI API料金
- **各ユーザーが自分のAPIキーを設定します**
- 料金は**各ユーザー自身のOpenAIアカウント**に発生
- GPT-3.5-turbo: 1000トークンあたり約$0.002
- 通常の使用では月額$1〜5程度

### 重要な注意点
- ⚠️ **サイト運営者に料金は発生しません**
- ⚠️ **他のユーザーのAPIキーと共有されません**
- ⚠️ APIキーは各ユーザーのブラウザ内にのみ保存されます

## 開発状況
- 2025-08-14: プロジェクト開始
- 2025-11-06: コア機能実装完了、ローンチ準備中

## ライセンス
Private Project

## サポート
問題が発生した場合は、GitHubのIssuesでご報告ください。
