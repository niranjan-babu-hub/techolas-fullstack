/* =========================================================
   FoodieHub – script.js
   Vanilla JavaScript: fetch recipes, render menu, search,
   filter, sort, cart (LocalStorage) and demo checkout.
   ========================================================= */

/* ---------- Config ---------- */
const API_URL = "https://dummyjson.com/recipes?limit=0";
const CART_STORAGE_KEY = "foodiehub-cart";
const DELIVERY_FEE = 40;            // ₹ per order
const FREE_DELIVERY_FROM = 499;     // free delivery when subtotal reaches this
const PREFERRED_CATEGORY_ORDER = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];
const CATEGORY_EMOJI = {
  All: "🍽️", Breakfast: "🥞", Lunch: "🍱", Dinner: "🍝", Dessert: "🍰",
  Snack: "🍿", Appetizer: "🥟", "Side Dish": "🥗", Beverage: "🥤",
};
// Friendlier labels for some API mealType values (the filter still uses the API value)
// The API uses both "Snack" and "Snacks" – treat them as one category
const MEAL_TYPE_ALIASES = { Snacks: "Snack" };
const CATEGORY_LABEL = { Snack: "Snacks", Appetizer: "Appetizers", Beverage: "Beverages", "Side Dish": "Side Dishes" };

/* ---------- App state ---------- */
const state = {
  recipes: [],
  category: "All",
  search: "",
  sort: "default",
  cart: loadCart(),
};

/* ---------- DOM references ---------- */
const $ = (selector) => document.querySelector(selector);
const els = {
  navbar: $("#navbar"),
  navLinks: $("#navLinks"),
  hamburger: $("#hamburger"),
  navSearchBtn: $("#navSearchBtn"),
  cartBtn: $("#cartBtn"),
  cartCount: $("#cartCount"),
  heroSearchForm: $("#heroSearchForm"),
  heroSearch: $("#heroSearch"),
  categoryList: $("#categoryList"),
  menuSearch: $("#menuSearch"),
  sortSelect: $("#sortSelect"),
  resultsInfo: $("#resultsInfo"),
  foodGrid: $("#foodGrid"),
  emptyState: $("#emptyState"),
  errorState: $("#errorState"),
  errorMessage: $("#errorMessage"),
  retryBtn: $("#retryBtn"),
  clearFiltersBtn: $("#clearFiltersBtn"),
  overlay: $("#overlay"),
  cartDrawer: $("#cartDrawer"),
  closeCartBtn: $("#closeCartBtn"),
  cartItems: $("#cartItems"),
  cartEmpty: $("#cartEmpty"),
  cartFooter: $("#cartFooter"),
  cartSubtotal: $("#cartSubtotal"),
  cartDelivery: $("#cartDelivery"),
  cartTotal: $("#cartTotal"),
  checkoutBtn: $("#checkoutBtn"),
  clearCartBtn: $("#clearCartBtn"),
  browseMenuBtn: $("#browseMenuBtn"),
  detailsModal: $("#detailsModal"),
  detailsContent: $("#detailsContent"),
  orderModal: $("#orderModal"),
  orderMessage: $("#orderMessage"),
  checkoutForm: $("#checkoutForm"),
  summaryItems: $("#summaryItems"),
  summarySubtotal: $("#summarySubtotal"),
  summaryDelivery: $("#summaryDelivery"),
  summaryTotal: $("#summaryTotal"),
  cartError: $("#cartError"),
  toast: $("#toast"),
  year: $("#year"),
};

/* =========================================================
   Helpers
   ========================================================= */

/** The API has no prices, so we create a stable demo price from the recipe id (₹99 – ₹309). */
function getPrice(id) {
  return 99 + ((id * 37) % 22) * 10;
}

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

/** Escape text before putting it inside innerHTML. */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function categoryLabel(category) {
  return CATEGORY_LABEL[category] || category;
}

/** Normalised mealType list for a recipe (merges API spelling variants). */
function getMealTypes(recipe) {
  const types = (recipe.mealType || []).map((type) => MEAL_TYPE_ALIASES[type] || type);
  return [...new Set(types)];
}

