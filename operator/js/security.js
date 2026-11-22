export function initializeSecurity(container) {
  if (!container) return;

  const groups = [
    {
      title: "ファイル保護",
      items: [
        ["ファイル整合性", "未確認"],
        ["不正な変更の検知", "未確認"],
        ["重要ファイルの保護", "未設定"],
        ["SHA-256検証", "未実行"]
      ]
    },
    {
      title: "ZIP・データ検査",
      items: [
        ["機密情報・APIキー検査", "未実行"],
        ["トークン・パスワード検査", "未実行"],
        ["個人情報検査", "未実行"],
        ["購入者データ混入検査", "未実行"]
      ]
    },
    {
      title: "アクセス・認証保護",
      items: [
        ["運営者認証", "未接続"],
        ["アクセス権限", "未設定"],
        ["ログイン試行制限", "未設定"],
        ["二段階認証", "未設定"],
        ["セッション管理", "未設定"],
        ["HTTPS接続", "未確認"]
      ]
    },
    {
      title: "監視・記録",
      items: [
        ["セキュリティ警告", "未取得"],
        ["操作監査履歴", "未取得"],
        ["異常アクセス検知", "未設定"],
        ["バックアップ確認", "未確認"]
      ]
    }
  ];

  container.innerHTML = `
    <section class="management-section">
      <h2>セキュリティ管理</h2>

      <p class="notice">
        セキュリティ検査・認証サーバーは未接続です。
        未確認の項目を安全とは判定しません。
      </p>

      ${groups.map(group => `
        <div class="security-group">
          <h3>${group.title}</h3>
          <div class="dashboard-grid">
            ${group.items.map(([name, status]) => `
              <article class="status-card">
                <h3>${name}</h3>
                <p>${status}</p>
              </article>
            `).join("")}
          </div>
        </div>
      `).join("")}

      <div class="status-card">
        <h3>セキュリティ運用ルール</h3>
        <ul>
          <li>認証情報や秘密鍵をブラウザ側に保存しない</li>
          <li>機密情報をZIPに含めない</li>
          <li>検査結果と操作履歴を記録する</li>
          <li>異常を検知した場合は開発者へ通知する</li>
          <li>購入者のサイトやデータを監視対象にしない</li>
        </ul>
      </div>
    </section>
  `;
}
