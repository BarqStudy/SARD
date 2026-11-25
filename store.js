const products = new Map([
  ["blue", "سرد الأزرق"],
  ["white", "سرد الأبيض"],
  ["color", "سرد الملوّن"],
]);
const unitPrice = 99;
const storageKey = "sard-cart-v1";
const number = new Intl.NumberFormat("ar-SA");
const price = (value) => `${number.format(value)} ر.س`;

const dialog = document.querySelector(".cart");
const cartToggle = document.querySelector(".cart-toggle");
const list = document.querySelector(".cart-list");
const summary = document.querySelector(".cart-summary");
const empty = document.querySelector(".cart-empty");
const toast = document.querySelector(".toast");
const cart = new Map();
let toastTimer;

try {
  const saved = JSON.parse(localStorage.getItem(storageKey)) ?? {};
  for (const id of products.keys()) {
    if (Number.isInteger(saved[id]) && saved[id] > 0 && saved[id] <= 99) {
      cart.set(id, saved[id]);
    }
  }
} catch {
  // The cart still works in memory when storage is unavailable.
}

function quantityButton(id, delta) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = id;
  button.dataset.delta = delta;
  button.textContent = delta > 0 ? "+" : "−";
  const action = delta > 0 ? "زيادة كمية" : "تقليل كمية";
  button.setAttribute("aria-label", `${action} ${products.get(id)}`);
  return button;
}

function renderCart() {
  let count = 0;
  list.replaceChildren();
  for (const [id, quantity] of cart) {
    count += quantity;
    const row = document.createElement("li");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    const subtotal = document.createElement("small");
    title.textContent = products.get(id);
    subtotal.textContent = price(quantity * unitPrice);
    details.append(title, subtotal);

    const controls = document.createElement("div");
    const quantityLabel = document.createElement("span");
    controls.className = "qty";
    quantityLabel.textContent = number.format(quantity);
    controls.append(quantityButton(id, -1), quantityLabel, quantityButton(id, 1));
    row.append(details, controls);
    list.append(row);
  }
  document.querySelector("[data-count]").textContent = number.format(count);
  document.querySelector("[data-total]").textContent = price(count * unitPrice);
  empty.hidden = count > 0;
  summary.hidden = count === 0;
}

function updateQuantity(id, delta) {
  const quantity = (cart.get(id) ?? 0) + delta;
  if (quantity > 99) return false;
  if (quantity > 0) cart.set(id, quantity);
  else cart.delete(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(cart)));
  } catch {
    // Storage can be blocked by the browser.
  }
  renderCart();
  return true;
}

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.product;
    const added = updateQuantity(id, 1);
    toast.textContent = added ? `أضفت ${products.get(id)} للسلة` : "وصلت للحد الأقصى لهذا الإصدار";
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
  });
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const { id, delta } = button.dataset;
  if (updateQuantity(id, Number(delta))) {
    const matchingButton = list.querySelector(`[data-id="${id}"][data-delta="${delta}"]`);
    const nextButton = matchingButton ?? list.querySelector("button") ?? empty.querySelector("button");
    nextButton.focus();
  }
});

cartToggle.addEventListener("click", () => dialog.showModal());
empty.querySelector("button").addEventListener("click", () => {
  document.querySelector("#editions").scrollIntoView();
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right) dialog.close();
});

renderCart();
