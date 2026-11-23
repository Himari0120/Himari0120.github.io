

const API_URL =
  "https://otoku-navigation-api.keita19711020.workers.dev/api/admin/program/data";

export async function initializeProgram(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="management-section">
      <h2>プログラム管理</h2>
      <p class="notice">管理者専用のプログラム情報管理画面です。</p>

      <div id="program-connection" class="status-card">
        接続確認中...
      </div>

      <form id="program-form" class="status-card">
        <h3>プログラム情報</h3>

        <label for="dev-version">開発バージョン</label>
        <input id="dev-version" name="devVersion"
          type="text" maxlength="50" required>

        <label for="public-version">公開バージョン</label>
        <input id="public-version" name="publicVersion"
          type="text" maxlength="50" required>

        <label for="change-log">変更履歴（1行につき1項目）</label>
        <textarea id="change-log" name="changeLog"
          rows="6" maxlength="3000"></textarea>

        <label for="integrity-status">ファイル整合性</label>
        <select id="integrity-status" name="integrityStatus" required>
          <option value="未確認">未確認</option>
          <option value="確認済み">確認済み</option>
          <option value="要確認">要確認</option>
        </select>

        <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
          <button type="submit" id="save-button">保存する</button>
          <button type="button" id="reload-button">再読み込み</button>
        </div>

        <p id="program-message" role="status" aria-live="polite"></p>
      </form>

      <div class="status-card">
        <h3>管理上のルール</h3>
        <ul>
          <li>購入者向けファイルを直接変更しない</li>
          <li>変更前に必ずバックアップを作成する</li>
          <li>更新前にテストとセキュリティ確認を行う</li>
          <li>コードの変更・改造・アップデートは開発者本人のみ実施する</li>
        </ul>
      </div>
    </section>
  `;

  const form = container.querySelector("#program-form");
  const connection = container.querySelector("#program-connection");
  const message = container.querySelector("#program-message");
  const saveButton = container.querySelector("#save-button");
  const reloadButton = container.querySelector("#reload-button");

  const devVersion = container.querySelector("#dev-version");
  const publicVersion = container.querySelector("#public-version");
  const changeLog = container.querySelector("#change-log");
  const integrityStatus = container.querySelector("#integrity-status");

  let user;

  try {
    const { initializeAuth } = await import("./auth.js");
    user = initializeAuth.getCurrentUser();

    if (!user) {
      throw new Error("ログインが確認できません");
    }

    await loadData();
  } catch (error) {
    connection.textContent = "接続エラー：" + error.message;
  }

  async function getToken() {
    if (!user) {
      throw new Error("ログインが確認できません");
    }

    return await user.getIdToken();
  }

  async function loadData() {
    connection.textContent = "KV接続確認中...";
    message.textContent = "";

    const token = await getToken();

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error("プログラム情報を取得できませんでした");
    }

    connection.textContent = "KV接続：接続済み";

    if (result.configured && result.data) {
      devVersion.value = result.data.devVersion || "";
      publicVersion.value = result.data.publicVersion || "";
      changeLog.value = Array.isArray(result.data.changeLog)
        ? result.data.changeLog.join("\n")
        : "";
      integrityStatus.value = result.data.integrityStatus || "未確認";

      message.textContent =
        "登録情報を読み込みました。最終更新：" +
        (result.data.updatedAt || "不明");
    } else {
      devVersion.value = "";
      publicVersion.value = "";
      changeLog.value = "";
      integrityStatus.value = "未確認";
      message.textContent = "まだ登録情報はありません。";
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (saveButton.disabled) return;

    const logs = changeLog.value
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);

    if (logs.length > 30 || logs.some(item => item.length > 500)) {
      message.textContent =
        "変更履歴は30項目以内、1項目500文字以内にしてください。";
      return;
    }

    const data = {
      devVersion: devVersion.value.trim(),
      publicVersion: publicVersion.value.trim(),
      changeLog: logs,
      integrityStatus: integrityStatus.value
    };

    if (!data.devVersion || !data.publicVersion) {
      message.textContent = "バージョンを入力してください。";
      return;
    }

    saveButton.disabled = true;
    message.textContent = "保存中...";

    try {
      const token = await getToken();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok || result.success !== true || result.saved !== true) {
        throw new Error("保存に失敗しました。");
      }

      message.textContent =
        "保存しました。最終更新：" + result.updatedAt;

      await loadData();

    } catch (error) {
      message.textContent = "保存エラー：" + error.message;
    } finally {
      saveButton.disabled = false;
    }
  });

  reloadButton.addEventListener("click", async () => {
    reloadButton.disabled = true;

    try {
      await loadData();
    } catch (error) {
      message.textContent = "再読み込みエラー：" + error.message;
    } finally {
      reloadButton.disabled = false;
    }
  });
}
