/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   FINAL COMPLETE APP.JS
   ============================================================ */

"use strict";

/* ============================================================
   STORAGE
============================================================ */

const PR_KEYS = {
  products: "prior_riding_products",
  buyers: "prior_riding_buyers",
  payments: "prior_riding_payments",
  proformas: "prior_riding_proformas",
  letters: "prior_riding_letters",
  settings: "prior_riding_settings"
};

const PR_PRODUCT_CATEGORIES = [
  "Goalkeeper Gloves",
  "Riding Gloves",
  "Cycling Gloves",
  "Boxing Gloves",
  "MMA Gloves",
  "Horse Riding Gloves",
  "Hard Riding Gloves",
  "Football / Soccer Gloves",
  "Chin Pads / Protective Pads",
  "Sports Bags",
  "Hand Wraps",
  "Other Sports Goods / Other Varieties"
];

let products = [];
let buyers = [];
let payments = [];
let proformas = [];
let letters = [];

/* ============================================================
   HELPERS
============================================================ */

function loadData(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(e);
    alert("Data could not be saved.");
    return false;
  }
}

function loadAllData() {
  products = loadData(PR_KEYS.products);
  buyers = loadData(PR_KEYS.buyers);
  payments = loadData(PR_KEYS.payments);
  proformas = loadData(PR_KEYS.proformas);
  letters = loadData(PR_KEYS.letters);
}

function generateId() {
  return Date.now().toString(36) + "_" +
    Math.random().toString(36).slice(2, 10);
}

function getElement(id) {
  return document.getElementById(id);
}

function getValue(id) {
  const el = getElement(id);
  return el ? String(el.value ?? "").trim() : "";
}

function setValue(id, value) {
  const el = getElement(id);
  if (el) el.value = value ?? "";
}

function today() {
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

/* ============================================================
   START
============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  loadAllData();
  setupForms();
  setupSearchInputs();
  setupOutsideClick();
  setupKeyboard();
  populateCategories();
  refreshAll();

  if (getElement("dashboard")) {
    showSection("dashboard");
  }
});

/* ============================================================
   FORMS
============================================================ */

function setupForms() {
  const forms = [
    ["productForm", saveProduct],
    ["buyerForm", saveBuyer],
    ["paymentForm", savePayment],
    ["proformaForm", createProforma],
    ["letterForm", createProformaLetter]
  ];

  forms.forEach(function (item) {
    const form = getElement(item[0]);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      item[1]();
    });
  });
}

function setupSearchInputs() {
  const p = getElement("productSearch");
  const b = getElement("buyerSearch");

  if (p) p.addEventListener("input", renderProducts);
  if (b) b.addEventListener("input", renderBuyers);
}

function setupOutsideClick() {
  document.addEventListener("click", function (e) {
    const menu = getElement("settingsMenu");
    const button = document.querySelector(".menu-btn");

    if (
      menu &&
      menu.style.display === "block" &&
      !menu.contains(e.target) &&
      (!button || !button.contains(e.target))
    ) {
      menu.style.display = "none";
    }
  });

  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
      }
    });
  });
}

function setupKeyboard() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal").forEach(function (modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
      });

      closeDashboardTool();
    }
  });
}

/* ============================================================
   NAVIGATION
============================================================ */

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(function (section) {
    section.classList.remove("active");
    section.style.display = "none";
  });

  const section = getElement(sectionId);

  if (section) {
    section.classList.add("active");
    section.style.display = "block";
  }

  document.querySelectorAll(".nav-btn").forEach(function (button) {
    button.classList.remove("active");

    const text = String(button.textContent || "").toLowerCase();

    if (
      (sectionId === "dashboard" && text.includes("dashboard")) ||
      (sectionId === "products" && text.includes("product")) ||
      (sectionId === "buyers" && text.includes("buyer"))
    ) {
      button.classList.add("active");
    }
  });

  refreshAll();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ============================================================
   REFRESH
============================================================ */

function refreshAll() {
  loadAllData();

  populateCategories();
  populateInterestedProducts();
  populateBuyerSelects();
  populateProductSelects();

  renderProducts();
  renderBuyers();
  renderRecentProducts();
  renderRecentBuyers();

  updateStats();
}

/* ============================================================
   STATS
============================================================ */
function updateStats() {
  const pc = getElement("productCount");
  const bc = getElement("buyerCount");
  const ac = getElement("activeBuyerCount");
  const fc = getElement("followupCount");

  if (pc) pc.textContent = products.length;
  if (bc) bc.textContent = buyers.length;

  if (ac) {
    ac.textContent = buyers.filter(function (buyer) {
      return String(buyer.status || "").toLowerCase() === "active";
    }).length;
  }

  if (fc) {
    fc.textContent = buyers.filter(function (buyer) {
      return Boolean(buyer.followupDate);
    }).length;
  }
}
