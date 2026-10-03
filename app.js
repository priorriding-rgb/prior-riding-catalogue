/* ============================================================
   PRIOR RIDING — INTERNATIONAL BUYER CRM
   COMPLETE REPAIRED APP.JS
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
   GLOBAL DATA
   ============================================================ */

let products = [];
let buyers = [];
let payments = [];
let proformas = [];
let letters = [];


/* ============================================================
   STORAGE HELPERS
   ============================================================ */

function loadData(key) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const data = JSON.parse(raw);

    return Array.isArray(data) ? data : [];

  } catch (error) {

    console.error(
      "PRIOR RIDING storage read error:",
      error
    );

    return [];
  }
}


function saveData(key, data) {
  try {

    localStorage.setItem(
      key,
      JSON.stringify(Array.isArray(data) ? data : [])
    );

    return true;

  } catch (error) {

    console.error(
      "PRIOR RIDING storage save error:",
      error
    );

    alert(
      "Data could not be saved. Please check your browser storage."
    );

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


/* ============================================================
   ID / VALUE HELPERS
   ============================================================ */

function generateId() {

  return (
    Date.now().toString(36) +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 11)
  );
}


function getValue(id) {

  const element =
    document.getElementById(id);

  if (!element) {
    return "";
  }

  return String(
    element.value == null
      ? ""
      : element.value
  ).trim();
}


function setValue(id, value) {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  element.value =
    value == null
      ? ""
      : value;
}


function getElement(id) {
  return document.getElementById(id);
}


function today() {

  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function escapeHtml(value) {

  return String(
    value == null ? "" : value
  )
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

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadAllData();

    setupForms();
    setupOutsideClick();
    setupKeyboard();
    setupSearchInputs();

    populateCategories();
    populateInterestedProducts();

    refreshAll();

    showSection("dashboard");

    console.log(
      "PRIOR RIDING CRM loaded successfully."
    );
  }
);


/* ============================================================
   FORM SETUP
   ============================================================ */

function setupForms() {

  const productForm =
    getElement("productForm");

  if (productForm) {

    productForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        saveProduct();
      }
    );
  }


  const buyerForm =
    getElement("buyerForm");

  if (buyerForm) {

    buyerForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        saveBuyer();
      }
    );
  }


  const paymentForm =
    getElement("paymentForm");

  if (paymentForm) {

    paymentForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        savePayment();
      }
    );
  }


  const proformaForm =
    getElement("proformaForm");

  if (proformaForm) {

    proformaForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        createProforma();
      }
    );
  }


  const letterForm =
    getElement("letterForm");

  if (letterForm) {

    letterForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        createProformaLetter();
      }
    );
  }
}


/* ============================================================
   SEARCH SETUP
   ============================================================ */

function setupSearchInputs() {

  const productSearch =
    getElement("productSearch");

  if (productSearch) {

    productSearch.addEventListener(
      "input",
      function () {
        renderProducts();
      }
    );
  }


  const buyerSearch =
    getElement("buyerSearch");

  if (buyerSearch) {

    buyerSearch.addEventListener(
      "input",
      function () {
        renderBuyers();
      }
    );
  }
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function showSection(sectionId) {

  document.querySelectorAll(
    ".section"
  ).forEach(
    function (section) {

      section.classList.remove(
        "active"
      );

      section.style.display =
        "none";
    }
  );


  const section =
    getElement(sectionId);

  if (section) {

    section.classList.add(
      "active"
    );

    section.style.display =
      "block";
  }


  document.querySelectorAll(
    ".nav-btn"
  ).forEach(
    function (button) {

      button.classList.remove(
        "active"
      );

      const text =
        String(
          button.textContent || ""
        ).toLowerCase();


      if (
        (
          sectionId === "dashboard" &&
          text.includes("dashboard")
        ) ||
        (
          sectionId === "products" &&
          text.includes("product")
        ) ||
        (
          sectionId === "buyers" &&
          text.includes("buyer")
        )
      ) {

        button.classList.add(
          "active"
        );
      }
    }
  );


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

  loadAllData();

  populateCategories();
  populateInterestedProducts();

  renderProducts();
  renderBuyers();

  renderRecentProducts();
  renderRecentBuyers();

  updateStats();

  populateBuyerSelects();
  populateProductSelects();

}


/* ============================================================
   DASHBOARD STATS
   ============================================================ */

function updateStats() {

  const productCount =
    getElement("productCount");

  const buyerCount =
    getElement("buyerCount");

  const activeBuyerCount =
    getElement("activeBuyerCount");

  const followupCount =
    getElement("followupCount");


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
      buyers.filter(
        function (buyer) {

          return (
            String(
              buyer.status || ""
            ).toLowerCase() ===
            "active"
          );
        }
      ).length;
  }


  if (followupCount) {

    followupCount.textContent =
      buyers.filter(
        function (buyer) {

          return Boolean(
            buyer.followupDate
          );
        }
      ).length;
  }


  updateStorageCounts();
}


/* ============================================================
   CATEGORY DROPDOWNS
   ============================================================ */

function populateCategories() {

  const select =
    getElement("category");

  if (!select) {
    return;
  }


  const current =
    select.value;


  select.innerHTML =
    '<option value="">Select Product Category</option>';


  PR_PRODUCT_CATEGORIES.forEach(
    function (category) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        category;

      option.textContent =
        category;

      select.appendChild(
        option
      );
    }
  );


  if (current) {
    select.value = current;
  }
}


