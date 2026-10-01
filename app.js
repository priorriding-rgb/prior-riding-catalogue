
function showSection(section) {
  var sections = document.querySelectorAll(".section");

  sections.forEach(function (item) {
    item.style.display = "none";
  });

  var selected = document.getElementById(section);

  if (selected) {
    selected.style.display = "block";
  }
}

function openProductModal() {
  var modal = document.getElementById("productModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeProductModal() {
  var modal = document.getElementById("productModal");

  if (modal) {
    modal.style.display = "none";
  }
}

function openBuyerModal() {
  var modal = document.getElementById("buyerModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeBuyerModal() {
  var modal = document.getElementById("buyerModal");

  if (modal) {
    modal.style.display = "none";
  }
}

window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openBuyerModal = openBuyerModal;
window.closeBuyerModal = closeBuyerModal;

document.addEventListener("DOMContentLoaded", function () {
  showSection("dashboard");
});
