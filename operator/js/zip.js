export function initializeZip(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>ZIP生成管理</h2>

      <div class="status-card">
        <h3>完全版ZIP</h3>
        <p>未生成</p>
      </div>

      <div class="status-card">
        <h3>アップデートZIP</h3>
        <p>未生成</p>
      </div>

      <div class="status-card">
        <h3>バックアップZIP</h3>
        <p>未生成</p>
      </div>

      <div class="status-card">
        <h3>ファイル検査</h3>
        <p>未実行</p>
      </div>

      <p class="notice">
        ZIP生成・検査機能はサーバー接続後に有効化します。
      </p>
    </section>
  `;
}