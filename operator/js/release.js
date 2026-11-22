export function initializeRelease(container) {
  if (!container) return;

  const items = [
    ["リリース候補", "未登録"],
    ["対象バージョン", "未設定"],
    ["対象エディション", "未設定"],
    ["リリースノート", "未登録"],
    ["ZIP検査", "未確認"],
    ["必須テスト", "未確認"],
    ["セキュリティ承認", "未確認"],
    ["公開状態", "未公開"],
    ["配布停止", "未設定"],
    ["ロールバック", "未設定"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>リリース管理</h2>

      <p class="notice">
        リリース実行サーバーは未接続です。
        この画面では公開・配布・停止操作は実行できません。
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
        <h3>公開前の必須条件</h3>
        <ul>
          <li>対象バージョンとエディションを確認する</li>
          <li>リリースノートを登録する</li>
          <li>ZIP生成・ファイル検査に合格する</li>
          <li>必須テストがすべて合格している</li>
          <li>セキュリティ検査と承認が完了している</li>
          <li>バックアップと復旧手段を確保する</li>
        </ul>
      </div>

      <div class="status-card">
        <h3>公開後の管理ルール</h3>
        <ul>
          <li>公開日時と変更内容を記録する</li>
          <li>問題発生時は新規配布を停止できるようにする</li>
          <li>必要に応じて正常なバージョンへ戻す</li>
          <li>購入者の既存データを保護する</li>
        </ul>
      </div>
    </section>
  `;
}
