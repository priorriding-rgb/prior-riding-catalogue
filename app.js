/* =========================================================
   PRIOR RIDING — International Buyer CRM
   app.js
   Version: 2026-10-05
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const PR_PRODUCTS_KEY = "prior_riding_products";
const PR_BUYERS_KEY = "prior_riding_buyers";
const PR_PAYMENTS_KEY = "prior_riding_payments";
const PR_PROFORMAS_KEY = "prior_riding_proformas";
const PR_LETTERS_KEY = "prior_riding_letters";

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function prRead(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;

    const parsed = JSON.parse(value);

    return parsed ?? fallback;
  } catch (error) {
    console.error("PR read error:", key, error);
    return fallback;
  }
}

function prWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("PR write error:", key, error);

    alert(
      "Storage error. Please check your phone storage."
    );

    return false;
  }
}

function prProducts() {
  return prRead(PR_PRODUCTS_KEY, []);
}

function prBuyers() {
  return prRead(PR_BUYERS_KEY, []);
}

function prPayments() {
  return prRead(PR_PAYMENTS_KEY, []);
}

function prProformas() {
  return prRead(PR_PROFORMAS_KEY, []);
}

function prLetters() {
  return prRead(PR_LETTERS_KEY, []);
}

function prUid(prefix = "PR") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

function prToday() {
  const d = new Date();

  const y = d.getFullYear();

  const m = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

function prFormatDate(value) {
  if (!value) return "-";

  try {
    const d = new Date(
      value +
      (
        String(value).length === 10
          ? "T00:00:00"
          : ""
      )
    );

    if (Number.isNaN(d.getTime())) {
      return value;
    }

    return d.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  } catch {
    return value;
  }
}

function prNumber(value) {
  const n = Number(value);

  return Number.isFinite(n)
    ? n
    : 0;
}

function prMoney(value, currency = "") {
  const n = prNumber(value);

  return (
    `${currency ? currency + " " : ""}` +
    n.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  );
}

function prEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function prEl(id) {
  return document.getElementById(id);
}

function prSetValue(id, value) {
  const el = prEl(id);

  if (el) {
    el.value = value ?? "";
  }
}

function prGetValue(id) {
  const el = prEl(id);

  return el
    ? el.value.trim()
    : "";
}

function prNotify(message) {
  alert(message);
}

/* =========================================================
   MODAL HELPERS
   ========================================================= */

function prFindModal(formId) {
  const form = prEl(formId);

  if (!form) return null;

  return (
    form.closest(".modal") ||
    form.closest(".modal-overlay") ||
    form.parentElement
  );
}

function prShowModal(formId) {
  const modal = prFindModal(formId);

  if (!modal) return;

  modal.style.display = "flex";

  modal.classList.add("show");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}

function prHideModal(formId) {
  const modal = prFindModal(formId);

  if (!modal) return;

  modal.style.display = "none";

  modal.classList.remove("show");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );
}

function prCloseById(id) {
  const el = prEl(id);

  if (!el) return;

  el.style.display = "none";

  el.classList.remove("show");

  el.setAttribute(
    "aria-hidden",
    "true"
  );
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {
  const sections =
    document.querySelectorAll(".section");

  sections.forEach(section => {
    section.style.display = "none";
    section.classList.remove("active");
  });

  const target = prEl(sectionId);

  if (target) {
    target.style.display = "block";
    target.classList.add("active");
  }

  document
    .querySelectorAll(".nav-btn")
    .forEach(btn => {
      btn.classList.remove("active");

      const onclick =
        btn.getAttribute("onclick") || "";

      if (
        onclick.includes(
          "'" + sectionId + "'"
        ) ||
        onclick.includes(
          '"' + sectionId + '"'
        )
      ) {
        btn.classList.add("active");
      }
    });

  if (sectionId === "dashboard") {
    renderDashboard();
  }

  if (sectionId === "products") {
    renderProducts();
  }

  if (sectionId === "buyers") {
    renderBuyers();
  }
}

/* =========================================================
   DASHBOARD
   ========================================================= */
function updateDashboardStats() {
  const products = prProducts();
  const buyers = prBuyers();
  const payments = prPayments();
  const proformas = prProformas();
  const letters = prLetters();

  const activeBuyers =
    buyers.filter(
      b =>
        String(
          b.status || ""
        ).toLowerCase() === "active"
    );

  const followups =
    buyers.filter(
      b =>
        b.followupDate ||
        String(
          b.status || ""
        ).toLowerCase().includes("follow")
    );

  const productCount =
    prEl("productCount") ||
    prEl("storageProductCount");

  const buyerCount =
    prEl("buyerCount") ||
    prEl("storageBuyerCount");

  const activeBuyerCount =
    prEl("activeBuyerCount") ||
    prEl("storageActiveBuyerCount");

  const followupCount =
    prEl("followupCount") ||
    prEl("storageFollowupCount");

  const paymentCount =
    prEl("storagePaymentCount");

  const proformaCount =
    prEl("storageProformaCount");

  const letterCount =
    prEl("storageLetterCount");

  if (productCount) {
    productCount.textContent =
      products.length;
  }

  if (buyerCount) {
    buyerCount.textContent =
      buyers.length;
  }

  if (activeBuyerCount) {
    activeBuyerCount.textContent =
      activeBuyers.length;
  }

  if (followupCount) {
    followupCount.textContent =
      followups.length;
  }

  if (paymentCount) {
    paymentCount.textContent =
      payments.length;
  }

  if (proformaCount) {
    proformaCount.textContent =
      proformas.length;
  }

  if (letterCount) {
    letterCount.textContent =
      letters.length;
  }
}
