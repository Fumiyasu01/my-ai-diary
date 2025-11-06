# My AI Diary v2.0 - クイックスタートガイド

**最終更新**: 2025-10-18

---

## 🚀 3分でわかる新規開発計画

### これまでの経緯
1. **旧バージョン**: Create React App + OpenAI直接呼び出し
2. **市場調査**: 成長市場（CAGR 13.9%）、競合分析完了
3. **決定**: Next.js 15で新規開発（3-4週間で完成予定）

### なぜ新規開発？
- ✅ Claude Codeで高速開発可能
- ✅ 既存UIコンポーネント90%再利用
- ✅ モダンスタックで将来性が高い
- ✅ 初期コスト無料（Supabase + Vercel Free tier）
- ✅ 開発期間が改修より2週間短縮

---

## 📚 重要ドキュメント

| ファイル | 内容 | 用途 |
|---------|------|------|
| **NEW_PROJECT_PLAN.md** | 完全な開発計画書 | 全体像の把握 |
| **MIGRATION_ASSETS.md** | 移植資産リスト | コンポーネント移植時 |
| **QUICK_START.md** | このファイル | クイックリファレンス |

---

## 💻 技術スタック早見表

```
フロントエンド:   Next.js 15 + React 19 + TypeScript
スタイリング:     Tailwind CSS v4
バックエンド:     Next.js API Routes（サーバーレス）
認証・DB:        Supabase（PostgreSQL）
決済:           Stripe
AI:             OpenAI API（GPT-4o-mini）
ホスティング:     Vercel
```

---

## 🎯 開発スケジュール

```
Week 1: 基盤構築（Next.js + Supabase + 認証）
Week 2: コア機能（チャット + AI + 日記生成）
Week 3: サブスクリプション（Stripe + 使用量制限）
Week 4: 継続支援機能 + デプロイ
```

---

## 🏁 今すぐ始める手順（30分）

### 1. 新規プロジェクト作成
```bash
npx create-next-app@latest my-ai-diary-v2 \
  --typescript \
  --tailwind \
  --app \
  --src-dir

cd my-ai-diary-v2
```

### 2. 依存パッケージインストール
```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add stripe @stripe/stripe-js
pnpm add openai
pnpm add zustand @tanstack/react-query
```

### 3. Supabaseプロジェクト作成
1. https://supabase.com/dashboard にアクセス
2. "New project" をクリック
3. プロジェクト名: `my-ai-diary-v2`
4. リージョン: `Northeast Asia (Tokyo)`
5. APIキーをコピー

### 4. 環境変数設定
```bash
# .env.local ファイル作成
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
EOF
```

### 5. 開発サーバー起動
```bash
pnpm dev
# http://localhost:3000 にアクセス
```

---

## 📋 Phase 1 (Week 1-2) チェックリスト

### 必須タスク

**基盤:**
- [ ] Next.jsプロジェクト作成
- [ ] Supabaseプロジェクト作成
- [ ] データベーススキーマ実装（NEW_PROJECT_PLAN.md参照）
- [ ] 認証フロー実装（ログイン/サインアップ）

**UIコンポーネント移植:**
- [ ] `ChatView.tsx` をコピー・修正
- [ ] `Message.tsx` をコピー
- [ ] `MessageList.tsx` をコピー
- [ ] `MessageInput.tsx` をコピー
- [ ] `DiaryView.tsx` をコピー・修正
- [ ] `CalendarView.tsx` をコピー

**API実装:**
- [ ] `/api/chat/route.ts` （OpenAI連携）
- [ ] `/api/diary/route.ts` （日記生成）
- [ ] メッセージ保存ロジック

**動作確認:**
- [ ] ログインできる
- [ ] チャットできる
- [ ] 日記が生成される
- [ ] 日記が表示される

---

## 💰 マネタイゼーション早見表

