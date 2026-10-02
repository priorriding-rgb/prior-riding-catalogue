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

  var current = select.value;

  var categories = [
    "Goalkeeper Gloves",
    "Riding Gloves",
    "Cycling Gloves",
    "Boxing Gloves",
    "MMA Gloves",
    "Horse Riding Gloves",
    "Hard Riding Gloves",
    "Chin Pads / Protective Pads",
    "Football / Soccer Gloves",
    "Sports Bags",
    "Hand Wraps",
    "Other Sports Goods"
  ];

  select.innerHTML = '<option value="">Select Product / Category</option>';

  categories.forEach(function (category) {
    var option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  if (products.length) {
    var group = document.createElement("optgroup");
    group.label = "Added Products";

    products.forEach(function (product) {
      var option = document.createElement("option");
      option.value = product.name;
      option.textContent = product.name + (product.articleNo ? " — " + product.articleNo : "");
      group.appendChild(option);
    });

    select.appendChild(group);
  }

  if (current) select.value = current;
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


// ---------------- DASHBOARD QUICK TOOLS ----------------

function openDashboardTool(tool) {
  var panel = document.getElementById("dashboardToolPanel");
  var title = document.getElementById("dashboardToolTitle");
  var body = document.getElementById("dashboardToolBody");
  if (!panel || !title || !body) return;

  var data = {
    performance: ["Performance Wise", "Product and buyer performance tools are ready for the next reporting layer."],
    calc: ["Calc Breakdown", "Calculation breakdown workspace for quotations, quantities, costs and totals."],
    paymentMode: ["Payment Mode", "Payment mode workspace for recording and reviewing buyer payment methods."],
    proforma: ["Add Proforma", "Create and manage proforma invoice details from this workspace."],
    proformaLetter: ["Add Proforma Letter", "Prepare a professional proforma covering letter from this workspace."],
    catalogue: ["Catalogue", "Open the product catalogue area and manage your catalogue products."],
    payment: ["Add Payment", "Record buyer payment details and keep payment history organized."]
  };

  var item = data[tool];
  if (!item) return;

  title.textContent = item[0];
  body.innerHTML = "<p>" + escapeHtml(item[1]) + "</p>";

  if (tool === "catalogue") {
    body.innerHTML += '<button class="primary-btn" onclick="showSection(\'products\'); closeDashboardTool();">Open Product Catalogue</button>';
  } else if (tool === "payment") {
    body.innerHTML += '<button class="primary-btn" onclick="showSection(\'buyers\'); closeDashboardTool();">Open Buyer CRM</button>';
  } else if (tool === "proforma" || tool === "proformaLetter") {
    body.innerHTML += '<button class="primary-btn" onclick="showSection(\'buyers\'); closeDashboardTool();">Select Buyer</button>';
  }

  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDashboardTool() {
  var panel = document.getElementById("dashboardToolPanel");
  if (panel) panel.style.display = "none";
}

function printToPdf() {
  window.print();
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

/* ===== PRIOR RIDING CRM ENHANCED TOOLS ===== */
var PR_PRODUCT_CATEGORIES=[
 "Goalkeeper Gloves","Riding Gloves","Cycling Gloves","Boxing Gloves","MMA Gloves",
 "Horse Riding Gloves","Hard Riding Gloves","Football / Soccer Gloves",
 "Chin Pads / Protective Pads","Sports Bags","Hand Wraps","Other Sports Goods / Other Varieties"
];
var PR_PAYMENT_MODES=["Bank Transfer / T.T.","Advance","Balance","Cash","Card","PayPal","Other"];
var prPayments=JSON.parse(localStorage.getItem("priorRidingPayments")||"[]");

function prSavePayments(){localStorage.setItem("priorRidingPayments",JSON.stringify(prPayments));}
function prMoney(n){return Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}

function prFillCategories(){
 var s=document.getElementById("category"); if(s){var v=s.value;s.innerHTML='<option value="">Select Product Category</option>'+PR_PRODUCT_CATEGORIES.map(function(c){return '<option>'+escapeHtml(c)+'</option>';}).join("");if(v)s.value=v;}
 var i=document.getElementById("interestedProduct"); if(i){var iv=i.value;i.innerHTML='<option value="">Select Product / Category</option>'+PR_PRODUCT_CATEGORIES.map(function(c){return '<option>'+escapeHtml(c)+'</option>';}).join("");if(products.length){i.innerHTML+='<optgroup label="Added Products">'+products.map(function(p){return '<option value="'+escapeHtml(p.name)+'">'+escapeHtml(p.name)+(p.articleNo?" — "+escapeHtml(p.articleNo):"")+'</option>';}).join("")+'</optgroup>';}if(iv)i.value=iv;}
}

function prOpenPayment(){
 closeDashboardTool();

 // Refresh payment selections every time the form opens.
 var s=document.getElementById("paymentBuyer");
 if(s){
   s.innerHTML='<option value="">Select Buyer</option>';
   if(buyers.length){
     buyers.forEach(function(b){
       var o=document.createElement("option");
       o.value=b.id;
       o.textContent=b.name+(b.country?" — "+b.country:"");
       s.appendChild(o);
     });
   }else{
     var empty=document.createElement("option");
     empty.value="";
     empty.textContent="No buyers found — add a buyer first";
     s.appendChild(empty);
   }
 }

 var m=document.getElementById("paymentMode");
 if(m){
   m.innerHTML='<option value="">Select Payment Mode</option>';
   PR_PAYMENT_MODES.forEach(function(mode){
     var o=document.createElement("option");
     o.value=mode;
     o.textContent=mode;
     m.appendChild(o);
   });
 }

 var d=document.getElementById("paymentDate");
 if(d&&!d.value)d.value=new Date().toISOString().slice(0,10);

 var modal=document.getElementById("paymentModal");
 if(modal)modal.style.display="flex";
}
function prClosePayment(){var m=document.getElementById("paymentModal");if(m)m.style.display="none";var f=document.getElementById("paymentForm");if(f)f.reset();}
function prSavePayment(e){
 e.preventDefault();
 var buyerId=document.getElementById("paymentBuyer").value,buyer=buyers.find(function(b){return b.id===buyerId;});
 var amount=Number(document.getElementById("paymentAmount").value);
 if(!buyer||!(amount>0)){alert("Please select a buyer and enter a valid amount.");return;}
 prPayments.push({id:generateId(),buyerId:buyerId,buyerName:buyer.name,amount:amount,currency:document.getElementById("paymentCurrency").value,mode:document.getElementById("paymentMode").value,date:document.getElementById("paymentDate").value,reference:document.getElementById("paymentReference").value.trim(),notes:document.getElementById("paymentNotes").value.trim()});
 prSavePayments();prClosePayment();updateDashboard();alert("Payment saved successfully.");
}

function prTool(tool){
 var p=document.getElementById("dashboardToolPanel"),t=document.getElementById("dashboardToolTitle"),b=document.getElementById("dashboardToolBody");if(!p||!t||!b)return;
 if(tool==="performance"){
  var counts={};PR_PRODUCT_CATEGORIES.forEach(function(c){counts[c]=0;});products.forEach(function(x){if(counts[x.category]!=null)counts[x.category]++;});
  t.textContent="Performance Wise";b.innerHTML='<p>Products by category.</p><div class="tool-grid">'+PR_PRODUCT_CATEGORIES.map(function(c){return '<div class="tool-stat"><b>'+escapeHtml(c)+'</b><strong>'+counts[c]+'</strong></div>';}).join("")+'</div>';
 }else if(tool==="calc"){
  var total=prPayments.reduce(function(s,x){return s+Number(x.amount||0);},0);
  t.textContent="Calc Breakdown";b.innerHTML='<div class="tool-grid"><div class="tool-stat"><b>Products</b><strong>'+products.length+'</strong></div><div class="tool-stat"><b>Buyers</b><strong>'+buyers.length+'</strong></div><div class="tool-stat"><b>Payments</b><strong>'+prPayments.length+'</strong></div><div class="tool-stat"><b>Payment Total</b><strong>'+prMoney(total)+'</strong></div></div>';
 }else if(tool==="paymentMode"){
  var modes={};PR_PAYMENT_MODES.forEach(function(m){modes[m]=0;});prPayments.forEach(function(x){modes[x.mode]=(modes[x.mode]||0)+1;});
  t.textContent="Payment Mode";b.innerHTML='<p>Payment methods recorded in the CRM.</p><div class="tool-grid">'+Object.keys(modes).map(function(m){return '<div class="tool-stat"><b>'+escapeHtml(m)+'</b><strong>'+modes[m]+'</strong></div>';}).join("")+'</div><button class="primary-btn" onclick="prOpenPayment()">+ Add Payment</button>';
 }else if(tool==="catalogue"){
  t.textContent="Catalogue";b.innerHTML='<p>Open the complete product catalogue.</p><button class="primary-btn" onclick="showSection(\'products\');closeDashboardTool()">Open Product Catalogue</button>';
 }else if(tool==="payment"){
  t.textContent="Add Payment";b.innerHTML='<p>Record buyer payment, amount and payment mode.</p><button class="primary-btn" onclick="prOpenPayment()">+ Add Payment</button>';
 }else if(tool==="proforma"){
  t.textContent="Add Proforma";b.innerHTML='<p>Create a print-ready proforma invoice using saved buyer and product data.</p><button class="primary-btn" onclick="prOpenProforma()">Create Proforma</button>';
 }else if(tool==="proformaLetter"){
  t.textContent="Add Proforma Letter";b.innerHTML='<p>Prepare a professional proforma covering letter.</p><button class="primary-btn" onclick="prOpenLetter()">Create Letter</button>';
 }
 p.style.display="block";p.scrollIntoView({behavior:"smooth",block:"start"});
}

function prOpenProforma(){
 var b=document.getElementById("proformaBuyer"),p=document.getElementById("proformaProduct");if(!b||!p)return;
 b.innerHTML='<option value="">Select Buyer</option>'+buyers.map(function(x){return '<option value="'+escapeHtml(x.id)+'">'+escapeHtml(x.name)+' — '+escapeHtml(x.country)+'</option>';}).join("");
 p.innerHTML='<option value="">Select Product</option>'+products.map(function(x){return '<option value="'+escapeHtml(x.id)+'">'+escapeHtml(x.name)+' — '+escapeHtml(x.articleNo)+'</option>';}).join("");
 document.getElementById("proformaDate").value=new Date().toISOString().slice(0,10);
 document.getElementById("proformaModal").style.display="flex";
}
function prCloseProforma(){document.getElementById("proformaModal").style.display="none";document.getElementById("proformaForm").reset();}
function prMakeProforma(e){
 e.preventDefault();var buyer=buyers.find(function(x){return x.id===document.getElementById("proformaBuyer").value;}),product=products.find(function(x){return x.id===document.getElementById("proformaProduct").value;});var q=Number(document.getElementById("proformaQty").value)||1,u=Number(document.getElementById("proformaUnitPrice").value)||0;
 if(!buyer||!product){alert("Please select buyer and product.");return;}var total=q*u,w=window.open("","_blank","width=900,height=700");if(!w){alert("Please allow pop-ups.");return;}
 w.document.write('<html><head><title>PRIOR RIDING Proforma</title><style>body{font-family:Arial;padding:40px}h1{color:#c62828}table{width:100%;border-collapse:collapse;margin-top:25px}th,td{border:1px solid #ddd;padding:10px}th{background:#16834b;color:#fff}</style></head><body><h1>PRIOR RIDING</h1><h2>PROFORMA INVOICE</h2><p><b>Buyer:</b> '+escapeHtml(buyer.name)+' — '+escapeHtml(buyer.country)+'</p><p><b>Date:</b> '+escapeHtml(document.getElementById("proformaDate").value)+'</p><table><tr><th>Product</th><th>Article</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr><tr><td>'+escapeHtml(product.name)+'</td><td>'+escapeHtml(product.articleNo)+'</td><td>'+q+'</td><td>'+prMoney(u)+'</td><td>'+prMoney(total)+'</td></tr></table><h3>Grand Total: '+prMoney(total)+'</h3><script>window.onload=function(){window.print()}<\/script></body></html>');w.document.close();prCloseProforma();
}
function prOpenLetter(){document.getElementById("letterDate").value=new Date().toISOString().slice(0,10);document.getElementById("letterModal").style.display="flex";}
function prCloseLetter(){document.getElementById("letterModal").style.display="none";document.getElementById("letterForm").reset();}
function prMakeLetter(e){
 e.preventDefault();var buyer=document.getElementById("letterBuyer").value.trim(),subject=document.getElementById("letterSubject").value.trim(),msg=document.getElementById("letterMessage").value.trim();if(!buyer||!msg){alert("Please enter buyer/company and message.");return;}var w=window.open("","_blank","width=900,height=700");if(!w){alert("Please allow pop-ups.");return;}w.document.write('<html><head><title>PRIOR RIDING Letter</title><style>body{font-family:Arial;padding:40px;line-height:1.8}h1{color:#c62828}</style></head><body><h1>PRIOR RIDING</h1><h2>PROFORMA INVOICE COVERING LETTER</h2><p><b>Date:</b> '+escapeHtml(document.getElementById("letterDate").value)+'</p><p><b>To:</b> '+escapeHtml(buyer)+'</p><p><b>Subject:</b> '+escapeHtml(subject||"Proforma Invoice")+'</p><p>'+escapeHtml(msg).replace(/\n/g,"<br>")+'</p><p>Best regards,<br><b>PRIOR RIDING</b></p><script>window.onload=function(){window.print()}<\/script></body></html>');w.document.close();prCloseLetter();
}

(function(){
 var oldUpdate=window.updateDashboard;window.updateDashboard=function(){if(typeof oldUpdate==="function")oldUpdate();var total=prPayments.reduce(function(s,x){return s+Number(x.amount||0);},0);var pc=document.getElementById("paymentCount"),pt=document.getElementById("paymentTotal");if(pc)pc.textContent=prPayments.length;if(pt)pt.textContent=prMoney(total);};
 var oldPopulate=window.populateInterestedProducts;window.populateInterestedProducts=function(){if(typeof oldPopulate==="function")oldPopulate();prFillCategories();};
 document.addEventListener("DOMContentLoaded",function(){
  prFillCategories();
  var f=document.getElementById("paymentForm");if(f)f.addEventListener("submit",prSavePayment);
  var pf=document.getElementById("proformaForm");if(pf)pf.addEventListener("submit",prMakeProforma);
  var lf=document.getElementById("letterForm");if(lf)lf.addEventListener("submit",prMakeLetter);
 });
 window.openDashboardTool=prTool;window.prOpenPayment=prOpenPayment;window.prClosePayment=prClosePayment;window.prOpenProforma=prOpenProforma;window.prCloseProforma=prCloseProforma;window.prOpenLetter=prOpenLetter;window.prCloseLetter=prCloseLetter;
})();


/* ===== PRIOR RIDING FINAL FUNCTIONAL FIXES ===== */
function prRenderPaymentHistory(){
  var box=document.getElementById("prPaymentHistory");
  if(!box)return;
  if(!prPayments.length){
    box.innerHTML='<div class="empty">No payments recorded yet.</div>';
    return;
  }
  box.innerHTML='<div class="payment-history">'+prPayments.slice().reverse().map(function(p){
    return '<div class="payment-row"><div><b>'+escapeHtml(p.buyerName)+'</b><span>'+escapeHtml(p.date||"-")+' · '+escapeHtml(p.mode||"-")+'</span></div><strong>'+escapeHtml(p.currency||"USD")+' '+prMoney(p.amount)+'</strong><button class="small-btn delete-btn" onclick="prDeletePayment(\''+p.id+'\')">Delete</button></div>';
  }).join("")+'</div>';
}
function prDeletePayment(id){
  if(!confirm("Delete this payment record?"))return;
  prPayments=prPayments.filter(function(p){return p.id!==id;});
  prSavePayments();
  prRenderPaymentHistory();
  prTool("payment");
  updateDashboard();
}
function prToolFinal(tool){
  var p=document.getElementById("dashboardToolPanel"),t=document.getElementById("dashboardToolTitle"),b=document.getElementById("dashboardToolBody");
  if(!p||!t||!b)return;
  if(tool==="performance"){
    var pc={};PR_PRODUCT_CATEGORIES.forEach(function(c){pc[c]=0;});
    products.forEach(function(x){if(pc[x.category]!==undefined)pc[x.category]++;});
    var bc={};buyers.forEach(function(x){if(x.interestedProduct)bc[x.interestedProduct]=(bc[x.interestedProduct]||0)+1;});
    t.textContent="Performance Wise";
    b.innerHTML='<p>Products and interested buyers by category.</p><div class="tool-grid">'+PR_PRODUCT_CATEGORIES.map(function(c){return '<div class="tool-stat"><b>'+escapeHtml(c)+'</b><strong>'+pc[c]+' products</strong><span>'+Number(bc[c]||0)+' buyers</span></div>';}).join("")+'</div>';
  }else if(tool==="calc"){
    var total=prPayments.reduce(function(s,x){return s+Number(x.amount||0);},0);
    t.textContent="Calc Breakdown";
    b.innerHTML='<div class="tool-grid"><div class="tool-stat"><b>Total Products</b><strong>'+products.length+'</strong></div><div class="tool-stat"><b>Total Buyers</b><strong>'+buyers.length+'</strong></div><div class="tool-stat"><b>Payments</b><strong>'+prPayments.length+'</strong></div><div class="tool-stat"><b>Recorded Payment Total</b><strong>'+prMoney(total)+'</strong></div></div>';
  }else if(tool==="paymentMode"){
    var modes={};PR_PAYMENT_MODES.forEach(function(m){modes[m]=0;});
    prPayments.forEach(function(x){modes[x.mode]=(modes[x.mode]||0)+1;});
    t.textContent="Payment Mode";
    b.innerHTML='<p>Select a payment method when adding a payment. Current records:</p><div class="tool-grid">'+Object.keys(modes).map(function(m){return '<div class="tool-stat"><b>'+escapeHtml(m)+'</b><strong>'+modes[m]+'</strong></div>';}).join("")+'</div><button class="primary-btn" onclick="prOpenPayment()">+ Add Payment</button>';
  }else if(tool==="payment"){
    t.textContent="Add Payment";
    b.innerHTML='<p>Record a buyer payment and keep its history in this device.</p><button class="primary-btn" onclick="prOpenPayment()">+ Add Payment</button><div id="prPaymentHistory"></div>';
    prRenderPaymentHistory();
  }else if(tool==="catalogue"){
    t.textContent="Catalogue";
    b.innerHTML='<p>Open the complete product catalogue.</p><button class="primary-btn" onclick="showSection("products");closeDashboardTool()">Open Product Catalogue</button>';
  }else if(tool==="proforma"){
    t.textContent="Add Proforma";
    b.innerHTML='<p>Create a print-ready proforma invoice from saved buyer and product data.</p><button class="primary-btn" onclick="prOpenProforma()">Create Proforma</button>';
  }else if(tool==="proformaLetter"){
    t.textContent="Add Proforma Letter";
    b.innerHTML='<p>Prepare a professional proforma covering letter.</p><button class="primary-btn" onclick="prOpenLetter()">Create Letter</button>';
  }
  p.style.display="block";
  p.scrollIntoView({behavior:"smooth",block:"start"});
}
window.openDashboardTool=prToolFinal;
window.prDeletePayment=prDeletePayment;
