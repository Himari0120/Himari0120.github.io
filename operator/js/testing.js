export function initializeTesting(container) {
  if (!container) return;

  const groups = [
    {
      title: "基本機能テスト",
      tests: [
        "ログイン・認証",
        "商品登録・編集・削除",
        "商品検索",
        "カテゴリー表示",
        "画像表示・読み込み"
      ]
    },
    {
      title: "データ・バックアップテスト",
      tests: [
        "Firebase接続",
        "データ保存・読み込み",
        "バックアップ作成",
        "バックアップ復元",
        "データ移行"
      ]
    },
    {
      title: "ZIP・アップデートテスト",
      tests: [
        "完全版ZIP作成",
        "アップデートZIP作成",
        "ZIP展開",
        "ファイル整合性",
        "アップデート適用",
        "アップデート失敗時の復旧"
      ]
    },
    {
      title: "表示・セキュリティテスト",
      tests: [
        "PC表示",
        "スマホ表示",
        "タブレット表示",
        "アクセス制御",
        "機密情報検査",
        "不正変更検知"
      ]
    }
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>テスト管理</h2>

      <p class="notice">
        テスト実行サーバーは未接続です。すべての項目は未実行であり、
        合格・不合格の判定はまだありません。
      </p>

      ${groups.map(group => `
        <div class="test-group">
          <h3>${group.title}</h3>
          <div class="dashboard-grid">
            ${group.tests.map(name => `
              <article class="status-card">
                <h3>${name}</h3>
                <p>未実行</p>
              </article>
            `).join("")}
          </div>
        </div>
      `).join("")}

      <div class="status-card">
        <h3>テスト判定ルール</h3>
        <ul>
          <li>未実行の項目を合格扱いにしない</li>
          <li>不合格項目は原因を記録する</li>
          <li>修正後に再テストを行う</li>
          <li>必須テストが完了するまでリリースしない</li>
        </ul>
      </div>
    </section>
  `;
}
