
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

const API_URL =
  "https://otoku-navigation-api.keita19711020.workers.dev/api/admin/status";

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

let adminVerified = false;

function showPage(hash) {
  if (!content || !adminVerified) return;

  const currentHash = pages[hash] ? hash : "#dashboard";

  content.innerHTML = `
    <div class="page-heading">
      <a href="#dashboard" class="back-link">ダッシュボードへ戻る</a>
    </div>
  `;

  pages[currentHash](content);

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
  adminVerified = false;
  loginPanel.hidden = false;
  dashboardPanel.hidden = true;
  loginMessage.textContent = message;
}

function showDashboard() {
  adminVerified = true;
  loginPanel.hidden = true;
  dashboardPanel.hidden = false;
  showPage(location.hash || "#dashboard");
}

async function verifyAdmin() {
  const user = initializeAuth.getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${idToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Administrator verification failed");
  }

  const result = await response.json();

  if (
    result.success !== true ||
    result.authenticated !== true ||
    result.role !== "admin"
  ) {
    throw new Error("Administrator access denied");
  }

  return true;
}

async function authenticateAndShowDashboard() {
  await verifyAdmin();
  showDashboard();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email =
    document.querySelector("#login-email").value.trim();

  const password =
    document.querySelector("#login-password").value;

  loginMessage.textContent = "管理者認証を確認しています。";

  try {
    await initializeAuth.login(email, password);
    await authenticateAndShowDashboard();

    loginForm.reset();
  } catch (error) {
    console.error("Login or admin verification failed.");

    await initializeAuth.logout();
    showLogin(
      "管理者認証に失敗しました。アカウント設定を確認してください。"
    );
  }
});

logoutButton.addEventListener("click", async () => {
  await initializeAuth.logout();
  showLogin("ログアウトしました。");
});

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    if (!adminVerified) return;

    const hash = link.getAttribute("href");
    history.replaceState(null, "", hash);
    showPage(hash);
  });
});

window.addEventListener("hashchange", () => {
  if (adminVerified) {
    showPage(location.hash || "#dashboard");
  }
});

try {
  const result = await initializeAuth.initialize();

  if (result.authenticated) {
    await authenticateAndShowDashboard();
  } else {
    showLogin();
  }
} catch (error) {
  console.error("Initial authentication failed.");
  await initializeAuth.logout();
  showLogin("管理者認証を確認できませんでした。");
}
