/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   COMPLETE APP.JS
   ============================================================ */

"use strict";

/* ============================================================
   DATA
   ============================================================ */

var products = prLoad("priorRidingProducts", []);
var buyers = prLoad("priorRidingBuyers", []);
var prPayments = prLoad("priorRidingPayments", []);
var proformas = prLoad("priorRidingProformas", []);

var PR_PRODUCT_CATEGORIES = [
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

var PR_PAYMENT_MODES = [
  "Bank Transfer / T.T.",
  "Advance",
  "Balance",
  "Cash",
  "Card",
  "PayPal",
  "Other"
];


/* ============================================================
   SAFE STORAGE
   ============================================================ */

function prLoad(key, fallback) {
  try {
    var value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.error("Storage load error:", key, e);
    return fallback;
  }
}

function prStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("Storage save error:", key, e);
    alert("Storage error. Please check your device storage.");
    return false;
  }
}

function saveProducts() {
  prStore("priorRidingProducts", products);
}

function saveBuyers() {
  prStore("priorRidingBuyers", buyers);
}

function prSavePayments() {
  prStore("priorRidingPayments", prPayments);
}

function saveProformas() {
  prStore("priorRidingProformas", proformas);
}

function generateId() {
  return Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10);
}

function prMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* ============================================================
   SECTION NAVIGATION
   ============================================================ */

