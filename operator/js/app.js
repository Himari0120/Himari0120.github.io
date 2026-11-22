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

const content = document.querySelector("#operator-content");
const navLinks = document.querySelectorAll(".dashboard nav a");

function showPage(hash) {
  if (!content) return;

  const page = pages[hash] || pages["#dashboard"];

  content.innerHTML = `
    <div class="page-heading">
      <h2>${page[0]}</h2>
      <a href="#dashboard" class="back-link">ダッシュボードへ戻る</a>
    </div>
  `;

  page[1](content);

  navLinks.forEach(link => {
    const active = link.getAttribute("href") === hash;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const hash = link.getAttribute("href");
    history.replaceState(null, "", hash);
    showPage(hash);
  });
});

window.addEventListener("hashchange", () => {
  showPage(location.hash || "#dashboard");
});

showPage(location.hash || "#dashboard");
