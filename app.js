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
        String(
          b.status || ""
        ).toLowerCase() === "follow-up" ||
        String(
          b.status || ""
        ).toLowerCase() === "followup" ||
        b.followupDate
    );

  const productCount =
    prEl("productCount");

  const buyerCount =
    prEl("buyerCount");

  const activeBuyerCount =
    prEl("activeBuyerCount");

  const followupCount =
    prEl("followupCount");

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
}

function renderRecentDashboard() {
  const products = prProducts();
  const buyers = prBuyers();

  const recentProducts =
    prEl("recentProducts");

  const recentBuyers =
    prEl("recentBuyers");

  if (recentProducts) {
    if (!products.length) {
      recentProducts.innerHTML =
        '<div class="empty-state">No products added yet.</div>';
    } else {
      recentProducts.innerHTML =
        products
          .slice()
          .reverse()
          .slice(0, 5)
          .map(
            product => `
              <div class="recent-item">
                <strong>
                  ${prEscape(
                    product.name ||
                    "Unnamed Product"
                  )}
                </strong>

                <small>
                  ${prEscape(
                    product.articleNo ||
                    product.article ||
                    "-"
                  )}

                  ${
                    product.category
                      ? " • " +
                        prEscape(
                          product.category
                        )
                      : ""
                  }
                </small>
              </div>
            `
          )
          .join("");
    }
  }

  if (recentBuyers) {
    if (!buyers.length) {
      recentBuyers.innerHTML =
        '<div class="empty-state">No buyers added yet.</div>';
    } else {
      recentBuyers.innerHTML =
        buyers
          .slice()
          .reverse()
          .slice(0, 5)
          .map(
            buyer => `
              <div class="recent-item">

                <strong>
                  ${prEscape(
                    buyer.name ||
                    "Unnamed Buyer"
                  )}
                </strong>

                <small>
                  ${prEscape(
                    buyer.country || "-"
                  )}

                  ${
                    buyer.status
                      ? " • " +
                        prEscape(
                          buyer.status
                        )
                      : ""
                  }
                </small>

              </div>
            `
          )
          .join("");
    }
  }
}

function renderDashboard() {
  updateDashboardStats();

  renderRecentDashboard();
}

/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function clearProductForm() {
  const form =
    prEl("productForm");

  if (form) {
    form.reset();
  }

  prSetValue(
    "productId",
    ""
  );

  prSetValue(
    "productStatus",
    "Active"
  );
}

function openProductModal(id = "") {
  const form =
    prEl("productForm");

  if (!form) return;

  clearProductForm();

  if (id) {
    const products =
      prProducts();

    const product =
      products.find(
        p => p.id === id
      );

    if (!product) return;

    prSetValue(
      "productId",
      product.id
    );

    prSetValue(
      "productName",
      product.name
    );

    prSetValue(
      "articleNo",
      product.articleNo
    );

    prSetValue(
      "category",
      product.category
    );

    prSetValue(
      "material",
      product.material
    );

    prSetValue(
      "size",
      product.size
    );

    prSetValue(
      "weight",
      product.weight
    );

    prSetValue(
      "color",
      product.color
    );

    prSetValue(
      "availableSizes",
      product.availableSizes
    );

    prSetValue(
      "moq",
      product.moq
    );

    prSetValue(
      "price",
      product.price
    );

    prSetValue(
      "imageUrl",
      product.imageUrl
    );

    prSetValue(
      "specification",
      product.specification
    );

    prSetValue(
      "description",
      product.description
    );

    prSetValue(
      "productStatus",
      product.status ||
      "Active"
    );
  }

  prShowModal(
    "productForm"
  );
}

function closeProductModal() {
  prHideModal(
    "productForm"
  );
}

function editProduct(id) {
  openProductModal(id);
}

function deleteProduct(id) {
  const products =
    prProducts();

  const product =
    products.find(
      p => p.id === id
    );

  if (!product) return;

  if (
    !confirm(
      `Delete "${product.name || "this product"}"?\n\nThis action cannot be undone.`
    )
  ) {
    return;
  }

  const updated =
    products.filter(
      p => p.id !== id
    );

  if (
    prWrite(
      PR_PRODUCTS_KEY,
      updated
    )
  ) {
    renderProducts();

    updateDashboardStats();

    renderRecentDashboard();

    populateProductSelects();

    alert(
      "Product deleted."
    );
  }
}

/* =========================================================
   PRODUCT RENDER
   ========================================================= */

function renderProducts() {
  const container =
    prEl("productList");

  if (!container) return;

  const products =
    prProducts();

  const search = (
    prEl("productSearch")?.value ||
    ""
  )
    .toLowerCase()
    .trim();

  const filtered =
    products.filter(
      product => {
        const text = [
          product.name,
          product.articleNo,
          product.category,
          product.material,
          product.color,
          product.description
        ]
          .join(" ")
          .toLowerCase();

        return (
          !search ||
          text.includes(search)
        );
      }
    );

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state">
        <strong>No products found.</strong>
        <p>
          Add your first PRIOR RIDING product.
        </p>
      </div>
    `;

    updateDashboardStats();

    return;
  }

  container.innerHTML =
    filtered
      .map(product => {
        const image =
          product.imageUrl
            ? `
              <img
                src="${prEscape(
                  product.imageUrl
                )}"
                alt="${prEscape(
                  product.name ||
                  "Product"
                )}"
                loading="lazy"
                onerror="this.style.display='none'"
              >
            `
            : "";

        return `
          <div class="product-card">

            ${
              image
                ? `
                  <div class="product-image">
                    ${image}
                  </div>
                `
                : ""
            }

            <div class="product-card-body">

              <div class="product-title">
                ${prEscape(
                  product.name ||
                  "Unnamed Product"
                )}
              </div>

              <div class="product-meta">

                ${
                  product.articleNo
                    ? `
                      <span>
                        Article:
                        ${prEscape(
                          product.articleNo
                        )}
                      </span>
                    `
                    : ""
                }

                ${
                  product.category
                    ? `
                      <span>
                        ${prEscape(
                          product.category
                        )}
                      </span>
                    `
                    : ""
                }

              </div>

              ${
                product.material
                  ? `
                    <div>
                      <strong>
                        Material:
                      </strong>
                      ${prEscape(
                        product.material
                      )}
                    </div>
                  `
                  : ""
              }

              ${
                product.size
                  ? `
                    <div>
                      <strong>
                        Size:
                      </strong>
                      ${prEscape(
                        product.size
                      )}
                    </div>
                  `
                  : ""
              }

              ${
                product.color
                  ? `
                    <div>
                      <strong>
                        Color:
                      </strong>
                      ${prEscape(
                        product.color
                      )}
                    </div>
                  `
                  : ""
              }

              ${
                product.moq
                  ? `
                    <div>
                      <strong>
                        MOQ:
                      </strong>
                      ${prEscape(
                        product.moq
                      )}
                    </div>
                  `
                  : ""
              }

              ${
                product.price
                  ? `
                    <div>
                      <strong>
                        Price:
                      </strong>
                      ${prEscape(
                        product.price
                      )}
                    </div>
                  `
                  : ""
              }

              ${
                product.specification
                  ? `
                    <div class="product-description">
                      ${prEscape(
                        product.specification
                      )}
                    </div>
                  `
                  : ""
              }

              <div class="product-actions">

                <button
                  type="button"
                  onclick="editProduct('${prEscape(
                    product.id
                  )}')"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onclick="deleteProduct('${prEscape(
                    product.id
                  )}')"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        `;
      })
      .join("");

  updateDashboardStats();

  populateProductSelects();
}