/* ============================================================
   BUYER INTERESTED PRODUCT
   ============================================================ */

function populateInterestedProducts() {

  const select =
    getElement("interestedProduct");

  if (!select) {
    return;
  }


  const current =
    select.value;


  select.innerHTML =
    '<option value="">Select Product / Category</option>';


  PR_PRODUCT_CATEGORIES.forEach(
    function (category) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        category;

      option.textContent =
        category;

      select.appendChild(
        option
      );
    }
  );


  if (products.length > 0) {

    const group =
      document.createElement(
        "optgroup"
      );

    group.label =
      "Added Products";


    products.forEach(
      function (product) {

        if (!product.name) {
          return;
        }


        const option =
          document.createElement(
            "option"
          );

        option.value =
          product.name;


        option.textContent =
          product.name +
          (
            product.articleNo
              ? " — " +
                product.articleNo
              : ""
          );


        group.appendChild(
          option
        );
      }
    );


    select.appendChild(
      group
    );
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
    getElement("productModal");

  const form =
    getElement("productForm");

  if (!modal) {
    return;
  }


  if (form) {
    form.reset();
  }


  setValue(
    "productId",
    ""
  );

  setValue(
    "productStatus",
    "Available"
  );


  const title =
    getElement(
      "productModalTitle"
    );


  if (id) {

    const product =
      products.find(
        function (item) {

          return (
            String(item.id) ===
            String(id)
          );
        }
      );


    if (!product) {

      alert(
        "Product not found."
      );

      return;
    }


    setValue(
      "productId",
      product.id
    );

    setValue(
      "productName",
      product.name
    );

    setValue(
      "articleNo",
      product.articleNo
    );

    setValue(
      "category",
      product.category
    );

    setValue(
      "material",
      product.material
    );

    setValue(
      "size",
      product.size
    );

    setValue(
      "weight",
      product.weight
    );

    setValue(
      "color",
      product.color
    );

    setValue(
      "availableSizes",
      product.availableSizes
    );

    setValue(
      "moq",
      product.moq
    );

    setValue(
      "price",
      product.price
    );

    setValue(
      "imageUrl",
      product.imageUrl
    );

    setValue(
      "specification",
      product.specification
    );

    setValue(
      "description",
      product.description
    );

    setValue(
      "productStatus",
      product.status ||
      "Available"
    );


    if (title) {

      title.textContent =
        "Edit Product";
    }

  } else {

    if (title) {

      title.textContent =
        "Add Product";
    }
  }


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function closeProductModal() {

  const modal =
    getElement("productModal");

  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   SAVE PRODUCT
   ============================================================ */

function saveProduct() {

  const id =
    getValue("productId");


  const name =
    getValue("productName");

  const articleNo =
    getValue("articleNo");


  if (!name || !articleNo) {

    alert(
      "Please enter Product Name and Article / Product No."
    );

    return;
  }


  const product = {

    id:
      id || generateId(),

    name:
      name,

    articleNo:
      articleNo,

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
      getValue("productStatus") ||
      "Available",

    updatedAt:
      new Date().toISOString()
  };


  if (id) {

    const index =
      products.findIndex(
        function (item) {

          return (
            String(item.id) ===
            String(id)
          );
        }
      );


    if (index !== -1) {

      products[index] =
        product;

    } else {

      products.unshift(
        product
      );
    }

  } else {

    products.unshift(
      product
    );
  }


  if (
    saveData(
      PR_KEYS.products,
      products
    )
  ) {

    closeProductModal();

    refreshAll();

    alert(
      "Product saved successfully."
    );
  }
}


/* ============================================================
   PRODUCT EDIT / DELETE
   ============================================================ */

function editProduct(id) {

  openProductModal(id);
}


function deleteProduct(id) {

  const product =
    products.find(
      function (item) {

        return (
          String(item.id) ===
          String(id)
        );
      }
    );


  if (!product) {

    alert(
      "Product not found."
    );

    return;
  }


  if (
    !confirm(
      'Delete "' +
      product.name +
      '"?'
    )
  ) {

    return;
  }


  products =
    products.filter(
      function (item) {

        return (
          String(item.id) !==
          String(id)
        );
      }
    );


  if (
    saveData(
      PR_KEYS.products,
      products
    )
  ) {

    refreshAll();
  }
}


/* ============================================================
   PRODUCT RENDER
   ============================================================ */

function renderProducts() {

  const container =
    getElement("productList");

  if (!container) {
    return;
  }


  const searchInput =
    getElement("productSearch");


  const search =
    searchInput
      ? String(
          searchInput.value || ""
        )
          .toLowerCase()
          .trim()
      : "";


  const filtered =
    products.filter(
      function (product) {

        const text =
          [
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
            .toLowerCase();


        return text.includes(
          search
        );
      }
    );


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
    filtered.map(
      function (product) {

        const image =
          product.imageUrl
            ? `
              <img
                src="${escapeAttribute(product.imageUrl)}"
                alt="${escapeAttribute(product.name)}"
                loading="lazy"
                style="
                  width:100%;
                  max-height:220px;
                  object-fit:contain;
                  border-radius:10px;
                  margin-bottom:12px;
                "
                onerror="this.style.display='none';"
              >
            `
            : "";


        const specification =
          product.specification
            ? `
              <p>
                <strong>Specification:</strong><br>
                ${escapeHtml(
                  product.specification
                )}
              </p>
            `
            : "";


        const description =
          product.description
            ? `
              <p>
                <strong>Description:</strong><br>
                ${escapeHtml(
                  product.description
                )}
              </p>
            `
            : "";


        return `
          <div class="panel product-card">

            ${image}

            <h3>
              ${escapeHtml(
                product.name
              )}
            </h3>

            <p>
              <strong>Article:</strong>
              ${escapeHtml(
                product.articleNo
              )}
            </p>

            <p>
              <strong>Category:</strong>
              ${escapeHtml(
                product.category || "-"
              )}
            </p>

            <p>
              <strong>Material:</strong>
              ${escapeHtml(
                product.material || "-"
              )}
            </p>

            <p>
              <strong>Size:</strong>
              ${escapeHtml(
                product.size || "-"
              )}
            </p>

            <p>
              <strong>Weight:</strong>
              ${escapeHtml(
                product.weight || "-"
              )}
            </p>

            <p>
              <strong>Color:</strong>
              ${escapeHtml(
                product.color || "-"
              )}
            </p>

            <p>
              <strong>Available Sizes:</strong>
              ${escapeHtml(
                product.availableSizes || "-"
              )}
            </p>

            <p>
              <strong>MOQ:</strong>
              ${escapeHtml(
                product.moq || "-"
              )}
            </p>

            <p>
              <strong>Price:</strong>
              ${escapeHtml(
                product.price || "-"
              )}
            </p>

            <p>
              <strong>Status:</strong>
              ${escapeHtml(
                product.status || "-"
              )}
            </p>

            ${specification}

            ${description}

            <div class="modal-actions">

              <button
                type="button"
                class="secondary-btn"
                onclick="editProduct(${JSON.stringify(String(product.id))})"
              >
                Edit
              </button>

              <button
                type="button"
                class="primary-btn"
                onclick="deleteProduct(${JSON.stringify(String(product.id))})"
              >
                Delete
              </button>

            </div>

          </div>
        `;
      }
    )
    .join("");
}


/* ============================================================
   BUYER MODAL
   ============================================================ */

function openBuyerModal(id) {

  const modal =
    getElement("buyerModal");

  const form =
    getElement("buyerForm");

  if (!modal) {
    return;
  }


  if (form) {
    form.reset();
  }


  setValue(
    "buyerId",
    ""
  );

  setValue(
    "buyerStatus",
    "Active"
  );


  const title =
    getElement(
      "buyerModalTitle"
    );


  if (id) {

    const buyer =
      buyers.find(
        function (item) {

          return (
            String(item.id) ===
            String(id)
          );
        }
      );


    if (!buyer) {

      alert(
        "Buyer not found."
      );

      return;
    }


    setValue(
      "buyerId",
      buyer.id
    );

    setValue(
      "buyerName",
      buyer.name
    );

    setValue(
      "buyerCountry",
      buyer.country
    );

    setValue(
      "contactPerson",
      buyer.contactPerson
    );

    setValue(
      "buyerEmail",
      buyer.email
    );

    setValue(
      "buyerPhone",
      buyer.phone
    );

    setValue(
      "interestedProduct",
      buyer.interestedProduct
    );

    setValue(
      "buyerStatus",
      buyer.status ||
      "Active"
    );

    setValue(
      "followupDate",
      buyer.followupDate
    );

    setValue(
      "buyerNotes",
      buyer.notes
    );


    if (title) {

      title.textContent =
        "Edit Buyer";
    }

  } else {

    if (title) {

      title.textContent =
        "Add Buyer";
    }
  }


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function closeBuyerModal() {

  const modal =
    getElement("buyerModal");

  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   SAVE BUYER
   ============================================================ */

function saveBuyer() {

  const id =
    getValue("buyerId");


  const name =
    getValue("buyerName");

  const country =
    getValue("buyerCountry");


  if (!name || !country) {

    alert(
      "Please enter Buyer / Company Name and Country."
    );

    return;
  }


  const buyer = {

    id:
      id || generateId(),

    name:
      name,

    country:
      country,

    contactPerson:
      getValue("contactPerson"),

    email:
      getValue("buyerEmail"),

    phone:
      getValue("buyerPhone"),

    interestedProduct:
      getValue("interestedProduct"),

    status:
      getValue("buyerStatus") ||
      "Active",

    followupDate:
      getValue("followupDate"),

    notes:
      getValue("buyerNotes"),

    updatedAt:
      new Date().toISOString()
  };


  if (id) {

    const index =
      buyers.findIndex(
        function (item) {

          return (
            String(item.id) ===
            String(id)
          );
        }
      );


    if (index !== -1) {

      buyers[index] =
        buyer;

    } else {

      buyers.unshift(
        buyer
      );
    }

  } else {

    buyers.unshift(
      buyer
    );
  }


  if (
    saveData(
      PR_KEYS.buyers,
      buyers
    )
  ) {

    closeBuyerModal();

    refreshAll();

    alert(
      "Buyer saved successfully."
    );
  }
}


/* ============================================================
   BUYER EDIT / DELETE
   ============================================================ */

function editBuyer(id) {

  openBuyerModal(id);
}


function deleteBuyer(id) {

  const buyer =
    buyers.find(
      function (item) {

        return (
          String(item.id) ===
          String(id)
        );
      }
    );


  if (!buyer) {

    alert(
      "Buyer not found."
    );

    return;
  }


  if (
    !confirm(
      'Delete "' +
      buyer.name +
      '"?'
    )
  ) {

    return;
  }


  buyers =
    buyers.filter(
      function (item) {

        return (
          String(item.id) !==
          String(id)
        );
      }
    );


  if (
    saveData(
      PR_KEYS.buyers,
      buyers
    )
  ) {

    refreshAll();
  }
}


/* ============================================================
   BUYER RENDER
   ============================================================ */

function renderBuyers() {

  const table =
    getElement("buyerTable");

  if (!table) {
    return;
  }


  const input =
    getElement("buyerSearch");


  const search =
    input
      ? String(
          input.value || ""
        )
          .toLowerCase()
          .trim()
      : "";


  const filtered =
    buyers.filter(
      function (buyer) {

        const text =
          [
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
            .toLowerCase();


        return text.includes(
          search
        );
      }
    );


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
    filtered.map(
      function (buyer) {

        return `
          <tr>

            <td>
              <strong>
                ${escapeHtml(
                  buyer.name
                )}
              </strong>

              ${
                buyer.contactPerson
                  ? `
                    <br>
                    <small>
                      ${escapeHtml(
                        buyer.contactPerson
                      )}
                    </small>
                  `
                  : ""
              }
            </td>

            <td>
              ${escapeHtml(
                buyer.country
              )}
            </td>

            <td>
              ${escapeHtml(
                buyer.email || "-"
              )}
            </td>

            <td>
              ${escapeHtml(
                buyer.phone || "-"
              )}
            </td>

            <td>
              ${escapeHtml(
                buyer.interestedProduct || "-"
              )}
            </td>

            <td>
              ${escapeHtml(
                buyer.status || "-"
              )}
            </td>

            <td>
              ${escapeHtml(
                buyer.followupDate || "-"
              )}
            </td>

            <td>

              <button
                type="button"
                class="secondary-btn"
                onclick="editBuyer(${JSON.stringify(String(buyer.id))})"
              >
                Edit
              </button>

              <button
                type="button"
                class="primary-btn"
                onclick="deleteBuyer(${JSON.stringify(String(buyer.id))})"
              >
                Delete
              </button>

            </td>

          </tr>
        `;
      }
    )
    .join("");
}


/* ============================================================
   RECENT PRODUCTS
   ============================================================ */

function renderRecentProducts() {

  const container =
    getElement(
      "recentProducts"
    );

  if (!container) {
    return;
  }


  const recent =
    products.slice(0, 5);


  if (!recent.length) {

    container.innerHTML =
      "<p>No products added yet.</p>";

    return;
  }


  container.innerHTML =
    recent.map(
      function (product) {

        return `
          <div class="panel">

            <strong>
              ${escapeHtml(
                product.name
              )}
            </strong>

            <p>
              ${escapeHtml(
                product.articleNo || ""
              )}
            </p>

            <small>
              ${escapeHtml(
                product.category || ""
              )}
            </small>

          </div>
        `;
      }
    )
    .join("");
}


/* ============================================================
   RECENT BUYERS
   ============================================================ */

function renderRecentBuyers() {

  const container =
    getElement(
      "recentBuyers"
    );

  if (!container) {
    return;
  }


  const recent =
    buyers.slice(0, 5);


  if (!recent.length) {

    container.innerHTML =
      "<p>No buyers added yet.</p>";

    return;
  }


  container.innerHTML =
    recent.map(
      function (buyer) {

        return `
          <div class="panel">

            <strong>
              ${escapeHtml(
                buyer.name
              )}
            </strong>

            <p>
              ${escapeHtml(
                buyer.country
              )}
            </p>

            <small>
              ${escapeHtml(
                buyer.status || ""
              )}
            </small>

          </div>
        `;
      }
    )
    .join("");
}


/* ============================================================
   BUYER SELECTS
   ============================================================ */

function populateBuyerSelects() {

  const selectIds = [
    "paymentBuyer",
    "proformaBuyer"
  ];


  selectIds.forEach(
    function (id) {

      const select =
        getElement(id);

      if (!select) {
        return;
      }


      const current =
        select.value;


      select.innerHTML =
        '<option value="">Select Buyer</option>';


      buyers.forEach(
        function (buyer) {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            buyer.id;

          option.textContent =
            buyer.name +
            (
              buyer.country
                ? " — " +
                  buyer.country
                : ""
            );


          select.appendChild(
            option
          );
        }
      );


      if (current) {
        select.value = current;
      }
    }
  );
}


/* ============================================================
   PRODUCT SELECT
   ============================================================ */

function populateProductSelects() {

  const select =
    getElement(
      "proformaProduct"
    );

  if (!select) {
    return;
  }


  const current =
    select.value;


  select.innerHTML =
    '<option value="">Select Product</option>';


  products.forEach(
    function (product) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        product.id;

      option.textContent =
        product.name +
        (
          product.articleNo
            ? " — " +
              product.articleNo
            : ""
        );


      select.appendChild(
        option
      );
    }
  );


  if (current) {
    select.value = current;
  }
}


/* ============================================================
   PAYMENT MODAL
   ============================================================ */

function openPaymentModal() {

  const modal =
    getElement(
      "paymentModal"
    );

  const form =
    getElement(
      "paymentForm"
    );


  if (!modal) {
    return;
  }


  if (form) {
    form.reset();
  }


  setValue(
    "paymentDate",
    today()
  );


  populateBuyerSelects();


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function prClosePayment() {

  const modal =
    getElement(
      "paymentModal"
    );

  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   SAVE PAYMENT
   ============================================================ */

function savePayment() {

  const buyerId =
    getValue("paymentBuyer");

  const foreignAmount =
    getValue(
      "paymentForeignAmount"
    );


  if (!buyerId) {

    alert(
      "Please select a buyer."
    );

    return;
  }


  if (!foreignAmount) {

    alert(
      "Please enter payment amount."
    );

    return;
  }


  const payment = {

    id:
      generateId(),

    buyerId:
      buyerId,

    bankName:
      getValue(
        "paymentBankName"
      ),

    proformaNo:
      getValue(
        "paymentProformaNo"
      ),

    foreignAmount:
      foreignAmount,

    currency:
      getValue(
        "paymentForeignCurrency"
      ),

    paymentMode:
      getValue(
        "paymentMode"
      ),

    pkrAmount:
      getValue(
        "paymentPkrAmount"
      ),

    paymentDate:
      getValue(
        "paymentDate"
      ) || today(),

    reference:
      getValue(
        "paymentReference"
      ),

    notes:
      getValue(
        "paymentNotes"
      ),

    createdAt:
      new Date().toISOString()
  };


  payments.unshift(
    payment
  );


  if (
    saveData(
      PR_KEYS.payments,
      payments
    )
  ) {

    prClosePayment();

    refreshAll();

    alert(
      "Payment saved successfully."
    );
  }
}


/* ============================================================
   PROFORMA MODAL
   ============================================================ */

function openProformaModal() {

  const modal =
    getElement(
      "proformaModal"
    );

  const form =
    getElement(
      "proformaForm"
    );


  if (!modal) {
    return;
  }


  if (form) {
    form.reset();
  }


  setValue(
    "proformaQty",
    "1"
  );

  setValue(
    "proformaUnitPrice",
    "0"
  );

  setValue(
    "proformaDate",
    today()
  );


  populateBuyerSelects();
  populateProductSelects();


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function prCloseProforma() {

  const modal =
    getElement(
      "proformaModal"
    );

  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   CREATE PROFORMA
   ============================================================ */

function createProforma() {

  const buyerId =
    getValue(
      "proformaBuyer"
    );

  const productId =
    getValue(
      "proformaProduct"
    );


  if (!buyerId || !productId) {

    alert(
      "Please select Buyer and Product."
    );

    return;
  }


  const buyer =
    buyers.find(
      function (item) {

        return (
          String(item.id) ===
          String(buyerId)
        );
      }
    );


  const product =
    products.find(
      function (item) {

        return (
          String(item.id) ===
          String(productId)
        );
      }
    );


  if (!buyer || !product) {

    alert(
      "Buyer or Product not found."
    );

    return;
  }


  const qty =
    Number(
      getValue(
        "proformaQty"
      )
    );


  const unitPrice =
    Number(
      getValue(
        "proformaUnitPrice"
      )
    );


  if (
    !Number.isFinite(qty) ||
    qty <= 0
  ) {

    alert(
      "Please enter a valid quantity."
    );

    return;
  }


  if (
    !Number.isFinite(unitPrice) ||
    unitPrice < 0
  ) {

    alert(
      "Please enter a valid unit price."
    );

    return;
  }


  const total =
    qty * unitPrice;


  const proforma = {

    id:
      generateId(),

    number:
      generateProformaNumber(),

    buyerId:
      buyer.id,

    buyerName:
      buyer.name,

    buyerCountry:
      buyer.country,

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

    currency:
      getValue(
        "proformaCurrency"
      ),

    date:
      getValue(
        "proformaDate"
      ) || today(),

    createdAt:
      new Date().toISOString()
  };


  proformas.unshift(
    proforma
  );


  if (
    saveData(
      PR_KEYS.proformas,
      proformas
    )
  ) {

    prCloseProforma();

    refreshAll();

    printProforma(
      proforma
    );
  }
}


/* ============================================================
   PROFORMA NUMBER
   ============================================================ */

function generateProformaNumber() {

  const year =
    new Date()
      .getFullYear();


  let highest =
    0;


  proformas.forEach(
    function (item) {

      const match =
        String(
          item.number || ""
        ).match(
          /PI-(\d+)/i
        );


      if (match) {

        const number =
          Number(
            match[1]
          );


        if (
          Number.isFinite(
            number
          ) &&
          number > highest
        ) {

          highest =
            number;
        }
      }
    }
  );


  return (
    "PI-" +
    year +
    "-" +
    String(
      highest + 1
    ).padStart(4, "0")
  );
}


/* ============================================================
   PROFORMA LETTER MODAL
   ============================================================ */

function openProformaLetterModal() {

  const modal =
    getElement(
      "letterModal"
    );

  const form =
    getElement(
      "letterForm"
    );


  if (!modal) {
    return;
  }


  if (form) {
    form.reset();
  }


  setValue(
    "letterDate",
    today()
  );


  setValue(
    "letterSubject",
    "Proforma Invoice"
  );


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function prCloseLetter() {

  const modal =
    getElement(
      "letterModal"
    );

  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   CREATE PROFORMA LETTER
   ============================================================ */

function createProformaLetter() {

  const buyer =
    getValue(
      "letterBuyer"
    );

  const subject =
    getValue(
      "letterSubject"
    );

  const message =
    getValue(
      "letterMessage"
    );


  if (!buyer || !message) {

    alert(
      "Please enter Buyer and Message."
    );

    return;
  }


  const letter = {

    id:
      generateId(),

    buyer:
      buyer,

    date:
      getValue(
        "letterDate"
      ) || today(),

    subject:
      subject ||
      "Proforma Invoice",

    message:
      message,

    createdAt:
      new Date().toISOString()
  };


  letters.unshift(
    letter
  );


  if (
    saveData(
      PR_KEYS.letters,
      letters
    )
  ) {

    prCloseLetter();

    refreshAll();

    printLetter(
      letter
    );
  }
}


/* ============================================================
   PRINT PROFORMA
   ============================================================ */

function printProforma(
  proforma
) {

  const currency =
    proforma.currency
      ? " " +
        escapeHtml(
          proforma.currency
        )
      : "";


  const html = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>
  ${escapeHtml(
    proforma.number
  )}
</title>

<style>

* {
  box-sizing: border-box;
}

body {
  font-family:
    Arial,
    Helvetica,
    sans-serif;

  padding: 40px;

  color: #222;

  max-width: 1000px;

  margin: auto;
}

.header {
  border-bottom:
    3px solid #222;

  padding-bottom: 15px;

  margin-bottom: 30px;
}

h1 {
  margin:
    0 0 5px 0;
}

h2 {
  margin-top: 30px;
}

table {
  width: 100%;

  border-collapse:
    collapse;

  margin-top: 30px;
}

th,
td {
  border:
    1px solid #ccc;

  padding: 12px;

  text-align: left;
}

th {
  background:
    #f4f4f4;
}

.total {
  text-align:
    right;

  font-size:
    20px;

  font-weight:
    bold;

  margin-top:
    20px;
}

.footer {
  margin-top:
    70px;

  border-top:
    1px solid #ddd;

  padding-top:
    20px;
}

@media print {

  body {
    padding: 20px;
  }

}

</style>

</head>

<body>

<div class="header">

<h1>
  PRIOR RIDING
</h1>

<p>
  International Buyer CRM
</p>

<p>
  Sialkot, Pakistan
</p>

</div>

<h2>
  PROFORMA INVOICE
</h2>

<p>
<strong>Invoice No:</strong>
${escapeHtml(
  proforma.number
)}
</p>

<p>
<strong>Date:</strong>
${escapeHtml(
  proforma.date
)}
</p>

<p>
<strong>Buyer:</strong>
${escapeHtml(
  proforma.buyerName
)}
</p>

${
  proforma.buyerCountry
    ? `
      <p>
        <strong>Country:</strong>
        ${escapeHtml(
          proforma.buyerCountry
        )}
      </p>
    `
    : ""
}

<table>

<tr>

<th>
  Product
</th>

<th>
  Article
</th>

<th>
  Quantity
</th>

<th>
  Unit Price
</th>

<th>
  Total
</th>

</tr>

<tr>

<td>
${escapeHtml(
  proforma.productName
)}
</td>

<td>
${escapeHtml(
  proforma.articleNo
)}
</td>

<td>
${escapeHtml(
  proforma.quantity
)}
</td>

<td>
${currency}
${escapeHtml(
  proforma.unitPrice
)}
</td>

<td>
${currency}
${escapeHtml(
  proforma.total
)}
</td>

</tr>

</table>

<div class="total">

Grand Total:
${currency}
${escapeHtml(
  proforma.total
)}

</div>

<div class="footer">

PRIOR RIDING<br>
Sialkot, Pakistan

</div>

<script>

window.onload =
  function () {

    setTimeout(
      function () {

        window.print();

      },
      300
    );

  };

</script>

</body>

</html>
`;


  openPrintWindow(
    html
  );
}


/* ============================================================
   PRINT LETTER
   ============================================================ */

function printLetter(
  letter
) {

  const html = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>
  PRIOR RIDING Letter
</title>

<style>

* {
  box-sizing: border-box;
}

body {

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  padding: 50px;

  line-height: 1.7;

  color: #222;

  max-width: 900px;

  margin: auto;
}

.header {

  border-bottom:
    3px solid #222;

  padding-bottom:
    15px;

  margin-bottom:
    30px;
}

.header h1 {

  margin:
    0;
}

.date {

  margin-top:
    30px;
}

.message {

  white-space:
    pre-wrap;

  margin-top:
    30px;
}

.footer {

  margin-top:
    60px;

  border-top:
    1px solid #ddd;

  padding-top:
    20px;
}

@media print {

  body {
    padding: 20px;
  }

}

</style>

</head>

<body>

<div class="header">

<h1>
  PRIOR RIDING
</h1>

<p>
  International Buyer CRM
</p>

<p>
  Sialkot, Pakistan
</p>

</div>

<p class="date">

<strong>Date:</strong>
${escapeHtml(
  letter.date
)}

</p>

<h2>
${escapeHtml(
  letter.subject
)}
</h2>

<p>
Dear
${escapeHtml(
  letter.buyer
)},
</p>

<div class="message">
${escapeHtml(
  letter.message
)}
</div>

<div class="footer">

Best Regards,<br>

<strong>
  PRIOR RIDING
</strong><br>

Sialkot, Pakistan

</div>

<script>

window.onload =
  function () {

    setTimeout(
      function () {

        window.print();

      },
      300
    );

  };

</script>

</body>

</html>
`;


  openPrintWindow(
    html
  );
}


/* ============================================================
   PRINT WINDOW
   ============================================================ */

function openPrintWindow(
  html
) {

  let printWindow;


  try {

    printWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=800"
      );

  } catch (error) {

    console.error(error);
  }


  if (!printWindow) {

    alert(
      "Please allow pop-ups for printing."
    );

    return;
  }


  try {

    printWindow.document.open();

    printWindow.document.write(
      html
    );

    printWindow.document.close();

  } catch (error) {

    console.error(
      "Print window error:",
      error
    );

    alert(
      "Could not open print preview."
    );
  }
}


/* ============================================================
   DASHBOARD TOOLS
   ============================================================ */

function openDashboardTool(
  type
) {

  const panel =
    getElement(
      "dashboardToolPanel"
    );

  const title =
    getElement(
      "dashboardToolTitle"
    );

  const body =
    getElement(
      "dashboardToolBody"
    );


  if (
    !panel ||
    !title ||
    !body
  ) {

    return;
  }


  panel.style.display =
    "block";


  if (type === "performance") {

    title.textContent =
      "📊 Performance Wise";


    body.innerHTML = `

      <div class="stats">

        <div class="stat-card">
          <span>Products</span>
          <strong>
            ${products.length}
          </strong>
        </div>

        <div class="stat-card">
          <span>Total Buyers</span>
          <strong>
            ${buyers.length}
          </strong>
        </div>

        <div class="stat-card">
          <span>Payments</span>
          <strong>
            ${payments.length}
          </strong>
        </div>

        <div class="stat-card">
          <span>Proformas</span>
          <strong>
            ${proformas.length}
          </strong>
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

          <label>
            Quantity
          </label>

          <input
            id="calcQty"
            type="number"
            min="0"
            step="1"
            value="1"
          >

        </div>

        <div class="field">

          <label>
            Unit Price
          </label>

          <input
            id="calcPrice"
            type="number"
            min="0"
            step="0.01"
            value="0"
          >

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


    payments.forEach(
      function (payment) {

        const mode =
          payment.paymentMode ||
          "Other";


        counts[mode] =
          (
            counts[mode] || 0
          ) + 1;
      }
    );


    if (
      Object.keys(counts)
        .length === 0
    ) {

      body.innerHTML =
        "<p>No payments recorded yet.</p>";

      return;
    }


    body.innerHTML =
      Object.keys(counts)
        .map(
          function (mode) {

            return `

              <div class="panel">

                <strong>
                  ${escapeHtml(
                    mode
                  )}
                </strong>

                <p>
                  ${counts[mode]}
                  payment(s)
                </p>

              </div>

            `;
          }
        )
        .join("");

    return;
  }


  if (type === "payment") {

    title.textContent =
      "💰 Add Payment";


    body.innerHTML = `

      <p>
        Add a new payment record.
      </p>

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

      <p>
        Create a new proforma invoice.
      </p>

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

      <p>
        Create a new proforma letter.
      </p>

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
        <strong>
          ${products.length}
        </strong>
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
    getElement(
      "dashboardToolPanel"
    );

  if (panel) {

    panel.style.display =
      "none";
  }
}


/* ============================================================
   CALCULATOR
   ============================================================ */

function calculateBreakdown() {

  const qty =
    Number(
      getValue(
        "calcQty"
      ) || 0
    );


  const price =
    Number(
      getValue(
        "calcPrice"
      ) || 0
    );


  const total =
    qty * price;


  const result =
    getElement(
      "calcResult"
    );


  if (result) {

    result.textContent =
      "Total: " +
      total.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );
  }
}


/* ============================================================
   PRINT / PDF
   ============================================================ */

function printToPdf() {

  window.print();
}


/* ============================================================
   STORAGE COUNTS
   ============================================================ */

function updateStorageCounts() {

  const productCount =
    getElement(
      "storageProductCount"
    );

  const buyerCount =
    getElement(
      "storageBuyerCount"
    );

  const paymentCount =
    getElement(
      "storagePaymentCount"
    );

  const proformaCount =
    getElement(
      "storageProformaCount"
    );


  if (productCount) {

    productCount.textContent =
      products.length;
  }


  if (buyerCount) {

    buyerCount.textContent =
      buyers.length;
  }


  if (paymentCount) {

    paymentCount.textContent =
      payments.length;
  }


  if (proformaCount) {

    proformaCount.textContent =
      proformas.length;
  }
}


/* ============================================================
   STORAGE PANEL
   ============================================================ */

function openStoragePanel() {

  toggleSettingsMenu();

  updateStorageCounts();


  const modal =
    getElement(
      "storageModal"
    );


  if (!modal) {
    return;
  }


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function closeStoragePanel() {

  const modal =
    getElement(
      "storageModal"
    );


  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   EXPORT ALL DATA
   ============================================================ */

function exportAllData() {

  const data = {

    app:
      "PRIOR RIDING — International Buyer CRM",

    version:
      "2.0",

    exportedAt:
      new Date().toISOString(),

    products:
      loadData(
        PR_KEYS.products
      ),

    buyers:
      loadData(
        PR_KEYS.buyers
      ),

    payments:
      loadData(
        PR_KEYS.payments
      ),

    proformas:
      loadData(
        PR_KEYS.proformas
      ),

    letters:
      loadData(
        PR_KEYS.letters
      )

  };


  const json =
    JSON.stringify(
      data,
      null,
      2
    );


  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    "prior-riding-backup-" +
    today() +
    ".json";


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  setTimeout(
    function () {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );
}


/* ============================================================
   RESTORE BACKUP
   ============================================================ */

function restoreAllData(
  event
) {

  const input =
    event &&
    event.target;


  if (!input) {
    return;
  }


  const file =
    input.files &&
    input.files[0];


  if (!file) {
    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    function (result) {

      try {

        const data =
          JSON.parse(
            result.target.result
          );


        if (
          !data ||
          typeof data !==
          "object"
        ) {

          throw new Error(
            "Invalid backup structure."
          );
        }


        let restored =
          false;


        if (
          Array.isArray(
            data.products
          )
        ) {

          products =
            data.products;

          saveData(
            PR_KEYS.products,
            products
          );

          restored = true;
        }


        if (
          Array.isArray(
            data.buyers
          )
        ) {

          buyers =
            data.buyers;

          saveData(
            PR_KEYS.buyers,
            buyers
          );

          restored = true;
        }


        if (
          Array.isArray(
            data.payments
          )
        ) {

          payments =
            data.payments;

          saveData(
            PR_KEYS.payments,
            payments
          );

          restored = true;
        }


        if (
          Array.isArray(
            data.proformas
          )
        ) {

          proformas =
            data.proformas;

          saveData(
            PR_KEYS.proformas,
            proformas
          );

          restored = true;
        }


        if (
          Array.isArray(
            data.letters
          )
        ) {

          letters =
            data.letters;

          saveData(
            PR_KEYS.letters,
            letters
          );

          restored = true;
        }


        if (!restored) {

          throw new Error(
            "No valid PRIOR RIDING data found."
          );
        }


        alert(
          "PRIOR RIDING backup restored successfully."
        );


        refreshAll();


        closeStoragePanel();


      } catch (error) {

        console.error(
          "Restore error:",
          error
        );


        alert(
          "Invalid PRIOR RIDING backup file."
        );
      }


      input.value =
        "";
    };


  reader.onerror =
    function () {

      alert(
        "Could not read the backup file."
      );

      input.value =
        "";
    };


  reader.readAsText(
    file
  );
}


/* ============================================================
   SETTINGS MENU
   ============================================================ */

function toggleSettingsMenu() {

  const menu =
    getElement(
      "settingsMenu"
    );


  if (!menu) {
    return;
  }


  const isOpen =
    menu.style.display ===
    "block";


  menu.style.display =
    isOpen
      ? "none"
      : "block";
}


function showAppInfo() {

  toggleSettingsMenu();


  const modal =
    getElement(
      "appInfoModal"
    );


  if (!modal) {
    return;
  }


  modal.style.display =
    "flex";

  modal.classList.add(
    "show"
  );
}


function closeAppInfo() {

  const modal =
    getElement(
      "appInfoModal"
    );


  if (modal) {

    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}


/* ============================================================
   OUTSIDE CLICK
   ============================================================ */

function setupOutsideClick() {

  document.addEventListener(
    "click",
    function (event) {

      const menu =
        getElement(
          "settingsMenu"
        );


      const button =
        document.querySelector(
          ".menu-btn"
        );


      if (
        menu &&
        menu.style.display ===
          "block" &&
        !menu.contains(
          event.target
        ) &&
        (
          !button ||
          !button.contains(
            event.target
          )
        )
      ) {

        menu.style.display =
          "none";
      }
    }
  );
}


/* ============================================================
   KEYBOARD
   ============================================================ */

function setupKeyboard() {

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key !==
        "Escape"
      ) {

        return;
      }


      closeProductModal();
      closeBuyerModal();
      prClosePayment();
      prCloseProforma();
      prCloseLetter();
      closeStoragePanel();
      closeAppInfo();
      closeDashboardTool();
    }
  );
}


/* ============================================================
   GLOBAL COMPATIBILITY
   ============================================================ */

window.showSection =
  showSection;


/* PRODUCT */

window.openProductModal =
  openProductModal;

window.closeProductModal =
  closeProductModal;

window.saveProduct =
  saveProduct;

window.editProduct =
  editProduct;

window.deleteProduct =
  deleteProduct;

window.renderProducts =
  renderProducts;


/* BUYER */

window.openBuyerModal =
  openBuyerModal;

window.closeBuyerModal =
  closeBuyerModal;

window.saveBuyer =
  saveBuyer;

window.editBuyer =
  editBuyer;

window.deleteBuyer =
  deleteBuyer;

window.renderBuyers =
  renderBuyers;


/* PAYMENT */

window.openPaymentModal =
  openPaymentModal;

window.prClosePayment =
  prClosePayment;

window.savePayment =
  savePayment;


/* PROFORMA */

window.openProformaModal =
  openProformaModal;

window.prCloseProforma =
  prCloseProforma;

window.createProforma =
  createProforma;


/* LETTER */

window.openProformaLetterModal =
  openProformaLetterModal;

window.prCloseLetter =
  prCloseLetter;

window.createProformaLetter =
  createProformaLetter;


/* DASHBOARD */

window.openDashboardTool =
  openDashboardTool;

window.closeDashboardTool =
  closeDashboardTool;

window.calculateBreakdown =
  calculateBreakdown;


/* PRINT */

window.printToPdf =
  printToPdf;


/* SETTINGS */

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
   FINAL LOAD
   ============================================================ */

console.log(
  "PRIOR RIDING — COMPLETE REPAIRED APP.JS READY"
);


/* ============================================================
   END
   ============================================================ */
