export function initializeProgram(container) {
  if (!container) return;

  const items = [
    ["ソースコード接続", "未接続"],
    ["開発バージョン", "未登録"],
    ["公開バージョン", "未取得"],
    ["変更履歴", "未取得"],
    ["ファイル整合性", "未確認"],
    ["更新・改造権限", "開発者のみ"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>プログラム管理</h2>

      <p class="notice">
        この画面は運営者専用の管理画面です。
        ソースコードの編集・更新機能は、認証サーバー接続後に有効化します。
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
        <h3>管理上のルール</h3>
        <ul>
          <li>購入者向けファイルを直接変更しない</li>
          <li>変更前に必ずバックアップを作成する</li>
          <li>更新前にテストとセキュリティ確認を行う</li>
          <li>コードの変更・改造・アップデートは開発者本人のみ実施する</li>
        </ul>
      </div>
    </section>
  `;
}
