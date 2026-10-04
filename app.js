/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   FINAL REPAIRED APP.JS
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
  } catch (error) {
    console.error("Storage read error:", error);
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Storage save error:", error);
    alert("Data could not be saved. Please check storage.");
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
    Math.random().toString(36).substring(2, 11);
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

function escapeAttribute(value) {
  return escapeHtml(value);
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  loadAllData();
  setupForms();
  setupSearchInputs();
  setupOutsideClick();
  setupKeyboard();
  populateCategories();
  populateInterestedProducts();
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

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      item[1]();
    });
  });
}

function setupSearchInputs() {
  const productSearch = getElement("productSearch");
  if (productSearch) {
    productSearch.addEventListener("input", renderProducts);
  }

  const buyerSearch = getElement("buyerSearch");
  if (buyerSearch) {
    buyerSearch.addEventListener("input", renderBuyers);
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
  const productCount = getElement("productCount");
  const buyerCount = getElement("buyerCount");
  const activeBuyerCount = getElement("activeBuyerCount");
  const followupCount = getElement("followupCount");

  if (productCount) productCount.textContent = products.length;
  if (buyerCount) buyerCount.textContent = buyers.length;

  if (activeBuyerCount) {
    activeBuyerCount.textContent = buyers.filter(function (buyer) {
      return String(buyer.status || "").toLowerCase() === "active";
    }).length;
  }

  if (followupCount) {
    followupCount.textContent = buyers.filter(function (buyer) {
      return Boolean(buyer.followupDate);
    }).length;
  }

  updateStorageCounts();
}

/* ============================================================
   CATEGORIES
   ============================================================ */

function populateCategories() {
  const select = getElement("category");
  if (!select) return;

  const current = select.value;

  select.innerHTML =
    '<option value="">Select Product Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  if (current) select.value = current;
}

function populateInterestedProducts() {
  const select = getElement("interestedProduct");
  if (!select) return;

  const current = select.value;

  select.innerHTML =
    '<option value="">Select Product / Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  if (products.length) {
    const group = document.createElement("optgroup");
    group.label = "Added Products";

    products.forEach(function (product) {
      if (!product.name) return;

      const option = document.createElement("option");
      option.value = product.name;
      option.textContent =
        product.name +
        (product.articleNo ? " — " + product.articleNo : "");

      group.appendChild(option);
    });

    select.appendChild(group);
  }

  if (current) select.value = current;
}

/* ============================================================
   PRODUCT MODAL
   ============================================================ */