function findRecipe(id) {
  return state.recipes.find((recipe) => recipe.id === id);
}

let toastTimer;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

/* =========================================================
   Fetching
   ========================================================= */

async function fetchRecipes() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`The server responded with status ${response.status}.`);
  }
  const data = await response.json();
  if (!data || !Array.isArray(data.recipes)) {
    throw new Error("The menu data looks incomplete.");
  }
  // Attach our demo price to each recipe
  return data.recipes.map((recipe) => ({ ...recipe, price: getPrice(recipe.id) }));
}

async function loadMenu() {
  showLoading();
  try {
    state.recipes = await fetchRecipes();
    renderCategories();
    renderMenu();
  } catch (error) {
    console.error("Failed to load recipes:", error);
    showError(error);
  }
}

/* =========================================================
   Rendering – loading / error
   ========================================================= */

function showLoading() {
  els.errorState.classList.add("hidden");
  els.emptyState.classList.add("hidden");
  els.foodGrid.classList.remove("hidden");
  els.foodGrid.setAttribute("aria-busy", "true");
  els.resultsInfo.textContent = "Loading delicious dishes…";

  els.categoryList.innerHTML = Array.from({ length: 6 }, () =>
    `<span class="category-skeleton skeleton" aria-hidden="true"></span>`
  ).join("");

  els.foodGrid.innerHTML = Array.from({ length: 8 }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-img skeleton"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w-40 skeleton"></div>
        <div class="skeleton-line w-90 skeleton"></div>
        <div class="skeleton-line w-70 skeleton"></div>
        <div class="skeleton-line tall skeleton"></div>
      </div>
    </div>`).join("");
}

function showError(error) {
  els.foodGrid.innerHTML = "";
  els.foodGrid.classList.add("hidden");
  els.foodGrid.setAttribute("aria-busy", "false");
  els.categoryList.innerHTML = "";
  els.resultsInfo.textContent = "";
  els.errorMessage.textContent =
    (navigator.onLine === false ? "You seem to be offline. " : "") +
    "We couldn't reach the kitchen. " + (error && error.message ? error.message : "") +
    " Please try again.";
  els.errorState.classList.remove("hidden");
}

/* =========================================================
   Rendering – categories
   ========================================================= */

function getCategories() {
  const counts = {};
  state.recipes.forEach((recipe) => {
    getMealTypes(recipe).forEach((type) => {
      counts[type] = (counts[type] || 0) + 1;
    });
  });
  const available = Object.keys(counts);
  const preferred = PREFERRED_CATEGORY_ORDER.filter((type) => available.includes(type));
  const others = available.filter((type) => !preferred.includes(type)).sort();
  return {
    list: ["All", ...preferred, ...others],
    counts: { All: state.recipes.length, ...counts },
  };
}

function renderCategories() {
  const { list, counts } = getCategories();
  els.categoryList.innerHTML = list.map((category) => `
    <button type="button" class="category-btn ${category === state.category ? "active" : ""}"
      data-category="${escapeHTML(category)}" aria-pressed="${category === state.category}">
      <span class="cat-emoji" aria-hidden="true">${CATEGORY_EMOJI[category] || "🍴"}</span>
      ${escapeHTML(categoryLabel(category))}
      <span class="cat-count">${counts[category]}</span>
    </button>`).join("");
}

function setCategory(category) {
  state.category = category;
  els.categoryList.querySelectorAll(".category-btn").forEach((btn) => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  renderMenu();
}

/* =========================================================
   Searching, filtering & sorting
   ========================================================= */

function searchRecipes(recipes, query) {
  const text = query.trim().toLowerCase();
  if (!text) return recipes;
  return recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(text) ||
    recipe.cuisine.toLowerCase().includes(text) ||
    (recipe.tags || []).some((tag) => tag.toLowerCase().includes(text))
  );
}

function filterByCategory(recipes, category) {
  if (category === "All") return recipes;
  return recipes.filter((recipe) => getMealTypes(recipe).includes(category));
}

function sortRecipes(recipes, sort) {
  const sorted = [...recipes];
  switch (sort) {
    case "rating-desc": return sorted.sort((a, b) => b.rating - a.rating);
    case "rating-asc": return sorted.sort((a, b) => a.rating - b.rating);
    case "price-asc": return sorted.sort((a, b) => a.price - b.price);
    case "price-desc": return sorted.sort((a, b) => b.price - a.price);
    default: return sorted;
  }
}

function getVisibleRecipes() {
  const searched = searchRecipes(state.recipes, state.search);
  const filtered = filterByCategory(searched, state.category);
  return sortRecipes(filtered, state.sort);
}

function setSearch(value) {
  state.search = value;
  if (els.menuSearch.value !== value) els.menuSearch.value = value;
  if (els.heroSearch.value !== value) els.heroSearch.value = value;
  if (state.recipes.length) renderMenu();
}

function clearFilters() {
  setSearch("");
  state.sort = "default";
  els.sortSelect.value = "default";
  setCategory("All");
}

/* =========================================================
   Rendering – menu
   ========================================================= */

function createFoodCard(recipe, index) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  return `
    <article class="food-card" style="animation-delay:${Math.min(index, 12) * 40}ms">
      <div class="food-img-wrap">
        <img src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}" loading="lazy" width="400" height="300" />
        <span class="badge">${escapeHTML(categoryLabel(getMealTypes(recipe)[0] || recipe.cuisine))}</span>
        <span class="badge badge-time" title="Total time">⏱ ${totalTime} min</span>
      </div>
      <div class="food-body">
        <div class="food-meta">
          <span class="food-cuisine">${escapeHTML(recipe.cuisine)}</span>
          <span class="rating" aria-label="Rated ${recipe.rating} out of 5">
            <span class="star" aria-hidden="true">★</span>${recipe.rating.toFixed(1)}
            <small>(${recipe.reviewCount})</small>
          </span>
        </div>
        <h3 class="food-name">${escapeHTML(recipe.name)}</h3>
        <div class="food-meta"><span>🔪 Prep ${recipe.prepTimeMinutes} min</span><span>🔥 ${recipe.caloriesPerServing} kcal</span></div>
        <div class="food-foot">
          <span class="price">${formatPrice(recipe.price)}</span>
        </div>
        <div class="food-actions">
          <button type="button" class="btn btn-outline" data-action="details" data-id="${recipe.id}">View Details</button>
          <button type="button" class="btn btn-primary" data-action="add" data-id="${recipe.id}">Add to Cart</button>
        </div>
      </div>
    </article>`;
}

function renderMenu() {
  const visible = getVisibleRecipes();
  els.foodGrid.setAttribute("aria-busy", "false");
  els.errorState.classList.add("hidden");

  if (visible.length === 0) {
    els.foodGrid.innerHTML = "";
    els.foodGrid.classList.add("hidden");
    els.emptyState.classList.remove("hidden");
    els.resultsInfo.textContent = "0 dishes found";
    return;
  }

  els.emptyState.classList.add("hidden");
  els.foodGrid.classList.remove("hidden");
  els.foodGrid.innerHTML = visible.map(createFoodCard).join("");

  const parts = [`Showing ${visible.length} ${visible.length === 1 ? "dish" : "dishes"}`];
  if (state.category !== "All") parts.push(`in ${categoryLabel(state.category)}`);
  if (state.search.trim()) parts.push(`for “${state.search.trim()}”`);
  els.resultsInfo.textContent = parts.join(" ");
}

/* =========================================================
   Food details modal
   ========================================================= */

let lastFocused = null;

function openModal(modal) {
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  const focusTarget = modal.querySelector(".modal-close, [data-close-modal].btn");
  if (focusTarget) focusTarget.focus();
}

function closeModal(modal) {
  modal.hidden = true;
  if (!isCartOpen() && els.detailsModal.hidden && els.orderModal.hidden) {
    document.body.classList.remove("no-scroll");
  }
  if (lastFocused) lastFocused.focus();
}

function openDetails(id) {
  const recipe = findRecipe(id);
  if (!recipe) return;

  els.detailsContent.innerHTML = `
    <div class="details-hero">
      <img src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}" />
      <div class="details-hero-text">
        <span class="food-cuisine">${escapeHTML(recipe.cuisine)} · ${escapeHTML(getMealTypes(recipe).map(categoryLabel).join(", "))}</span>
        <h2 id="detailsTitle">${escapeHTML(recipe.name)}</h2>
      </div>
    </div>
    <div class="details-body">
      <div class="details-stats">
        <div class="stat"><span>Rating</span><strong>★ ${recipe.rating.toFixed(1)} <small>(${recipe.reviewCount})</small></strong></div>
        <div class="stat"><span>Prep time</span><strong>${recipe.prepTimeMinutes} min</strong></div>
        <div class="stat"><span>Cook time</span><strong>${recipe.cookTimeMinutes} min</strong></div>
        <div class="stat"><span>Servings</span><strong>${recipe.servings}</strong></div>
        <div class="stat"><span>Calories</span><strong>${recipe.caloriesPerServing} kcal</strong></div>
      </div>
      <div class="details-cols">
        <div>
          <h3>Ingredients</h3>
          <ul class="ingredient-list">
            ${recipe.ingredients.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h3>Instructions</h3>
          <ol class="instruction-list">
            ${recipe.instructions.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}
          </ol>
        </div>
      </div>
    </div>
    <div class="details-foot">
      <span class="price">${formatPrice(recipe.price)}</span>
      <button type="button" class="btn btn-primary" data-action="add" data-id="${recipe.id}">Add to Cart</button>
    </div>`;

  openModal(els.detailsModal);
}

/* =========================================================
   Cart management (LocalStorage)
   ========================================================= */

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((item) => item && item.id && item.qty > 0) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  } catch (error) {
    console.warn("Could not save cart:", error);
  }
}

function addToCart(id) {
  const recipe = findRecipe(id);
  if (!recipe) return;

  const existing = state.cart.find((item) => item.id === id); // avoid duplicates by id
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: recipe.id, name: recipe.name, image: recipe.image, price: recipe.price, qty: 1 });
  }
  updateCart();
  showToast(`${recipe.name} added to cart`);
  els.cartCount.classList.remove("bump");
  void els.cartCount.offsetWidth; // restart animation
  els.cartCount.classList.add("bump");
}

function changeQuantity(id, delta) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCart();
}

function removeFromCart(id) {
  const item = state.cart.find((entry) => entry.id === id);
  state.cart = state.cart.filter((entry) => entry.id !== id);
  updateCart();
  if (item) showToast(`${item.name} removed`);
}

function clearCart() {
  state.cart = [];
  updateCart();
}

function getCartTotals() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { count, subtotal, delivery, total: subtotal + delivery };
}

function deliveryText(totals) {
  if (totals.subtotal === 0) return formatPrice(0);
  return totals.delivery === 0 ? '<span class="free-tag">FREE</span>' : formatPrice(totals.delivery);
}

function renderCart() {
  const totals = getCartTotals();
  els.cartCount.textContent = totals.count;
  els.cartBtn.setAttribute("aria-label", `Open cart, ${totals.count} item${totals.count === 1 ? "" : "s"}`);

  const isEmpty = state.cart.length === 0;
  els.cartEmpty.classList.toggle("hidden", !isEmpty);
  els.cartFooter.classList.toggle("hidden", isEmpty);

  els.cartItems.innerHTML = state.cart.map((item) => `
    <li class="cart-item">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" width="72" height="72" />
      <div>
        <div class="ci-top">
          <div>
            <p class="ci-name">${escapeHTML(item.name)}</p>
            <p class="ci-unit">${formatPrice(item.price)} each</p>
          </div>
          <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove ${escapeHTML(item.name)}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
        <div class="ci-bottom">
          <div class="qty-control" role="group" aria-label="Quantity for ${escapeHTML(item.name)}">
            <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <span class="ci-total">${formatPrice(item.price * item.qty)}</span>
        </div>
      </div>
    </li>`).join("");

  els.cartSubtotal.textContent = formatPrice(totals.subtotal);
  els.cartDelivery.innerHTML = deliveryText(totals);
  els.cartTotal.textContent = formatPrice(totals.total);
}

function renderOrderSummary() {
  const totals = getCartTotals();
  if (state.cart.length === 0) {
    els.summaryItems.innerHTML = `<li class="summary-empty">Your cart is empty. <a href="#menu">Add some dishes</a> to place an order.</li>`;
  } else {
    els.summaryItems.innerHTML = state.cart.map((item) => `
      <li class="summary-item">
        <img src="${escapeHTML(item.image)}" alt="" width="48" height="48" />
        <span class="si-name">${escapeHTML(item.name)}<small>${item.qty} × ${formatPrice(item.price)}</small></span>
        <span class="si-price">${formatPrice(item.price * item.qty)}</span>
      </li>`).join("");
  }
  els.summarySubtotal.textContent = formatPrice(totals.subtotal);
  els.summaryDelivery.innerHTML = deliveryText(totals);
  els.summaryTotal.textContent = formatPrice(totals.total);
}

function updateCart() {
  saveCart();
  renderCart();
  renderOrderSummary();
  if (state.cart.length > 0) els.cartError.textContent = "";
}

/* ---------- Cart drawer ---------- */
function isCartOpen() {
  return els.cartDrawer.classList.contains("open");
}

function openCart() {
  lastFocused = document.activeElement;
  els.cartDrawer.classList.add("open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  els.cartBtn.setAttribute("aria-expanded", "true");
  els.overlay.hidden = false;
  document.body.classList.add("no-scroll");
  els.closeCartBtn.focus();
}

function closeCart() {
  els.cartDrawer.classList.remove("open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
  els.cartBtn.setAttribute("aria-expanded", "false");
  els.overlay.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lastFocused) lastFocused.focus();
}

/* =========================================================
   Checkout
   ========================================================= */

function setFieldError(input, message) {
  const group = input.closest(".form-group");
  const errorEl = document.getElementById(input.getAttribute("aria-describedby"));
  group.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message;
}

function validateCheckout() {
  const form = els.checkoutForm;
  const name = form.name.value.trim();
  const phone = form.phone.value.replace(/[\s-]/g, "");
  const address = form.address.value.trim();
  let firstInvalid = null;

  const nameError = !name ? "Please enter your name." :
    name.length < 2 ? "Name should be at least 2 characters." :
    !/^[A-Za-z][A-Za-z .'-]*$/.test(name) ? "Name can only contain letters and spaces." : "";
  const phoneError = !phone ? "Please enter your phone number." :
    !/^(\+91)?[6-9]\d{9}$/.test(phone) ? "Enter a valid 10-digit mobile number." : "";
  const addressError = !address ? "Please enter your delivery address." :
    address.length < 10 ? "Please enter a complete address (at least 10 characters)." : "";

  [[form.name, nameError], [form.phone, phoneError], [form.address, addressError]].forEach(([input, error]) => {
    setFieldError(input, error);
    if (error && !firstInvalid) firstInvalid = input;
  });

  els.cartError.textContent = state.cart.length === 0 ? "Your cart is empty — add at least one dish first." : "";

  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid && state.cart.length > 0;
}

function placeOrder(event) {
  event.preventDefault();
  if (!validateCheckout()) return;

  const name = els.checkoutForm.name.value.trim().split(" ")[0];
  const { total, count } = getCartTotals();
  const orderId = "FH" + Date.now().toString().slice(-6);

  els.orderMessage.innerHTML =
    `Thank you, <strong>${escapeHTML(name)}</strong>! Your order <strong>#${orderId}</strong> of ` +
    `${count} item${count === 1 ? "" : "s"} (${formatPrice(total)}) has been placed. ` +
    `It will arrive in about 30–40 minutes. <br/><small>(This is a demo — no payment was taken.)</small>`;

  clearCart();
  els.checkoutForm.reset();
  openModal(els.orderModal);
}

