/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   COMPLETE APP.JS
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

let products = loadData(PR_KEYS.products);
let buyers = loadData(PR_KEYS.buyers);
let payments = loadData(PR_KEYS.payments);
let proformas = loadData(PR_KEYS.proformas);
let letters = loadData(PR_KEYS.letters);

function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("PRIOR RIDING storage error:", error);
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(error);
    alert("Data could not be saved.");
    return false;
  }
}

function generateId() {
  return Date.now().toString(36) + "_" +
    Math.random().toString(36).substring(2, 10);
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? String(element.value || "").trim() : "";
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value == null ? "" : value;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}


/* ============================================================
   CATEGORIES / PAYMENT MODES
   ============================================================ */

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

const PR_PAYMENT_MODES = [
  "Bank Transfer / T.T.",
  "Advance",
  "Balance",
  "Cash",
  "Card",
  "PayPal",
  "Other"
];


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initPriorRiding() {

  setupForms();
  setupOutsideClick();
  setupKeyboard();

  populateCategories();
  populateInterestedProducts();

  refreshAll();

  const dashboard =
    document.getElementById("dashboard");

  if (dashboard) {
    document.querySelectorAll(".section").forEach(function(section) {
      section.classList.remove("active");
      section.style.display = "none";
    });

    dashboard.classList.add("active");
    dashboard.style.display = "block";
  }

  console.log("PRIOR RIDING CRM loaded.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPriorRiding);
} else {
  initPriorRiding();
}


/* ============================================================
   FORM SETUP
   ============================================================ */

function setupForms() {

  const productForm =
    document.getElementById("productForm");

  if (productForm) {
    productForm.addEventListener("submit", function(event) {
      event.preventDefault();
      saveProduct();
    });
  }

  const buyerForm =
    document.getElementById("buyerForm");

  if (buyerForm) {
    buyerForm.addEventListener("submit", function(event) {
      event.preventDefault();
      saveBuyer();
    });
  }

  const paymentForm =
    document.getElementById("paymentForm");

  if (paymentForm) {
    paymentForm.addEventListener("submit", function(event) {
      event.preventDefault();
      savePayment();
    });
  }

  const proformaForm =
    document.getElementById("proformaForm");

  if (proformaForm) {
    proformaForm.addEventListener("submit", function(event) {
      event.preventDefault();
      createProforma();
    });
  }

  const letterForm =
    document.getElementById("letterForm");

  if (letterForm) {
    letterForm.addEventListener("submit", function(event) {
      event.preventDefault();
      createProformaLetter();
    });
  }
}


/* ============================================================
   EXTRA SAFE HELPERS
   ============================================================ */

function setupOutsideClick() {

  document.addEventListener("click", function(event) {

    const productModal =
      document.getElementById("productModal");

    const buyerModal =
      document.getElementById("buyerModal");

    const paymentModal =
      document.getElementById("paymentModal");

    if (
      productModal &&
      event.target === productModal
    ) {
      closeProductModal();
    }

    if (
      buyerModal &&
      event.target === buyerModal
    ) {
      closeBuyerModal();
    }

    if (
      paymentModal &&
      event.target === paymentModal
    ) {
      closePayment();
    }
  });
}

function setupKeyboard() {

  document.addEventListener("keydown", function(event) {

    if (event.key !== "Escape") return;

    closeProductModal();
    closeBuyerModal();
    closePayment();
    closeDashboardTool();

  });
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function showSection(sectionId) {

  document.querySelectorAll(".section").forEach(function(section) {
    section.classList.remove("active");
    section.style.display = "none";
  });

  const selected =
    document.getElementById(sectionId);

  if (selected) {
    selected.classList.add("active");
    selected.style.display = "block";
  }

  document.querySelectorAll(".nav-btn").forEach(function(button) {

    button.classList.remove("active");

    const text =
      String(button.textContent || "").toLowerCase();

    if (
      (sectionId === "dashboard" &&
        text.includes("dashboard")) ||
      (sectionId === "products" &&
        text.includes("product")) ||
      (sectionId === "buyers" &&
        text.includes("buyer"))
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

  products = loadData(PR_KEYS.products);
  buyers = loadData(PR_KEYS.buyers);
  payments = loadData(PR_KEYS.payments);
  proformas = loadData(PR_KEYS.proformas);
  letters = loadData(PR_KEYS.letters);

  populateCategories();
  populateInterestedProducts();

  renderProducts();
  renderBuyers();

  updateStats();

  renderRecentProducts();
  renderRecentBuyers();

  populateBuyerSelects();
  populateProductSelects();

  renderPaymentHistory();
  renderProformaHistory();
  renderLetterHistory();
}


/* ============================================================
   DASHBOARD
   ============================================================ */

function updateStats() {

  const productCount =
    document.getElementById("productCount");

  const buyerCount =
    document.getElementById("buyerCount");

  const activeBuyerCount =
    document.getElementById("activeBuyerCount");

  const followupCount =
    document.getElementById("followupCount");

  const paymentCount =
    document.getElementById("paymentCount");

  const paymentTotal =
    document.getElementById("paymentTotal");

  if (productCount)
    productCount.textContent = products.length;

  if (buyerCount)
    buyerCount.textContent = buyers.length;

  if (activeBuyerCount) {
    activeBuyerCount.textContent =
      buyers.filter(function(buyer) {
        return buyer.status === "Active";
      }).length;
  }

  if (followupCount) {
    followupCount.textContent =
      buyers.filter(function(buyer) {
        return !!buyer.followupDate;
      }).length;
  }

  if (paymentCount)
    paymentCount.textContent = payments.length;

  if (paymentTotal) {

    const total =
      payments.reduce(function(sum, payment) {
        return sum +
          Number(
            payment.pkrAmount ||
            payment.amount ||
            0
          );
      }, 0);

    paymentTotal.textContent =
      "PKR " + money(total);
  }
}


/* ============================================================
   PRODUCT CATEGORIES
   ============================================================ */

function populateCategories() {

  const select =
    document.getElementById("category");

  if (!select) return;

  const current = select.value;

  select.innerHTML =
    '<option value="">Select Product Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function(category) {

    const option =
      document.createElement("option");

    option.value = category;
    option.textContent = category;

    select.appendChild(option);
  });

  if (current)
    select.value = current;
}


/* ============================================================
   INTERESTED PRODUCTS
   ============================================================ */

function populateInterestedProducts() {

  const select =
    document.getElementById("interestedProduct");

  if (!select) return;

  const current = select.value;

  select.innerHTML =
    '<option value="">Select Product / Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function(category) {

    const option =
      document.createElement("option");

    option.value = category;
    option.textContent = category;

    select.appendChild(option);
  });

  if (products.length) {

    const group =
      document.createElement("optgroup");

    group.label = "Added Products";

    products.forEach(function(product) {

      const option =
        document.createElement("option");

      option.value = product.name;

      option.textContent =
        product.name +
        (
          product.articleNo
            ? " — " + product.articleNo
            : ""
        );

      group.appendChild(option);
    });

    select.appendChild(group);
  }

  if (current)
    select.value = current;
}


/* ============================================================
   PRODUCT MODAL
   ============================================================ */

function openProductModal(id) {

  const modal =
    document.getElementById("productModal");

  const form =
    document.getElementById("productForm");

  if (!modal || !form) return;

  form.reset();

  setValue("productId", "");

  if (id) {

    const product =
      products.find(function(item) {
        return String(item.id) === String(id);
      });

    if (!product) return;

    setValue("productId", product.id);
    setValue("productName", product.name);
    setValue("articleNo", product.articleNo);
    setValue("category", product.category);
    setValue("material", product.material);
    setValue("size", product.size);
    setValue("weight", product.weight);
    setValue("color", product.color);
    setValue("availableSizes", product.availableSizes);
    setValue("moq", product.moq);
    setValue("price", product.price);
    setValue("imageUrl", product.imageUrl);
    setValue("specification", product.specification);
    setValue("description", product.description);
    setValue("productStatus", product.status);

    const title =
      document.getElementById("productModalTitle");

    if (title)
      title.textContent = "Edit Product";

  } else {

    const title =
      document.getElementById("productModalTitle");

    if (title)
      title.textContent = "Add Product";
  }

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeProductModal() {

  const modal =
    document.getElementById("productModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


/* ============================================================
   SAVE PRODUCT
   ============================================================ */

function saveProduct() {

  const id =
    getValue("productId");

  const product = {

    id: id || generateId(),

    name:
      getValue("productName"),

    articleNo:
      getValue("articleNo"),

    category:
      getValue("category"),

    material:
      getValue("material"),

    size:
      getValue("