function showSection(section) {

  document.querySelectorAll(".section").forEach(function(item) {
    item.style.display = "none";
    item.classList.remove("active");
  });

  var selected = document.getElementById(section);

  if (selected) {
    selected.style.display = "block";
    selected.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(function(btn) {
    btn.classList.remove("active");

    var text = btn.textContent.toLowerCase();

    if (
      (section === "dashboard" && text.indexOf("dashboard") !== -1) ||
      (section === "products" && text.indexOf("product") !== -1) ||
      (section === "buyers" && text.indexOf("buyer") !== -1)
    ) {
      btn.classList.add("active");
    }
  });

  updateDashboard();

  if (section === "products") renderProducts();
  if (section === "buyers") renderBuyers();
}


/* ============================================================
   PRODUCT MODAL
   ============================================================ */

function openProductModal() {

  var modal = document.getElementById("productModal");

  if (modal) modal.style.display = "flex";

  var form = document.getElementById("productForm");

  if (form && !document.getElementById("productId").value) {
    form.reset();
  }

  var title = document.getElementById("productModalTitle");

  if (title) title.textContent = "Add Product";

  prFillCategories();
}

function closeProductModal() {

  var modal = document.getElementById("productModal");

  if (modal) modal.style.display = "none";

  var form = document.getElementById("productForm");

  if (form) form.reset();

  var id = document.getElementById("productId");

  if (id) id.value = "";

  var title = document.getElementById("productModalTitle");

  if (title) title.textContent = "Add Product";
}


/* ============================================================
   BUYER MODAL
   ============================================================ */

function openBuyerModal() {

  var modal = document.getElementById("buyerModal");

  if (modal) modal.style.display = "flex";

  var form = document.getElementById("buyerForm");

  if (form && !document.getElementById("buyerId").value) {
    form.reset();
  }

  var title = document.getElementById("buyerModalTitle");

  if (title) title.textContent = "Add Buyer";

  populateInterestedProducts();
}

function closeBuyerModal() {

  var modal = document.getElementById("buyerModal");

  if (modal) modal.style.display = "none";

  var form = document.getElementById("buyerForm");

  if (form) form.reset();

  var id = document.getElementById("buyerId");

  if (id) id.value = "";

  var title = document.getElementById("buyerModalTitle");

  if (title) title.textContent = "Add Buyer";
}


/* ============================================================
   PRODUCT SAVE
   ============================================================ */

function handleProductSubmit(event) {

  event.preventDefault();

  var id = document.getElementById("productId").value;

  var product = {
    id: id || generateId(),
    name: document.getElementById("productName").value.trim(),
    articleNo: document.getElementById("articleNo").value.trim(),
    category: document.getElementById("category").value,
    material: document.getElementById("material").value.trim(),
    size: document.getElementById("size").value.trim(),
    weight: document.getElementById("weight").value.trim(),
    color: document.getElementById("color").value.trim(),
    availableSizes: document.getElementById("availableSizes").value.trim(),
    moq: document.getElementById("moq").value.trim(),
    price: document.getElementById("price").value.trim(),
    imageUrl: document.getElementById("imageUrl").value.trim(),
    specification: document.getElementById("specification").value.trim(),
    description: document.getElementById("description").value.trim(),
    status: document.getElementById("productStatus").value
  };

  if (!product.name || !product.articleNo) {
    alert("Please enter Product Name and Article / Product No.");
    return;
  }

  if (id) {

    var index = products.findIndex(function(p) {
      return String(p.id) === String(id);
    });

    if (index >= 0) {
      products[index] = product;
    }

  } else {
    products.push(product);
  }

  saveProducts();
  renderProducts();
  populateInterestedProducts();
  updateDashboard();
  closeProductModal();

  alert("Product saved successfully.");
}


/* ============================================================
   BUYER SAVE
   ============================================================ */

function handleBuyerSubmit(event) {

  event.preventDefault();

  var id = document.getElementById("buyerId").value;

  var buyer = {
    id: id || generateId(),
    name: document.getElementById("buyerName").value.trim(),
    country: document.getElementById("buyerCountry").value.trim(),
    contactPerson: document.getElementById("contactPerson").value.trim(),
    email: document.getElementById("buyerEmail").value.trim(),
    phone: document.getElementById("buyerPhone").value.trim(),
    interestedProduct: document.getElementById("interestedProduct").value,
    status: document.getElementById("buyerStatus").value,
    followupDate: document.getElementById("followupDate").value,
    notes: document.getElementById("buyerNotes").value.trim()
  };

  if (!buyer.name || !buyer.country) {
    alert("Please enter Buyer / Company Name and Country.");
    return;
  }

  if (id) {

    var index = buyers.findIndex(function(b) {
      return String(b.id) === String(id);
    });

    if (index >= 0) {
      buyers[index] = buyer;
    }

  } else {
    buyers.push(buyer);
  }

  saveBuyers();
  renderBuyers();
  updateDashboard();
  closeBuyerModal();

  alert("Buyer saved successfully.");
}


/* ============================================================
   PRODUCTS
   ============================================================ */

function renderProducts() {

  var container = document.getElementById("productList");

  if (!container) return;

  var searchInput = document.getElementById("productSearch");

  var search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  var filtered = products.filter(function(product) {

    return (
      String(product.name || "").toLowerCase().includes(search) ||
      String(product.articleNo || "").toLowerCase().includes(search) ||
      String(product.category || "").toLowerCase().includes(search)
    );

  });

  if (!filtered.length) {

    container.innerHTML =
      '<div class="panel">' +
      '<p>No products found. Click "+ Add Product" to add one.</p>' +
      '</div>';

    return;
  }

  container.innerHTML = filtered.map(function(product) {

    return `
      <div class="panel product-card">

        ${
          product.imageUrl
            ? `<img src="${escapeHtml(product.imageUrl)}"
                 alt="${escapeHtml(product.name)}"
                 style="width:100%;max-height:220px;object-fit:contain;">`
            : ""
        }

        <h3>${escapeHtml(product.name)}</h3>

        <p><strong>Article:</strong>
        ${escapeHtml(product.articleNo)}</p>

        <p><strong>Category:</strong>
        ${escapeHtml(product.category || "-")}</p>

        <p><strong>Material:</strong>
        ${escapeHtml(product.material || "-")}</p>

        <p><strong>Size:</strong>
        ${escapeHtml(product.size || "-")}</p>

        <p><strong>Color:</strong>
        ${escapeHtml(product.color || "-")}</p>

        <p><strong>MOQ:</strong>
        ${escapeHtml(product.moq || "-")}</p>

        <p><strong>Price:</strong>
        ${escapeHtml(product.price || "-")}</p>

        <p><strong>Status:</strong>
        ${escapeHtml(product.status || "-")}</p>

        <div style="margin-top:12px;">
          <button onclick="editProduct('${product.id}')">
            Edit
          </button>

          <button onclick="deleteProduct('${product.id}')">
            Delete
          </button>
        </div>

      </div>
    `;

  }).join("");
}


/* ============================================================
   BUYERS
   ============================================================ */

function renderBuyers() {

  var table = document.getElementById("buyerTable");

  if (!table) return;

  var searchInput = document.getElementById("buyerSearch");

  var search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  var filtered = buyers.filter(function(buyer) {

    return (
      String(buyer.name || "").toLowerCase().includes(search) ||
      String(buyer.country || "").toLowerCase().includes(search) ||
      String(buyer.phone || "").toLowerCase().includes(search)
    );

  });

  if (!filtered.length) {

    table.innerHTML = `
      <tr>
        <td colspan="8">
          No buyers found. Click "+ Add Buyer" to add one.
        </td>
      </tr>
    `;

    return;
  }

  table.innerHTML = filtered.map(function(buyer) {

    return `
      <tr>

        <td>
          <strong>${escapeHtml(buyer.name)}</strong>
          ${
            buyer.contactPerson
              ? `<br>${escapeHtml(buyer.contactPerson)}`
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
          <button onclick="editBuyer('${buyer.id}')">
            Edit
          </button>

          <button onclick="deleteBuyer('${buyer.id}')">
            Delete
          </button>
        </td>

      </tr>
    `;

  }).join("");
}


/* ============================================================
   CATEGORY
   ============================================================ */

function prFillCategories() {

  var category = document.getElementById("category");

  if (!category) return;

  var current = category.value;

  category.innerHTML =
    '<option value="">Select Product Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function(item) {

    var option = document.createElement("option");

    option.value = item;
    option.textContent = item;

    category.appendChild(option);
  });

  if (current) category.value = current;
}