### 価格設定
```
無料:     ¥0    （1日3回まで）
月額:     ¥980  （無制限）
年額:     ¥6,800（30%オフ）
学割:     ¥680  （30%オフ）
```

### 収益予測（1年目）
```
月間ユーザー:    1,000人
フリーミアム変換: 3%（30人）
月間収益:       ¥29,400
年間収益:       ¥352,800
```

---

## 🎨 既存UIコンポーネント活用

### すぐ使える（90%のコンポーネント）

```bash
# 旧プロジェクトからコピー
cp src/components/ChatView.tsx ../my-ai-diary-v2/src/components/chat/
cp src/components/Message.tsx ../my-ai-diary-v2/src/components/chat/
cp src/components/MessageList.tsx ../my-ai-diary-v2/src/components/chat/
cp src/components/MessageInput.tsx ../my-ai-diary-v2/src/components/chat/
cp src/components/DiaryView.tsx ../my-ai-diary-v2/src/components/diary/
cp src/components/CalendarView.tsx ../my-ai-diary-v2/src/components/diary/
```

**修正箇所（各ファイル5-10分）:**
1. Import文を `@/` パスに変更
2. API呼び出しを `/api/chat` に変更
3. データ取得をSupabaseに変更

詳細は **MIGRATION_ASSETS.md** 参照

---

## 🔑 重要なコード例

### 1. Supabase クライアント
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

### 2. チャットAPI
```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // 認証確認
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  // サブスク・使用量確認
  // ...

  // OpenAI API呼び出し
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await openai.chat.completions.create({...})

  return Response.json(response)
}
```

### 3. 認証フック
```typescript
// lib/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user }
}
```

---

## 🐛 よくあるエラーと解決法

### エラー1: Supabase接続エラー
```bash
# 環境変数を確認
echo $NEXT_PUBLIC_SUPABASE_URL

# .env.local が正しく設定されているか確認
cat .env.local
```

### エラー2: OpenAI API エラー
```bash
# APIキーの確認
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### エラー3: ビルドエラー
```bash
# キャッシュクリア
rm -rf .next
pnpm dev
```

---

## 📱 サポートするプラットフォーム

- ✅ iOS Safari（モバイル）
- ✅ Android Chrome（モバイル）
- ✅ Chrome/Firefox/Safari（デスクトップ）
- ✅ PWA対応（Phase 2以降）

---

## 🎓 学習リソース

### 公式ドキュメント
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### チュートリアル
- [Next.js + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Next.js + Stripe Subscriptions](https://github.com/vercel/nextjs-subscription-payments)

---

## 📞 質問・サポート

### 開発中の質問
1. **NEW_PROJECT_PLAN.md** を参照
2. **MIGRATION_ASSETS.md** で移植方法確認
3. 公式ドキュメント検索
4. Claude Codeに質問

### プロジェクト情報
- **旧本番環境**: https://my-ai-diary-ten.vercel.app/
- **GitHub（旧）**: https://github.com/Fumiyasu01/my-ai-diary

---

## ✅ 次のアクション

**今日やること:**
1. [ ] Next.jsプロジェクト作成（10分）
2. [ ] Supabaseアカウント作成（5分）
3. [ ] 環境変数設定（5分）
4. [ ] Hello World確認（5分）

**明日やること:**
1. [ ] データベーススキーマ実装
2. [ ] 認証フロー実装
3. [ ] 最初のUIコンポーネント移植

**今週のゴール:**
- [ ] ログイン機能完成
- [ ] チャット機能完成
- [ ] 既存UIコンポーネント全て移植

---

## 🎉 開発を始めましょう！

```bash
# Step 1: プロジェクト作成
npx create-next-app@latest my-ai-diary-v2 --typescript --tailwind --app

# Step 2: 移動
cd my-ai-diary-v2

# Step 3: 開発開始！
pnpm dev
```

**詳細は NEW_PROJECT_PLAN.md を参照してください。**

**成功を祈ります！🚀**
