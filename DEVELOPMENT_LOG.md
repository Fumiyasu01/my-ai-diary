# My AI Diary - 開発ログ

## プロジェクト概要
- **開発日**: 2025年8月28日
- **開発者**: Fumiyasu01
- **デプロイURL**: https://my-ai-diary-ten.vercel.app/
- **GitHub**: https://github.com/Fumiyasu01/my-ai-diary

## 開発環境
- **Node.js**: v18+
- **React**: 19.1.1
- **TypeScript**: 4.9.5
- **Tailwind CSS**: 3.4.17
- **開発ポート**: 3001（3000は他アプリで使用中）

## 実装完了機能一覧

### ✅ Phase 1: 基礎構築
1. **プロジェクトセットアップ**
   - Create React App with TypeScript
   - Tailwind CSS v3.4（v4はCRAと非互換のため注意）
   - ポート3001で開発

2. **基本UIコンポーネント**
   - `Header.tsx`: ヘッダーとタブ切り替え
   - `ChatView.tsx`: チャット画面
   - `MessageList.tsx`: メッセージ一覧
   - `MessageInput.tsx`: メッセージ入力
   - `Message.tsx`: 個別メッセージ表示
   - `DiaryView.tsx`: 日記表示画面

### ✅ Phase 2: コア機能
3. **AIエージェント設定**
   - `AgentSettings.tsx`: 性格カスタマイズモーダル
   - 名前と性格の自由記述設定
   - リアルタイムで設定反映

4. **IndexedDB データ永続化**
   - `services/database.ts`: データベースサービス
   - `hooks/useDatabase.ts`: カスタムフック
   - 会話履歴の自動保存
   - 設定の永続化

5. **OpenAI API連携**
   - `services/openai.ts`: OpenAIサービスクラス
   - `ApiKeySettings.tsx`: APIキー設定モーダル
   - GPT-3.5-turbo使用
   - カスタムシステムプロンプト対応

### ✅ Phase 3: 日記機能
6. **日記自動生成**
   - `DiaryGenerator.tsx`: 日記生成ボタン
   - 会話4回以上で生成可能
   - 感情分析とキーワード抽出
   - JSON形式でのデータ構造化

7. **カレンダービュー**
   - `CalendarView.tsx`: カレンダー表示
   - 日記がある日にEmoji表示
   - 日付クリックで該当日記表示
   - リスト/カレンダー切り替え

### ✅ Phase 4: デバッグ・改善
8. **デバッグ機能**
   - `DebugInfo.tsx`: 現在の設定表示
   - 設定の反映確認用

## 重要な技術的決定事項

### 1. **Tailwind CSS v3使用**
```json
"tailwindcss": "^3.4.17"  // v4はCreate React Appと非互換
```

### 2. **データ構造**
```typescript
// 会話データ
interface ConversationData {
  id: string;
  date: string;
  conversations: MessageData[];
  diary?: DiaryData;
}

// 日記データ
interface DiaryData {
  summary: string;
  emotion: string[];
  keywords: string[];
}
```

### 3. **API設計**
- システムプロンプト: `あなたの名前は${agentName}です。${agentPersonality}`
- 日記生成は別エンドポイント使用

## トラブルシューティング記録

### 問題1: PostCSSエラー
- **原因**: Tailwind CSS v4の自動インストール
- **解決**: v3.4に明示的にダウングレード

### 問題2: 設定が反映されない
- **原因**: Reactコンポーネントの状態管理
- **解決**: useEffectで設定値の同期追加

### 問題3: ポート競合
- **原因**: 3000番ポートが使用中
- **解決**: PORT=3001で起動

## デプロイ情報

### GitHub設定
```bash
git remote add origin https://github.com/Fumiyasu01/my-ai-diary.git
git branch -M main
git push -u origin main
```

### Vercel設定
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- 自動デプロイ: GitHub push時

## 今後の課題・改善案

### 優先度高
- [ ] PWA化（オフライン対応）
- [ ] 音声入力機能
- [ ] データエクスポート（PDF/JSON）

### 優先度中
- [ ] ダークモード
- [ ] 複数言語対応
- [ ] 統計グラフ表示

### 優先度低
- [ ] ユーザー認証（Firebase Auth）
- [ ] クラウド同期
- [ ] 共有機能

## 開発コマンド集

```bash
# 開発サーバー起動
PORT=3001 npm start

# ビルド
npm run build

# デプロイ（Vercelの場合）
git push origin main  # 自動デプロイされる

# IndexedDBクリア（ブラウザコンソール）
indexedDB.deleteDatabase('my-ai-diary')
```

## APIキー管理
- **保存場所**: ブラウザのIndexedDB
- **セキュリティ**: クライアントサイドのみ、サーバー送信なし
- **テスト用**: OpenAI Playgroundで事前確認推奨

## 次回開発時の注意点

1. **必ず最初に確認**
   - ポート3001で起動すること
   - Tailwind CSS v3を維持すること
   - buildフォルダはgitignoreに含まれている

2. **新機能追加時**
   - TypeScriptの型定義を必ず追加
   - IndexedDBのマイグレーション考慮
   - モバイルファーストで設計

3. **デバッグ時**
   - DebugInfoコンポーネントで設定確認
   - ブラウザのIndexedDBを直接確認
   - OpenAI APIのレスポンスログ確認

## 連絡・サポート
- GitHub Issues: https://github.com/Fumiyasu01/my-ai-diary/issues
- デプロイURL: https://my-ai-diary-ten.vercel.app/

---

## 追記情報

### 2025年10月18日
- v2.0開発計画策定完了
- 市場調査・競合分析完了
- 技術スタック決定: Next.js 15 + Supabase + Stripe
- 移植計画書作成: MIGRATION_ASSETS.md
- 完全な開発計画書作成: NEW_PROJECT_PLAN.md

### 2025年11月6日 - 現在の状態
- **v1.0本番環境**: ✅ 継続稼働中（84日間）
- **アクセス**: https://my-ai-diary-ten.vercel.app/
- **安定性**: 問題なく動作中
- **次期開発**: v2.0計画完了、開発着手待ち

---
最終更新: 2025年11月6日