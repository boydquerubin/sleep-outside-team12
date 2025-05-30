import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");
  const mainElement = document.querySelector("main.divider");

  if (!productList) {
    console.error("Element .product-list not found in the DOM");
    return;
  }

  if (!mainElement) {
    console.error("Element main.divider not found in the DOM");
    return;
  }

  // Remove any existing checkout button to avoid duplicates
  const existingButton = document.querySelector(".button_checkout");
  if (existingButton) {
    existingButton.remove();
  }

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    console.log("The cart is empty");
    productList.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  if (cartItems.length > 1) {
    for (let i = 0; i < cartItems.length; i++) {
      console.log("Item " + i + " do carrinho:", cartItems[i]);
    }
  } else {
    console.log("Item 0 do carrinho:", cartItems[0]);
  }

  try {
    const htmlItems = cartItems
      .filter(
        (item) =>
          item &&
          item.Id &&
          (item.Image || item.Images?.PrimaryMedium) &&
          item.Name &&
          item.Colors &&
          item.Colors[0] &&
          item.FinalPrice,
      )
      .map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");

    const checkoutButton = document.createElement("button");
    checkoutButton.className = "button_checkout";
    checkoutButton.textContent = "Go to Checkout";
    checkoutButton.onclick = () => {
      window.location.href = "../checkout/index.html";
    };
    mainElement.appendChild(checkoutButton);

    attachRemoveButtonListeners();
    attachQuantityButtonListeners();
  } catch (error) {
    console.error("Error to render the items from the cart", error);
    productList.innerHTML = "<p>Error loading cart. Please try again.</p>";
  }
}

function cartItemTemplate(item) {
  try {
    const imageSrc = item.Images?.PrimaryMedium || item.Image || "/images/placeholder.jpg";
    const imageAlt = item.Name || "Product Image";
    const colorName = item.Colors[0]?.ColorName || "N/A";

    const newItem = `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${imageSrc.replace('..', '')}"
          alt="${imageAlt}"
          onerror="this.src='/images/placeholder.jpg'; this.alt='No image available';"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name || "Unknown Product"}</h2>
      </a>
      <p class="cart-card__color">${colorName}</p>
      <div class="cart-card__quantity">
        <button class="quantity-decrease" data-id="${item.Id}">-</button>
        <span class="quantity">qty: ${item.Quantity || 1}</span>
        <button class="quantity-increase" data-id="${item.Id}">+</button>
      </div>
      <p class="cart-card__price">$${item.FinalPrice?.toFixed(2) || "0.00"}</p>
      <span class="cart-card__remove" data-id="${item.Id}" style="cursor: pointer; position: absolute; top: 10px; right: 10px;">✕</span>
    </li>`;

    return newItem;
  } catch (error) {
    console.error(`Error rendering cart item with ID ${item.Id}:`, error);
    return `<li class="cart-card divider"><p>Error loading item ${item.Id}</p></li>`;
  }
}

function attachRemoveButtonListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      removeCartItem(itemId);
    });
  });
}

function attachQuantityButtonListeners() {
  const increaseButtons = document.querySelectorAll(".quantity-increase");
  const decreaseButtons = document.querySelectorAll(".quantity-decrease");

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      updateCartItemQuantity(itemId, 1);
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      updateCartItemQuantity(itemId, -1);
    });
  });
}

function updateCartItemQuantity(itemId, change) {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);
  if (itemIndex === -1) {
    console.warn(`Item with ID ${itemId} not found in cart`);
    return;
  }

  const newQuantity = (cartItems[itemIndex].Quantity || 1) + change;

  if (newQuantity <= 0) {
    cartItems.splice(itemIndex, 1);
    console.log(`Item with ID ${itemId} removed from cart due to quantity 0`);
  } else {
    cartItems[itemIndex].Quantity = newQuantity;
    console.log(`Updated quantity of item ${itemId} to ${newQuantity}`);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  summingTheValue();
  window.dispatchEvent(new Event("cartUpdated"));
}

function removeCartItem(itemId) {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems = cartItems.filter((item) => item.Id !== itemId);
  setLocalStorage("so-cart", cartItems);
  console.log(`Item with ID ${itemId} removed from cart`);
  renderCartContents();
  summingTheValue();
  window.dispatchEvent(new Event("cartUpdated"));
}

function clearCart() {
  localStorage.removeItem("so-cart");
  const productList = document.querySelector(".product-list");
  if (productList) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
  }
}

function summingTheValue() {
  const cartItems = getLocalStorage("so-cart");
  const rendering = document.querySelector(".total_value_number_span");

  if (!rendering) {
    console.error("Element .total_value_number_span not found in the DOM");
    return;
  }

  let totalPrice = 0;
  if (cartItems && Array.isArray(cartItems)) {
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      const price = item.FinalPrice || 0;
      const quantity = item.Quantity || 1;
      totalPrice += price * quantity;
    }
  }

  rendering.textContent = totalPrice.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("cart.js: DOMContentLoaded triggered");
  renderCartContents();
  summingTheValue();
});

window.addEventListener("cartUpdated", () => {
  renderCartContents();
});