import { initializeDashboard } from "./dashboard.js";
import { initializeProgram } from "./program.js";
import { initializeZip } from "./zip.js";
import { initializeVersion } from "./version.js";
import { initializeTesting } from "./testing.js";
import { initializeRelease } from "./release.js";
import { initializeSecurity } from "./security.js";
import { initializeSalesMonitor } from "./sales-monitor.js";
import { initializeSettings } from "./settings.js";

const pages = {
  "#dashboard": ["ダッシュボード", initializeDashboard],
  "#program": ["プログラム管理", initializeProgram],
  "#zip": ["ZIP管理", initializeZip],
  "#version": ["バージョン管理", initializeVersion],
  "#testing": ["テスト管理", initializeTesting],
  "#release": ["リリース管理", initializeRelease],
  "#security": ["セキュリティ管理", initializeSecurity],
  "#sales": ["販売ページ監視", initializeSalesMonitor],
  "#settings": ["運営者設定", initializeSettings]
};

const dashboard = document.querySelector(".dashboard");

if (dashboard) {
  const content = document.createElement("div");
  content.id = "operator-content";
  dashboard.appendChild(content);

  function showPage(hash) {
    const page = pages[hash] || pages["#dashboard"];
    content.innerHTML = `<h2>${page[0]}</h2>`;
    page[1](content);
  }

  document.querySelectorAll(".dashboard nav a").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const hash = link.getAttribute("href");
      history.replaceState(null, "", hash);
      showPage(hash);
    });
  });

  showPage(location.hash || "#dashboard");
}