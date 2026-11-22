
/* =====================================
   おトク発見ナビ 運営者コンソール
   app.js
===================================== */

import { initializeAuth } from "./auth.js";
import { initializeDashboard } from "./dashboard.js";
import { initializeProgram } from "./program.js";
import { initializeZip } from "./zip.js";
import { initializeVersion } from "./version.js";
import { initializeTesting } from "./testing.js";
import { initializeRelease } from "./release.js";
import { initializeSecurity } from "./security.js";
import { initializeSalesMonitor } from "./sales-monitor.js";

const pageTitles = {
  dashboard: "ダッシュボード",
  program: "プログラム管理",
  zip: "ZIP生成管理",
  version: "バージョン・更新管理",
  testing: "テスト管理",
  release: "リリース管理",
  security: "セキュリティ管理",
  sales: "販売ページ監視",
  settings: "運営者設定"
};

const pageInitializers = {
  dashboard: initializeDashboard,
  program: initializeProgram,
  zip: initializeZip,
  version: initializeVersion,
  testing: initializeTesting,
  release: initializeRelease,
  security: initializeSecurity,
  sales: initializeSalesMonitor
};

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const pageTitle = document.getElementById("pageTitle");
const pageContent = document.getElementById("pageContent");
const pageStatus = document.getElementById("pageStatus");
const connectionStatus = document.getElementById("connectionStatus");
const logoutButton = document.getElementById("logoutButton");
const navigation = document.getElementById("operatorNavigation");

let authenticated = false;
let currentPage = "dashboard";

function showPage(page) {
  if (!authenticated) return;
  if (!pageTitles[page]) return;

  currentPage = page;
  pageTitle.textContent = pageTitles[page];

  document.querySelectorAll(".menu-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  pageContent.replaceChildren();

  if (page === "settings") {
    pageContent.textContent =
      "運営者設定は認証システム接続後に利用できます。";
    return;
  }

  const initializer = pageInitializers[page];

  if (typeof initializer === "function") {
    initializer(pageContent);
  } else {
    pageContent.textContent =
      "この管理機能は準備中です。";
  }
}

function setAuthenticated() {
  authenticated = true;

  loginSection.hidden = true;
  dashboardSection.hidden = false;

  connectionStatus.textContent = "認証済み";
  pageStatus.textContent = "認証済み";
  logoutButton.disabled = false;

  showPage("dashboard");
}

function setUnauthenticated() {
  authenticated = false;

  loginSection.hidden = false;
  dashboardSection.hidden = true;

  connectionStatus.textContent = "未接続";
  pageStatus.textContent = "未認証";
  logoutButton.disabled = true;

  currentPage = "dashboard";
}

navigation.addEventListener("click", event => {
  const button = event.target.closest(".menu-button");

  if (!button) return;

  showPage(button.dataset.page);
});

logoutButton.addEventListener("click", async () => {
  if (!authenticated) return;

  await initializeAuth.logout();
  setUnauthenticated();
});

async function startOperatorConsole() {
  setUnauthenticated();

  try {
    await initializeAuth.initialize({
      onLogin: setAuthenticated,
      onLogout: setUnauthenticated
    });
  } catch (error) {
    console.error("認証システム初期化エラー:", error);
  }
}

startOperatorConsole();
