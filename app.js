/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   FINAL COMPLETE FUNCTIONAL APP.JS
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
    console.error("Load error:", e);
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Save error:", e);
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
  populateInterestedProducts();
  populateBuyerSelects();
  populateProductSelects();

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

  if (p) {
    p.addEventListener("input", renderProducts);
  }

  if (b) {
    b.addEventListener("input", renderBuyers);
  }
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

    const text =
      String(button.textContent || "").toLowerCase();

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

  updateStorageCounts();
}

/* ============================================================
   STORAGE COUNTS
============================================================ */

function updateStorageCounts() {
  const pc = getElement("storageProductCount");
  const bc = getElement("storageBuyerCount");
  const pay = getElement("storagePaymentCount");
  const pro = getElement("storageProformaCount");

  if (pc) pc.textContent = products.length;
  if (bc) bc.textContent = buyers.length;
  if (pay) pay.textContent = payments.length;
  if (pro) pro.textContent = proformas.length;
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

  if (current) {
    select.value = current;
  }
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
        (product.articleNo
          ? " — " + product.articleNo
          : "");

      group.appendChild(option);
    });

    select.appendChild(group);
  }

  if (current) {
    select.value = current;
  }
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

    if (title) {
      title.textContent = "Edit Product";
    }
  } else {
    if (title) {
      title.textContent = "Add Product";
    }
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
    alert(
      "Please enter Product Name and Article / Product No."
    );
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
    status:
      getValue("productStatus") || "Available",
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

  if (!confirm('Delete "' + product.name + '"?')) {
    return;
  }

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

  const input = getElement("productSearch");

  const search = input
    ? String(input.value || "").toLowerCase().trim()
    : "";

  const filtered = products.filter(function (product) {
    return [
      product.name,
      product.articleNo,
      product.category,
      product.material,
      product.color,
      product.availableSizes,
      product.moq,
      product.price,
      product.status
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
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
          src="${escapeHtml(product.imageUrl)}"
          alt="${escapeHtml(product.name)}"
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
          <strong>Available Sizes:</strong>
          ${escapeHtml(product.availableSizes || "-")}
        </p>

        <p>
          <strong>MOQ:</strong>
          ${escapeHtml(product.moq || "-")}
        </p>

        <p>
          <strong>Price:</strong>
          ${escapeHtml(product.price || "-")}
        </p>

        <p>
          <strong>Status:</strong>
          ${escapeHtml(product.status || "-")}
        </p>

        ${
          product.specification
            ? `
              <p>
                <strong>Specification:</strong><br>
                ${escapeHtml(product.specification)}
              </p>
            `
            : ""
        }

        ${
          product.description
            ? `
              <p>
                <strong>Description:</strong><br>
                ${escapeHtml(product.description)}
              </p>
            `
            : ""
        }

        <div class="modal-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick='editProduct(${JSON.stringify(String(product.id))})'
          >
            Edit
          </button>

          <button
            type="button"
            class="primary-btn"
            onclick='deleteProduct(${JSON.stringify(String(product.id))})'
          >
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
    setValue(
      "interestedProduct",
      buyer.interestedProduct
    );
    setValue("buyerStatus", buyer.status || "Active");
    setValue("followupDate", buyer.followupDate);
    setValue("buyerNotes", buyer.notes);

    if (title) {
      title.textContent = "Edit Buyer";
    }
  } else {
    if (title) {
      title.textContent = "Add Buyer";
    }
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
    alert(
      "Please enter Buyer / Company Name and Country."
    );
    return;
  }

  const buyer = {
    id: id || generateId(),
    name: name,
    country: country,
    contactPerson: getValue("contactPerson"),
    email: getValue("buyerEmail"),
    phone: getValue("buyerPhone"),
    interestedProduct:
      getValue("interestedProduct"),
    status:
      getValue("buyerStatus") || "Active",
    followupDate:
      getValue("followupDate"),
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

  if (!confirm('Delete "' + buyer.name + '"?')) {
    return;
  }

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
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
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
              ? `
                <br>
                <small>
                  ${escapeHtml(buyer.contactPerson)}
                </small>
              `
              : ""
          }
        </td>

        <td>${escapeHtml(buyer.country)}</td>

        <td>${escapeHtml(buyer.email || "-")}</td>

        <td>${escapeHtml(buyer.phone || "-")}</td>

        <td>
          ${escapeHtml(
            buyer.interestedProduct || "-"
          )}
        </td>

        <td>${escapeHtml(buyer.status || "-")}</td>

        <td>
          ${escapeHtml(buyer.followupDate || "-")}
        </td>

        <td>

          <button
            type="button"
            class="secondary-btn"
            onclick='editBuyer(${JSON.stringify(String(buyer.id))})'
          >
            Edit
          </button>

          <button
            type="button"
            class="primary-btn"
            onclick='deleteBuyer(${JSON.stringify(String(buyer.id))})'
          >
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
    container.innerHTML =
      "<p>No products added yet.</p>";
    return;
  }

  container.innerHTML = recent.map(function (product) {
    return `
      <div class="panel">

        <strong>
          ${escapeHtml(product.name)}
        </strong>

        <p>
          ${escapeHtml(product.articleNo || "")}
        </p>

        <small>
          ${escapeHtml(product.category || "")}
        </small>

      </div>
    `;
  }).join("");
}

function renderRecentBuyers() {
  const container = getElement("recentBuyers");

  if (!container) return;

  const recent = buyers.slice(0, 5);

  if (!recent.length) {
    container.innerHTML =
      "<p>No buyers added yet.</p>";
    return;
  }

  container.innerHTML = recent.map(function (buyer) {
    return `
      <div class="panel">

        <strong>
          ${escapeHtml(buyer.name)}
        </strong>

        <p>
          ${escapeHtml(buyer.country)}
        </p>

        <small>
          ${escapeHtml(buyer.status || "")}
        </small>

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
        (buyer.country
          ? " — " + buyer.country
          : "");

      select.appendChild(option);
    });

    if (current) {
      select.value = current;
    }
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
      (product.articleNo
        ? " — " + product.articleNo
        : "");

    select.appendChild(option);
  });

  if (current) {
    select.value = current;
  }
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
    paymentDate:
      getValue("paymentDate") || today(),
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
    const match = String(item.number || "")
      .match(/PI-(\d+)/);

    if (match) {
      highest = Math.max(
        highest,
        Number(match[1])
      );
    }
  });

  return "PI-" +
    String(highest + 1).padStart(3, "0") +
    "-" +
    year;
}

function createProforma() {
  const buyerId = getValue("proformaBuyer");
  const productId = getValue("proformaProduct");

  const qty =
    Number(getValue("proformaQty")) || 0;

  const unitPrice =
    Number(getValue("proformaUnitPrice")) || 0;

  const date =
    getValue("proformaDate") || today();

  if (!buyerId || !productId) {
    alert("Please select Buyer and Product.");
    return;
  }

  if (qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  const buyer = buyers.find(function (item) {
    return String(item.id) === String(buyerId);
  });

  const product = products.find(function (item) {
    return String(item.id) === String(productId);
  });

  if (!buyer || !product) {
    alert("Buyer or Product not found.");
    return;
  }

  const proforma = {
    id: generateId(),
    number: generateProformaNumber(),
    buyerId: buyerId,
    productId: productId,
    buyerName: buyer.name,
    buyerCountry: buyer.country,
    productName: product.name,
    articleNo: product.articleNo,
    quantity: qty,
    unitPrice: unitPrice,
    total: qty * unitPrice,
    date: date,
    currency: "USD",
    createdAt: new Date().toISOString()
  };

  proformas.unshift(proforma);

  if (!saveData(PR_KEYS.proformas, proformas)) {
    return;
  }

  prCloseProforma();
  refreshAll();

  printProforma(proforma);
}

/* ============================================================
   PROFORMA LETTER
============================================================ */

function openProformaLetterModal() {
  const modal = getElement("letterModal");
  const form = getElement("letterForm");

  if (!modal) return;

  if (form) form.reset();

  setValue("letterDate", today());
  setValue("letterSubject", "Proforma Invoice");

  modal.style.display = "flex";
  modal.classList.add("show");
}

function prCloseLetter() {
  const modal = getElement("letterModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

function createProformaLetter() {
  const buyer =
    getValue("letterBuyer");

  const date =
    getValue("letterDate") || today();

  const subject =
    getValue("letterSubject") ||
    "Proforma Invoice";

  const message =
    getValue("letterMessage");

  if (!buyer || !message) {
    alert(
      "Please enter Buyer / Company and Message."
    );
    return;
  }

  const letter = {
    id: generateId(),
    buyer: buyer,
    date: date,
    subject: subject,
    message: message,
    createdAt: new Date().toISOString()
  };

  letters.unshift(letter);

  if (saveData(PR_KEYS.letters, letters)) {
    prCloseLetter();
    refreshAll();

    printLetter(letter);
  }
}

/* ============================================================
   DASHBOARD TOOLS
============================================================ */

function openDashboardTool(type) {
  const panel =
    getElement("dashboardToolPanel");

  const title =
    getElement("dashboardToolTitle");

  const body =
    getElement("dashboardToolBody");

  if (!panel || !title || !body) {
    alert("Dashboard tool is unavailable.");
    return;
  }

  panel.style.display = "block";

  if (type === "performance") {
    title.textContent = "Performance Wise";

    body.innerHTML = `
      <div class="panel">

        <h3>Business Performance</h3>

        <p>
          Total Products:
          <strong>${products.length}</strong>
        </p>

        <p>
          Total Buyers:
          <strong>${buyers.length}</strong>
        </p>

        <p>
          Active Buyers:
          <strong>
            ${
              buyers.filter(function (b) {
                return String(b.status || "")
                  .toLowerCase() === "active";
              }).length
            }
          </strong>
        </p>

        <p>
          Follow-ups:
          <strong>
            ${
              buyers.filter(function (b) {
                return Boolean(b.followupDate);
              }).length
            }
          </strong>
        </p>

        <p>
          Payments Recorded:
          <strong>${payments.length}</strong>
        </p>

        <p>
          Proformas:
          <strong>${proformas.length}</strong>
        </p>

      </div>
    `;

    return;
  }

  if (type === "calc") {
    title.textContent = "Calc Breakdown";

    const totalPayments =
      payments.reduce(function (sum, payment) {
        return sum +
          (Number(payment.pkrAmount) || 0);
      }, 0);

    const totalProformas =
      proformas.reduce(function (sum, item) {
        return sum +
          (Number(item.total) || 0);
      }, 0);

    body.innerHTML = `
      <div class="panel">

        <h3>Calculation Breakdown</h3>

        <p>
          Total PKR Payments:
          <strong>${money(totalPayments)}</strong>
        </p>

        <p>
          Total Proforma Value:
          <strong>${money(totalProformas)}</strong>
        </p>

        <p>
          Products:
          <strong>${products.length}</strong>
        </p>

        <p>
          Buyers:
          <strong>${buyers.length}</strong>
        </p>

      </div>
    `;

    return;
  }

  if (type === "paymentMode") {
    title.textContent = "Payment Mode";

    const modes = {};

    payments.forEach(function (payment) {
      const mode =
        payment.paymentMode || "Other";

      modes[mode] =
        (modes[mode] || 0) + 1;
    });

    let html = `
      <div class="panel">
        <h3>Payment Mode Summary</h3>
    `;

    const keys = Object.keys(modes);

    if (!keys.length) {
      html += "<p>No payments recorded yet.</p>";
    } else {
      keys.forEach(function (mode) {
        html += `
          <p>
            ${escapeHtml(mode)}:
            <strong>${modes[mode]}</strong>
          </p>
        `;
      });
    }

    html += "</div>";

    body.innerHTML = html;

    return;
  }

  if (type === "payment") {
    closeDashboardTool();
    openPaymentModal();
    return;
  }

  if (type === "proforma") {
    closeDashboardTool();
    openProformaModal();
    return;
  }

  if (type === "proformaLetter") {
    closeDashboardTool();
    openProformaLetterModal();
    return;
  }

  if (type === "catalogue") {
    title.textContent = "Catalogue";

    if (!products.length) {
      body.innerHTML = `
        <div class="panel">
          <h3>No Products</h3>
          <p>Please add products first.</p>
        </div>
      `;
      return;
    }

    body.innerHTML = `
      <div class="panel">

        <h3>PRIOR RIDING Product Catalogue</h3>

        ${products.map(function (product) {
          return `
            <div class="panel">

              <strong>
                ${escapeHtml(product.name)}
              </strong>

              <p>
                Article:
                ${escapeHtml(product.articleNo || "-")}
              </p>

              <p>
                Category:
                ${escapeHtml(product.category || "-")}
              </p>

              <p>
                Price:
                ${escapeHtml(product.price || "-")}
              </p>

            </div>
          `;
        }).join("")}

      </div>
    `;

    return;
  }

  body.innerHTML = `
    <div class="panel">
      <p>Dashboard tool ready.</p>
    </div>
  `;
}

function closeDashboardTool() {
  const panel =
    getElement("dashboardToolPanel");

  if (panel) {
    panel.style.display = "none";
  }
}

/* ============================================================
   PRINT / PDF
============================================================ */

function printToPdf() {
  window.print();
}

function printProforma(item) {
  const buyer = escapeHtml(item.buyerName);
  const country = escapeHtml(item.buyerCountry);
  const product = escapeHtml(item.productName);
  const article = escapeHtml(item.articleNo);
  const number = escapeHtml(item.number);

  const html = `
    <html>
    <head>
      <title>${number} - PRIOR RIDING</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
        }

        h1 {
          color: #b00020;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
        }
      </style>
    </head>

    <body>

      <h1>PRIOR RIDING</h1>

      <h2>PROFORMA INVOICE</h2>

      <p>
        <strong>PI No:</strong> ${number}
      </p>

      <p>
        <strong>Date:</strong> ${escapeHtml(item.date)}
      </p>

      <p>
        <strong>Buyer:</strong> ${buyer}
      </p>

      <p>
        <strong>Country:</strong> ${country}
      </p>

      <table>

        <tr>
          <th>Product</th>
          <th>Article</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>

        <tr>
          <td>${product}</td>
          <td>${article}</td>
          <td>${item.quantity}</td>
          <td>${money(item.unitPrice)} USD</td>
          <td>${money(item.total)} USD</td>
        </tr>

      </table>

      <h3>
        Total:
        ${money(item.total)} USD
      </h3>

      <p>
        PRIOR RIDING — International Buyer CRM
      </p>

    </body>
    </html>
  `;

  openPrintWindow(html);
}

function printLetter(letter) {
  const html = `
    <html>
    <head>
      <title>PRIOR RIDING Letter</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 50px;
          line-height: 1.7;
        }

        h1 {
          color: #b00020;
        }
      </style>
    </head>

    <body>

      <h1>PRIOR RIDING</h1>

      <p>
        <strong>Date:</strong>
        ${escapeHtml(letter.date)}
      </p>

      <p>
        <strong>To:</strong>
        ${escapeHtml(letter.buyer)}
      </p>

      <h2>
        ${escapeHtml(letter.subject)}
      </h2>

      <p>
        ${escapeHtml(letter.message)
          .replace(/\n/g, "<br>")}
      </p>

      <br>

      <p>
        Best Regards,<br>
        <strong>PRIOR RIDING</strong>
      </p>

    </body>
    </html>
  `;

  openPrintWindow(html);
}

function openPrintWindow(html) {
  const win = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!win) {
    alert(
      "Please allow pop-ups to print the document."
    );
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();

  setTimeout(function () {
    win.focus();
    win.print();
  }, 400);
}

/* ============================================================
   STORAGE / BACKUP
============================================================ */

function toggleSettingsMenu() {
  const menu = getElement("settingsMenu");

  if (!menu) return;

  menu.style.display =
    menu.style.display === "none"
      ? "block"
      : "none";
}

function openStoragePanel() {
  toggleSettingsMenu();

  const modal =
    getElement("storageModal");

  if (!modal) return;

  updateStorageCounts();

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeStoragePanel() {
  const modal =
    getElement("storageModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

function showAppInfo() {
  toggleSettingsMenu();

  const modal =
    getElement("appInfoModal");

  if (!modal) return;

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeAppInfo() {
  const modal =
    getElement("appInfoModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

function exportAllData() {
  const data = {
    app:
      "PRIOR RIDING — International Buyer CRM",

    version: "1.0",

    exportedAt:
      new Date().toISOString(),

    products: products,
    buyers: buyers,
    payments: payments,
    proformas: proformas,
    letters: letters
  };

  const blob = new Blob(
    [
      JSON.stringify(data, null, 2)
    ],
    {
      type: "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "prior-riding-backup-" +
    today() +
    ".json";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}

function restoreAllData(event) {
  const file =
    event.target.files &&
    event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const data =
        JSON.parse(e.target.result);

      if (Array.isArray(data.products)) {
        localStorage.setItem(
          PR_KEYS.products,
          JSON.stringify(data.products)
        );
      }

      if (Array.isArray(data.buyers)) {
        localStorage.setItem(
          PR_KEYS.buyers,
          JSON.stringify(data.buyers)
        );
      }

      if (Array.isArray(data.payments)) {
        localStorage.setItem(
          PR_KEYS.payments,
          JSON.stringify(data.payments)
        );
      }

      if (Array.isArray(data.proformas)) {
        localStorage.setItem(
          PR_KEYS.proformas,
          JSON.stringify(data.proformas)
        );
      }

      if (Array.isArray(data.letters)) {
        localStorage.setItem(
          PR_KEYS.letters,
          JSON.stringify(data.letters)
        );
      }

      alert(
        "PRIOR RIDING backup restored successfully."
      );

      location.reload();

    } catch (error) {
      console.error(error);

      alert(
        "Invalid PRIOR RIDING backup file."
      );
    }
  };

  reader.readAsText(file);

  event.target.value = "";
}

/* ============================================================
   GLOBAL SAFETY
============================================================ */

window.showSection = showSection;

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

window.openBuyerModal = openBuyerModal;
window.closeBuyerModal = closeBuyerModal;
window.editBuyer = editBuyer;
window.deleteBuyer = deleteBuyer;

window.openPaymentModal = openPaymentModal;
window.prClosePayment = prClosePayment;

window.openProformaModal = openProformaModal;
window.prCloseProforma = prCloseProforma;

window.openProformaLetterModal =
  openProformaLetterModal;

window.prCloseLetter = prCloseLetter;

window.openDashboardTool =
  openDashboardTool;

window.closeDashboardTool =
  closeDashboardTool;

window.printToPdf = printToPdf;

window.toggleSettingsMenu =
  toggleSettingsMenu;

window.openStoragePanel =
  openStoragePanel;

window.closeStoragePanel =
  closeStoragePanel;

window.showAppInfo =
  showAppInfo;

window.closeAppInfo =
  closeAppInfo;

window.exportAllData =
  exportAllData;

window.restoreAllData =
  restoreAllData;

/* ============================================================
   END
============================================================ */
