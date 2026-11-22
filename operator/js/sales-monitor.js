export function initializeSalesMonitor(container) {
  if (!container) return;

  const items = [
    ["監視対象URL", "未登録"],
    ["ページ稼働状況", "未確認"],
    ["リンク切れ確認", "未実行"],
    ["ページ内容の変更検知", "未設定"],
    ["SSL証明書確認", "未確認"],
    ["異常発生時の通知", "未設定"],
    ["監視履歴", "未取得"],
    ["最終確認日時", "未取得"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>販売ページ監視</h2>

      <p class="notice">
        監視サーバーは未接続です。現在、ページの稼働確認やリンク検査は実行されていません。
      </p>

      <div class="dashboard-grid">
        ${items.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>

      <div class="status-card">
        <h3>監視対象のルール</h3>
        <ul>
          <li>開発者本人が管理する販売ページのみを対象にする</li>
          <li>購入者のサイトや個人ページは監視しない</li>
          <li>ページ停止・リンク切れ・予期しない変更を記録する</li>
          <li>異常を検知した場合は開発者へ通知する</li>
          <li>監視結果と確認日時を履歴として保存する</li>
        </ul>
      </div>
    </section>
  `;
}
