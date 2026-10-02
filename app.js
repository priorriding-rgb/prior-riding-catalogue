// PRIOR RIDING CRM
// Buyer + Product Storage System

var products = JSON.parse(localStorage.getItem("priorRidingProducts") || "[]");
var buyers = JSON.parse(localStorage.getItem("priorRidingBuyers") || "[]");

function saveProducts() {
  localStorage.setItem("priorRidingProducts", JSON.stringify(products));
}

function saveBuyers() {
  localStorage.setItem("priorRidingBuyers", JSON.stringify(buyers));
}

function showSection(section) {
  var sections = document.querySelectorAll(".section");

  sections.forEach(function (item) {
    item.style.display = "none";
  });

  var selected = document.getElementById(section);

  if (selected) {
    selected.style.display = "block";
  }

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.classList.remove("active");
  });

  var buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach(function (btn) {
    var text = btn.textContent.toLowerCase();

    if (
      (section === "dashboard" && text.includes("dashboard")) ||
      (section === "products" && text.includes("product")) ||
      (section === "buyers" && text.includes("buyer"))
    ) {
      btn.classList.add("active");
    }
  });

  updateDashboard();
}

function openProductModal() {
  var modal = document.getElementById("productModal");

  if (modal) {
    modal.style.display = "flex";
  }

  document.getElementById("productModalTitle").textContent = "Add Product";
}

function closeProductModal() {
  var modal = document.getElementById("productModal");

  if (modal) {
    modal.style.display = "none";
  }

  var form = document.getElementById("productForm");

  if (form) {
    form.reset();
  }

  document.getElementById("productId").value = "";
  document.getElementById("productModalTitle").textContent = "Add Product";
}

function openBuyerModal() {
  var modal = document.getElementById("buyerModal");

  if (modal) {
    modal.style.display = "flex";
  }

  document.getElementById("buyerModalTitle").textContent = "Add Buyer";
  populateInterestedProducts();
}

function closeBuyerModal() {
  var modal = document.getElementById("buyerModal");

  if (modal) {
    modal.style.display = "none";
  }

  var form = document.getElementById("buyerForm");

  if (form) {
    form.reset();
  }

  document.getElementById("buyerId").value = "";
  document.getElementById("buyerModalTitle").textContent = "Add Buyer";
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 8);
}


// ---------------- PRODUCT SAVE ----------------

