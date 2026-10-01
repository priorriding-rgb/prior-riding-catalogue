let products = JSON.parse(localStorage.getItem("priorRidingProducts")) || [];
let buyers = JSON.parse(localStorage.getItem("priorRidingBuyers")) || [];

function saveData() {
  localStorage.setItem("priorRidingProducts", JSON.stringify(products));
  localStorage.setItem("priorRidingBuyers", JSON.stringify(buyers));
}

function showSection(sectionName) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active");
  });

  document.getElementById(sectionName).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.remove("active");
  });

  const buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach(button => {
    if (
      (sectionName === "dashboard" && button.textContent.includes("Dashboard")) ||
      (sectionName === "products" && button.textContent.includes("Product Catalogue")) ||
      (sectionName === "buyers" && button.textContent.includes("Buyer CRM"))
    ) {
      button.classList.add("active");
    }
  });

  updateDashboard();
  renderProducts();
  renderBuyers();
  updateProductSelect();
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {
  document.getElementById("productCount").textContent = products.length;

  document.getElementById("buyerCount").textContent = buyers.length;

  const active = buyers.filter(
    buyer => buyer.status === "Active"
  ).length;

  document.getElementById("activeBuyerCount").textContent = active;

  const followups = buyers.filter(
    buyer => buyer.followupDate
  ).length;

  document.getElementById("followupCount").textContent = followups;

  renderRecentProducts();
  renderRecentBuyers();
}


/* =========================
   PRODUCTS
========================= */

function openProductModal(product = null) {
  document.getElementById("productModal").classList.add("show");

  if (product) {
    document.getElementById("productModalTitle").textContent = "Edit Product";

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name || "";
    document.getElementById("articleNo").value = product.articleNo || "";
    document.getElementById("category").value = product.category || "";
    document.getElementById("material").value = product.material || "";
    document.getElementById("size").value = product.size || "";
    document.getElementById("weight").value = product.weight || "";
    document.getElementById("color").value = product.color || "";
    document.getElementById("availableSizes").value = product.availableSizes || "";
    document.getElementById("moq").value = product.moq || "";
    document.getElementById("price").value = product.price || "";
    document.getElementById("imageUrl").value = product.imageUrl || "";
    document.getElementById("specification").value = product.specification || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("productStatus").value =
      product.status || "Available";
  } else {
    document.getElementById("productModalTitle").textContent = "Add Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
  }
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("show");
}

document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const id =
    document.getElementById("productId").value ||
    Date.now().toString();

  const product = {
    id: id,
    name: document.getElementById("productName").value.trim(),
    articleNo: document.getElementById("articleNo").value.trim(),
    category: document.getElementById("category").value.trim(),
    material: document.getElementById("material").value.trim(),
    size: document.getElementById("size").value.trim(),
    weight: document.getElementById("weight").value.trim(),
    color: document.getElementById("color").value.trim(),
    availableSizes:
      document.getElementById("availableSizes").value.trim(),
    moq: document.getElementById("moq").value.trim(),
    price: document.getElementById("price").value.trim(),
    imageUrl: document.getElementById("imageUrl").value.trim(),
    specification:
      document.getElementById("specification").value.trim(),
    description:
      document.getElementById("description").value.trim(),
    status:
      document.getElementById("productStatus").value
  };

  const existingIndex = products.findIndex(p => p.id === id);

  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.unshift(product);
  }

  saveData();
  closeProductModal();
  renderProducts();
  updateProductSelect();
  updateDashboard();

  alert("Product saved successfully.");
});


function renderProducts() {
  const container = document.getElementById("productList");

  const search =
    (document.getElementById("productSearch")?.value || "")
      .toLowerCase()
      .trim();

  const filtered = products.filter(product =>
    [
      product.name,
      product.articleNo,
      product.category,
      product.material
    ]
      .join(" ")
      .toLowerCase()
      .includes(search)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty">
        No products found.<br><br>
        Click <b>+ Add Product</b> to create your first catalogue item.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {

    const image = product.imageUrl
      ? `<img class="product-image" src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}">`
      : `<div class="no-image">PRIOR RIDING</div>`;

    return `
      <div class="product-card">

        ${image}

        <div class="product-body">

          <div class="article">
            ARTICLE: ${escapeHtml(product.articleNo)}
          </div>

          <h3>${escapeHtml(product.name)}</h3>

          <div class="product-meta">
            ${product.category
              ? `<div><b>Category:</b> ${escapeHtml(product.category)}</div>`
              : ""}

            ${product.material
              ? `<div><b>Material:</b> ${escapeHtml(product.material)}</div>`
              : ""}

            ${product.size
              ? `<div><b>Size:</b> ${escapeHtml(product.size)}</div>`
              : ""}

            ${product.weight
              ? `<div><b>Weight:</b> ${escapeHtml(product.weight)}</div>`
              : ""}

            ${product.color
              ? `<div><b>Color:</b> ${escapeHtml(product.color)}</div>`
              : ""}

            ${product.moq
              ? `<div><
