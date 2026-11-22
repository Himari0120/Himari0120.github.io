export function initializeVersion(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>バージョン・更新管理</h2>

      <div class="status-card">
        <h3>現在の公開バージョン</h3>
        <p>未取得</p>
      </div>

      <div class="status-card">
        <h3>次期バージョン</h3>
        <p>未登録</p>
      </div>

      <div class="status-card">
        <h3>更新履歴</h3>
        <p>未取得</p>
      </div>

      <div class="status-card">
        <h3>ロールバック</h3>
        <p>未設定</p>
      </div>

      <p class="notice">
        更新データの作成・配布はサーバー接続後に有効化します。
      </p>
    </section>
  `;
}