/* =========================================================
   BUYER MODAL
   ========================================================= */

function clearBuyerForm() {
  const form =
    prEl("buyerForm");

  if (form) {
    form.reset();
  }

  prSetValue(
    "buyerId",
    ""
  );

  prSetValue(
    "buyerStatus",
    "Potential"
  );
}

function openBuyerModal(id = "") {
  const form =
    prEl("buyerForm");

  if (!form) return;

  clearBuyerForm();

  populateProductSelects();

  if (id) {
    const buyers =
      prBuyers();

    const buyer =
      buyers.find(
        b => b.id === id
      );

    if (!buyer) return;

    prSetValue(
      "buyerId",
      buyer.id
    );

    prSetValue(
      "buyerName",
      buyer.name
    );

    prSetValue(
      "buyerCountry",
      buyer.country
    );

    prSetValue(
      "contactPerson",
      buyer.contactPerson
    );

    prSetValue(
      "buyerEmail",
      buyer.email
    );

    prSetValue(
      "buyerPhone",
      buyer.phone
    );

    prSetValue(
      "interestedProduct",
      buyer.interestedProduct
    );

    prSetValue(
      "buyerStatus",
      buyer.status ||
      "Potential"
    );

    prSetValue(
      "followupDate",
      buyer.followupDate
    );

    prSetValue(
      "buyerNotes",
      buyer.notes
    );
  }

  prShowModal(
    "buyerForm"
  );
}

function closeBuyerModal() {
  prHideModal(
    "buyerForm"
  );
}

function editBuyer(id) {
  openBuyerModal(id);
}

function deleteBuyer(id) {
  const buyers =
    prBuyers();

  const buyer =
    buyers.find(
      b => b.id === id
    );

  if (!buyer) return;

  if (
    !confirm(
      `Delete "${buyer.name || "this buyer"}"?\n\nThis action cannot be undone.`
    )
  ) {
    return;
  }

  const updated =
    buyers.filter(
      b => b.id !== id
    );

  if (
    prWrite(
      PR_BUYERS_KEY,
      updated
    )
  ) {
    renderBuyers();

    updateDashboardStats();

    renderRecentDashboard();

    populateBuyerSelects();

    alert(
      "Buyer deleted."
    );
  }
}

/* =========================================================
   BUYER RENDER
   ========================================================= */

function renderBuyers() {
  const table =
    prEl("buyerTable");

  if (!table) return;

  const buyers =
    prBuyers();

  const search = (
    prEl("buyerSearch")?.value ||
    ""
  )
    .toLowerCase()
    .trim();

  const filtered =
    buyers.filter(
      buyer => {
        const text = [
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

        return (
          !search ||
          text.includes(search)
        );
      }
    );

  if (!filtered.length) {
    table.innerHTML = `
      <tr>
        <td
          colspan="10"
          style="text-align:center;padding:25px;"
        >
          No buyers found.
        </td>
      </tr>
    `;

    updateDashboardStats();

    return;
  }

  table.innerHTML =
    filtered
      .map(
        buyer => `
          <tr>

            <td>
              ${prEscape(
                buyer.name
              )}
            </td>

            <td>
              ${prEscape(
                buyer.country
              )}
            </td>

            <td>
              ${prEscape(
                buyer.contactPerson
              )}
            </td>

            <td>
              ${
                buyer.email
                  ? `
                    <a
                      href="mailto:${prEscape(
                        buyer.email
                      )}"
                    >
                      ${prEscape(
                        buyer.email
                      )}
                    </a>
                  `
                  : "-"
              }
            </td>

            <td>
              ${prEscape(
                buyer.phone
              )}
            </td>

            <td>
              ${prEscape(
                buyer.interestedProduct
              )}
            </td>

            <td>
              ${prEscape(
                buyer.status
              )}
            </td>

            <td>
              ${prFormatDate(
                buyer.followupDate
              )}
            </td>

            <td>
              ${prEscape(
                buyer.notes
              )}
            </td>

            <td>

              <button
                type="button"
                onclick="editBuyer('${prEscape(
                  buyer.id
                )}')"
              >
                Edit
              </button>

              <button
                type="button"
                onclick="deleteBuyer('${prEscape(
                  buyer.id
                )}')"
              >
                Delete
              </button>

            </td>

          </tr>
        `
      )
      .join("");

  updateDashboardStats();
}

/* =========================================================
   SELECT DROPDOWNS
   ========================================================= */

function populateProductSelects() {
  const products =
    prProducts();

  const productCategories = [
    "Goalkeeper Gloves",
    "Football / Soccer Gloves",
    "Boxing Gloves",
    "MMA Gloves",
    "Riding Gloves",
    "Horse Riding Gloves",
    "Hard Riding Gloves",
    "Cycling Gloves",
    "Motorcycle Gloves",
    "Sports Gloves",
    "Fitness / Gym Gloves",
    "Work Gloves",
    "Chin Pads / Protective Pads",
    "Sports Bags",
    "Hand Wraps",
    "Other Sports Goods"
  ];

  const ids = [
    "interestedProduct",
    "proformaProduct"
  ];

  ids.forEach(id => {
    const select =
      prEl(id);

    if (!select) return;

    const current =
      select.value;

    const categoryOptions =
      productCategories
        .map(
          category => `
            <option
              value="${prEscape(
                category
              )}"
            >
              ${prEscape(
                category
              )}
            </option>
          `
        )
        .join("");

    const savedProductOptions =
      products
        .map(
          product => `
            <option
              value="${prEscape(
                product.name ||
                product.id
              )}"
            >
              ${prEscape(
                product.name ||
                "Unnamed Product"
              )}

              ${
                product.articleNo
                  ? " — " +
                    prEscape(
                      product.articleNo
                    )
                  : ""
              }
            </option>
          `
        )
        .join("");

    select.innerHTML = `
      <option value="">
        Select Product / Category
      </option>

      <optgroup
        label="PRIOR RIDING Product Categories"
      >
        ${categoryOptions}
      </optgroup>

      ${
        products.length
          ? `
            <optgroup
              label="Saved Products"
            >
              ${savedProductOptions}
            </optgroup>
          `
          : ""
      }
    `;

    if (current) {
      select.value =
        current;
    }
  });
}

function populateBuyerSelects() {
  const buyers =
    prBuyers();

  [
    "paymentBuyer",
    "proformaBuyer",
    "letterBuyer"
  ].forEach(id => {
    const select =
      prEl(id);

    if (!select) return;

    const current =
      select.value;

    select.innerHTML =
      `<option value="">Select Buyer</option>` +
      buyers
        .map(
          buyer => `
            <option
              value="${prEscape(
                buyer.name ||
                buyer.id
              )}"
            >
              ${prEscape(
                buyer.name ||
                "Unnamed Buyer"
              )}

              ${
                buyer.country
                  ? " — " +
                    prEscape(
                      buyer.country
                    )
                  : ""
              }
            </option>
          `
        )
        .join("");

    if (current) {
      select.value =
        current;
    }
  });
}

/* =========================================================
   PAYMENT
   ========================================================= */

function prOpenPayment() {
  const form =
    prEl("paymentForm");

  if (!form) return;

  form.reset();

  populateBuyerSelects();

  prSetValue(
    "paymentDate",
    prToday()
  );

  prShowModal(
    "paymentForm"
  );
}

function prClosePayment() {
  prHideModal(
    "paymentForm"
  );
}

