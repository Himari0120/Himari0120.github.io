export function initializeSettings(container) {
  if (!container) return;

  const groups = [
    {
      title: "アカウント管理",
      items: [
        ["運営者アカウント", "未設定"],
        ["アカウント権限", "未設定"],
        ["パスワード再設定", "未設定"],
        ["復旧コード", "未設定"]
      ]
    },
    {
      title: "ログイン・認証設定",
      items: [
        ["二段階認証", "未設定"],
        ["セッション有効期限", "未設定"],
        ["ログイン試行制限", "未設定"],
        ["不正ログイン検知", "未設定"]
      ]
    },
    {
      title: "通知・操作管理",
      items: [
        ["セキュリティ通知", "未設定"],
        ["リリース通知", "未設定"],
        ["操作履歴", "未取得"],
        ["ログ保存期間", "未設定"]
      ]
    },
    {
      title: "接続・システム設定",
      items: [
        ["HTTPS接続", "未確認"],
        ["認証サーバー", "未接続"],
        ["管理API", "未接続"],
        ["バックアップ接続", "未接続"]
      ]
    }
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>運営者設定</h2>

      <p class="notice">
        認証・設定サーバーは未接続です。
        この画面ではアカウント情報や認証設定の変更は実行できません。
      </p>

      ${groups.map(group => `
        <div class="settings-group">
          <h3>${group.title}</h3>
          <div class="dashboard-grid">
            ${group.items.map(([name, status]) => `
              <article class="status-card">
                <h3>${name}</h3>
                <p>${status}</p>
              </article>
            `).join("")}
          </div>
        </div>
      `).join("")}

      <div class="status-card">
        <h3>安全管理ルール</h3>
        <ul>
          <li>パスワードや秘密情報をブラウザ側に保存しない</li>
          <li>二段階認証を導入する</li>
          <li>一定時間操作がなければセッションを終了する</li>
          <li>ログイン失敗回数を制限する</li>
          <li>復旧コードは安全な方法で保管する</li>
          <li>重要な操作を監査履歴に記録する</li>
        </ul>
      </div>
    </section>
  `;
}
