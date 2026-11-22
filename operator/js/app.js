
import { initializeAuth } from "./auth.js";
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
  "#dashboard": initializeDashboard,
  "#program": initializeProgram,
  "#zip": initializeZip,
  "#version": initializeVersion,
  "#testing": initializeTesting,
  "#release": initializeRelease,
  "#security": initializeSecurity,
  "#sales": initializeSalesMonitor,
  "#settings": initializeSettings
};

const loginPanel = document.querySelector("#login-panel");
const dashboardPanel = document.querySelector("#dashboard-panel");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#logout-button");
const content = document.querySelector("#operator-content");
const navLinks = document.querySelectorAll(".dashboard nav a");

function showPage(hash) {
  if (!content) return;

  const currentHash = pages[hash] ? hash : "#dashboard";
  const page = pages[currentHash];

  content.innerHTML = `
    <div class="page-heading">
      <a href="#dashboard" class="back-link">ダッシュボードへ戻る</a>
    </div>
  `;

  page(content);

  navLinks.forEach(link => {
    const active = link.getAttribute("href") === currentHash;
    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showLogin(message = "") {
  loginPanel.hidden = false;
  dashboardPanel.hidden = true;
  loginMessage.textContent = message;
}

function showDashboard() {
  loginPanel.hidden = true;
  dashboardPanel.hidden = false;
  showPage(location.hash || "#dashboard");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value;

  loginMessage.textContent = "ログイン確認中です。";

  try {
    await initializeAuth.login(email, password);
    loginForm.reset();
    showDashboard();
  } catch (error) {
    console.error(error);
    loginMessage.textContent =
      "ログインできませんでした。メールアドレスとパスワードを確認してください。";
  }
});

logoutButton.addEventListener("click", async () => {
  await initializeAuth.logout();
  showLogin("ログアウトしました。");
});

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const hash = link.getAttribute("href");
    history.replaceState(null, "", hash);
    showPage(hash);
  });
});

window.addEventListener("hashchange", () => {
  if (initializeAuth.isAuthenticated()) {
    showPage(location.hash || "#dashboard");
  }
});

try {
  const result = await initializeAuth.initialize();

  if (result.authenticated) {
    showDashboard();
  } else {
    showLogin();
  }
} catch (error) {
  console.error(error);
  showLogin("認証サーバーに接続できません。");
}