function savePayment(event) {
  event.preventDefault();

  const payments =
    prPayments();

  const payment = {
    id: prUid("PAY"),

    buyer:
      prGetValue(
        "paymentBuyer"
      ),

    bankName:
      prGetValue(
        "paymentBankName"
      ),

    proformaNo:
      prGetValue(
        "paymentProformaNo"
      ),

    foreignAmount:
      prNumber(
        prGetValue(
          "paymentForeignAmount"
        )
      ),

    foreignCurrency:
      prGetValue(
        "paymentForeignCurrency"
      ),

    paymentMode:
      prGetValue(
        "paymentMode"
      ),

    pkrAmount:
      prNumber(
        prGetValue(
          "paymentPkrAmount"
        )
      ),

    date:
      prGetValue(
        "paymentDate"
      ) || prToday(),

    reference:
      prGetValue(
        "paymentReference"
      ),

    notes:
      prGetValue(
        "paymentNotes"
      ),

    createdAt:
      new Date().toISOString()
  };

  payments.push(
    payment
  );

  if (
    prWrite(
      PR_PAYMENTS_KEY,
      payments
    )
  ) {
    prClosePayment();

    updateDashboardStats();

    renderDashboard();

    alert(
      "Payment saved successfully."
    );
  }
}

/* =========================================================
   PROFORMA
   ========================================================= */

function prOpenProforma() {
  const form =
    prEl("proformaForm");

  if (!form) return;

  form.reset();

  populateBuyerSelects();

  populateProductSelects();

  prSetValue(
    "proformaDate",
    prToday()
  );

  prSetValue(
    "proformaQty",
    "1"
  );

  prSetValue(
    "proformaUnitPrice",
    "0"
  );

  prShowModal(
    "proformaForm"
  );
}

function prCloseProforma() {
  prHideModal(
    "proformaForm"
  );
}

function createProforma(event) {
  event.preventDefault();

  const buyers =
    prBuyers();

  const products =
    prProducts();

  const buyerName =
    prGetValue(
      "proformaBuyer"
    );

  const productName =
    prGetValue(
      "proformaProduct"
    );

  if (!buyerName) {
    alert(
      "Please select Buyer."
    );
    return;
  }

  if (!productName) {
    alert(
      "Please select Product / Category."
    );
    return;
  }

  const buyer =
    buyers.find(
      b =>
        b.name === buyerName ||
        b.id === buyerName
    );

  const product =
    products.find(
      p =>
        p.name === productName ||
        p.id === productName
    );

  const qty =
    prNumber(
      prGetValue(
        "proformaQty"
      )
    );

  const unitPrice =
    prNumber(
      prGetValue(
        "proformaUnitPrice"
      )
    );

  if (qty <= 0) {
    alert(
      "Please enter a valid quantity."
    );
    return;
  }

  if (unitPrice < 0) {
    alert(
      "Please enter a valid unit price."
    );
    return;
  }

  const proforma = {
    id: prUid("PI"),

    number:
      "PR-" +
      new Date().getFullYear() +
      "-" +
      String(
        Date.now()
      ).slice(-6),

    buyer:
      buyerName,

    buyerCountry:
      buyer?.country || "",

    buyerEmail:
      buyer?.email || "",

    product:
      productName,

    articleNo:
      product?.articleNo || "",

    quantity:
      qty,

    unitPrice:
      unitPrice,

    total:
      qty * unitPrice,

    date:
      prGetValue(
        "proformaDate"
      ) || prToday(),

    createdAt:
      new Date().toISOString()
  };

  const proformas =
    prProformas();

  proformas.push(
    proforma
  );

  if (
    prWrite(
      PR_PROFORMAS_KEY,
      proformas
    )
  ) {
    prCloseProforma();

    printProforma(
      proforma
    );
  }
}

/* =========================================================
   PROFORMA PRINT
   ========================================================= */

function printProforma(proforma) {
  const html = `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>
PRIOR RIDING - Proforma Invoice
</title>

<style>

body {
  font-family: Arial, sans-serif;
  margin: 35px;
  color: #222;
}

.header {
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  border-bottom:3px solid #18864b;
  padding-bottom:15px;
}

.brand {
  font-size:28px;
  font-weight:800;
  color:#c62828;
}

.brand span {
  color:#18864b;
}

h1 {
  text-align:center;
  margin:30px 0;
}

.info {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
  margin-bottom:25px;
}

.box {
  border:1px solid #ccc;
  padding:14px;
}

table {
  width:100%;
  border-collapse:collapse;
}

th,
td {
  border:1px solid #bbb;
  padding:10px;
  text-align:left;
}

th {
  background:#f3f3f3;
}

.total {
  margin-top:20px;
  text-align:right;
  font-size:20px;
  font-weight:bold;
}

.footer {
  margin-top:60px;
  border-top:1px solid #ccc;
  padding-top:15px;
}

@media print {

  button {
    display:none;
  }

}

</style>

</head>

<body>

<div class="header">

  <div class="brand">
    PRIOR <span>RIDING</span>
  </div>

  <div>
    <strong>
      PROFORMA INVOICE
    </strong>
    <br>

    ${prEscape(
      proforma.number
    )}

  </div>

</div>

<h1>
  PROFORMA INVOICE
</h1>

<div class="info">

  <div class="box">

    <strong>
      Buyer
    </strong>

    <br><br>

    ${prEscape(
      proforma.buyer
    )}

    <br>

    ${prEscape(
      proforma.buyerCountry
    )}

    <br>

    ${prEscape(
      proforma.buyerEmail
    )}

  </div>

  <div class="box">

    <strong>
      Invoice Details
    </strong>

    <br><br>

    No:
    ${prEscape(
      proforma.number
    )}

    <br>

    Date:
    ${prFormatDate(
      proforma.date
    )}

  </div>

</div>

<table>

<thead>

<tr>

<th>
Product
</th>

<th>
Article No.
</th>

<th>
Qty
</th>

<th>
Unit Price
</th>

<th>
Total
</th>

</tr>

</thead>

<tbody>

<tr>

<td>
${prEscape(
  proforma.product
)}
</td>

<td>
${prEscape(
  proforma.articleNo
)}
</td>

<td>
${proforma.quantity}
</td>

<td>
${prMoney(
  proforma.unitPrice
)}
</td>

<td>
${prMoney(
  proforma.total
)}
</td>

</tr>

</tbody>

</table>

<div class="total">

Total:
${prMoney(
  proforma.total
)}

</div>

<div class="footer">

<strong>
PRIOR RIDING
</strong>

<br>

International Gloves Manufacturer & Exporter

</div>

<script>

window.onload = function() {
  window.print();
};

</script>

</body>

</html>
`;

  const win =
    window.open(
      "",
      "_blank"
    );

  if (!win) {
    alert(
      "Please allow pop-ups to print the Proforma Invoice."
    );

    return;
  }

  win.document.open();

  win.document.write(
    html
  );

  win.document.close();
}

/* =========================================================
   PROFORMA LETTER
   ========================================================= */

function prOpenLetter() {
  const form =
    prEl("letterForm");

  if (!form) return;

  form.reset();

  populateBuyerSelects();

  prSetValue(
    "letterDate",
    prToday()
  );

  prSetValue(
    "letterSubject",
    "Proforma Invoice"
  );

  prShowModal(
    "letterForm"
  );
}

function prCloseLetter() {
  prHideModal(
    "letterForm"
  );
}

