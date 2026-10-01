document.addEventListener("DOMContentLoaded", function () {

  let products = JSON.parse(localStorage.getItem("priorRidingProducts") || "[]");
  let buyers = JSON.parse(localStorage.getItem("priorRidingBuyers") || "[]");

  function saveData() {
    localStorage.setItem("priorRidingProducts", JSON.stringify(products));
    localStorage.setItem("priorRidingBuyers", JSON.stringify(buyers));
  }

  function showSection(section) {
    document.querySelectorAll(".section").forEach(function (el) {
      el.style.display = "none";
    });

    const target = document.getElementById(section);
    if (target) target.style.display = "block";

    document.querySelectorAll(".nav-btn").forEach(function (btn) {
      btn.classList.remove("active");
    });

    const activeBtn = document.querySelector('[data-section="' + section + '"]');
    if (activeBtn) activeBtn.classList.add("active");

    updateDashboard();
  }

  window.showSection = showSection;

  function updateDashboard() {
    const productCount = document.getElementById("productCount");
    const buyerCount = document.getElementById("buyerCount");
    const activeBuyerCount = document.getElementById("activeBuyerCount");
    const followupCount = document.getElementById("followupCount");

    if (productCount) productCount.textContent = products.length;
    if (buyerCount) buyerCount.textContent = buyers.length;

    if (activeBuyerCount) {
      activeBuyerCount.textContent =
        buyers.filter(function (b) {
          return b.status === "Active";
        }).length;
    }

    if (followupCount)
