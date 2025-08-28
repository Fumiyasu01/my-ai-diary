# CLAUDE.md - 開発方針と重要事項

## プロジェクト概要
**My AI Diary** - カスタマイズ可能なAIエージェントとの会話を自動的に日記として記録するWebアプリ

## 開発の基本方針

### 1. ユーザー体験優先
- **シンプルで直感的なUI**: 誰でも迷わず使える
- **モバイルファースト**: スマホでの利用を最優先
- **レスポンシブデザイン**: どの端末でも快適に

### 2. プライバシー重視
- **ローカルストレージ優先**: データはユーザーのブラウザに保存
- **APIキーの安全な管理**: ユーザー自身が管理
- **エクスポート機能**: データの可搬性を確保

### 3. カスタマイズ性
- **AIの性格を自由に設定**: ユーザーが求めるAI像を実現
- **日記の自動生成**: 会話から意味のある日記を作成

## 技術的な重要事項

### 現在の環境
- **開発ポート**: 3001（3000は他のアプリで使用中）
- **React**: v19.1.1（最新版）
- **Tailwind CSS**: v3.4（v4はCRAと非互換）

### 実装上の注意点
1. **PostCSS設定**: Tailwind CSS v3を使用（v4はエラーになる）
2. **TypeScript**: 型定義を明確にして保守性を高める
3. **コンポーネント設計**: 再利用可能な小さな単位で構築

## 開発ロードマップ

### Phase 1: 基礎構築 ✅
- [x] プロジェクトセットアップ
- [x] 基本UIコンポーネント
- [x] AIエージェント設定画面

### Phase 2: コア機能 🚧
- [ ] OpenAI/Claude API連携
- [ ] IndexedDBでのデータ永続化
- [ ] リアルタイムチャット機能

### Phase 3: 日記機能
- [ ] 会話の自動要約
- [ ] 感情分析とタグ付け
- [ ] 日記表示の最適化

### Phase 4: 拡張機能
- [ ] 音声入力対応
- [ ] カレンダービュー
- [ ] 検索・フィルター機能
- [ ] データエクスポート

## API設計方針

### OpenAI/Claude API連携
```typescript
// APIキーは環境変数またはローカルストレージで管理
const apiKey = localStorage.getItem('openai_api_key');

// カスタムプロンプトの組み立て
const systemPrompt = `
あなたの名前は${agentName}です。
${agentPersonality}
ユーザーとの会話を楽しんでください。
`;
```

### IndexedDB構造
```typescript
// データベース名: my-ai-diary
// ストア構造:
// - conversations: 会話履歴
// - diaries: 生成された日記
// - settings: ユーザー設定
```

## 開発時のコマンド

```bash
# 開発サーバー起動
PORT=3001 npm start

# ビルド
npm run build

# テスト実行
npm test

# 型チェック
npx tsc --noEmit
```

## トラブルシューティング

### よくある問題と解決策

1. **PostCSSエラー**
   - 原因: Tailwind CSS v4の使用
   - 解決: v3.4.xを使用する

2. **ポート競合**
   - 原因: 3000番ポートが使用中
   - 解決: PORT=3001で起動

3. **型エラー**
   - 確認: tsconfig.jsonの設定
   - 解決: 適切な型定義を追加

## 今後の課題

### 技術的課題
- [ ] パフォーマンス最適化（大量の会話データ処理）
- [ ] オフライン対応
- [ ] PWA化

### UX改善
- [ ] オンボーディングフロー
- [ ] チュートリアル機能
- [ ] フィードバック機能

## 開発者メモ

### 2025-08-28 開発完了
- プロジェクト開始・完成
- 基本UI実装完了
- Tailwind CSS v4→v3への変更（CRA互換性のため）
- ポート3001で開発環境構築
- IndexedDB実装（データ永続化）
- OpenAI API連携（GPT-3.5-turbo）
- 日記自動生成機能実装
- カレンダービュー実装
- Vercelデプロイ完了

## 現在のステータス
- **本番環境**: https://my-ai-diary-ten.vercel.app/
- **GitHub**: https://github.com/Fumiyasu01/my-ai-diary
- **状態**: ✅ 本番稼働中

## 次回開発時の必須確認事項

### 1. 環境設定
```bash
# 開発開始前に必ず実行
cd /Users/fumiyasu/develop/my-ai-diary
PORT=3001 npm start  # ポート3001必須
```

### 2. 重要な制約
- **Tailwind CSS**: v3.4を維持（v4は使用不可）
- **React**: v19.1.1で動作確認済み
- **ポート**: 3001固定（3000は他アプリ使用中）

### 3. データ確認
```javascript
// ブラウザコンソールでIndexedDB確認
const db = await openDB('my-ai-diary', 1);
const conversations = await db.getAll('conversations');
console.log(conversations);
```

### 4. コンポーネント構造
```
src/
├── components/       # UIコンポーネント
├── services/        # API連携・DB操作
├── hooks/          # カスタムフック
└── types/          # TypeScript型定義
```

### 5. Git操作
```bash
# 変更をデプロイ
git add .
git commit -m "変更内容"
git push origin main  # Vercel自動デプロイ
```

## トラブルシューティング早見表

| 問題 | 解決方法 |
|------|---------|
| PostCSSエラー | Tailwind CSS v3を再インストール |
| ポート使用中 | PORT=3001で起動 |
| 設定が反映されない | DebugInfoで確認、useEffect追加 |
| データが消えた | IndexedDBを確認 |
| APIエラー | APIキーの有効性確認 |

---

詳細は DEVELOPMENT_LOG.md を参照してください。