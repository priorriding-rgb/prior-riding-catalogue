
let buyers = JSON.parse(localStorage.getItem("priorRidingBuyers") || "[]");

function saveToStorage() {
  localStorage.setItem("priorRidingBuyers", JSON.stringify(buyers));
}

function openBuyerForm() {
  document.getElementById("buyerModal").classList.add("show");
  document.getElementById("buyerName").focus();
}

function closeBuyerForm() {
  document.getElementById("buyerModal").classList.remove("show");
  document.getElementById("buyerForm").reset();
}

function saveBuyer(event) {
  event.preventDefault();

  const buyer = {
    id: Date.now(),
    name: document.getElementById("buyerName").value.trim(),
    country: document.getElementById("buyerCountry").value.trim(),
    email: document.getElementById("buyerEmail").value.trim(),
    phone: document.getElementById("buyerPhone").value.trim(),
    status: document.getElementById("buyerStatus").value,
    notes: document.getElementById("buyerNotes").value.trim()
  };

  buyers.unshift(buyer);
  saveToStorage();
  closeBuyerForm();
  renderBuyers();
  updateStats();
}

function renderBuyers() {
  const list = document.getElementById("buyerList");
  const search = document.getElementById("searchInput").value.toLowerCase().trim();

  const filtered = buyers.filter(buyer =>
    `${buyer.name} ${buyer.country} ${buyer.email} ${buyer.phone} ${buyer.status}`
      .toLowerCase()
      .includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <h4>No buyers found</h4>
        <p>Click “+ Add Buyer” to add your first international buyer.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(buyer => `
    <div class="buyer-card">
      <div>
        <h4>${escapeHtml(buyer.name)}</h4>
        <p><strong>Country:</strong> ${escapeHtml(buyer.country)}</p>
        ${buyer.email ? `<p><strong>Email:</strong> ${escapeHtml(buyer.email)}</p>` : ""}
        ${buyer.phone ? `<p><strong>Phone:</strong> ${escapeHtml(buyer.phone)}</p>` : ""}
        ${buyer.notes ? `<p><strong>Notes:</strong> ${escapeHtml(buyer.notes)}</p>` : ""}
      </div>
      <span class="status">${escapeHtml(buyer.status)}</span>
    </div>
  `).join("");
}

function updateStats() {
  document.getElementById("totalBuyers").textContent = buyers.length;

  const active = buyers.filter(
    buyer => buyer.status === "Active"
  ).length;

  const followUps = buyers.filter(
    buyer => buyer.status === "Follow-up"
  ).length;

  document.getElementById("activeBuyers").textContent = active;
  document.getElementById("followUps").textContent = followUps;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  renderBuyers();
  updateStats();
});
