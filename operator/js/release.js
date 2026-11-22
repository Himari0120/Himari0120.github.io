export function initializeRelease(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>リリース管理</h2>

      <div class="status-card">
        <h3>リリース候補</h3>
        <p>未登録</p>
      </div>

      <div class="status-card">
        <h3>テスト承認</h3>
        <p>未確認</p>
      </div>

      <div class="status-card">
        <h3>公開状態</h3>
        <p>未公開</p>
      </div>

      <div class="status-card">
        <h3>配布停止・ロールバック</h3>
        <p>未設定</p>
      </div>

      <p class="notice">
        必須テストとセキュリティ確認が完了するまで、リリースは実行できません。
      </p>
    </section>
  `;
}