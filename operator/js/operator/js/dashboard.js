
/* おトク発見ナビ 運営者コンソール
   dashboard.js
*/

export function initializeDashboard(container) {
  const section = document.createElement("section");
  section.className = "dashboard";

  const heading = document.createElement("h2");
  heading.textContent = "システム稼働状況";

  const description = document.createElement("p");
  description.textContent =
    "運営者向けのシステム状況を確認できます。";

  section.append(heading, description);

  const cards = [
    {
      title: "公開バージョン",
      value: "未取得",
      detail: "公開環境との接続待ち"
    },
    {
      title: "開発バージョン",
      value: "未設定",
      detail: "開発環境との接続待ち"
    },
    {
      title: "ZIP生成状況",
      value: "未実行",
      detail: "生成機能は未接続"
    },
    {
      title: "テスト状況",
      value: "未実行",
      detail: "テスト機能は未接続"
    },
    {
      title: "セキュリティ",
      value: "未確認",
      detail: "検査機能は未接続"
    },
    {
      title: "販売ページ監視",
      value: "未接続",
      detail: "監視機能は未接続"
    }
  ];

  const grid = document.createElement("div");
  grid.className = "dashboard-grid";

  cards.forEach(item => {
    const card = document.createElement("article");
    card.className = "dashboard-card";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const value = document.createElement("p");
    value.className = "dashboard-value";
    value.textContent = item.value;

    const detail = document.createElement("p");
    detail.className = "dashboard-detail";
    detail.textContent = item.detail;

    card.append(title, value, detail);
    grid.appendChild(card);
  });

  const notice = document.createElement("div");
  notice.className = "dashboard-notice";

  const noticeTitle = document.createElement("strong");
  noticeTitle.textContent = "接続状態について";

  const noticeText = document.createElement("p");
  noticeText.textContent =
    "現在は画面の基本構成のみです。サーバーや各管理機能が接続されるまでは、状態を未確認・未実行として表示します。";

  notice.append(noticeTitle, noticeText);

  section.append(grid, notice);
  container.appendChild(section);
}
