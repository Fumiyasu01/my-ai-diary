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

### ✅ 実装済み（v1.0）
- **基本UIレイアウト**
  - モバイルファーストのレスポンシブデザイン
  - チャット/日記のタブ切り替え
  - WhatsApp/LINE風のメッセージUI

- **AIエージェント設定**
  - 自由記述での性格・話し方のカスタマイズ
  - 設定モーダルUI
  - リアルタイムでの設定反映

- **API連携**
  - OpenAI API（GPT-3.5-turbo）との接続完了
  - カスタムプロンプトの反映
  - APIキー設定画面

- **データ永続化**
  - IndexedDBによるローカル保存完了
  - 会話履歴の自動保存
  - 設定情報の永続化

- **日記自動生成**
  - 会話内容の自動要約（4回以上の会話後）
  - 感情タグの自動付与（7種類）
  - キーワード自動抽出
  - JSON形式でのデータ構造化

- **日記表示機能**
  - 日記一覧表示（リストビュー）
  - カレンダービュー（日付ベース）
  - 感情別フィルター
  - 日付クリックで該当日記表示

### 🎯 本番環境
- **デプロイURL**: https://my-ai-diary-ten.vercel.app/
- **ホスティング**: Vercel（自動デプロイ設定済み）
- **ステータス**: ✅ 稼働中

### 📋 今後実装予定（v2.0計画中）
- **新規開発**: Next.js 15 + Supabase + Stripe
- **主要機能**: フリーミアムモデル、認証、サブスクリプション
- **詳細**: NEW_PROJECT_PLAN.md 参照

- **追加機能（検討中）**
  - 音声入力（Web Speech API）
  - PWA対応
  - データエクスポート（PDF/JSON）
  - 統計グラフ表示

## 技術スタック（v1.0）
- **フロントエンド**: React 19.1.1 (TypeScript)
- **スタイリング**: Tailwind CSS 3.4.17
- **データ保存**: IndexedDB（ローカルのみ）
- **AI連携**: OpenAI API (GPT-3.5-turbo)
- **開発環境**: Create React App
- **ホスティング**: Vercel
- **ポート**: 3001（開発時）

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（ポート3001）
PORT=3001 npm start

# ビルド
npm run build
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
│   └── AgentSettings.tsx   # AI設定モーダル
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
  diary: {
    summary: string,
    emotion: string[],
    keywords: string[]
  }
}
```

### AIエージェント設定
```typescript
{
  agentName: string,
  personality: string,
  createdAt: string,
  lastUpdated: string
}
```

## 開発状況

### v1.0（完成・本番稼働中）
- **2025-08-14**: プロジェクト開始、基本UI実装完了
- **2025-08-28**: v1.0完成（全機能実装完了）
  - OpenAI API連携
  - IndexedDB実装
  - 日記自動生成機能
  - カレンダービュー
  - Vercelデプロイ完了
- **2025-08-29**: 開発ドキュメント整備
- **2025-10-18**: v2.0計画書作成
- **2025-11-06**: 現在も本番環境で稼働中

### v2.0（計画中）
- **計画策定**: 2025-10-18
- **詳細**: NEW_PROJECT_PLAN.md, MIGRATION_ASSETS.md 参照
- **技術スタック**: Next.js 15 + Supabase + Stripe

## 使い方

### 1. アクセス
デプロイされたURLにアクセスしてください。

### 2. 初期設定
1. 右上の設定ボタンをクリック
2. OpenAI APIキーを入力（[取得方法](https://platform.openai.com/api-keys)）
3. AIエージェントの名前と性格を設定

### 3. 使用開始
- **チャット**: AIと自由に会話
- **日記生成**: 4回以上会話後、「日記を生成」ボタンをクリック
- **日記閲覧**: 日記タブで過去の日記を確認
- **カレンダー**: カレンダービューで日付から日記を選択

## プライバシー
- すべてのデータはあなたのブラウザ内にのみ保存されます
- サーバーにデータは送信されません
- APIキーも安全にローカル保存されます

## ライセンス
MIT License