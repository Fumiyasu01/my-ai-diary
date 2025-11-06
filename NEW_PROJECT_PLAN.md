# My AI Diary v2.0 - 新規開発プロジェクト計画書

**作成日**: 2025-10-18
**プロジェクト名**: My AI Diary v2.0
**目的**: 市場で売れるAI日記アプリの構築

---

## 📋 目次

1. [エグゼクティブサマリー](#エグゼクティブサマリー)
2. [市場分析結果](#市場分析結果)
3. [プロジェクト概要](#プロジェクト概要)
4. [技術スタック](#技術スタック)
5. [アーキテクチャ設計](#アーキテクチャ設計)
6. [データベース設計](#データベース設計)
7. [機能要件](#機能要件)
8. [UI/UX設計方針](#uiux設計方針)
9. [既存資産の移植計画](#既存資産の移植計画)
10. [開発ロードマップ](#開発ロードマップ)
11. [マネタイゼーション戦略](#マネタイゼーション戦略)
12. [セットアップ手順](#セットアップ手順)

---

## エグゼクティブサマリー

### ビジョン
「AIとの日常会話が、自動的に自分だけの日記になるアプリ」を提供し、メンタルヘルスとウェルネス市場で成功する。

### 重要な決定事項
- **アプローチ**: 新規開発（Next.js 15ベース）
- **理由**: Claude Code活用により3-4週間で完成、最新技術、低コスト
- **既存プロジェクト**: UIコンポーネント90%を移植・再利用

### ビジネス目標
- **1年目**: 月間1万ユーザー、3%変換率、月額収益 ¥230,000
- **市場規模**: 日本メンタルヘルスアプリ市場 324百万ドル（2024）→ 1,365百万ドル（2035）
- **成長率**: CAGR 13.9%

---

## 市場分析結果

### 市場規模

#### グローバル
- **メンタルヘルスアプリ**: 2025年 74.8億ドル → 2032年 238億ドル（CAGR 18%）
- **日記アプリ**: 2025年 1.1億ドル → 2033年 3億ドル（CAGR 11.5%）

#### 日本市場
- **2024年**: 324百万ドル
- **2035年予測**: 1,365百万ドル
- **CAGR**: 13.9%

### 主要競合分析

#### Replika（AIコンパニオン）
- ユーザー数: 3000万人
- 有料変換率: 25%
- 価格: 月額$14.99、年額$49.99
- 強み: 感情的つながり、3Dアバター

#### Day One（日記アプリ）
- ダウンロード数: 1500万+
- 受賞: Apple Design Award、App of the Year
- 強み: プライバシー、リッチメディア、継続支援

#### Calm（メンタルヘルス）
- ダウンロード数: 1億+
- 有料ユーザー: 400万人（4%変換率）
- 企業評価: $20億
- 強み: Sleep Stories、B2B展開

#### MydayAI（日本）
- 無料で使用可能
- AI分析、グラフ化機能

### 重要な市場インサイト

1. **Gen Zの92%がデジタルウェルネスを好む**
2. **フリーミアム変換率**: 標準2-5%、優良10-15%
3. **継続率の課題**: 初日50%離脱、7日後30%、30日後13-18%
4. **価格帯**: 月額¥980-1,480、年額¥6,800前後が主流
5. **成功要因**: パーソナライゼーション、継続支援、感情的つながり

---

## プロジェクト概要

### コンセプト
カスタマイズ可能なAIエージェントとの会話を自動的に日記として記録し、メンタルヘルスとウェルネスをサポートする。

### 解決する課題
1. 日記を書く習慣の継続が難しい
2. AIモデルのアップデートによる性格変化への不満
3. プライバシーを守りながらAI対話を楽しみたい
4. 自分の感情や思考を可視化・分析したい

### ターゲットユーザー
- **年齢**: 20-35歳（Gen Z/Millennial）
- **属性**: 都市部在住、デジタルネイティブ
- **関心**: メンタルヘルス、自己啓発、プライバシー
- **課金許容度**: ¥1,000/月

### ユニークバリュープロポジション（UVP）
「AIとの自然な会話が、自動的に構造化された日記になる。あなた専用のAIカウンセラー × 日記アプリ」

---

## 技術スタック

### 旧プロジェクト（参考）
```
フロントエンド: React 19.1.1 + TypeScript + Tailwind CSS v3.4
データ保存: IndexedDB（ローカルのみ）
API: OpenAI直接呼び出し（クライアントサイド）
ホスティング: Vercel（静的サイト）
制約: Create React App（2024年以降非推奨）
```

### 新プロジェクト（v2.0）

#### フロントエンド
```
フレームワーク: Next.js 15 (App Router)
言語: TypeScript 5.x
UI: React 19
スタイリング: Tailwind CSS v4
状態管理: Zustand + TanStack Query
コンポーネント: Radix UI（アクセシビリティ）
```

#### バックエンド
```
API: Next.js API Routes（サーバーレス）
認証: Supabase Auth
データベース: PostgreSQL（Supabase）
ストレージ: Supabase Storage
リアルタイム: Supabase Realtime
```

#### 外部サービス
```
AI: OpenAI API（GPT-4o-mini）
決済: Stripe
メール: Resend
分析: Vercel Analytics + PostHog
エラー追跡: Sentry
```

#### 開発ツール
```
パッケージマネージャー: pnpm
リンター: ESLint + Prettier
型チェック: TypeScript strict mode
テスト: Vitest + React Testing Library
CI/CD: GitHub Actions
```

---

## アーキテクチャ設計

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                         クライアント                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Next.js 15 (App Router) + React 19            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Chat UI    │  │ Diary UI   │  │ Settings   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────┐    │  │
│  │  │    Zustand Store + TanStack Query          │    │  │
│  │  └────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Next.js API Routes                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ /api/chat    │  │ /api/diary   │  │ /api/stripe  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│  ┌──────▼──────────────────▼──────────────────▼─────────┐  │
│  │              Middleware Layer                        │  │
│  │  - 認証チェック (Supabase Auth)                       │  │
│  │  - レート制限 (Upstash Redis)                        │  │
│  │  - サブスク確認                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Supabase   │  │  OpenAI API │  │   Stripe    │
│             │  │             │  │             │
│ - Auth      │  │ - GPT-4o    │  │ - Checkout  │
│ - Database  │  │ - Embedding │  │ - Webhook   │
│ - Storage   │  │             │  │ - Portal    │
└─────────────┘  └─────────────┘  └─────────────┘
```

### ディレクトリ構造

```
my-ai-diary-v2/
├── app/
│   ├── (auth)/                    # 認証グループ
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (app)/                     # メインアプリ（認証必須）
│   │   ├── layout.tsx             # アプリレイアウト
│   │   ├── chat/
│   │   │   └── page.tsx           # チャット画面
│   │   ├── diary/
│   │   │   ├── page.tsx           # 日記一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx       # 日記詳細
│   │   └── settings/
│   │       ├── page.tsx           # 設定トップ
│   │       ├── agent/
│   │       │   └── page.tsx       # AI設定
│   │       └── subscription/
│   │           └── page.tsx       # サブスク管理
│   ├── api/                       # APIルート
│   │   ├── chat/
│   │   │   └── route.ts           # チャットAPI
│   │   ├── diary/
│   │   │   ├── route.ts           # 日記生成API
│   │   │   └── [id]/
│   │   │       └── route.ts       # 日記CRUD
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts       # チェックアウト
│   │   │   ├── webhook/
│   │   │   │   └── route.ts       # Webhook処理
│   │   │   └── portal/
│   │   │       └── route.ts       # カスタマーポータル
│   │   └── usage/
│   │       └── route.ts           # 使用量確認
│   ├── layout.tsx                 # ルートレイアウト
│   └── page.tsx                   # ランディングページ
├── components/
│   ├── ui/                        # 基本UIコンポーネント（Radix UI）
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── chat/                      # チャット関連
│   │   ├── ChatView.tsx           # ← 既存から移植
│   │   ├── Message.tsx            # ← 既存から移植
│   │   ├── MessageList.tsx        # ← 既存から移植
│   │   └── MessageInput.tsx       # ← 既存から移植
│   ├── diary/                     # 日記関連
│   │   ├── DiaryView.tsx          # ← 既存から移植
│   │   ├── DiaryCard.tsx
│   │   ├── CalendarView.tsx       # ← 既存から移植
│   │   └── EmotionChart.tsx
│   ├── settings/
│   │   ├── AgentSettings.tsx      # ← 既存から移植（改良）
│   │   └── SubscriptionCard.tsx
│   ├── onboarding/
│   │   ├── OnboardingFlow.tsx
│   │   └── StepIndicator.tsx
│   ├── streak/
│   │   ├── StreakDisplay.tsx
│   │   └── StreakCalendar.tsx
│   └── layout/
│       ├── Header.tsx             # ← 既存から移植（改良）
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabaseクライアント
│   │   ├── server.ts              # サーバーサイド用
│   │   └── middleware.ts          # ミドルウェア
│   ├── openai/
│   │   ├── client.ts              # OpenAIクライアント
│   │   └── prompts.ts             # プロンプトテンプレート
│   ├── stripe/
│   │   ├── client.ts              # Stripeクライアント
│   │   └── plans.ts               # プラン定義
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSubscription.ts
│   │   ├── useStreak.ts
│   │   ├── useChat.ts
│   │   └── useDiary.ts
│   ├── store/
│   │   ├── authStore.ts           # 認証状態
│   │   ├── chatStore.ts           # チャット状態
│   │   └── settingsStore.ts       # 設定状態
│   └── utils/
│       ├── date.ts
│       ├── emotion.ts
│       └── format.ts
├── types/
│   ├── index.ts                   # ← 既存から移植
│   ├── database.ts                # Supabase型定義
│   └── stripe.ts                  # Stripe型定義
├── prisma/
│   └── schema.prisma              # DB スキーマ
├── public/
│   ├── images/
│   ├── icons/
│   └── sw.js                      # Service Worker（PWA）
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## データベース設計

### Supabase（PostgreSQL）スキーマ

```sql
-- ユーザープロファイル（Supabase Authと連携）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AIエージェント設定
CREATE TABLE agent_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL DEFAULT 'AIアシスタント',
  personality TEXT NOT NULL,
  avatar_url TEXT,
  voice_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 会話履歴
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- メッセージ
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 日記エントリー
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  emotions TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  word_count INTEGER,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- サブスクリプション
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL, -- 'free', 'premium_monthly', 'premium_yearly'
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 使用量トラッキング
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  message_count INTEGER DEFAULT 0,
  diary_count INTEGER DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ストリーク（連続記録）
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 通知設定
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  daily_reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '20:00:00',
  streak_reminder_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- インデックス
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_diary_entries_user_date ON diary_entries(user_id, date DESC);
CREATE INDEX idx_conversations_user_date ON conversations(user_id, date DESC);
CREATE INDEX idx_usage_records_user_date ON usage_records(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー（例: profiles）
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 他のテーブルも同様のポリシーを設定
```

### ER図（主要なリレーション）

```
profiles (ユーザー)
  ├─ 1:1 → agent_settings (AI設定)
  ├─ 1:1 → subscriptions (サブスク)
  ├─ 1:1 → streaks (ストリーク)
  ├─ 1:1 → notification_settings (通知設定)
  ├─ 1:N → conversations (会話)
  ├─ 1:N → diary_entries (日記)
  └─ 1:N → usage_records (使用量)

conversations (会話)
  ├─ 1:N → messages (メッセージ)
  └─ 1:1 → diary_entries (日記)
```

---

## 機能要件

### Phase 1: MVP（3-4週間）

#### 必須機能（Must Have）

**1. 認証・オンボーディング**
- [ ] メール/パスワード認証
- [ ] Google OAuth
- [ ] 初回オンボーディングフロー（3ステップ）
  - ステップ1: ようこそ画面
  - ステップ2: AI性格設定（プリセット + カスタム）
  - ステップ3: 通知設定
- [ ] プロフィール設定

**2. チャット機能**
- [ ] リアルタイムチャット（OpenAI API）
- [ ] メッセージ履歴表示
- [ ] タイピングインジケーター
- [ ] メッセージの自動保存
- [ ] 会話の日付別整理
- [ ] ← 既存UIコンポーネント活用

**3. AI エージェント**
- [ ] カスタム性格設定
- [ ] プリセット性格（5種類）
  - 優しい聞き上手
  - 前向きなコーチ
  - 冷静なアドバイザー
  - クリエイティブな友人
  - ユーモラスな相棒
- [ ] AIアバター表示（シンプルなイラスト）
- [ ] システムプロンプトのカスタマイズ

**4. 日記自動生成**
- [ ] 会話から日記生成（4回以上の会話後）
- [ ] 感情分析（7種類の感情タグ）
- [ ] キーワード自動抽出
- [ ] 日記の編集機能
- [ ] ← 既存ロジック活用

**5. 日記表示**
- [ ] 日記一覧（リスト表示）
- [ ] カレンダー表示
- [ ] 感情別フィルター
- [ ] キーワード検索
- [ ] ← 既存UIコンポーネント活用

**6. サブスクリプション（フリーミアム）**
- [ ] 無料プラン（1日3回まで会話）
- [ ] プレミアムプラン（無制限）
- [ ] Stripe Checkout統合
- [ ] サブスク管理画面
- [ ] 使用量表示
- [ ] アップグレード誘導

**7. 基本設定**
- [ ] プロフィール編集
- [ ] AI設定変更
- [ ] 通知設定
- [ ] アカウント削除

#### 重要機能（Should Have）

**8. 継続支援**
- [ ] ストリーク表示（連続記録日数）
- [ ] デイリーリマインダー通知
- [ ] 達成バッジ（7日、30日、100日）
- [ ] 「On This Day」（過去の今日）

**9. データ管理**
- [ ] データエクスポート（JSON）
- [ ] 会話履歴のダウンロード
- [ ] 日記のバックアップ

### Phase 2: 強化機能（4-8週間後）

**10. 高度なパーソナライゼーション**
- [ ] AIが過去の会話を学習
- [ ] ユーザーの好みに応じた質問提案
- [ ] 最適な対話時間の学習
- [ ] 感情トレンド分析

**11. リッチコンテンツ**
- [ ] 日記プロンプト集（100種類）
- [ ] 状況別テンプレート
- [ ] ガイド付き瞑想音声
- [ ] マインドフルネスエクササイズ

**12. データ可視化**
- [ ] 感情トレンドグラフ
- [ ] 話題の分析（ワードクラウド）
- [ ] 月次レポート自動生成
- [ ] 統計ダッシュボード

**13. ソーシャル機能（軽め）**
- [ ] 匿名での感情共有
- [ ] 共感リアクション（コメント不可）
- [ ] コミュニティチャレンジ
- [ ] 他ユーザーとの比較統計

**14. PWA機能**
- [ ] オフライン対応
- [ ] プッシュ通知
- [ ] ホーム画面追加
- [ ] バックグラウンド同期

### Phase 3: スケール機能（3ヶ月後～）

**15. 音声機能**
- [ ] 音声入力（Web Speech API）
- [ ] 音声読み上げ
- [ ] 音声でのAI対話

**16. B2B機能**
- [ ] 企業向けダッシュボード
- [ ] チーム管理
- [ ] 集計レポート
- [ ] カスタムブランディング

**17. ネイティブアプリ**
- [ ] iOS アプリ（React Native）
- [ ] Android アプリ
- [ ] App Store 配信

**18. 多言語対応**
- [ ] 英語
- [ ] 中国語（簡体字・繁体字）
- [ ] 韓国語

---

## UI/UX設計方針

### デザイン原則

1. **シンプルさ**: 3クリック以内に全ての主要機能へアクセス
2. **共感的**: 温かみのある色調、柔らかいフォント
3. **プライバシー**: 安全性を視覚的に伝える
4. **習慣化**: 進捗が見える、達成感を感じる
5. **モバイルファースト**: スマホでの快適な操作

### カラーパレット

```css
/* プライマリー（信頼・安心） */
--primary-50: #EFF6FF;
--primary-100: #DBEAFE;
--primary-500: #3B82F6;  /* メインカラー */
--primary-600: #2563EB;
--primary-900: #1E3A8A;

/* セカンダリー（温かみ） */
--secondary-50: #FEF3C7;
--secondary-500: #F59E0B;
--secondary-600: #D97706;

/* アクセント（ポジティブ） */
--accent-50: #ECFDF5;
--accent-500: #10B981;
--accent-600: #059669;

/* ニュートラル */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-900: #111827;

/* 感情カラー */
--emotion-happy: #FCD34D;      /* 嬉しい */
--emotion-sad: #93C5FD;        /* 悲しい */
--emotion-angry: #FCA5A5;      /* 怒り */
--emotion-anxious: #C4B5FD;    /* 不安 */
--emotion-grateful: #86EFAC;   /* 感謝 */
```

### タイポグラフィ

```css
/* フォントファミリー */
--font-sans: 'Inter', 'Noto Sans JP', sans-serif;
--font-display: 'Sora', 'Noto Sans JP', sans-serif;

/* サイズ */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### コンポーネントライブラリ

**Radix UI + Tailwind CSS**
- アクセシビリティ対応
- カスタマイズ性が高い
- ヘッドレスUI

**採用コンポーネント:**
- Dialog（モーダル）
- Dropdown Menu
- Tooltip
- Toast（通知）
- Tabs
- Accordion
- Progress

### アニメーション方針

```
- ページ遷移: 200ms ease-out
- ホバー: 150ms ease-in-out
- ローディング: スケルトンスクリーン + スピナー
- 成功フィードバック: チェックマークアニメーション（300ms）
```

### レスポンシブブレークポイント

```css
/* Tailwind CSS デフォルト */
sm: 640px   /* スマホ横向き */
md: 768px   /* タブレット */
lg: 1024px  /* ノートPC */
xl: 1280px  /* デスクトップ */
2xl: 1536px /* 大画面 */
```

### 既存UIからの継承

**そのまま活用できるもの:**
- チャットUIのレイアウト
- メッセージバブルのデザイン
- 日記カードのデザイン
- カレンダービューのレイアウト
- 感情アイコンのマッピング

**改良が必要なもの:**
- ヘッダー（ナビゲーション強化）
- 設定モーダル（項目追加）
- オンボーディング（新規作成）
- サブスク画面（新規作成）

---

## 既存資産の移植計画

### 移植優先度：高（そのまま使える）

| ファイル | 移植先 | 修正内容 |
|---------|--------|----------|
| `src/components/ChatView.tsx` | `components/chat/ChatView.tsx` | API呼び出し先変更のみ |
| `src/components/Message.tsx` | `components/chat/Message.tsx` | 変更なし |
| `src/components/MessageList.tsx` | `components/chat/MessageList.tsx` | 変更なし |
| `src/components/MessageInput.tsx` | `components/chat/MessageInput.tsx` | 軽微な調整 |
| `src/components/DiaryView.tsx` | `components/diary/DiaryView.tsx` | データ取得方法変更 |
| `src/components/CalendarView.tsx` | `components/diary/CalendarView.tsx` | 変更なし |
| `src/types/index.ts` | `types/index.ts` | 型定義追加 |

### 移植優先度：中（部分的に改良）

| ファイル | 移植先 | 修正内容 |
|---------|--------|----------|
| `src/components/Header.tsx` | `components/layout/Header.tsx` | ナビゲーション追加 |
| `src/components/AgentSettings.tsx` | `components/settings/AgentSettings.tsx` | プリセット機能追加 |
| `src/components/DiaryGenerator.tsx` | `components/diary/DiaryGenerator.tsx` | サブスク連携追加 |

### 移植優先度：低（参考にする）

| ファイル | 利用方法 |
|---------|----------|
| `src/services/openai.ts` | プロンプト設計の参考 |
| `src/services/database.ts` | データ構造の参考 |
| `src/hooks/useDatabase.ts` | Supabaseフック設計の参考 |

### 移植しないもの（置き換え）

| 旧ファイル | 理由 | 新実装 |
|-----------|------|--------|
| `src/components/ApiKeySettings.tsx` | サーバーサイドで管理 | 不要 |
| `src/components/DebugInfo.tsx` | 開発用 | Vercel Analytics |
| `src/App.tsx` | App Router に移行 | `app/layout.tsx` + ページ |

---

## 開発ロードマップ

### Week 1: 基盤構築

**Day 1: プロジェクトセットアップ**
- [ ] Next.js プロジェクト作成
- [ ] Supabase プロジェクト作成
- [ ] 環境変数設定
- [ ] Git リポジトリ初期化
- [ ] パッケージインストール

**Day 2-3: データベース設計**
- [ ] Prisma スキーマ作成
- [ ] Supabase マイグレーション
- [ ] RLS ポリシー設定
- [ ] シードデータ作成

**Day 4-5: 認証実装**
- [ ] Supabase Auth 統合
- [ ] ログイン/サインアップ画面
- [ ] 認証ミドルウェア
- [ ] プロフィール作成フロー

### Week 2: コア機能実装

**Day 1-2: チャット機能**
- [ ] 既存UIコンポーネント移植
- [ ] `/api/chat/route.ts` 実装
- [ ] OpenAI API 統合
- [ ] メッセージ保存ロジック
- [ ] リアルタイム更新（Supabase Realtime）

**Day 3: AI エージェント設定**
- [ ] AgentSettings コンポーネント改良
- [ ] プリセット性格5種類作成
- [ ] システムプロンプト管理
- [ ] 設定保存API

**Day 4-5: 日記生成**
- [ ] 日記生成API実装
- [ ] 感情分析ロジック
- [ ] キーワード抽出
- [ ] 日記表示UI移植

### Week 3: サブスクリプション

**Day 1-2: Stripe 統合**
- [ ] Stripe アカウントセットアップ
- [ ] プラン作成（Free/Premium）
- [ ] Checkout Session API
- [ ] Customer Portal API

**Day 3: 使用量制限**
- [ ] レート制限ミドルウェア
- [ ] 使用量トラッキング
- [ ] フリープラン制限（1日3回）
- [ ] 制限到達時のUI

**Day 4-5: サブスク画面**
- [ ] プラン比較表
- [ ] 支払い画面
- [ ] サブスク管理画面
- [ ] Webhook 処理

### Week 4: 継続支援＆仕上げ

**Day 1-2: 継続支援機能**
- [ ] ストリーク計算ロジック
- [ ] StreakDisplay コンポーネント
- [ ] 達成バッジシステム
- [ ] 「On This Day」機能

**Day 3: オンボーディング**
- [ ] ウェルカム画面
- [ ] 3ステップフロー
- [ ] プリセット選択UI
- [ ] 初回会話誘導

**Day 4: 最終調整**
- [ ] エラーハンドリング
- [ ] ローディング状態
- [ ] レスポンシブ対応確認
- [ ] アクセシビリティチェック

**Day 5: デプロイ**
- [ ] 環境変数設定（Vercel）
- [ ] Supabase 本番環境設定
- [ ] ドメイン設定
- [ ] 本番デプロイ
- [ ] 動作確認

### Week 5-8: Phase 2（オプション）

**継続的な改善:**
- データ可視化機能
- プロンプト集
- ソーシャル機能
- PWA 対応
- パフォーマンス最適化

---

## マネタイゼーション戦略

### 価格設定

#### 個人向けプラン

**無料プラン（Free）**
```
価格: ¥0
制限:
- 1日3回までの会話
- 週1回の日記生成
- 基本的な感情分析
- 広告表示（将来的に）
- データ保存30日間
```

**プレミアムプラン（Premium）**
```
月額: ¥980
年額: ¥6,800（¥566/月、30%オフ）

特典:
- 無制限の会話
- 毎日の日記自動生成
- 高度な感情分析とインサイト
- データエクスポート（JSON/PDF）
- 複数のAI性格作成（最大5つ）
- 音声入力対応
- 広告非表示
- データ無制限保存
- 優先サポート
```

#### 学割プラン（Student）**
```
月額: ¥680（30%オフ）
年額: ¥4,800

条件: 学生証明書の提出
特典: Premiumと同じ
```

#### B2B プラン（Business）**
```
従業員1人あたり: ¥500/月
最小契約: 50人以上

特典:
- 管理者ダッシュボード
- 集計レポート
- カスタムブランディング
- 専任サポート
- API アクセス
```

### 収益予測（1年目）

#### 前提条件（保守的）
```
月間新規ユーザー: 1,000人
累計ユーザー（12ヶ月後）: 12,000人
アクティブ率: 40%（4,800人）
フリーミアム変換率: 3%（144人）
年額選択率: 50%
```

#### 月次収益（12ヶ月後）
```
プレミアム月額: 72人 × ¥980 = ¥70,560
プレミアム年額: 72人 × ¥6,800 ÷ 12 = ¥40,800
学割: 20人 × ¥680 = ¥13,600

月間収益合計: ¥124,960
年間収益: ¥1,499,520
```

#### コスト（月間）
```
Supabase: ¥2,500
Vercel: ¥2,000
OpenAI API: ¥30,000（約200人分）
Stripe手数料: ¥6,248（5%）
その他: ¥5,000

月間コスト: ¥45,748
月間利益: ¥79,212
年間利益: ¥950,544
```

### 成長シナリオ（楽観的）

#### 2年目目標
```
累計ユーザー: 50,000人
アクティブ率: 50%（25,000人）
フリーミアム変換率: 5%（1,250人）

月間収益: ¥1,084,375
年間収益: ¥13,012,500
年間利益: ¥7,800,000（コスト40%想定）
```

### 変換率向上施策

1. **14日間無料トライアル**: Premium機能を体験
2. **期間限定オファー**: 初月50%オフ
3. **友達紹介プログラム**: 紹介者・被紹介者に1ヶ月無料
4. **年末キャンペーン**: 年額プラン20%オフ
5. **達成マイルストーン**: 30日継続でPremium 1ヶ月プレゼント

### KPI（重要指標）

```
- DAU（デイリーアクティブユーザー）
- MAU（マンスリーアクティブユーザー）
- 継続率（Day 1, Day 7, Day 30）
- フリーミアム変換率
- ARPU（ユーザーあたり平均収益）
- LTV（顧客生涯価値）
- CAC（顧客獲得コスト）
- チャーン率（解約率）
```

---

## セットアップ手順

### 前提条件

```
Node.js: v20.x 以上
pnpm: v8.x 以上（推奨）
Git: 最新版
エディタ: VS Code（推奨）
```

### 1. 新規プロジェクト作成

```bash
# Next.jsプロジェクト作成
npx create-next-app@latest my-ai-diary-v2 \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd my-ai-diary-v2
```

### 2. 依存パッケージインストール

```bash
# Supabase
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs

# Stripe
pnpm add stripe @stripe/stripe-js

# OpenAI
pnpm add openai

# 状態管理・データフェッチ
pnpm add zustand @tanstack/react-query

# UI コンポーネント
pnpm add @radix-ui/react-dialog \
         @radix-ui/react-dropdown-menu \
         @radix-ui/react-toast \
         @radix-ui/react-tabs \
         @radix-ui/react-progress

# ユーティリティ
pnpm add clsx tailwind-merge date-fns zod

# 開発用
pnpm add -D @types/node prisma
```

### 3. Supabase プロジェクト作成

```bash
# Supabase CLI インストール
pnpm add -D supabase

# Supabase ログイン
npx supabase login

# プロジェクト初期化
npx supabase init

# ローカル開発環境起動
npx supabase start
```

**または Web UI で:**
1. https://supabase.com/dashboard
2. "New project" をクリック
3. プロジェクト名: my-ai-diary-v2
4. データベースパスワード設定
5. リージョン: Northeast Asia (Tokyo)

### 4. 環境変数設定

```bash
# .env.local ファイル作成
cp .env.example .env.local
```

**.env.local の内容:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. データベースセットアップ

```bash
# Prisma 初期化
npx prisma init

# スキーマをprisma/schema.prismaに記述後
npx prisma migrate dev --name init

# Supabase Studio でも確認可能
# http://localhost:54323
```

### 6. 既存UIコンポーネント移植

```bash
# 旧プロジェクトからコピー
cd ../my-ai-diary
cp -r src/components/ChatView.tsx ../my-ai-diary-v2/src/components/chat/
cp -r src/components/Message.tsx ../my-ai-diary-v2/src/components/chat/
cp -r src/components/MessageList.tsx ../my-ai-diary-v2/src/components/chat/
cp -r src/components/MessageInput.tsx ../my-ai-diary-v2/src/components/chat/
cp -r src/components/DiaryView.tsx ../my-ai-diary-v2/src/components/diary/
cp -r src/components/CalendarView.tsx ../my-ai-diary-v2/src/components/diary/
cp -r src/types/index.ts ../my-ai-diary-v2/src/types/
```

### 7. 開発サーバー起動

```bash
cd my-ai-diary-v2
pnpm dev
```

http://localhost:3000 にアクセス

### 8. Stripe セットアップ

```bash
# Stripe CLI インストール（macOS）
brew install stripe/stripe-cli/stripe

# ログイン
stripe login

# Webhook リスナー起動（開発時）
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Stripe Dashboard で:**
1. https://dashboard.stripe.com/
2. Products → Create product
   - Free: ¥0
   - Premium Monthly: ¥980
   - Premium Yearly: ¥6,800

### 9. デプロイ（Vercel）

```bash
# Vercel CLI インストール
pnpm add -g vercel

# デプロイ
vercel

# 環境変数設定（Vercel Dashboard）
# https://vercel.com/your-project/settings/environment-variables
```

---

## 開発ガイドライン

### コーディング規約

**TypeScript**
```typescript
// 型定義は明確に
interface User {
  id: string
  email: string
  displayName: string | null
}

// 関数は明示的な戻り値型
async function getUser(id: string): Promise<User | null> {
  // ...
}

// コンポーネントはFunctional Component
export default function ChatView({ messages }: ChatViewProps) {
  // ...
}
```

**命名規則**
```
- コンポーネント: PascalCase (ChatView.tsx)
- 関数: camelCase (getUserProfile)
- 定数: UPPER_SNAKE_CASE (MAX_MESSAGE_LENGTH)
- ファイル: kebab-case (use-auth.ts) またはPascalCase（コンポーネント）
```

**ディレクトリ構造**
```
- 機能ごとにディレクトリ分け
- 共通コンポーネントは components/ui/
- ページ固有コンポーネントは app/(group)/components/
```

### Git コミット規約

```bash
# Conventional Commits 形式

feat: 新機能追加
fix: バグ修正
docs: ドキュメント変更
style: コードフォーマット
refactor: リファクタリング
test: テスト追加
chore: ビルド設定等

# 例
feat: チャット機能の実装
fix: 日記生成時のエラー修正
docs: セットアップ手順の更新
```

### ブランチ戦略

```
main        本番環境（保護）
├── develop  開発環境
    ├── feature/chat-ui
    ├── feature/subscription
    └── fix/diary-generation
```

### テスト方針

```typescript
// 単体テスト: Vitest
import { describe, it, expect } from 'vitest'

describe('formatDate', () => {
  it('日付を正しくフォーマットする', () => {
    expect(formatDate('2025-01-01')).toBe('2025年1月1日')
  })
})

// E2Eテスト: Playwright（オプション）
import { test, expect } from '@playwright/test'

test('ログインできる', async ({ page }) => {
  await page.goto('http://localhost:3000/login')
  // ...
})
```

---

## トラブルシューティング

### よくある問題

**1. Supabase接続エラー**
```bash
# 環境変数を確認
echo $NEXT_PUBLIC_SUPABASE_URL

# Supabase Studio で確認
npx supabase status
```

**2. OpenAI APIエラー**
```bash
# APIキーの有効性確認
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**3. Stripe Webhook受信失敗**
```bash
# Stripe CLI起動確認
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Webhook署名確認
echo $STRIPE_WEBHOOK_SECRET
```

**4. ビルドエラー**
```bash
# キャッシュクリア
pnpm clean
rm -rf .next

# 再インストール
rm -rf node_modules
pnpm install
```

---

## 参考資料

### 公式ドキュメント
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives)

### テンプレート・ボイラープレート
- [Next.js + Supabase Starter](https://github.com/vercel/next.js/tree/canary/examples/with-supabase)
- [Next.js + Stripe Template](https://github.com/vercel/nextjs-subscription-payments)
- [Taxonomy (shadcn/ui)](https://github.com/shadcn/taxonomy)

### 学習リソース
- [Next.js Learn](https://nextjs.org/learn)
- [Supabase Tutorial](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Stripe Payment Links](https://stripe.com/docs/payment-links)

---

## 連絡先・サポート

### プロジェクト情報
- **旧プロジェクト**: https://github.com/Fumiyasu01/my-ai-diary
- **旧本番環境**: https://my-ai-diary-ten.vercel.app/
- **新プロジェクト**: （リポジトリ作成後に記載）

### 開発チーム
- **開発者**: Fumiyasu01
- **AI アシスタント**: Claude (Anthropic)

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-10-18 | 1.0.0 | 初版作成（新規開発計画書） |

---

## ライセンス

MIT License

---

**このドキュメントは新規開発の完全なガイドです。**
**Phase 1のMVP開発から始めましょう！**
