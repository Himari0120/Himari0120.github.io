export function initializeTesting(container) {
  if (!container) return;

  const tests = [
    ["ログイン・認証", "未実行"],
    ["商品管理", "未実行"],
    ["検索・カテゴリー", "未実行"],
    ["画像表示", "未実行"],
    ["バックアップ・復元", "未実行"],
    ["ZIP作成・展開", "未実行"],
    ["アップデート", "未実行"],
    ["PC・スマホ表示", "未実行"],
    ["セキュリティ", "未実行"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>テスト管理</h2>
      <div class="dashboard-grid">
        ${tests.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>
      <p class="notice">
        テストはまだ実行されていません。未実行の項目を合格扱いにはしません。
      </p>
    </section>
  `;
}