function openProductModal(id) {
  const modal = getElement("productModal");
  const form = getElement("productForm");

  if (!modal) return;

  if (form) form.reset();

  setValue("productId", "");
  setValue("productStatus", "Available");

  const title = getElement("productModalTitle");

  if (id) {
    const product = products.find(function (item) {
      return String(item.id) === String(id);
    });

    if (!product) {
      alert("Product not found.");
      return;
    }

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
    setValue("productStatus", product.status || "Available");

    if (title) title.textContent = "Edit Product";
  } else {
    if (title) title.textContent = "Add Product";
  }

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeProductModal() {
  const modal = getElement("productModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

/* ============================================================
   PRODUCT SAVE
   ============================================================ */

function saveProduct() {
  const id = getValue("productId");
  const name = getValue("productName");
  const articleNo = getValue("articleNo");

  if (!name || !articleNo) {
    alert("Please enter Product Name and Article / Product No.");
    return;
  }

  const product = {
    id: id || generateId(),
    name: name,
    articleNo: articleNo,
    category: getValue("category"),
    material: getValue("material"),
    size: getValue("size"),
    weight: getValue("weight"),
    color: getValue("color"),
    availableSizes: getValue("availableSizes"),
    moq: getValue("moq"),
    price: getValue("price"),
    imageUrl: getValue("imageUrl"),
    specification: getValue("specification"),
    description: getValue("description"),
    status: getValue("productStatus") || "Available",
    updatedAt: new Date().toISOString()
  };

  if (id) {
    const index = products.findIndex(function (item) {
      return String(item.id) === String(id);
    });

    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
  } else {
    products.unshift(product);
  }

  if (saveData(PR_KEYS.products, products)) {
    closeProductModal();
    refreshAll();
    alert("Product saved successfully.");
  }
}

function editProduct(id) {
  openProductModal(id);
}

function deleteProduct(id) {
  const product = products.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!product) return;

  if (!confirm('Delete "' + product.name + '"?')) return;

  products = products.filter(function (item) {
    return String(item.id) !== String(id);
  });

  if (saveData(PR_KEYS.products, products)) {
    refreshAll();
  }
}

/* ============================================================
   PRODUCT RENDER
   ============================================================ */

function renderProducts() {
  const container = getElement("productList");
  if (!container) return;

  const searchInput = getElement("productSearch");
  const search = searchInput
    ? String(searchInput.value || "").toLowerCase().trim()
    : "";

  const filtered = products.filter(function (product) {
    const text = [
      product.name,
      product.articleNo,
      product.category,
      product.material,
      product.color,
      product.availableSizes,
      product.moq,
      product.price,
      product.status
    ].join(" ").toLowerCase();

    return text.includes(search);
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div class="panel">
        <h3>No Products Found</h3>
        <p>Add your first PRIOR RIDING product.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(function (product) {
    const image = product.imageUrl
      ? `
        <img
          src="${escapeAttribute(product.imageUrl)}"
          alt="${escapeAttribute(product.name)}"
          loading="lazy"
          style="width:100%;max-height:220px;object-fit:contain;border-radius:10px;margin-bottom:12px;"
          onerror="this.style.display='none';"
        >
      `
      : "";

    return `
      <div class="panel product-card">
        ${image}

        <h3>${escapeHtml(product.name)}</h3>

        <p><strong>Article:</strong>
          ${escapeHtml(product.articleNo)}</p>

        <p><strong>Category:</strong>
          ${escapeHtml(product.category || "-")}</p>

        <p><strong>Material:</strong>
          ${escapeHtml(product.material || "-")}</p>

        <p><strong>Size:</strong>
          ${escapeHtml(product.size || "-")}</p>

        <p><strong>Weight:</strong>
          ${escapeHtml(product.weight || "-")}</p>

        <p><strong>Color:</strong>
          ${escapeHtml(product.color || "-")}</p>

        <p><strong>Available Sizes:</strong>
          ${escapeHtml(product.availableSizes || "-")}</p>

        <p><strong>MOQ:</strong>
          ${escapeHtml(product.moq || "-")}</p>

        <p><strong>Price:</strong>
          ${escapeHtml(product.price || "-")}</p>

        <p><strong>Status:</strong>
          ${escapeHtml(product.status || "-")}</p>

        ${
          product.specification
            ? `<p><strong>Specification:</strong><br>
               ${escapeHtml(product.specification)}</p>`
            : ""
        }

        ${
          product.description
            ? `<p><strong>Description:</strong><br>
               ${escapeHtml(product.description)}</p>`
            : ""
        }

        <div class="modal-actions">
          <button
            type="button"
            class="secondary-btn"
            onclick="editProduct(${JSON.stringify(String(product.id))})">
            Edit
          </button>

          <button
            type="button"
            class="primary-btn"
            onclick="deleteProduct(${JSON.stringify(String(product.id))})">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/* ============================================================
   BUYER MODAL
   ============================================================ */

function openBuyerModal(id) {
  const modal = getElement("buyerModal");
  const form = getElement("buyerForm");

  if (!modal) return;

  if (form) form.reset();

  setValue("buyerId", "");
  setValue("buyerStatus", "Active");

  const title = getElement("buyerModalTitle");

  if (id) {
    const buyer = buyers.find(function (item) {
      return String(item.id) === String(id);
    });

    if (!buyer) {
      alert("Buyer not found.");
      return;
    }

    setValue("buyerId", buyer.id);
    setValue("buyerName", buyer.name);
    setValue("buyerCountry", buyer.country);
    setValue("contactPerson", buyer.contactPerson);
    setValue("buyerEmail", buyer.email);
    setValue("buyerPhone", buyer.phone);
    setValue("interestedProduct", buyer.interestedProduct);
    setValue("buyerStatus", buyer.status || "Active");
    setValue("followupDate", buyer.followupDate);
    setValue("buyerNotes", buyer.notes);

    if (title) title.textContent = "Edit Buyer";
  } else {
    if (title) title.textContent = "Add Buyer";
  }

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeBuyerModal() {
  const modal = getElement("buyerModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

/* ============================================================
   BUYER SAVE
   ============================================================ */

function saveBuyer() {
  const id = getValue("buyerId");
  const name = getValue("buyerName");
  const country = getValue("buyerCountry");

  if (!name || !country) {
    alert("Please enter Buyer / Company Name and Country.");
    return;
  }

  const buyer = {
    id: id || generateId(),
    name: name,
    country: country,
    contactPerson: getValue("contactPerson"),
    email: getValue("buyerEmail"),
    phone: getValue("buyerPhone"),
    interestedProduct: getValue("interestedProduct"),
    status: getValue("buyerStatus") || "Active",
    followupDate: getValue("followupDate"),
    notes: getValue("buyerNotes"),
    updatedAt: new Date().toISOString()
  };

  if (id) {
    const index = buyers.findIndex(function (item) {
      return String(item.id) === String(id);
    });

    if (index >= 0) {
      buyers[index] = buyer;
    } else {
      buyers.unshift(buyer);
    }
  } else {
    buyers.unshift(buyer);
  }

  if (saveData(PR_KEYS.buyers, buyers)) {
    closeBuyerModal();
    refreshAll();
    alert("Buyer saved successfully.");
  }
}

function editBuyer(id) {
  openBuyerModal(id);
}

function deleteBuyer(id) {
  const buyer = buyers.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!buyer) return;

  if (!confirm('Delete "' + buyer.name + '"?')) return;

  buyers = buyers.filter(function (item) {
    return String(item.id) !== String(id);
  });

  if (saveData(PR_KEYS.buyers, buyers)) {
    refreshAll();
  }
}

/* ============================================================
   BUYER RENDER
   ============================================================ */

function renderBuyers() {
  const table = getElement("buyerTable");
  if (!table) return;

  const input = getElement("buyerSearch");

  const search = input
    ? String(input.value || "").toLowerCase().trim()
    : "";

  const filtered = buyers.filter(function (buyer) {
    return [
      buyer.name,
      buyer.country,
      buyer.contactPerson,
      buyer.email,
      buyer.phone,
      buyer.interestedProduct,
      buyer.status,
      buyer.notes
    ].join(" ").toLowerCase().includes(search);
  });

  if (!filtered.length) {
    table.innerHTML = `
      <tr>
        <td colspan="8">No buyers found.</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = filtered.map(function (buyer) {
    return `
      <tr>
        <td>
          <strong>${escapeHtml(buyer.name)}</strong>
          ${
            buyer.contactPerson
              ? `<br><small>${escapeHtml(buyer.contactPerson)}</small>`
              : ""
          }
        </td>

        <td>${escapeHtml(buyer.country)}</td>
        <td>${escapeHtml(buyer.email || "-")}</td>
        <td>${escapeHtml(buyer.phone || "-")}</td>
        <td>${escapeHtml(buyer.interestedProduct || "-")}</td>
        <td>${escapeHtml(buyer.status || "-")}</td>
        <td>${escapeHtml(buyer.followupDate || "-")}</td>

        <td>
          <button
            type="button"
            class="secondary-btn"
            onclick="editBuyer(${JSON.stringify(String(buyer.id))})">
            Edit
          </button>

          <button
            type="button"
            class="primary-btn"
            onclick="deleteBuyer(${JSON.stringify(String(buyer.id))})">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

/* ============================================================
   RECENT
   ============================================================ */

function renderRecentProducts() {
  const container = getElement("recentProducts");
  if (!container) return;

  const recent = products.slice(0, 5);

  if (!recent.length) {
    container.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  container.innerHTML = recent.map(function (product) {
    return `
      <div class="panel">
        <strong>${escapeHtml(product.name)}</strong>
        <p>${escapeHtml(product.articleNo || "")}</p>
        <small>${escapeHtml(product.category || "")}</small>
      </div>
    `;
  }).join("");
}

function renderRecentBuyers() {
  const container = getElement("recentBuyers");
  if (!container) return;

  const recent = buyers.slice(0, 5);

  if (!recent.length) {
    container.innerHTML = "<p>No buyers added yet.</p>";
    return;
  }

  container.innerHTML = recent.map(function (buyer) {
    return `
      <div class="panel">
        <strong>${escapeHtml(buyer.name)}</strong>
        <p>${escapeHtml(buyer.country)}</p>
        <small>${escapeHtml(buyer.status || "")}</small>
      </div>
    `;
  }).join("");
}

/* ============================================================
   SELECTS
   ============================================================ */

function populateBuyerSelects() {
  ["paymentBuyer", "proformaBuyer"].forEach(function (id) {
    const select = getElement(id);
    if (!select) return;

    const current = select.value;

    select.innerHTML =
      '<option value="">Select Buyer</option>';

    buyers.forEach(function (buyer) {
      const option = document.createElement("option");
      option.value = buyer.id;
      option.textContent =
        buyer.name +
        (buyer.country ? " — " + buyer.country : "");

      select.appendChild(option);
    });

    if (current) select.value = current;
  });
}

function populateProductSelects() {
  const select = getElement("proformaProduct");
  if (!select) return;

  const current = select.value;

  select.innerHTML =
    '<option value="">Select Product</option>';

  products.forEach(function (product) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent =
      product.name +
      (product.articleNo ? " — " + product.articleNo : "");

    select.appendChild(option);
  });

  if (current) select.value = current;
}

/* ============================================================
   PAYMENT
   ============================================================ */

function openPaymentModal() {
  const modal = getElement("paymentModal");
  const form = getElement("paymentForm");

  if (!modal) return;

  if (form) form.reset();

  setValue("paymentDate", today());

  populateBuyerSelects();

  modal.style.display = "flex";
  modal.classList.add("show");
}

function prClosePayment() {
  const modal = getElement("paymentModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

function savePayment() {
  const buyerId = getValue("paymentBuyer");
  const amount = getValue("paymentForeignAmount");

  if (!buyerId) {
    alert("Please select a buyer.");
    return;
  }

  if (!amount) {
    alert("Please enter payment amount.");
    return;
  }

  const payment = {
    id: generateId(),
    buyerId: buyerId,
    bankName: getValue("paymentBankName"),
    proformaNo: getValue("paymentProformaNo"),
    foreignAmount: amount,
    currency: getValue("paymentForeignCurrency"),
    paymentMode: getValue("paymentMode"),
    pkrAmount: getValue("paymentPkrAmount"),
    paymentDate: getValue("paymentDate") || today(),
    reference: getValue("paymentReference"),
    notes: getValue("paymentNotes"),
    createdAt: new Date().toISOString()
  };

  payments.unshift(payment);

  if (saveData(PR_KEYS.payments, payments)) {
    prClosePayment();
    refreshAll();
    alert("Payment saved successfully.");
  }
}

/* ============================================================
   PROFORMA
   ============================================================ */

function openProformaModal() {
  const modal = getElement("proformaModal");
  const form = getElement("proformaForm");

  if (!modal) return;

  if (form) form.reset();

  setValue("proformaQty", "1");
  setValue("proformaUnitPrice", "0");
  setValue("proformaDate", today());

  populateBuyerSelects();
  populateProductSelects();

  modal.style.display = "flex";
  modal.classList.add("show");
}

function prCloseProforma() {
  const modal = getElement("proformaModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

function generateProformaNumber() {
  const year = new Date().getFullYear();
  let highest = 0;

  proformas.forEach(function (item) {
    const match = String(item.number || "").match(/PI
