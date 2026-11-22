export function initializeProgram(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>プログラム管理</h2>

      <div class="status-card">
        <h3>ソースコード管理</h3>
        <p>未接続</p>
      </div>

      <div class="status-card">
        <h3>開発バージョン</h3>
        <p>未登録</p>
      </div>

      <div class="status-card">
        <h3>公開バージョン</h3>
        <p>未取得</p>
      </div>

      <div class="status-card">
        <h3>変更履歴</h3>
        <p>未取得</p>
      </div>

      <p class="notice">
        ソースコードの編集機能は、安全なサーバー接続後に有効化します。
      </p>
    </section>
  `;
}