function populateInterestedProducts() {

  var select =
    document.getElementById("interestedProduct");

  if (!select) return;

  var current = select.value;

  select.innerHTML =
    '<option value="">Select Product / Category</option>';

  PR_PRODUCT_CATEGORIES.forEach(function(category) {

    var option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    select.appendChild(option);
  });

  if (products.length) {

    var group =
      document.createElement("optgroup");

    group.label = "Added Products";

    products.forEach(function(product) {

      var option =
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

  if (current) select.value = current;
}


/* ============================================================
   EDIT
   ============================================================ */

function editProduct(id) {

  var product = products.find(function(p) {
    return String(p.id) === String(id);
  });

  if (!product) return;

  prFillCategories();

  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name || "";
  document.getElementById("articleNo").value = product.articleNo || "";
  document.getElementById("category").value = product.category || "";
  document.getElementById("material").value = product.material || "";
  document.getElementById("size").value = product.size || "";
  document.getElementById("weight").value = product.weight || "";
  document.getElementById("color").value = product.color || "";
  document.getElementById("availableSizes").value =
    product.availableSizes || "";
  document.getElementById("moq").value = product.moq || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("imageUrl").value = product.imageUrl || "";
  document.getElementById("specification").value =
    product.specification || "";
  document.getElementById("description").value =
    product.description || "";
  document.getElementById("productStatus").value =
    product.status || "Available";

  document.getElementById("productModalTitle").textContent =
    "Edit Product";

  document.getElementById("productModal").style.display =
    "flex";
}


function editBuyer(id) {

  var buyer = buyers.find(function(b) {
    return String(b.id) === String(id);
  });

  if (!buyer) return;

  populateInterestedProducts();

  document.getElementById("buyerId").value = buyer.id;
  document.getElementById("buyerName").value = buyer.name || "";
  document.getElementById("buyerCountry").value =
    buyer.country || "";
  document.getElementById("contactPerson").value =
    buyer.contactPerson || "";
  document.getElementById("buyerEmail").value =
    buyer.email || "";
  document.getElementById("buyerPhone").value =
    buyer.phone || "";
  document.getElementById("interestedProduct").value =
    buyer.interestedProduct || "";
  document.getElementById("buyerStatus").value =
    buyer.status || "Active";
  document.getElementById("followupDate").value =
    buyer.followupDate || "";
  document.getElementById("buyerNotes").value =
    buyer.notes || "";

  document.getElementById("buyerModalTitle").textContent =
    "Edit Buyer";

  document.getElementById("buyerModal").style.display =
    "flex";
}


/* ============================================================
   DELETE
   ============================================================ */

function deleteProduct(id) {

  if (!confirm("Delete this product?")) return;

  products = products.filter(function(product) {
    return String(product.id) !== String(id);
  });

  saveProducts();
  renderProducts();
  populateInterestedProducts();
  updateDashboard();
}


function deleteBuyer(id) {

  if (!confirm("Delete this buyer?")) return;

  buyers = buyers.filter(function(buyer) {
    return String(buyer.id) !== String(id);
  });

  saveBuyers();
  renderBuyers();
  updateDashboard();
}


/* ============================================================
   DASHBOARD
   ============================================================ */

function updateDashboard() {

  var productCount =
    document.getElementById("productCount");

  var buyerCount =
    document.getElementById("buyerCount");

  var activeBuyerCount =
    document.getElementById("activeBuyerCount");

  var followupCount =
    document.getElementById("followupCount");

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

  renderRecentProducts();
  renderRecentBuyers();
}


function renderRecentProducts() {

  var container =
   
