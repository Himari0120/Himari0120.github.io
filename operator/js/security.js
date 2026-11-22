export function initializeSecurity(container) {
  if (!container) return;

  const checks = [
    ["ファイル整合性", "未確認"],
    ["不正な変更の検知", "未確認"],
    ["ZIP内の機密情報検査", "未実行"],
    ["認証設定", "未接続"],
    ["アクセス制御", "未設定"],
    ["セキュリティ警告", "未取得"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>セキュリティ管理</h2>
      <div class="dashboard-grid">
        ${checks.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>
      <p class="notice">
        セキュリティ検査はサーバー接続後に実行します。未確認の項目を安全とは判定しません。
      </p>
    </section>
  `;
}