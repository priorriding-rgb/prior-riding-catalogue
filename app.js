/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   COMPLETE FUNCTIONAL APP CONTROLLER
   ============================================================ */

"use strict";

/* ============================================================
   STORAGE KEYS
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


/* ============================================================
   BASIC HELPERS
   ============================================================ */

function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Storage read error:", e);
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(e);
    alert("Storage error: data could not be saved.");
    return false;
  }
}

function generateId() {
  return Date.now().toString() + "_" +
    Math.random().toString(36).substring(2, 9);
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
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
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}


/* ============================================================
   PRODUCT CATEGORIES
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

document.addEventListener("DOMContentLoaded", function () {

  setupForms();
  setupOutsideClick();
  setupKeyboard();

  populateCategories();
  populateInterestedProducts();

  refreshAll();

  console.log("PRIOR RIDING CRM loaded successfully.");

});


/* ============================================================
   FORM SETUP
   ============================================================ */

function setupForms() {

  const productForm = document.getElementById("productForm");

  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveProduct();
    });
  }

  const buyerForm = document.getElementById("buyerForm");

  if (buyerForm) {
    buyerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveBuyer();
    });
  }

  const paymentForm = document.getElementById("paymentForm");

  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      savePayment();
    });
  }

  const proformaForm = document.getElementById("proformaForm");

  if (proformaForm) {
    proformaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      createProforma();
    });
  }

  const letterForm = document.getElementById("letterForm");

  if (letterForm) {
    letterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      createProformaLetter();
    });
  }
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function showSection(sectionId) {

  document.querySelectorAll(".section").forEach(function (section) {
    section.classList.remove("active");
    section.style.display = "none";
  });

  const section = document.getElementById(sectionId);

  if (section) {
    section.classList.add("active");
    section.style.display = "block";
  }

  document.querySelectorAll(".nav-btn").forEach(function (btn) {

    btn.classList.remove("active");

    const text = btn.textContent.toLowerCase();

    if (
      (sectionId === "dashboard" && text.includes("dashboard")) ||
      (sectionId === "products" && text.includes("product")) ||
      (sectionId === "buyers" && text.includes("buyer"))
    ) {
      btn.classList.add("active");
    }

  });

  refreshAll();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ============================================================
   REFRESH EVERYTHING
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

}


/* ============================================================
   DASHBOARD STATS
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

  if (productCount)
    productCount.textContent = products.length;

  if (buyerCount)
    buyerCount.textContent = buyers.length;

  if (activeBuyerCount) {

    activeBuyerCount.textContent =
      buyers.filter(function (b) {
        return b.status === "Active";
      }).length;

  }

  if (followupCount) {

    followupCount.textContent =
      buyers.filter(function (b) {
        return !!b.followupDate;
      }).length;

  }
}


/* ============================================================
   PRODUCT CATEGORY
   ============================================================ */

function populateCategories() {

  const select =
    document.getElementById("category");

  if (!select) return;

  const current = select.value;

  select.innerHTML =
    '<option value="">Select Product Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function (category) {

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

  PR_PRODUCT_CATEGORIES.forEach(function (category) {

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

    products.forEach(function (product) {

      const option =
        document.createElement("option");

      option.value = product.name;

      option.textContent =
        product.name +
        (product.articleNo
          ? " — " + product.articleNo
          : "");

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
      products.find(function (p) {
        return String(p.id) === String(id);
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
      getValue("size"),

    weight:
      getValue("weight"),

    color:
      getValue("color"),

    availableSizes:
      getValue("availableSizes"),

    moq:
      getValue("moq"),

    price:
      getValue("price"),

    imageUrl:
      getValue("imageUrl"),

    specification:
      getValue("specification"),

    description:
      getValue("description"),

    status:
      getValue("productStatus") || "Available",

    updatedAt:
      new Date().toISOString()

  };

  if (!product.name || !product.articleNo) {

    alert(
      "Please enter Product Name and Article / Product No."
    );

    return;
  }

  if (id) {

    const index =
      products.findIndex(function (p) {
        return String(p.id) === String(id);
      });

    if (index !== -1)
      products[index] = product;

  } else {

    products.unshift(product);

  }

  saveData(PR_KEYS.products, products);

  closeProductModal();

  refreshAll();

  alert("Product saved successfully.");

}


/* ============================================================
   EDIT / DELETE PRODUCT
   ============================================================ */

function editProduct(id) {
  openProductModal(id);
}


function deleteProduct(id) {

  if (!confirm("Delete this product?"))
    return;

  products =
    products.filter(function (p) {
      return String(p.id) !== String(id);
    });

  saveData(PR_KEYS.products, products);

  refreshAll();

}


/* ============================================================
   RENDER PRODUCTS
   ============================================================ */

function renderProducts() {

  const container =
    document.getElementById("productList");

  if (!container) return;

  const input =
    document.getElementById("productSearch");

  const search =
    input
      ? input.value.toLowerCase().trim()
      : "";

  const filtered =
    products.filter(function (product) {

      return (

        String(product.name || "")
          .toLowerCase()
          .includes(search)

        ||

        String(product.articleNo || "")
          .toLowerCase()
          .includes(search)

        ||

        String(product.category || "")
          .toLowerCase()
          .includes(search)

      );

    });

  if (!filtered.length) {

    container.innerHTML = `
      <div class="panel">
        <p>No products found.</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    filtered.map(function (product) {

      return `

        <div class="panel product-card">

          ${
            product.imageUrl
              ? `
                <img
                  src="${escapeHtml(product.imageUrl)}"
                  alt="${escapeHtml(product.name)}"
                  style="
                    width:100%;
                    max-height:220px;
                    object-fit:contain;
                  "
                >
              `
              : ""
          }

          <h3>
            ${escapeHtml(product.name)}
          </h3>

          <p>
            <strong>Article:</strong>
            ${escapeHtml(product.articleNo)}
          </p>

          <p>
            <strong>Category:</strong>
            ${escapeHtml(product.category || "-")}
          </p>

          <p>
            <strong>Material:</strong>
            ${escapeHtml(product.material || "-")}
          </p>

          <p>
            <strong>Size:</strong>
            ${escapeHtml(product.size || "-")}
          </p>

          <p>
            <strong>Weight:</strong>
            ${escapeHtml(product.weight || "-")}
          </p>

          <p>
            <strong>Color:</strong>
            ${escapeHtml(product.color || "-")}
          </p>

          <p>
            <strong>MOQ:</strong>
            ${escapeHtml(product.moq || "-")}
          </