/* =========================================================
   Navigation
   ========================================================= */

function toggleMobileMenu(force) {
  const open = typeof force === "boolean" ? force : !els.navLinks.classList.contains("open");
  els.navLinks.classList.toggle("open", open);
  els.hamburger.setAttribute("aria-expanded", String(open));
  els.hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function scrollToMenuSearch() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => els.menuSearch.focus({ preventScroll: true }), 500);
}

function watchActiveSection() {
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href")));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((section) => section && observer.observe(section));
}

/* =========================================================
   Event listeners
   ========================================================= */

function setupEventListeners() {
  // Navbar
  els.hamburger.addEventListener("click", () => toggleMobileMenu());
  els.navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) toggleMobileMenu(false); });
  els.navSearchBtn.addEventListener("click", () => { toggleMobileMenu(false); scrollToMenuSearch(); });
  els.cartBtn.addEventListener("click", () => { toggleMobileMenu(false); openCart(); });
  window.addEventListener("scroll", () => els.navbar.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  // Search (hero + menu stay in sync)
  els.heroSearch.addEventListener("input", (e) => setSearch(e.target.value));
  els.heroSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setSearch(els.heroSearch.value);
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
  els.menuSearch.addEventListener("input", (e) => setSearch(e.target.value));

  // Sort
  els.sortSelect.addEventListener("change", (e) => { state.sort = e.target.value; renderMenu(); });

  // Categories (event delegation)
  els.categoryList.addEventListener("click", (e) => {
    const btn = e.target.closest(".category-btn");
    if (!btn) return;
    setCategory(btn.dataset.category);
    if (e.currentTarget.closest("#categories")) {
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    }
  });

  // Food cards & details modal buttons (event delegation)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    switch (btn.dataset.action) {
      case "details": openDetails(id); break;
      case "add": addToCart(id); break;
      case "increase": changeQuantity(id, 1); break;
      case "decrease": changeQuantity(id, -1); break;
      case "remove": removeFromCart(id); break;
    }
  });

  // States
  els.retryBtn.addEventListener("click", loadMenu);
  els.clearFiltersBtn.addEventListener("click", clearFilters);

  // Cart drawer
  els.closeCartBtn.addEventListener("click", closeCart);
  els.overlay.addEventListener("click", closeCart);
  els.browseMenuBtn.addEventListener("click", () => {
    closeCart();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
  els.checkoutBtn.addEventListener("click", () => {
    closeCart();
    document.getElementById("checkout").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => els.checkoutForm.name.focus({ preventScroll: true }), 500);
  });
  els.clearCartBtn.addEventListener("click", () => {
    if (confirm("Remove all items from your cart?")) {
      clearCart();
      showToast("Cart cleared");
    }
  });

  // Modals: close buttons, backdrop and Escape key
  [els.detailsModal, els.orderModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-modal]")) closeModal(modal);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!els.orderModal.hidden) closeModal(els.orderModal);
    else if (!els.detailsModal.hidden) closeModal(els.detailsModal);
    else if (isCartOpen()) closeCart();
    else toggleMobileMenu(false);
  });

  // Order confirmation "Back to menu" scrolls to the menu
  els.orderModal.querySelector(".btn[data-close-modal]").addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  // Checkout form
  els.checkoutForm.addEventListener("submit", placeOrder);
  els.checkoutForm.addEventListener("input", (e) => {
    if (e.target.closest(".form-group.invalid")) setFieldError(e.target, "");
  });
}

/* =========================================================
   Init
   ========================================================= */

function init() {
  els.year.textContent = new Date().getFullYear();
  setupEventListeners();
  watchActiveSection();
  renderCart();
  renderOrderSummary();
  loadMenu();
}

init();
