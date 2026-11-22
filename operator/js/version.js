export function initializeVersion(container) {
  if (!container) return;

  const versions = [
    ["現在の公開バージョン", "未取得"],
    ["現在の開発バージョン", "未登録"],
    ["次期リリースバージョン", "未登録"],
    ["バージョン形式", "未設定（Major.Minor.Patch）"]
  ];

  const updateItems = [
    ["更新履歴", "未取得"],
    ["変更内容", "未登録"],
    ["アップデート対象", "未設定"],
    ["更新パッケージ", "未生成"],
    ["更新テスト", "未実行"],
    ["ロールバック用データ", "未設定"]
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>バージョン・更新管理</h2>

      <p class="notice">
        バージョン情報と更新機能は管理サーバー未接続のため、現在は取得・実行できません。
      </p>

      <h3>バージョン情報</h3>
      <div class="dashboard-grid">
        ${versions.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>

      <h3>更新管理</h3>
      <div class="dashboard-grid">
        ${updateItems.map(([name, status]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <p>${status}</p>
          </article>
        `).join("")}
      </div>

      <div class="status-card">
        <h3>更新時の保護ルール</h3>
        <ul>
          <li>バージョン番号は Major.Minor.Patch 形式で管理する</li>
          <li>更新前に完全なバックアップを作成する</li>
          <li>更新内容と対象ファイルを記録する</li>
          <li>購入者の登録情報・保存データを保持する</li>
          <li>更新失敗時に復元できる状態を確保する</li>
          <li>テスト合格後にのみ公開候補とする</li>
        </ul>
      </div>
    </section>
  `;
}
