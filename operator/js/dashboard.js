export function initializeDashboard(container) {
  if (!container) return;

  const items = [
    ["公開バージョン", "未取得"],
    ["開発バージョン", "未登録"],
    ["ZIP生成状況", "未実行"],
    ["テスト状況", "未実行"],
    ["セキュリティ", "未確認"],
    ["販売ページ監視", "未接続"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>運営ダッシュボード</h2>
      <div class="dashboard-grid">
        ${items.map(([title, status]) => `
          <article class="status-card">
            <h3>${title}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>
      <p class="notice">
        各項目は管理サーバー接続後に情報を取得します。
      </p>
    </section>
  `;
}