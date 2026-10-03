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


/* ============================================================
   BASIC HELPERS
   ============================================================ */

function loadData(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const data = JSON.parse(value);
    return Array.isArray(data) ? data : [];
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
  return Date.now().toString() + "_" +
    Math.random().toString(36).substring(2, 9);
}


function getValue(id) {
  const element = document.getElementById(id);
  return element ? String(element.value || "").trim() : "";
}


function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value == null ? "" : value;
  }
}


function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function today() {
  return new Date().toISOString().slice(0, 10);
}


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

  showSection("dashboard");

  console.log("PRIOR RIDING CRM loaded successfully.");

});


/* ============================================================
   FORM SETUP
   ============================================================ */

function setupForms() {

  const productForm = document.getElementById("productForm");

  if (productForm) {
    productForm.addEventListener("submit", function (event) {
      event.preventDefault();
      saveProduct();
    });
  }


  const buyerForm = document.getElementById("buyerForm");

  if (buyerForm) {
    buyerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      saveBuyer();
    });
  }


  const paymentForm = document.getElementById("paymentForm");

  if (paymentForm) {
    paymentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      savePayment();
    });
  }


  const proformaForm = document.getElementById("proformaForm");

  if (proformaForm) {
    proformaForm.addEventListener("submit", function (event) {
      event.preventDefault();
      createProforma();
    });
  }


  const letterForm = document.getElementById("letterForm");

  if (letterForm) {
    letterForm.addEventListener("submit", function (event) {
      event.preventDefault();
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


  if (productCount) {
    productCount.textContent = products.length;
  }


  if (buyerCount) {
    buyerCount.textContent = buyers.length;
  }


  if (activeBuyerCount) {
    activeBuyerCount.textContent =
      buyers.filter(function (buyer) {
        return buyer.status === "Active";
      }).length;
  }


  if (followupCount) {
    followupCount.textContent =
      buyers.filter(function (buyer) {
        return !!buyer.followupDate;
      }).length;
  }


  updateStorageCounts();
}


/* ============================================================
   CATEGORY DROPDOWNS
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


  if (current) {
    select.value = current;
  }
}


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

      option.value = product.name || "";

      option.textContent =
        (product.name || "Product") +
        (
          product.articleNo
            ? " — " + product.articleNo
            : ""
        );

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

  const modal =
    document.getElementById("productModal");

  const form =
    document.getElementById("productForm");

  if (!modal || !form) return;

  form.reset();

  setValue("productId", "");

  setValue("productStatus", "Available");


  const title =
    document.getElementById("productModalTitle");


  if (id) {

    const product =
      products.find(function (item) {
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
      products.findIndex(function (item) {
        return String(item.id) === String(id);
      });


    if (index !== -1) {
      products[index] = product;
    }

  } else {

    products.unshift(product);
  }


  saveData(PR_KEYS.products, products);

  closeProductModal();

  refreshAll();

  alert("Product saved successfully.");
}


/* ============================================================
   PRODUCT EDIT / DELETE
   ============================================================ */

function editProduct(id) {
  openProductModal(id);
}


function deleteProduct(id) {

  if (!confirm("Delete this product?")) {
    return;
  }


  products =
    products.filter(function (product) {
      return String(product.id) !== String(id);
    });


  saveData(PR_KEYS.products, products);

  refreshAll();
}


/* ============================================================
   PRODUCT RENDER
   ============================================================ */

function renderProducts() {

  const container =
    document.getElementById("productList");

  if (!container) return;


  const searchInput =
    document.getElementById("productSearch");


  const search =
    searchInput
      ? String(searchInput.value || "").toLowerCase().trim()
      : "";


  const filtered =
    products.filter(function (product) {

      const text =
        [
          product.name,
          product.articleNo,
          product.category,
          product.material,
          product.color
        ]
          .join(" ")
          .toLowerCase();


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
                    border-radius:10px;
                    margin-bottom:12px;
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
              onclick="editProduct('${escapeHtml(product.id)}')"
            >
              Edit
            </button>

            <button
              type="button"
              class="primary-btn"
              onclick="deleteProduct('${escapeHtml(product.id)}')"
            >
              Delete
            </button>

          </div>

        </div>
      `;
    })
    .join("");
}


/* ============================================================
   BUYER MODAL
   ============================================================ */

function openBuyerModal(id) {

  const modal =
    document.getElementById("buyerModal");

  const form =
    document.getElementById("buyerForm");

  if (!modal || !form) return;


  form.reset();

  setValue("buyerId", "");
  setValue("buyerStatus", "Active");


  const title =
    document.getElementById("buyerModalTitle");


  if (id) {

    const buyer =
      buyers.find(function (item) {
        return String(item.id) === String(id);
      });


    if (!buyer) return;


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

  const modal =
    document.getElementById("buyerModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


/* ============================================================
   SAVE BUYER
   ============================================================ */

function saveBuyer() {

  const id =
    getValue("buyerId");


  const buyer = {

    id: id || generateId(),

    name:
      getValue("buyerName"),

    country:
      getValue("buyerCountry"),

    contactPerson:
      getValue("contactPerson"),

    email:
      getValue("buyerEmail"),

    phone:
      getValue("buyerPhone"),

    interestedProduct:
      getValue("interestedProduct"),

    status:
      getValue("buyerStatus") || "Active",

    followupDate:
      getValue("followupDate"),

    notes:
      getValue("buyerNotes"),

    updatedAt:
      new Date().toISOString()
  };


  if (!buyer.name || !buyer.country) {

    alert(
      "Please enter Buyer / Company Name and Country."
    );

    return;
  }


  if (id) {

    const index =
      buyers.findIndex(function (item) {
        return String(item.id) === String(id);
      });


    if (index !== -1) {
      buyers[index] = buyer;
    }

  } else {

    buyers.unshift(buyer);
  }


  saveData(PR_KEYS.buyers, buyers);

  closeBuyerModal();

  refreshAll();

  alert("Buyer saved successfully.");
}


/* ============================================================
   BUYER EDIT / DELETE
   ============================================================ */

function editBuyer(id) {
  openBuyerModal(id);
}


function deleteBuyer(id) {

  if (!confirm("Delete this buyer?")) {
    return;
  }


  buyers =
    buyers.filter(function (buyer) {
      return String(buyer.id) !== String(id);
    });


  saveData(PR_KEYS.buyers, buyers);

  refreshAll();
}


/* ============================================================
   BUYER RENDER
   ============================================================ */

function renderBuyers() {

  const table =
    document.getElementById("buyerTable");

  if (!table) return;


  const input =
    document.getElementById("buyerSearch");


  const search =
    input
      ? String(input.value || "").toLowerCase().trim()
      : "";


  const filtered =
    buyers.filter(function (buyer) {

      const text =
        [
          buyer.name,
          buyer.country,
          buyer.contactPerson,
          buyer.email,
          buyer.phone,
          buyer.interestedProduct,
          buyer.status
        ]
          .join(" ")
          .toLowerCase();


      return text.includes(search);
    });


  if (!filtered.length) {

    table.innerHTML = `
      <tr>
        <td colspan="8">
          No buyers found.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    filtered.map(function (buyer) {

      return `
        <tr>

          <td>
            <strong>
              ${escapeHtml(buyer.name)}
            </strong>
            ${
              buyer.contactPerson
                ? `<br><small>${escapeHtml(buyer.contactPerson)}</small>`
                : ""
            }
          </td>

          <td>
            ${escapeHtml(buyer.country)}
          </td>

          <td>
            ${escapeHtml(buyer.email || "-")}
          </td>

          <td>
            ${escapeHtml(buyer.phone || "-")}
          </td>

          <td>
            ${escapeHtml(buyer.interestedProduct || "-")}
          </td>

          <td>
            ${escapeHtml(buyer.status || "-")}
          </td>

          <td>
            ${escapeHtml(buyer.followupDate || "-")}
          </td>

          <td>

            <button
              type="button"
              class="secondary-btn"
              onclick="editBuyer('${escapeHtml(buyer.id)}')"
            >
              Edit
            </button>

            <button
              type="button"
              class="primary-btn"
              onclick="deleteBuyer('${escapeHtml(buyer.id)}')"
            >
              Delete
            </button>

          </td>

        </tr>
      `;
    })
    .join("");
}


/* ============================================================
   RECENT PRODUCTS
   ============================================================ */

function renderRecentProducts() {

  const container =
    document.getElementById("recentProducts");

  if (!container) return;


  const recent =
    products.slice(0, 5);


  if (!recent.length) {

    container.innerHTML =
      "<p>No products added yet.</p>";

    return;
  }


  container.innerHTML =
    recent.map(function (product) {

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
    })
    .join("");
}


/* ============================================================
   RECENT BUYERS
   ============================================================ */

function renderRecentBuyers() {

  const container =
    document.getElementById("recentBuyers");

  if (!container) return;


  const recent =
    buyers.slice(0, 5);


  if (!recent.length) {

    container.innerHTML =
      "<p>No buyers added yet.</p>";

    return;
  }


  container.innerHTML =
    recent.map(function (buyer) {

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
    })
    .join("");
}


/* ============================================================
   BUYER SELECTS
   ============================================================ */

function populateBuyerSelects() {

  const selects = [
    "paymentBuyer",
    "proformaBuyer"
  ];


  selects.forEach(function (id) {

    const select =
      document.getElementById(id);

    if (!select) return;


    const current =
      select.value;


    select.innerHTML =
      '<option value="">Select Buyer</option>';


    buyers.forEach(function (buyer) {

      const option =
        document.createElement("option");

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


/* ============================================================
   PRODUCT SELECT
   ============================================================ */

function populateProductSelects() {

  const select =
    document.getElementById("proformaProduct");

  if (!select) return;


  const current =
    select.value;


  select.innerHTML =
    '<option value="">Select Product</option>';


  products.forEach(function (product) {

    const option =
      document.createElement("option");

    option.value = product.id;

    option.textContent =
      product.name +
      (
        product.articleNo
          ? " — " + product.articleNo
          : ""
      );


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

  const modal =
    document.getElementById("paymentModal");

  const form =
    document.getElementById("paymentForm");

  if (!modal) return;


  if (form) {
    form.reset();
  }


  setValue("paymentDate", today());

  modal.style.display = "flex";
  modal.classList.add("show");

  populateBuyerSelects();
}


function prClosePayment() {

  const modal =
    document.getElementById("paymentModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


function savePayment() {

  const payment = {

    id: generateId(),

    buyerId:
      getValue("paymentBuyer"),

    bankName:
      getValue("paymentBankName"),

    proformaNo:
      getValue("paymentProformaNo"),

    foreignAmount:
      getValue("paymentForeignAmount"),

    currency:
      getValue("paymentForeignCurrency"),

    paymentMode:
      getValue("paymentMode"),

    pkrAmount:
      getValue("paymentPkrAmount"),

    paymentDate:
      getValue("paymentDate") || today(),

    reference:
      getValue("paymentReference"),

    notes:
      getValue("paymentNotes"),

    createdAt:
      new Date().toISOString()
  };


  if (!payment.buyerId) {

    alert("Please select a buyer.");

    return;
  }


  if (!payment.foreignAmount) {

    alert("Please enter payment amount.");

    return;
  }


  payments.unshift(payment);

  saveData(PR_KEYS.payments, payments);

  prClosePayment();

  refreshAll();

  alert("Payment saved successfully.");
}


/* ============================================================
   PROFORMA
   ============================================================ */

function openProformaModal() {

  const modal =
    document.getElementById("proformaModal");

  const form =
    document.getElementById("proformaForm");

  if (!modal) return;


  if (form) {
    form.reset();
  }


  setValue("proformaQty", "1");
  setValue("proformaUnitPrice", "0");
  setValue("proformaDate", today());


  populateBuyerSelects();
  populateProductSelects();


  modal.style.display = "flex";
  modal.classList.add("show");
}


function prCloseProforma() {

  const modal =
    document.getElementById("proformaModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


function createProforma() {

  const buyerId =
    getValue("proformaBuyer");

  const productId =
    getValue("proformaProduct");


  if (!buyerId || !productId) {

    alert("Please select Buyer and Product.");

    return;
  }


  const buyer =
    buyers.find(function (item) {
      return String(item.id) === String(buyerId);
    });


  const product =
    products.find(function (item) {
      return String(item.id) === String(productId);
    });


  if (!buyer || !product) {

    alert("Buyer or Product not found.");

    return;
  }


  const qty =
    Number(getValue("proformaQty") || 0);

  const unitPrice =
    Number(getValue("proformaUnitPrice") || 0);

  const total =
    qty * unitPrice;


  const proforma = {

    id: generateId(),

    number:
      "PI-" +
      String(proformas.length + 1).padStart(4, "0"),

    buyerId:
      buyer.id,

    buyerName:
      buyer.name,

    productId:
      product.id,

    productName:
      product.name,

    articleNo:
      product.articleNo,

    quantity:
      qty,

    unitPrice:
      unitPrice,

    total:
      total,

    date:
      getValue("proformaDate") || today(),

    createdAt:
      new Date().toISOString()
  };


  proformas.unshift(proforma);

  saveData(PR_KEYS.proformas, proformas);

  prCloseProforma();

  printProforma(proforma);
}


/* ============================================================
   PROFORMA LETTER
   ============================================================ */

function openProformaLetterModal() {

  const modal =
    document.getElementById("letterModal");

  const form =
    document.getElementById("letterForm");

  if (!modal) return;


  if (form) {
    form.reset();
  }


  setValue("letterDate", today());
  setValue("letterSubject", "Proforma Invoice");


  modal.style.display = "flex";
  modal.classList.add("show");
}


function prCloseLetter() {

  const modal =
    document.getElementById("letterModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


function createProformaLetter() {

  const buyer =
    getValue("letterBuyer");

  const subject =
    getValue("letterSubject");

  const message =
    getValue("letterMessage");


  if (!buyer || !message) {

    alert("Please enter Buyer and Message.");

    return;
  }


  const letter = {

    id:
      generateId(),

    buyer:
      buyer,

    date:
      getValue("letterDate") || today(),

    subject:
      subject || "Proforma Invoice",

    message:
      message,

    createdAt:
      new Date().toISOString()
  };


  letters.unshift(letter);

  saveData(PR_KEYS.letters, letters);

  prCloseLetter();

  printLetter(letter);
}


/* ============================================================
   PRINT PROFORMA
   ============================================================ */

function printProforma(proforma) {

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHtml(proforma.number)}</title>
<style>
body {
  font-family: Arial, sans-serif;
  padding: 40px;
  color: #222;
}
h1 {
  margin-bottom: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
}
th, td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
}
.total {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}
</style>
</head>
<body>

<h1>PRIOR RIDING</h1>
<p>International Buyer CRM</p>

<h2>PROFORMA INVOICE</h2>

<p><strong>Invoice No:</strong> ${escapeHtml(proforma.number)}</p>
<p><strong>Date:</strong> ${escapeHtml(proforma.date)}</p>
<p><strong>Buyer:</strong> ${escapeHtml(proforma.buyerName)}</p>

<table>
<tr>
<th>Product</th>
<th>Article</th>
<th>Quantity</th>
<th>Unit Price</th>
<th>Total</th>
</tr>

<tr>
<td>${escapeHtml(proforma.productName)}</td>
<td>${escapeHtml(proforma.articleNo)}</td>
<td>${escapeHtml(proforma.quantity)}</td>
<td>${escapeHtml(proforma.unitPrice)}</td>
<td>${escapeHtml(proforma.total)}</td>
</tr>
</table>

<div class="total">
Grand Total: ${escapeHtml(proforma.total)}
</div>

<p style="margin-top:50px;">
PRIOR RIDING<br>
Sialkot, Pakistan
</p>

<script>
window.onload = function() {
  window.print();
};
</script>

</body>
</html>
`;


  openPrintWindow(html);
}


/* ============================================================
   PRINT LETTER
   ============================================================ */

function printLetter(letter) {

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>PRIOR RIDING Letter</title>
<style>
body {
  font-family: Arial, sans-serif;
  padding: 50px;
  line-height: 1.7;
}
h1 {
  margin-bottom: 0;
}
.date {
  margin-top: 30px;
}
.message {
  white-space: pre-wrap;
  margin-top: 30px;
}
</style>
</head>
<body>

<h1>PRIOR RIDING</h1>
<p>International Buyer CRM</p>

<p class="date">
Date: ${escapeHtml(letter.date)}
</p>

<h2>${escapeHtml(letter.subject)}</h2>

<p>
Dear ${escapeHtml(letter.buyer)},
</p>

<div class="message">
${escapeHtml(letter.message)}
</div>

<p style="margin-top:50px;">
Best Regards,<br>
<strong>PRIOR RIDING</strong><br>
Sialkot, Pakistan
</p>

<script>
window.onload = function() {
  window.print();
};
</script>

</body>
</html>
`;


  openPrintWindow(html);
}


/* ============================================================
   PRINT WINDOW
   ============================================================ */

function openPrintWindow(html) {

  const printWindow =
    window.open("", "_blank");

  if (!printWindow) {

    alert(
      "Please allow pop-ups for printing."
    );

    return;
  }


  printWindow.document.open();

  printWindow.document.write(html);

  printWindow.document.close();
}


/* ============================================================
   DASHBOARD TOOLS
   ============================================================ */

function openDashboardTool(type) {

  const panel =
    document.getElementById("dashboardToolPanel");

  const title =
    document.getElementById("dashboardToolTitle");

  const body =
    document.getElementById("dashboardToolBody");


  if (!panel || !title || !body) return;


  panel.style.display = "block";


  if (type === "performance") {

    title.textContent =
      "📊 Performance Wise";

    body.innerHTML = `
      <div class="stats">

        <div class="stat-card">
          <span>Products</span>
          <strong>${products.length}</strong>
        </div>

        <div class="stat-card">
          <span>Total Buyers</span>
          <strong>${buyers.length}</strong>
        </div>

        <div class="stat-card">
          <span>Payments</span>
          <strong>${payments.length}</strong>
        </div>

        <div class="stat-card">
          <span>Proformas</span>
          <strong>${proformas.length}</strong>
        </div>

      </div>
    `;

    return;
  }


  if (type === "calc") {

    title.textContent =
      "🧮 Calculation Breakdown";

    body.innerHTML = `
      <div class="panel">

        <div class="field">
          <label>Quantity</label>
          <input id="calcQty" type="number" value="1">
        </div>

        <div class="field">
          <label>Unit Price</label>
          <input id="calcPrice" type="number" step="0.01" value="0">
        </div>

        <button
          type="button"
          class="primary-btn"
          onclick="calculateBreakdown()"
        >
          Calculate
        </button>

        <h3 id="calcResult">
          Total: 0.00
        </h3>

      </div>
    `;

    return;
  }


  if (type === "paymentMode") {

    title.textContent =
      "💳 Payment Mode";

    const counts = {};

    payments.forEach(function (payment) {

      const mode =
        payment.paymentMode || "Other";

      counts[mode] =
        (counts[mode] || 0) + 1;
    });


    body.innerHTML =
      Object.keys(counts).length
        ? Object.keys(counts).map(function (mode) {

            return `
              <div class="panel">
                <strong>${escapeHtml(mode)}</strong>
                <p>${counts[mode]} payment(s)</p>
              </div>
            `;

          }).join("")
        : "<p>No payments recorded yet.</p>";

    return;
  }


  if (type === "payment") {

    title.textContent =
      "💰 Add Payment";

    body.innerHTML = `
      <p>Add a new payment record.</p>
      <button
        type="button"
        class="primary-btn"
        onclick="closeDashboardTool(); openPaymentModal();"
      >
        Add Payment
      </button>
    `;

    return;
  }


  if (type === "proforma") {

    title.textContent =
      "🧾 Add Proforma";

    body.innerHTML = `
      <p>Create a new proforma invoice.</p>
      <button
        type="button"
        class="primary-btn"
        onclick="closeDashboardTool(); openProformaModal();"
      >
        Add Proforma
      </button>
    `;

    return;
  }


  if (type === "proformaLetter") {

    title.textContent =
      "✉️ Add Proforma Letter";

    body.innerHTML = `
      <p>Create a new proforma letter.</p>
      <button
        type="button"
        class="primary-btn"
        onclick="closeDashboardTool(); openProformaLetterModal();"
      >
        Add Proforma Letter
      </button>
    `;

    return;
  }


  if (type === "catalogue") {

    title.textContent =
      "📚 Product Catalogue";

    body.innerHTML = `
      <p>
        You currently have
        <strong>${products.length}</strong>
        product(s).
      </p>

      <button
        type="button"
        class="primary-btn"
        onclick="closeDashboardTool(); showSection('products');"
      >
        Open Catalogue
      </button>
    `;

    return;
  }
}


function closeDashboardTool() {

  const panel =
    document.getElementById("dashboardToolPanel");

  if (panel) {
    panel.style.display = "none";
  }
}


function calculateBreakdown() {

  const qty =
    Number(getValue("calcQty") || 0);

  const price =
    Number(getValue("calcPrice") || 0);

  const total =
    qty * price;


  const result =
    document.getElementById("calcResult");


  if (result) {
    result.textContent =
      "Total: " +
      total.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
  }
}


/* ============================================================
   PDF / PRINT
   ============================================================ */

function printToPdf() {
  window.print();
}


/* ============================================================
   STORAGE / BACKUP
   ============================================================ */

function updateStorageCounts() {

  const productCount =
    document.getElementById("storageProductCount");

  const buyerCount =
    document.getElementById("storageBuyerCount");

  const paymentCount =
    document.getElementById("storagePaymentCount");

  const proformaCount =
    document.getElementById("storageProformaCount");


  if (productCount) {
    productCount.textContent = products.length;
  }

  if (buyerCount) {
    buyerCount.textContent = buyers.length;
  }

  if (paymentCount) {
    paymentCount.textContent = payments.length;
  }

  if (proformaCount) {
    proformaCount.textContent = proformas.length;
  }
}


function openStoragePanel() {

  toggleSettingsMenu();

  updateStorageCounts();


  const modal =
    document.getElementById("storageModal");

  if (!modal) return;


  modal.style.display = "flex";
  modal.classList.add("show");
}


function closeStoragePanel() {

  const modal =
    document.getElementById("storageModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


/* ============================================================
   EXPORT BACKUP
   ============================================================ */

function exportAllData() {

  const data = {

    app:
      "PRIOR RIDING — International Buyer CRM",

    version:
      "1.0",

    exportedAt:
      new Date().toISOString(),

    products:
      loadData(PR_KEYS.products),

    buyers:
      loadData(PR_KEYS.buyers),

    payments:
      loadData(PR_KEYS.payments),

    proformas:
      loadData(PR_KEYS.proformas),

    letters:
      loadData(PR_KEYS.letters)

  };


  const blob =
    new Blob(
      [JSON.stringify(data, null, 2)],
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


/* ============================================================
   RESTORE BACKUP
   ============================================================ */

function restoreAllData(event) {

  const file =
    event.target.files &&
    event.target.files[0];


  if (!file) return;


  const reader =
    new FileReader();


  reader.onload = function (result) {

    try {

      const data =
        JSON.parse(result.target.result);


      if (Array.isArray(data.products)) {
        saveData(
          PR_KEYS.products,
          data.products
        );
      }


      if (Array.isArray(data.buyers)) {
        saveData(
          PR_KEYS.buyers,
          data.buyers
        );
      }


      if (Array.isArray(data.payments)) {
        saveData(
          PR_KEYS.payments,
          data.payments
        );
      }


      if (Array.isArray(data.proformas)) {
        saveData(
          PR_KEYS.proformas,
          data.proformas
        );
      }


      if (Array.isArray(data.letters)) {
        saveData(
          PR_KEYS.letters,
          data.letters
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
   SETTINGS MENU
   ============================================================ */

function toggleSettingsMenu() {

  const menu =
    document.getElementById("settingsMenu");

  if (!menu) return;


  menu.style.display =
    menu.style.display === "none"
      ? "block"
      : "none";
}


function showAppInfo() {

  toggleSettingsMenu();


  const modal =
    document.getElementById("appInfoModal");

  if (!modal) return;


  modal.style.display = "flex";
  modal.classList.add("show");
}


function closeAppInfo() {

  const modal =
    document.getElementById("appInfoModal");

  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}


/* ============================================================
   OUTSIDE CLICK
   ============================================================ */

function setupOutsideClick() {

  document.addEventListener("click", function (event) {

    const menu =
      document.getElementById("settingsMenu");

    const button =
      document.querySelector(".menu-btn");


    if (
      menu &&
      menu.style.display === "block" &&
      !menu.contains(event.target) &&
      (!button || !button.contains(event.target))
    ) {
      menu.style.display = "none";
    }

  });
}


/* ============================================================
   KEYBOARD
   ============================================================ */

function setupKeyboard() {

  document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") return;


    closeProductModal();
    closeBuyerModal();
    prClosePayment();
    prCloseProforma();
    prCloseLetter();
    closeStoragePanel();
    closeAppInfo();
    closeDashboardTool();

  });
}


/* ============================================================
   GLOBAL COMPATIBILITY
   ============================================================ */

window.showSection = showSection;

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.renderProducts = renderProducts;

window.openBuyerModal = openBuyerModal;
window.closeBuyerModal = closeBuyerModal;
window.saveBuyer = saveBuyer;
window.editBuyer = editBuyer;
window.deleteBuyer = deleteBuyer;
window.renderBuyers = renderBuyers;

window.openPaymentModal = openPaymentModal;
window.prClosePayment = prClosePayment;
window.savePayment = savePayment;

window.openProformaModal = openProformaModal;
window.prCloseProforma = prCloseProforma;
window.createProforma = createProforma;

window.openProformaLetterModal =
  openProformaLetterModal;

window.prCloseLetter = prCloseLetter;
window.createProformaLetter =
  createProformaLetter;

window.openDashboardTool =
  openDashboardTool;

window.closeDashboardTool =
  closeDashboardTool;

window.calculateBreakdown =
  calculateBreakdown;

window.printToPdf =
  printToPdf;

window.toggleSettingsMenu =
  toggleSettingsMenu;

window.openStoragePanel =
  openStoragePanel;

window.closeStoragePanel =
  closeStoragePanel;

window.exportAllData =
  exportAllData;

window.restoreAllData =
  restoreAllData;

window.showAppInfo =
  showAppInfo;

window.closeAppInfo =
  closeAppInfo;


/* ============================================================
   END
   ============================================================ */
