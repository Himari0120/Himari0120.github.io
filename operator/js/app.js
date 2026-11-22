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

const content = document.querySelector("#operator-content");
const navLinks = document.querySelectorAll(".dashboard nav a");

function showPage(hash) {
  if (!content) return;

  const page = pages[hash] || pages["#dashboard"];
  const currentHash = pages[hash] ? hash : "#dashboard";

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
