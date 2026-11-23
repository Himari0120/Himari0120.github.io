const API_URL =
  "https://otoku-navigation-api.keita19711020.workers.dev/api/admin/program/data";

export async function initializeProgram(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>プログラム管理</h2>
      <p class="notice">管理者認証済み。プログラム情報を取得しています。</p>
      <div id="program-data-status">読み込み中...</div>
    </section>
  `;

  const status = container.querySelector("#program-data-status");

  try {
    const { initializeAuth } = await import("./auth.js");
    const user = initializeAuth.getCurrentUser();

    if (!user) {
      throw new Error("ログインが確認できません");
    }

    const token = await user.getIdToken();

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error("プログラム情報の取得に失敗しました");
    }

    const items = result.configured
      ? [
          ["KV接続", "接続済み"],
          ["登録情報", "登録済み"],
          ["保存データ", JSON.stringify(result.data, null, 2)]
        ]
      : [
          ["KV接続", "接続済み"],
          ["登録情報", "未登録"],
          ["開発バージョン", "未登録"],
          ["公開バージョン", "未登録"],
          ["変更履歴", "未登録"],
          ["ファイル整合性", "未確認"],
          ["更新・改造権限", "開発者のみ"]
        ];

    status.innerHTML = `
      <div class="dashboard-grid">
        ${items.map(([name, value]) => `
          <article class="status-card">
            <h3>${name}</h3>
            <pre>${escapeHtml(String(value))}</pre>
          </article>
        `).join("")}
      </div>

      <div class="status-card">
        <h3>管理上のルール</h3>
        <ul>
          <li>購入者向けファイルを直接変更しない</li>
          <li>変更前に必ずバックアップを作成する</li>
          <li>更新前にテストとセキュリティ確認を行う</li>
          <li>コードの変更・改造・アップデートは開発者本人のみ実施する</li>
        </ul>
      </div>
    `;
  } catch (error) {
    status.textContent = "取得エラー：" + error.message;
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}