function handleProductSubmit(event) {
  event.preventDefault();

  var id = document.getElementById("productId").value;

  var product = {
    id: id || generateId(),
    name: document.getElementById("productName").value.trim(),
    articleNo: document.getElementById("articleNo").value.trim(),
    category: document.getElementById("category").value.trim(),
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
    var index = products.findIndex(function (p) {
      return p.id === id;
    });

    if (index !== -1) {
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


// ---------------- BUYER SAVE ----------------

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
    var index = buyers.findIndex(function (b) {
      return b.id === id;
    });

    if (index !== -1) {
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


// ---------------- PRODUCT LIST ----------------

function renderProducts() {
  var container = document.getElementById("productList");

  if (!container) return;

  var searchInput = document.getElementById("productSearch");

  var search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  var filtered = products.filter(function (product) {
    return (
      product.name.toLowerCase().includes(search) ||
      product.articleNo.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  });

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="panel"><p>No products found. Click "+ Add Product" to add one.</p></div>';
    return;
  }

  container.innerHTML = filtered
    .map(function (product) {
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

          <p><strong>Article:</strong> ${escapeHtml(product.articleNo)}</p>

          <p><strong>Category:</strong>
            ${escapeHtml(product.category || "-")}
          </p>

          <p><strong>Material:</strong>
            ${escapeHtml(product.material || "-")}
          </p>

          <p><strong>Size:</strong>
            ${escapeHtml(product.size || "-")}
          </p>

          <p><strong>Color:</strong>
            ${escapeHtml(product.color || "-")}
          </p>

          <p><strong>MOQ:</strong>
            ${escapeHtml(product.moq || "-")}
          </p>

          <p><strong>Price:</strong>
            ${escapeHtml(product.price || "-")}
          </p>

          <p><strong>Status:</strong>
            ${escapeHtml(product.status || "-")}
          </p>

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
    })
    .join("");
}


// ---------------- BUYER LIST ----------------

function renderBuyers() {
  var table = document.getElementById("buyerTable");

  if (!table) return;

  var searchInput = document.getElementById("buyerSearch");

  var search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  var filtered = buyers.filter(function (buyer) {
    return (
      buyer.name.toLowerCase().includes(search) ||
      buyer.country.toLowerCase().includes(search) ||
      buyer.phone.toLowerCase().includes(search)
    );
  });

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8">
          No buyers found. Click "+ Add Buyer" to add one.
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML = filtered
    .map(function (buyer) {
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
    })
    .join("");
}


// ---------------- INTERESTED PRODUCT OPTIONS ----------------

function populateInterestedProducts() {
  var select = document.getElementById("interestedProduct");

  if (!select) return;

  select.innerHTML =
    '<option value="">Select Product</option>';

  products.forEach(function (product) {
    var option = document.createElement("option");

    option.value = product.name;

    option.textContent =
      product.name +
      (product.articleNo
        ? " — " + product.articleNo
        : "");

    select.appendChild(option);
  });
}


// ---------------- EDIT PRODUCT ----------------

function editProduct(id) {
  var product = products.find(function (p) {
    return p.id === id;
  });

  if (!product) return;

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

  document.getElementById("productModal").style.display = "flex";
}


// ---------------- EDIT BUYER ----------------

function editBuyer(id) {
  var buyer = buyers.find(function (b) {
    return b.id === id;
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

  document.getElementById("buyerModal").style.display = "flex";
}


// ---------------- DELETE PRODUCT ----------------

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  products = products.filter(function (product) {
    return product.id !== id;
  });

  saveProducts();

  renderProducts();
  populateInterestedProducts();
  updateDashboard();
}


// ---------------- DELETE BUYER ----------------

function deleteBuyer(id) {
  if (!confirm("Delete this buyer?")) return;

  buyers = buyers.filter(function (buyer) {
    return buyer.id !== id;
  });

  saveBuyers();

  renderBuyers();
  updateDashboard();
}


// ---------------- DASHBOARD ----------------

function updateDashboard() {
  var productCount = document.getElementById("productCount");
  var buyerCount = document.getElementById("buyerCount");
  var activeBuyerCount =
    document.getElementById("activeBuyerCount");
  var followupCount =
    document.getElementById("followupCount");

  if (productCount) {
    productCount.textContent = products.length;
  }

  if (buyerCount) {
    buyerCount.textContent = buyers.length;
  }

  if (activeBuyerCount) {
    activeBuyerCount.textContent = buyers.filter(function (buyer) {
      return buyer.status === "Active";
    }).length;
  }

  if (followupCount) {
    followupCount.textContent = buyers.filter(function (buyer) {
      return buyer.followupDate;
    }).length;
  }

  renderRecentProducts();
  renderRecentBuyers();
}


function renderRecentProducts() {
  var container = document.getElementById("recentProducts");

  if (!container) return;

  var recent = products.slice(-5).reverse();

  if (recent.length === 0) {
    container.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  container.innerHTML = recent
    .map(function (product) {
      return `
        <div style="padding:10px 0;border-bottom:1px solid #ddd;">
          <strong>${escapeHtml(product.name)}</strong>
          <br>
          <small>${escapeHtml(product.articleNo)}</small>
        </div>
      `;
    })
    .join("");
}


function renderRecentBuyers() {
  var container = document.getElementById("recentBuyers");

  if (!container) return;

  var recent = buyers.slice(-5).reverse();

  if (recent.length === 0) {
    container.innerHTML = "<p>No buyers added yet.</p>";
    return;
  }

  container.innerHTML = recent
    .map(function (buyer) {
      return `
        <div style="padding:10px 0;border-bottom:1px solid #ddd;">
          <strong>${escapeHtml(buyer.name)}</strong>
          <br>
          <small>${escapeHtml(buyer.country)}</small>
        </div>
      `;
    })
    .join("");
}


// ---------------- SAFETY ----------------

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ---------------- START APP ----------------

document.addEventListener("DOMContentLoaded", function () {

  var productForm = document.getElementById("productForm");

  if (productForm) {
    productForm.addEventListener(
      "submit",
      handleProductSubmit
    );
  }

  var buyerForm = document.getElementById("buyerForm");

  if (buyerForm) {
    buyerForm.addEventListener(
      "submit",
      handleBuyerSubmit
    );
  }

  renderProducts();
  renderBuyers();
  populateInterestedProducts();
  updateDashboard();

  showSection("dashboard");
});


// ---------------- GLOBAL FUNCTIONS ----------------

window.showSection = showSection;

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;

window.openBuyerModal = openBuyerModal;
window.closeBuyerModal = closeBuyerModal;

window.renderProducts = renderProducts;
window.renderBuyers = renderBuyers;

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

window.editBuyer = editBuyer;
window.deleteBuyer = deleteBuyer;
