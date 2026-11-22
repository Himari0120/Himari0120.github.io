export function initializeSalesMonitor(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>販売ページ監視</h2>

      <div class="status-card">
        <h3>監視対象ページ</h3>
        <p>未登録</p>
      </div>

      <div class="status-card">
        <h3>ページ稼働状況</h3>
        <p>未確認</p>
      </div>

      <div class="status-card">
        <h3>リンク確認</h3>
        <p>未実行</p>
      </div>

      <div class="status-card">
        <h3>ページ変更検知</h3>
        <p>未設定</p>
      </div>

      <p class="notice">
        監視機能は監視対象URLとサーバー接続を設定した後に有効化します。
        購入者のサイトは監視対象にしません。
      </p>
    </section>
  `;
}