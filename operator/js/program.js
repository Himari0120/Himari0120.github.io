
const API_URL =
  "https://otoku-navigation-api.keita19711020.workers.dev/api/admin/program/data";

const HISTORY_URL =
  "https://otoku-navigation-api.keita19711020.workers.dev/api/admin/program/history";

const MANAGEMENT_RULES = [
  "購入者向けファイルを直接変更しない",
  "変更前に必ずバックアップを作成する",
  "更新前にテストとセキュリティ確認を行う",
  "コードの変更・改造・アップデートは開発者本人のみ実施する"
];

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
        <input id="dev-version" type="text" maxlength="50" required>

        <label for="public-version">公開バージョン</label>
        <input id="public-version" type="text" maxlength="50" required>

        <label for="change-log">変更履歴（1行につき1項目）</label>
        <textarea id="change-log" rows="6" maxlength="3000"></textarea>

        <label for="integrity-status">ファイル整合性</label>
        <select id="integrity-status" required>
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
        <h3>更新履歴</h3>
        <p>最新100件の保存記録を表示します。</p>

        <button type="button" id="export-history-button">
          更新履歴をJSON保存
        </button>

        <div id="history-list">履歴を読み込み中...</div>
      </div>

      <div class="status-card">
        <h3>管理上のルール</h3>
        <ul>
          ${MANAGEMENT_RULES.map(rule =>
            `<li>${escapeHtml(rule)}</li>`
          ).join("")}
        </ul>
      </div>
    </section>
  `;

  const connection = container.querySelector("#program-connection");
  const form = container.querySelector("#program-form");
  const message = container.querySelector("#program-message");
  const saveButton = container.querySelector("#save-button");
  const reloadButton = container.querySelector("#reload-button");
  const historyList = container.querySelector("#history-list");
  const exportHistoryButton = container.querySelector(
    "#export-history-button"
  );

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
    await loadHistory();

  } catch (error) {
    connection.textContent = "接続エラー：" + error.message;
    historyList.textContent = "履歴を取得できませんでした。";
  }

  async function getToken() {
    if (!user) {
      throw new Error("ログインが確認できません");
    }

    return await user.getIdToken();
  }

  async function requestJSON(url, options = {}) {
    const token = await getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(result.error || "通信に失敗しました");
    }

    return result;
  }

  async function loadData() {
    connection.textContent = "KV接続確認中...";
    message.textContent = "";

    const result = await requestJSON(API_URL);

    connection.textContent = "KV接続：接続済み";

    if (result.configured && result.data) {
      devVersion.value = result.data.devVersion || "";
      publicVersion.value = result.data.publicVersion || "";

      changeLog.value = Array.isArray(result.data.changeLog)
        ? result.data.changeLog.join("\n")
        : "";

      integrityStatus.value =
        result.data.integrityStatus || "未確認";

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

  async function loadHistory() {
    historyList.textContent = "履歴を読み込み中...";

    try {
      const result = await requestJSON(HISTORY_URL);

      if (!Array.isArray(result.history) ||
          result.history.length === 0) {
        historyList.textContent = "更新履歴はまだありません。";
        return;
      }

      historyList.innerHTML = result.history.map((item, index) => {
        const logs = Array.isArray(item.changeLog)
          ? item.changeLog
          : [];

        return `
          <article class="status-card" style="margin-top:12px;">
            <h4>更新記録 ${index + 1}</h4>

            <p><strong>更新日時：</strong>
              ${escapeHtml(item.updatedAt || "不明")}
            </p>

            <p><strong>開発バージョン：</strong>
              ${escapeHtml(item.devVersion || "不明")}
            </p>

            <p><strong>公開バージョン：</strong>
              ${escapeHtml(item.publicVersion || "不明")}
            </p>

            <p><strong>ファイル整合性：</strong>
              ${escapeHtml(item.integrityStatus || "不明")}
            </p>

            <p><strong>更新者：</strong>
              ${escapeHtml(item.updatedBy || "不明")}
            </p>

            <p><strong>変更内容：</strong></p>

            ${
              logs.length
                ? `<ul>${logs.map(log =>
                    `<li>${escapeHtml(log)}</li>`
                  ).join("")}</ul>`
                : "<p>変更内容の記録なし</p>"
            }
          </article>
        `;
      }).join("");

    } catch (error) {
      historyList.textContent =
        "履歴取得エラー：" + error.message;
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (saveButton.disabled) return;

    const logs = changeLog.value
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);

    if (
      logs.length > 30 ||
      logs.some(item => item.length > 500)
    ) {
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
      const result = await requestJSON(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      message.textContent =
        "保存しました。更新日時：" + result.updatedAt;

      await loadData();
      await loadHistory();

    } catch (error) {
      message.textContent =
        "保存エラー：" + error.message;

    } finally {
      saveButton.disabled = false;
    }
  });

  reloadButton.addEventListener("click", async () => {
    reloadButton.disabled = true;

    try {
      await loadData();
      await loadHistory();

    } catch (error) {
      message.textContent =
        "再読み込みエラー：" + error.message;

    } finally {
      reloadButton.disabled = false;
    }
  });

  exportHistoryButton.addEventListener("click", async () => {
    exportHistoryButton.disabled = true;
    message.textContent = "JSONバックアップを作成中...";

    try {
      const result = await requestJSON(HISTORY_URL);

      if (!Array.isArray(result.history)) {
        throw new Error("履歴データが正しくありません");
      }

      const backup = {
        exportedAt: new Date().toISOString(),
        count: result.history.length,
        history: result.history
      };

      const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json;charset=utf-8" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        `program-history-${new Date().toISOString().slice(0, 10)}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      message.textContent =
        `更新履歴 ${result.history.length} 件のJSONバックアップを作成しました。`;

    } catch (error) {
      message.textContent =
        "JSON保存エラー：" + error.message;

    } finally {
      exportHistoryButton.disabled = false;
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}