function createLetter(event) {
  event.preventDefault();

  const letter = {
    id: prUid("LTR"),

    buyer:
      prGetValue(
        "letterBuyer"
      ),

    date:
      prGetValue(
        "letterDate"
      ) || prToday(),

    subject:
      prGetValue(
        "letterSubject"
      ) ||
      "Proforma Invoice",

    message:
      prGetValue(
        "letterMessage"
      ),

    createdAt:
      new Date().toISOString()
  };

  const letters =
    prLetters();

  letters.push(
    letter
  );

  if (
    prWrite(
      PR_LETTERS_KEY,
      letters
    )
  ) {
    prCloseLetter();

    printLetter(
      letter
    );
  }
}

function printLetter(letter) {
  const html = `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>
PRIOR RIDING - Letter
</title>

<style>

body {
  font-family: Arial, sans-serif;
  margin:50px;
  color:#222;
}

.header {
  border-bottom:3px solid #18864b;
  padding-bottom:15px;
}

.brand {
  font-size:30px;
  font-weight:800;
  color:#c62828;
}

.brand span {
  color:#18864b;
}

.date {
  margin-top:35px;
}

.subject {
  font-size:20px;
  font-weight:bold;
  margin:30px 0;
}

.message {
  white-space:pre-wrap;
  line-height:1.8;
}

.footer {
  margin-top:80px;
}

@media print {

  button {
    display:none;
  }

}

</style>

</head>

<body>

<div class="header">

  <div class="brand">
    PRIOR <span>RIDING</span>
  </div>

  <div>
    International Gloves Manufacturer & Exporter
  </div>

</div>

<div class="date">
${prFormatDate(
  letter.date
)}
</div>

<p>

<strong>
To:
</strong>

${prEscape(
  letter.buyer
)}

</p>

<div class="subject">

${prEscape(
  letter.subject
)}

</div>

<div class="message">

${prEscape(
  letter.message
)}

</div>

<div class="footer">

Regards,

<br><br>

<strong>
PRIOR RIDING
</strong>

<br>

International Gloves Manufacturer & Exporter

</div>

<script>

window.onload = function() {
  window.print();
};

</script>

</body>

</html>
`;

  const win =
    window.open(
      "",
      "_blank"
    );

  if (!win) {
    alert(
      "Please allow pop-ups to print the letter."
    );

    return;
  }

  win.document.open();

  win.document.write(
    html
  );

  win.document.close();
}

/* =========================================================
   DASHBOARD TOOLS
   ========================================================= */

function openDashboardTool(type) {
  const panel =
    prEl(
      "dashboardToolPanel"
    );

  const title =
    prEl(
      "dashboardToolTitle"
    );

  const body =
    prEl(
      "dashboardToolBody"
    );

  if (
    !panel ||
    !title ||
    !body
  ) {
    if (
      type === "payment"
    ) {
      prOpenPayment();
    }

    if (
      type === "proforma"
    ) {
      prOpenProforma();
    }

    if (
      type === "proformaLetter"
    ) {
      prOpenLetter();
    }

    return;
  }

  if (
    type === "payment"
  ) {
    prOpenPayment();
    return;
  }

  if (
    type === "proforma"
  ) {
    prOpenProforma();
    return;
  }

  if (
    type === "proformaLetter"
  ) {
    prOpenLetter();
    return;
  }

  if (
    type === "catalogue"
  ) {
    showSection(
      "products"
    );

    return;
  }

  title.textContent =
    "Dashboard Tool";

  if (
    type === "performance"
  ) {
    title.textContent =
      "PERFORMANCE WISE";

    const products =
      prProducts();

    const buyers =
      prBuyers();

    const payments =
      prPayments();

    const active =
      buyers.filter(
        b =>
          String(
            b.status
          ).toLowerCase() ===
          "active"
      ).length;

    const potential =
      buyers.filter(
        b =>
          String(
            b.status
          ).toLowerCase() ===
          "potential"
      ).length;

    const followup =
      buyers.filter(
        b =>
          String(
            b.status
          ).toLowerCase()
            .includes("follow")
      ).length;

    const totalPKR =
      payments.reduce(
        (sum, p) =>
          sum +
          prNumber(
            p.pkrAmount
          ),
        0
      );

    body.innerHTML = `
      <div class="report-grid">

        <div class="report-card">
          <strong>
            ${products.length}
          </strong>
          <span>
            Total Products
          </span>
        </div>

        <div class="report-card">
          <strong>
            ${buyers.length}
          </strong>
          <span>
            Total Buyers
          </span>
        </div>

        <div class="report-card">
          <strong>
            ${active}
          </strong>
          <span>
            Active Buyers
          </span>
        </div>

        <div class="report-card">
          <strong>
            ${potential}
          </strong>
          <span>
            Potential Buyers
          </span>
        </div>

        <div class="report-card">
          <strong>
            ${followup}
          </strong>
          <span>
            Follow-ups
          </span>
        </div>

        <div class="report-card">
          <strong>
            PKR
            ${totalPKR.toLocaleString()}
          </strong>
          <span>
            Total Payments
          </span>
        </div>

      </div>
    `;

    panel.style.display =
      "block";

    return;
  }

  if (
    type === "calc"
  ) {
    title.textContent =
      "CALC BREAKDOWN";

    body.innerHTML = `
      <div class="calc-box">

        <label>

          Quantity

          <input
            id="prCalcQty"
            type="number"
            min="0"
            step="1"
            value="1"
          >

        </label>

        <label>

          Unit Price

          <input
            id="prCalcPrice"
            type="number"
            min="0"
            step="0.01"
            value="0"
          >

        </label>

        <label>

          Discount %

          <input
            id="prCalcDiscount"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value="0"
          >

        </label>

        <button
          type="button"
          id="prCalcButton"
        >
          Calculate
        </button>

        <div id="prCalcResult">
          Total: 0.00
        </div>

      </div>
    `;

    const calcButton =
      prEl(
        "prCalcButton"
      );

    if (calcButton) {
      calcButton.addEventListener(
        "click",
        calculateDashboard
      );
    }

    panel.style.display =
      "block";

    return;
  }

  if (
    type === "paymentMode"
  ) {
    title.textContent =
      "PAYMENT MODE";

    const payments =
      prPayments();

    const modes = {};

    payments.forEach(
      payment => {
        const mode =
          payment.paymentMode ||
          "Other";

        if (!modes[mode]) {
          modes[mode] = {
            count: 0,
            pkr: 0
          };
        }

        modes[mode].count++;

        modes[mode].pkr +=
          prNumber(
            payment.pkrAmount
          );
      }
    );

    const rows =
      Object.entries(
        modes
      );

    body.innerHTML =
      rows.length
        ? `
          <div class="report-table-wrap">

            <table>

              <thead>

                <tr>

                  <th>
                    Payment Mode
                  </th>

                  <th>
                    Transactions
                  </th>

                  <th>
                    PKR Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                ${rows
                  .map(
                    ([mode, data]) => `
                      <tr>

                        <td>
                          ${prEscape(
                            mode
                          )}
                        </td>

                        <td>
                          ${data.count}
                        </td>

                        <td>
                          PKR
                          ${data.pkr.toLocaleString()}
                        </td>

                      </tr>
                    `
                  )
                  .join("")}

              </tbody>

            </table>

          </div>
        `
        : `
          <div class="empty-state">
            No payments recorded yet.
          </div>
        `;

    panel.style.display =
      "block";

    return;
  }

  panel.style.display =
    "block";
}

function closeDashboardTool() {
  const panel =
    prEl(
      "dashboardToolPanel"
    );

  if (panel) {
    panel.style.display =
      "none";
  }
}

