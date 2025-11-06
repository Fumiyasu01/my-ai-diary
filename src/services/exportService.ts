import { ConversationData, DiaryEntry } from '../types';

/**
 * Export Service
 * Handles exporting diary entries in various formats (Markdown, HTML, PDF)
 */

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
};

// Helper function to format timestamp
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Export all diaries as Markdown format
 */
export const exportDiariesAsMarkdown = (conversations: ConversationData[]): string => {
  const diaryConversations = conversations.filter(conv => conv.diary);

  if (diaryConversations.length === 0) {
    return '# My AI Diary\n\n日記がまだありません。';
  }

  let markdown = '# My AI Diary\n\n';
  markdown += `エクスポート日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
  markdown += `---\n\n`;

  diaryConversations.forEach(conv => {
    const { diary, date, conversations: messages, title } = conv;
    if (!diary) return;

    markdown += `## ${formatDate(date)}\n\n`;

    if (title) {
      markdown += `**タイトル:** ${title}\n\n`;
    }

    // Diary summary
    markdown += `### 📝 今日の日記\n\n`;
    markdown += `${diary.summary}\n\n`;

    // Content (if exists)
    if (diary.content) {
      markdown += `${diary.content}\n\n`;
    }

    // Emotions
    if (diary.emotion && diary.emotion.length > 0) {
      markdown += `### 😊 今日の感情\n\n`;
      diary.emotion.forEach(emotion => {
        markdown += `- ${emotion}\n`;
      });
      markdown += `\n`;
    }

    // Keywords
    if (diary.keywords && diary.keywords.length > 0) {
      markdown += `### 🏷️ キーワード\n\n`;
      markdown += diary.keywords.map(kw => `\`${kw}\``).join(', ');
      markdown += `\n\n`;
    }

    // Conversation log
    if (messages && messages.length > 0) {
      markdown += `### 💬 会話ログ\n\n`;
      messages.forEach(msg => {
        const time = formatTime(msg.timestamp);
        const role = msg.role === 'user' ? '私' : 'AIアシスタント';
        markdown += `**${role}** (${time})  \n`;
        markdown += `${msg.content}\n\n`;
      });
    }

    markdown += `---\n\n`;
  });

  return markdown;
};

/**
 * Export all diaries as HTML format
 */
