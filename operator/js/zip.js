export function initializeZip(container) {
  if (!container) return;

  const packages = [
    ["完全版ZIP", "未生成"],
    ["アップデートZIP", "未生成"],
    ["バックアップZIP", "未生成"]
  ];

  const checks = [
    ["必須ファイル", "未確認"],
    ["不要ファイル・禁止ファイル", "未確認"],
    ["機密情報・トークン", "未検査"],
    ["個人情報・購入者データ", "未検査"],
    ["ファイル数・容量", "未計測"],
    ["SHA-256整合性", "未確認"],
    ["ZIP展開テスト", "未実行"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>ZIP生成管理</h2>

      <p class="notice">
        ZIP生成・検査機能はサーバー未接続のため、現在は実行できません。
        この画面の表示は実際の生成・検査結果ではありません。
      </p>

      <h3>パッケージ管理</h3>
      <div class="dashboard-grid">
        ${packages.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>

      <h3>生成前・生成後の検査項目</h3>
      <div class="dashboard-grid">
        ${checks.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>

      <div class="status-card">
        <h3>配布制御ルール</h3>
        <ul>
          <li>必須検査がすべて完了するまで配布しない</li>
          <li>機密情報・トークン・購入者データを含めない</li>
          <li>ZIP展開テストに失敗した場合は配布しない</li>
          <li>検査結果と生成履歴を記録する</li>
          <li>バックアップを確認してから更新する</li>
        </ul>
      </div>
    </section>
  `;
}