function calculateDashboard() {
  const qty =
    prNumber(
      prGetValue(
        "prCalcQty"
      )
    );

  const price =
    prNumber(
      prGetValue(
        "prCalcPrice"
      )
    );

  const discount =
    Math.min(
      100,
      Math.max(
        0,
        prNumber(
          prGetValue(
            "prCalcDiscount"
          )
        )
      )
    );

  const gross =
    qty * price;

  const discountAmount =
    gross *
    (discount / 100);

  const net =
    gross -
    discountAmount;

  const result =
    prEl(
      "prCalcResult"
    );

  if (result) {
    result.innerHTML = `
      <div>
        Gross:
        <strong>
          ${gross.toFixed(2)}
        </strong>
      </div>

      <div>
        Discount:
        <strong>
          ${discountAmount.toFixed(2)}
        </strong>
      </div>

      <div>
        Net Total:
        <strong>
          ${net.toFixed(2)}
        </strong>
      </div>
    `;
  }
}

/* =========================================================
   PRINT / PDF
   ========================================================= */

function printToPdf() {
  try {
    var pageTitle =
      "PRIOR RIDING — International Buyer CRM";

    var pageContent =
      document.querySelector("main")?.innerHTML || "";

    var oldOverlay =
      document.getElementById("pr-print-pdf-overlay");

    if (oldOverlay) {
      oldOverlay.remove();
    }

    var oldStyle =
      document.getElementById("pr-print-pdf-style");

    if (oldStyle) {
      oldStyle.remove();
    }

    var style =
      document.createElement("style");

    style.id = "pr-print-pdf-style";

    style.textContent = `
      #pr-print-pdf-overlay {
        display: none;
      }

      @media print {

        body > *:not(#pr-print-pdf-overlay) {
          display: none !important;
        }

        #pr-print-pdf-overlay {
          display: block !important;
          position: static !important;
          width: 100% !important;
          background: #fff !important;
          color: #111 !important;
          padding: 20px !important;
          font-family: Arial, sans-serif !important;
        }

        #pr-print-pdf-overlay button,
        #pr-print-pdf-overlay input,
        #pr-print-pdf-overlay select,
        #pr-print-pdf-overlay textarea,
        #pr-print-pdf-overlay .quick-actions,
        #pr-print-pdf-overlay .nav,
        #pr-print-pdf-overlay .topbar,
        #pr-print-pdf-overlay .settings-menu,
        #pr-print-pdf-overlay .modal,
        #pr-print-pdf-overlay .menu-btn {
          display: none !important;
        }

        #pr-print-pdf-overlay table {
          width: 100%;
          border-collapse: collapse;
        }

        #pr-print-pdf-overlay th,
        #pr-print-pdf-overlay td {
          border: 1px solid #ccc;
          padding: 7px;
          font-size: 12px;
          text-align: left;
        }

        #pr-print-pdf-overlay th {
          background: #f1f1f1;
        }

        #pr-print-pdf-overlay img {
          max-width: 100%;
        }

        .pr-print-header {
          display: block !important;
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #16833b;
          padding-bottom: 10px;
        }

        .pr-print-header h1 {
          margin: 0;
          font-size: 24px;
          color: #16833b;
        }

        .pr-print-header p {
          margin: 5px 0 0;
          color: #555;
        }
      }
    `;

    document.head.appendChild(style);

    var overlay =
      document.createElement("div");

    overlay.id = "pr-print-pdf-overlay";

    overlay.innerHTML = `
      <div class="pr-print-header">
        <h1>PRIOR RIDING</h1>
        <p>
          International Buyer CRM & Product Catalogue
        </p>
      </div>

      ${pageContent}
    `;

    document.body.appendChild(overlay);

    var cleaned = false;

    function cleanupPrint() {

      if (cleaned) return;

      cleaned = true;

      if (overlay) {
        overlay.remove();
      }

      if (style) {
        style.remove();
      }

      window.removeEventListener(
        "afterprint",
        cleanupPrint
      );
    }

    window.addEventListener(
      "afterprint",
      cleanupPrint
    );

    setTimeout(function () {

      try {

        window.print();

      } catch (error) {

        console.error(
          "PRIOR RIDING Print Error:",
          error
        );

        cleanupPrint();

        alert(
          "Print / PDF شروع نہیں ہو سکا۔"
        );
      }

    }, 250);

    setTimeout(
      cleanupPrint,
      5000
    );

  } catch (error) {

    console.error(
      "PRIOR RIDING Print/PDF Error:",
      error
    );

    alert(
      "Print / PDF شروع نہیں ہو سکا۔ دوبارہ کوشش کریں۔"
    );
  }
}
/* =========================================================
   SETTINGS MENU
   ========================================================= */

function toggleSettingsMenu() {
  const menu =
    prEl("settingsMenu") ||
    prEl("storageMenu") ||
    document.querySelector(
      ".settings-menu"
    );

  if (!menu) return;

  const isHidden =
    menu.style.display ===
      "none" ||
    getComputedStyle(
      menu
    ).display === "none";

  menu.style.display =
    isHidden
      ? "block"
      : "none";
}

function openStoragePanel() {
  updateStorageStats();

  const panel =
    prEl("storagePanel") ||
    document.querySelector(
      "#storageModal"
    );

  if (panel) {
    panel.style.display =
      "flex";

    panel.classList.add(
      "show"
    );
  }
}

function closeStoragePanel() {
  const panel =
    prEl("storagePanel") ||
    document.querySelector(
      "#storageModal"
    );

  if (panel) {
    panel.style.display =
      "none";

    panel.classList.remove(
      "show"
    );
  }
}