export const exportDiariesAsHTML = (conversations: ConversationData[], agentName: string = 'AIアシスタント'): string => {
  const diaryConversations = conversations.filter(conv => conv.diary);

  if (diaryConversations.length === 0) {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My AI Diary</title>
  <style>
    body { font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 3px solid #4F46E5; padding-bottom: 10px; }
  </style>
</head>
<body>
  <h1>My AI Diary</h1>
  <p>日記がまだありません。</p>
</body>
</html>`;
  }

  let html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My AI Diary - エクスポート</title>
  <style>
    body {
      font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #4F46E5;
      border-bottom: 4px solid #4F46E5;
      padding-bottom: 16px;
      margin-bottom: 30px;
      font-size: 2.5em;
    }
    .export-info {
      background: #F3F4F6;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 40px;
      color: #6B7280;
      font-size: 0.9em;
    }
    .diary-entry {
      margin-bottom: 60px;
      padding-bottom: 40px;
      border-bottom: 2px solid #E5E7EB;
    }
    .diary-entry:last-child {
      border-bottom: none;
    }
    .diary-date {
      color: #4F46E5;
      font-size: 1.8em;
      font-weight: bold;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .diary-title {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 1.3em;
      font-weight: bold;
      color: #374151;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-content {
      background: #F9FAFB;
      padding: 16px 20px;
      border-radius: 8px;
      border-left: 4px solid #4F46E5;
      line-height: 1.8;
    }
    .emotions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .emotion-tag {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.9em;
      color: #92400E;
      font-weight: 500;
    }
    .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .keyword-tag {
      background: #E0E7FF;
      color: #4338CA;
      padding: 5px 14px;
      border-radius: 16px;
      font-size: 0.85em;
      font-weight: 500;
    }
    .conversation {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 16px;
    }
    .message {
      margin-bottom: 16px;
      padding: 12px;
      border-radius: 8px;
    }
    .message:last-child {
      margin-bottom: 0;
    }
    .message-user {
      background: #EEF2FF;
      border-left: 4px solid #4F46E5;
    }
    .message-assistant {
      background: #F0FDF4;
      border-left: 4px solid #10B981;
    }
    .message-header {
      font-weight: bold;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .message-role {
      color: #4F46E5;
    }
    .message-assistant .message-role {
      color: #10B981;
    }
    .message-time {
      font-size: 0.8em;
      color: #9CA3AF;
      font-weight: normal;
    }
    .message-content {
      color: #374151;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📔 My AI Diary</h1>
    <div class="export-info">
      エクスポート日時: ${new Date().toLocaleString('ja-JP')} | 日記数: ${diaryConversations.length}件
    </div>
`;

  diaryConversations.forEach(conv => {
    const { diary, date, conversations: messages, title } = conv;
    if (!diary) return;

    html += `
    <div class="diary-entry">
      <div class="diary-date">
        📅 ${formatDate(date)}
      </div>
`;

    if (title) {
      html += `
      <div class="diary-title">
        ${escapeHtml(title)}
      </div>
`;
    }

    // Diary summary
    html += `
      <div class="section">
        <div class="section-title">📝 今日の日記</div>
        <div class="section-content">
          ${escapeHtml(diary.summary).replace(/\n/g, '<br>')}
        </div>
      </div>
`;

    // Content (if exists)
    if (diary.content) {
      html += `
      <div class="section">
        <div class="section-content">
          ${escapeHtml(diary.content).replace(/\n/g, '<br>')}
        </div>
      </div>
`;
    }

    // Emotions
    if (diary.emotion && diary.emotion.length > 0) {
      html += `
      <div class="section">
        <div class="section-title">😊 今日の感情</div>
        <div class="emotions">
          ${diary.emotion.map(emotion => `<span class="emotion-tag">${escapeHtml(emotion)}</span>`).join('\n          ')}
        </div>
      </div>
`;
    }

    // Keywords
    if (diary.keywords && diary.keywords.length > 0) {
      html += `
      <div class="section">
        <div class="section-title">🏷️ キーワード</div>
        <div class="keywords">
          ${diary.keywords.map(kw => `<span class="keyword-tag">${escapeHtml(kw)}</span>`).join('\n          ')}
        </div>
      </div>
`;
    }

    // Conversation log
    if (messages && messages.length > 0) {
      html += `
      <div class="section">
        <div class="section-title">💬 会話ログ</div>
        <div class="conversation">
`;
      messages.forEach(msg => {
        const time = formatTime(msg.timestamp);
        const role = msg.role === 'user' ? '私' : agentName;
        const messageClass = msg.role === 'user' ? 'message-user' : 'message-assistant';
        html += `
          <div class="message ${messageClass}">
            <div class="message-header">
              <span class="message-role">${escapeHtml(role)}</span>
              <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.content)}</div>
          </div>
`;
      });
      html += `
        </div>
      </div>
`;
    }

    html += `
    </div>
`;
  });

  html += `
  </div>
</body>
</html>`;

  return html;
};

/**
 * Generate PDF-ready HTML (for browser's print-to-PDF functionality)
 */
export const generatePDFReadyHTML = (conversations: ConversationData[], agentName: string = 'AIアシスタント'): string => {
  // Use the same HTML export but with print-optimized styles
  const html = exportDiariesAsHTML(conversations, agentName);

  // Add print instructions at the top
  const printInstructions = `
  <div class="print-instructions" style="background: #FEF3C7; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
    <strong>📄 PDF保存方法:</strong>
    <ol style="margin: 8px 0 0 20px; line-height: 1.8;">
      <li>ブラウザの印刷機能を開く（Ctrl+P / Cmd+P）</li>
      <li>「送信先」または「プリンター」で「PDFに保存」を選択</li>
      <li>「保存」ボタンをクリック</li>
    </ol>
    <p style="margin: 8px 0 0 0; font-size: 0.9em; color: #92400E;">
      💡 このメッセージは印刷時には表示されません
    </p>
  </div>
  <style>
    @media print {
      .print-instructions { display: none !important; }
    }
  </style>
`;

  return html.replace('<div class="export-info">', printInstructions + '<div class="export-info">');
};

/**
 * Helper function to escape HTML special characters
 */
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Download file helper
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Open HTML in new window (for PDF export via browser print)
 */
export const openHTMLInNewWindow = (html: string): void => {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  }
};