function updateStorageStats() {
  const products =
    prProducts();

  const buyers =
    prBuyers();

  const payments =
    prPayments();

  const proformas =
    prProformas();

  const productCount =
    prEl(
      "storageProductCount"
    );

  const buyerCount =
    prEl(
      "storageBuyerCount"
    );

  const paymentCount =
    prEl(
      "storagePaymentCount"
    );

  const proformaCount =
    prEl(
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

/* =========================================================
   EXPORT BACKUP
   ========================================================= */

function exportAllData() {
  const backup = {
    app:
      "PRIOR RIDING",

    version:
      "2026-10-05",

    exportedAt:
      new Date().toISOString(),

    products:
      prProducts(),

    buyers:
      prBuyers(),

    payments:
      prPayments(),

    proformas:
      prProformas(),

    letters:
      prLetters()
  };

  const json =
    JSON.stringify(
      backup,
      null,
      2
    );

  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href = url;

  a.download =
    "PRIOR-RIDING-CRM-BACKUP-" +
    prToday() +
    ".json";

  document.body.appendChild(
    a
  );

  a.click();

  a.remove();

  setTimeout(
    () => {
      URL.revokeObjectURL(
        url
      );
    },
    1000
  );
}

/* =========================================================
   RESTORE BACKUP
   ========================================================= */

function restoreAllData(
  eventOrInput
) {
  const input =
    eventOrInput?.target?.files
      ? eventOrInput.target
      : prEl(
          "restoreFile"
        );

  if (
    !input ||
    !input.files ||
    !input.files.length
  ) {
    return;
  }

  const file =
    input.files[0];

  const reader =
    new FileReader();

  reader.onload =
    function () {
      try {
        const backup =
          JSON.parse(
            reader.result
          );

        if (
          !backup ||
          typeof backup !==
            "object"
        ) {
          throw new Error(
            "Invalid backup"
          );
        }

        if (
          !confirm(
            "Restore PRIOR RIDING backup?\n\n" +
            "Current local data will be replaced by this backup."
          )
        ) {
          input.value = "";
          return;
        }

        if (
          Array.isArray(
            backup.products
          )
        ) {
          prWrite(
            PR_PRODUCTS_KEY,
            backup.products
          );
        }

        if (
          Array.isArray(
            backup.buyers
          )
        ) {
          prWrite(
            PR_BUYERS_KEY,
            backup.buyers
          );
        }

        if (
          Array.isArray(
            backup.payments
          )
        ) {
          prWrite(
            PR_PAYMENTS_KEY,
            backup.payments
          );
        }

        if (
          Array.isArray(
            backup.proformas
          )
        ) {
          prWrite(
            PR_PROFORMAS_KEY,
            backup.proformas
          );
        }

        if (
          Array.isArray(
            backup.letters
          )
        ) {
          prWrite(
            PR_LETTERS_KEY,
            backup.letters
          );
        }

        alert(
          "Backup restored successfully."
        );

        location.reload();

      } catch (error) {
        console.error(
          error
        );

        alert(
          "Backup restore failed.\n\n" +
          "Please select a valid PRIOR RIDING JSON backup file."
        );
      }
    };

  reader.readAsText(
    file
  );
}

/* =========================================================
   APP INFORMATION
   ========================================================= */

function showAppInfo() {
  const modal =
    prEl(
      "appInfoModal"
    ) ||
    prEl(
      "appInformationModal"
    );

  if (modal) {
    modal.style.display =
      "flex";

    modal.classList.add(
      "show"
    );

    return;
  }

  alert(
    "PRIOR RIDING\n\n" +
    "International Buyer CRM & Product Catalogue\n\n" +
    "Manufacturer & Exporter\n" +
    "Version: 2026"
  );
}

function closeAppInfo() {
  const modal =
    prEl(
      "appInfoModal"
    ) ||
    prEl(
      "appInformationModal"
    );

  if (modal) {
    modal.style.display =
      "none";

    modal.classList.remove(
      "show"
    );
  }
}

/* =========================================================
   LOGOUT
   ========================================================= */

function logoutPriorRiding() {
  if (
    !confirm(
      "Do you want to logout from PRIOR RIDING?"
    )
  ) {
    return;
  }

  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn(
      "Session clear error:",
      error
    );
  }

  alert(
    "Logged out successfully."
  );

  window.location.reload();
}

/* =========================================================
   FORM SUBMISSION — PRODUCT
   ========================================================= */

function saveProduct(event) {
  event.preventDefault();

  const products =
    prProducts();

  const id =
    prGetValue(
      "productId"
    );

  const product = {
    id:
      id ||
      prUid("PROD"),

    name:
      prGetValue(
        "productName"
      ),

    articleNo:
      prGetValue(
        "articleNo"
      ),

    category:
      prGetValue(
        "category"
      ),

    material:
      prGetValue(
        "material"
      ),

    size:
      prGetValue(
        "size"
      ),

    weight:
      prGetValue(
        "weight"
      ),

    color:
      prGetValue(
        "color"
      ),

    availableSizes:
      prGetValue(
        "availableSizes"
      ),

    moq:
      prGetValue(
        "moq"
      ),

    price:
      prGetValue(
        "price"
      ),

    imageUrl:
      prGetValue(
        "imageUrl"
      ),

    specification:
      prGetValue(
        "specification"
      ),

    description:
      prGetValue(
        "description"
      ),

    status:
      prGetValue(
        "productStatus"
      ) ||
      "Active",

    updatedAt:
      new Date().toISOString()
  };

  if (!product.name) {
    alert(
      "Please enter Product Name."
    );

    return;
  }

  const existingIndex =
    products.findIndex(
      p =>
        p.id ===
        product.id
    );

  if (
    existingIndex >= 0
  ) {
    product.createdAt =
      products[
        existingIndex
      ].createdAt ||
      new Date().toISOString();

    products[
      existingIndex
    ] = product;

  } else {
    product.createdAt =
      new Date().toISOString();

    products.push(
      product
    );
  }

  if (
    prWrite(
      PR_PRODUCTS_KEY,
      products
    )
  ) {
    closeProductModal();

    renderProducts();

    renderDashboard();

    populateProductSelects();

    alert(
      existingIndex >= 0
        ? "Product updated successfully."
        : "Product saved successfully."
    );
  }
}

/* =========================================================
   FORM SUBMISSION — BUYER
   ========================================================= */

function saveBuyer(event) {
  event.preventDefault();

  const buyers =
    prBuyers();

  const id =
    prGetValue(
      "buyerId"
    );

  const buyer = {
    id:
      id ||
      prUid("BUYER"),

    name:
      prGetValue(
        "buyerName"
      ),

    country:
      prGetValue(
        "buyerCountry"
      ),

    contactPerson:
      prGetValue(
        "contactPerson"
      ),

    email:
      prGetValue(
        "buyerEmail"
      ),

    phone:
      prGetValue(
        "buyerPhone"
      ),

    interestedProduct:
      prGetValue(
        "interestedProduct"
      ),

    status:
      prGetValue(
        "buyerStatus"
      ) ||
      "Potential",

    followupDate:
      prGetValue(
        "followupDate"
      ),

    notes:
      prGetValue(
        "buyerNotes"
      ),

    updatedAt:
      new Date().toISOString()
  };

  if (!buyer.name) {
    alert(
      "Please enter Buyer Name."
    );

    return;
  }

  const existingIndex =
    buyers.findIndex(
      b =>
        b.id ===
        buyer.id
    );

  if (
    existingIndex >= 0
  ) {
    buyer.createdAt =
      buyers[
        existingIndex
      ].createdAt ||
      new Date().toISOString();

    buyers[
      existingIndex
    ] = buyer;

  } else {
    buyer.createdAt =
      new Date().toISOString();

    buyers.push(
      buyer
    );
  }

  if (
    prWrite(
      PR_BUYERS_KEY,
      buyers
    )
  ) {
    closeBuyerModal();

    renderBuyers();

    renderDashboard();

    populateBuyerSelects();

    alert(
      existingIndex >= 0
        ? "Buyer updated successfully."
        : "Buyer saved successfully."
    );
  }
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupFormListeners() {
  const productForm =
    prEl("productForm");

  if (
    productForm &&
    !productForm.dataset.prBound
  ) {
    productForm.addEventListener(
      "submit",
      saveProduct
    );

    productForm.dataset.prBound =
      "1";
  }

  const buyerForm =
    prEl("buyerForm");

  if (
    buyerForm &&
    !buyerForm.dataset.prBound
  ) {
    buyerForm.addEventListener(
      "submit",
      saveBuyer
    );

    buyerForm.dataset.prBound =
      "1";
  }

  const paymentForm =
    prEl("paymentForm");

  if (
    paymentForm &&
    !paymentForm.dataset.prBound
  ) {
    paymentForm.addEventListener(
      "submit",
      savePayment
    );

    paymentForm.dataset.prBound =
      "1";
  }

  const proformaForm =
    prEl("proformaForm");

  if (
    proformaForm &&
    !proformaForm.dataset.prBound
  ) {
    proformaForm.addEventListener(
      "submit",
      createProforma
    );

    proformaForm.dataset.prBound =
      "1";
  }

  const letterForm =
    prEl("letterForm");

  if (
    letterForm &&
    !letterForm.dataset.prBound
  ) {
    letterForm.addEventListener(
      "submit",
      createLetter
    );

    letterForm.dataset.prBound =
      "1";
  }

  const restoreFile =
    prEl("restoreFile");

  if (
    restoreFile &&
    !restoreFile.dataset.prBound
  ) {
    restoreFile.addEventListener(
      "change",
      restoreAllData
    );

    restoreFile.dataset.prBound =
      "1";
  }
}

/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

function setupOutsideModalClose() {
  document.addEventListener(
    "click",
    function (event) {
      const target =
        event.target;

      if (!target.classList) {
        return;
      }

      if (
        target.classList.contains(
          "modal"
        ) ||
        target.classList.contains(
          "modal-overlay"
        )
      ) {
        target.style.display =
          "none";

        target.classList.remove(
          "show"
        );
      }
    }
  );
}

/* =========================================================
   ESCAPE KEY
   ========================================================= */

function setupEscapeKey() {
  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      document
        .querySelectorAll(
          ".modal.show, .modal-overlay.show"
        )
        .forEach(
          modal => {
            modal.style.display =
              "none";

            modal.classList.remove(
              "show"
            );
          }
        );

      closeDashboardTool();
    }
  );
}

/* =========================================================
   STORAGE CHANGE REFRESH
   ========================================================= */

window.addEventListener(
  "storage",
  function () {
    renderDashboard();

    renderProducts();

    renderBuyers();

    populateProductSelects();

    populateBuyerSelects();

    updateStorageStats();
  }
);

/* =========================================================
   INITIALIZE
   ========================================================= */

function initPriorRidingApp() {
  setupFormListeners();

  setupOutsideModalClose();

  setupEscapeKey();

  populateProductSelects();

  populateBuyerSelects();

  renderDashboard();

  renderProducts();

  renderBuyers();

  updateStorageStats();

  const dashboard =
    prEl("dashboard");

  if (dashboard) {
    showSection(
      "dashboard"
    );
  }

  console.log(
    "PRIOR RIDING CRM initialized successfully."
  );
}

/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initPriorRidingApp,
    {
      once: true
    }
  );
} else {
  initPriorRidingApp();
}
/* =========================================================
   PRIOR RIDING — NATIVE SCANNER
   ========================================================= */

async function openScanner() {
  try {
    const nativePlugin =
      window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.PriorNative;

    if (!nativePlugin) {
      alert(
        "Scanner ابھی اس APK میں دستیاب نہیں ہے۔ تازہ APK Build کریں۔"
      );
      return;
    }

    if (
      typeof nativePlugin.startScannerDiscovery ===
      "function"
    ) {
      await nativePlugin.startScannerDiscovery();
      return;
    }

    if (
      typeof nativePlugin.openBluetoothSettings ===
      "function"
    ) {
      await nativePlugin.openBluetoothSettings();
      return;
    }

    alert(
      "Scanner service دستیاب نہیں ہے۔"
    );

  } catch (error) {
    console.error(
      "PRIOR RIDING Scanner Error:",
      error
    );

    alert(
      "Scanner شروع نہیں ہو سکا۔ Bluetooth اور Scanner connection چیک کریں۔"
    );
  }
}/* =========================================================
   PRIOR RIDING — SCANNER
   ========================================================= */
/* =========================================================
   PRIOR RIDING — REAL BLUETOOTH SCANNER
   ========================================================= */
/* =========================================================
   PRIOR RIDING — BLUETOOTH HID / KEYBOARD SCANNER
   ========================================================= */

let priorScannerBuffer = "";
let priorScannerTimer = null;
let priorScannerLastKeyTime = 0;

function openScanner() {

  const input =
    document.getElementById("barcode") ||
    document.getElementById("productBarcode") ||
    document.getElementById("scanCode");

  if (input) {
    input.focus();

    if (typeof input.select === "function") {
      input.select();
    }
  }

  alert(
    "Bluetooth Scanner تیار ہے۔\n\n" +
    "Scanner کو Bluetooth سے Pair کریں۔\n" +
    "Scanner کو HID / Keyboard Mode میں رکھیں۔\n\n" +
    "اب barcode scan کریں۔"
  );
}


/* =========================================================
   BLUETOOTH HID SCANNER INPUT
   Scanner keyboard کی طرح barcode بھیجتا ہے
   ========================================================= */

document.addEventListener("keydown", function (event) {

  const now = Date.now();
  const gap = now - priorScannerLastKeyTime;

  priorScannerLastKeyTime = now;


  /* Scanner کے characters بہت تیزی سے آتے ہیں */
  if (
    gap > 150 &&
    priorScannerBuffer.length > 0
  ) {
    priorScannerBuffer = "";
  }


  /* Barcode کے آخر میں Scanner عموماً ENTER بھیجتا ہے */
  if (event.key === "Enter") {

    if (priorScannerBuffer.length >= 3) {

      event.preventDefault();

      const scannedCode =
        priorScannerBuffer.trim();

      priorScannerBuffer = "";

      clearTimeout(priorScannerTimer);

      if (scannedCode) {

        console.log(
          "PRIOR RIDING Bluetooth Scanner:",
          scannedCode
        );

        handleScannedCode(scannedCode);
      }
    }

    return;
  }


  /* صرف ایک-character keys کو barcode buffer میں شامل کریں */
  if (event.key.length === 1) {

    priorScannerBuffer += event.key;

    clearTimeout(priorScannerTimer);

    priorScannerTimer = setTimeout(
      function () {
        priorScannerBuffer = "";
      },
      200
    );
  }

});

/* =========================================================
   SCANNED BARCODE HANDLER
   ========================================================= */

function handleScannedCode(value) {

  const cleanValue =
    String(value || "")
      .replace(/[\r\n]+/g, "")
      .trim();

  if (!cleanValue) return;

  console.log(
    "Scanned Code:",
    cleanValue
  );

  alert(
    "Scanner نے Code پڑھ لیا:\n\n" +
    cleanValue
  );
}
/* PRIOR RIDING — Minimal Repair Patch
   Payment Mode + PRINT + PDF
   Add this file at the END of the existing app.js.
*/
(function () {
  'use strict';

  // Payment methods: keep existing methods and add international methods.
  window.PR_INTERNATIONAL_PAYMENT_MODES = [
    'Western Union', 'Wise', 'MoneyGram', 'Payoneer', 'Remitly', 'Skrill'
  ];

  function patchPaymentModes() {
    const additions = window.PR_INTERNATIONAL_PAYMENT_MODES;
    document.querySelectorAll('select').forEach(function (select) {
      const text = ((select.id || '') + ' ' + (select.name || '') + ' ' + (select.getAttribute('aria-label') || '')).toLowerCase();
      if (!/(payment|mode)/.test(text)) return;
      additions.forEach(function (mode) {
        if (![...select.options].some(o => o.value === mode || o.textContent.trim() === mode)) {
          const o = document.createElement('option'); o.value = mode; o.textContent = mode; select.appendChild(o);
        }
      });
    });
  }

  function buildReport() {
    const products = Array.isArray(window.products) ? window.products : (typeof products !== 'undefined' && Array.isArray(products) ? products : []);
    const buyers = Array.isArray(window.buyers) ? window.buyers : (typeof buyers !== 'undefined' && Array.isArray(buyers) ? buyers : []);
    const payments = Array.isArray(window.prPayments) ? window.prPayments : (typeof prPayments !== 'undefined' && Array.isArray(prPayments) ? prPayments : []);
    const esc = v => String(v ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    return '<!doctype html><html><head><meta charset="utf-8"><title>PRIOR RIDING Report</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{margin-bottom:4px}h2{margin-top:24px}table{border-collapse:collapse;width:100%;margin-top:8px}th,td{border:1px solid #bbb;padding:7px;text-align:left}th{background:#eee}.meta{color:#555}</style></head><body>' +
      '<h1>PRIOR RIDING</h1><div class="meta">International Buyer CRM Report — ' + new Date().toLocaleString() + '</div>' +
      '<h2>Products (' + products.length + ')</h2><table><tr><th>Product</th><th>Article</th><th>Price</th></tr>' + products.map(p => '<tr><td>'+esc(p.name || p.productName)+'</td><td>'+esc(p.article || p.articleNo || p.code)+'</td><td>'+esc(p.price || p.unitPrice)+'</td></tr>').join('') + '</table>' +
      '<h2>Buyers (' + buyers.length + ')</h2><table><tr><th>Name</th><th>Company</th><th>Country</th><th>Email</th></tr>' + buyers.map(b => '<tr><td>'+esc(b.name)+'</td><td>'+esc(b.company)+'</td><td>'+esc(b.country)+'</td><td>'+esc(b.email)+'</td></tr>').join('') + '</table>' +
      '<h2>Payments (' + payments.length + ')</h2><table><tr><th>Date</th><th>Buyer</th><th>Mode</th><th>Amount</th></tr>' + payments.map(p => '<tr><td>'+esc(p.date)+'</td><td>'+esc(p.buyerName || p.buyer)+'</td><td>'+esc(p.mode || p.paymentMode)+'</td><td>'+esc(p.amount || p.foreignAmount || p.pkrAmount)+'</td></tr>').join('') + '</table></body></html>';
  }

  function printReport() {
    const w = window.open('', '_blank');
    if (!w) { alert('براہِ کرم browser میں pop-up/print کی اجازت دیں۔'); return; }
    w.document.open(); w.document.write(buildReport()); w.document.close();
    w.onload = function () { w.focus(); setTimeout(function(){ w.print(); }, 250); };
  }

  function bindPrintButtons() {
    document.querySelectorAll('button,[role="button"],a').forEach(function (el) {
      const label = (el.textContent || el.getAttribute('aria-label') || '').trim().toLowerCase();
      if (!label) return;
      if (label === 'print' || label.includes('print')) el.addEventListener('click', function(e){ e.preventDefault(); printReport(); });
      if (label === 'pdf' || label.includes('pdf')) el.addEventListener('click', function(e){ e.preventDefault(); printReport(); });
    });
  }

  function repair() { patchPaymentModes(); bindPrintButtons(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', repair); else repair();
  new MutationObserver(repair).observe(document.documentElement, {childList:true, subtree:true});
})();
/* =========================================================
   PRIOR RIDING — PRINT + PDF ONLY REPAIR
   Version: 2026-10-07
   IMPORTANT: Add this patch at the VERY END of existing app.js
   Do not remove existing app code.
   ========================================================= */
(function () {
  'use strict';

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function readArray(keys) {
    for (var i = 0; i < keys.length; i++) {
      try {
        var raw = localStorage.getItem(keys[i]);
        if (!raw) continue;
        var data = JSON.parse(raw);
        if (Array.isArray(data)) return data;
      } catch (e) {}
    }
    return [];
  }

  function reportHTML() {
    var products = readArray(['prior_riding_products', 'products']);
    var buyers = readArray(['prior_riding_buyers', 'buyers']);
    var payments = readArray(['prior_riding_payments', 'prPayments', 'payments']);

    var pRows = products.map(function (p) {
      return '<tr><td>' + esc(p.name || p.productName || p.title) + '</td><td>' +
        esc(p.article || p.articleNo || p.code || p.productNo) + '</td><td>' +
        esc(p.price || p.unitPrice || '') + '</td></tr>';
    }).join('');

    var bRows = buyers.map(function (b) {
      return '<tr><td>' + esc(b.name || b.buyerName) + '</td><td>' +
        esc(b.company || b.companyName) + '</td><td>' + esc(b.country) + '</td><td>' +
        esc(b.email) + '</td></tr>';
    }).join('');

    var payRows = payments.map(function (p) {
      return '<tr><td>' + esc(p.date || p.paymentDate) + '</td><td>' +
        esc(p.buyerName || p.buyer || p.customer) + '</td><td>' +
        esc(p.mode || p.paymentMode) + '</td><td>' +
        esc(p.amount || p.foreignAmount || p.pkrAmount || '') + '</td></tr>';
    }).join('');

    return '<div id="pr-print-sheet">' +
      '<h1>PRIOR RIDING</h1>' +
      '<div class="pr-print-meta">International Buyer CRM &nbsp; | &nbsp; ' + new Date().toLocaleString() + '</div>' +
      '<h2>Product Catalogue (' + products.length + ')</h2>' +
      '<table><thead><tr><th>Product</th><th>Article No.</th><th>Price</th></tr></thead><tbody>' + pRows + '</tbody></table>' +
      '<h2>Buyer CRM (' + buyers.length + ')</h2>' +
      '<table><thead><tr><th>Buyer</th><th>Company</th><th>Country</th><th>Email</th></tr></thead><tbody>' + bRows + '</tbody></table>' +
      '<h2>Payment History (' + payments.length + ')</h2>' +
      '<table><thead><tr><th>Date</th><th>Buyer</th><th>Payment Mode</th><th>Amount</th></tr></thead><tbody>' + payRows + '</tbody></table>' +
      '</div>';
  }

  function runPrint() {
    if (document.getElementById('pr-print-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'pr-print-overlay';
    overlay.innerHTML = reportHTML();

    var style = document.createElement('style');
    style.id = 'pr-print-style';
    style.textContent =
      '#pr-print-overlay{display:none}' +
      '@media print{' +
      'body > *:not(#pr-print-overlay){display:none!important}' +
      '#pr-print-overlay{display:block!important;position:static!important;background:#fff!important;color:#111!important;padding:22px!important;font-family:Arial,sans-serif!important}' +
      '#pr-print-sheet{display:block!important}' +
      '#pr-print-sheet h1{font-size:24px;margin:0 0 4px}' +
      '#pr-print-sheet h2{font-size:17px;margin:22px 0 7px;page-break-after:avoid}' +
      '.pr-print-meta{font-size:11px;color:#555;margin-bottom:18px}' +
      '#pr-print-sheet table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px}' +
      '#pr-print-sheet th,#pr-print-sheet td{border:1px solid #999;padding:6px;text-align:left;vertical-align:top}' +
      '#pr-print-sheet th{font-weight:700;background:#eee}' +
      '#pr-print-sheet tr{page-break-inside:avoid}' +
      '}';

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      overlay.remove();
      style.remove();
      window.removeEventListener('afterprint', cleanup);
    }

    window.addEventListener('afterprint', cleanup);

    setTimeout(function () {
      try {
        window.print();
      } catch (e) {
        cleanup();
        alert('Print/PDF شروع نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔');
      }
      // Android WebView may not fire afterprint consistently.
      setTimeout(cleanup, 3000);
    }, 180);
  }

  function isPrintButton(el) {
    var label = ((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.id || '')).trim().toLowerCase();
    return label === 'print' || label === 'pdf' || label.includes('print') || label.includes('pdf');
  }

  function bind() {
    document.querySelectorAll('button,a,[role="button"]').forEach(function (el) {
      if (!isPrintButton(el) || el.dataset.prPrintPdfFixed === '1') return;
      el.dataset.prPrintPdfFixed = '1';
      el.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        runPrint();
      }, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  new MutationObserver(bind).observe(document.documentElement, { childList: true, subtree: true });
})();
/* PRIOR RIDING — PRINT + PDF ONLY REPAIR
   Add at the very end of existing app.js
   No new window / no blank page / no other feature changes.
*/

