/* eslint-disable no-console */
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");

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
    const consolidatedItems = consolidateCartItems(cartItems);
    const htmlItems = consolidatedItems
      .filter(
        (item) =>
          item &&
          item.Id &&
          item.Image &&
          item.Name &&
          item.Colors &&
          item.Colors[0] &&
          item.FinalPrice,
      )
      .map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");
    attachRemoveButtonListeners();
  } catch (error) {
    console.error("Error to render the items from the cart", error);
    productList.innerHTML = "<p>Error loading cart. Please try again.</p>";
  }
}

function consolidateCartItems(cartItems) {
  if (!cartItems || !Array.isArray(cartItems)) {
    return [];
  }

  const itemMap = cartItems.reduce((acc, item) => {
    if (!item || !item.Id) {
      return acc;
    }
    if (!acc[item.Id]) {
      acc[item.Id] = { ...item, Quantity: 1 };
    } else {
      acc[item.Id].Quantity += 1;
    }
    return acc;
  }, {});

  return Object.values(itemMap);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <span class="cart-card__remove" data-id="${item.Id}" style="cursor: pointer; position: absolute; top: 10px; right: 10px;">✕</span>
  </li>`;

  return newItem;
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

function removeCartItem(itemId) {
  let cartItems = getLocalStorage("so-cart");
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
  productList.innerHTML = "<p>Your cart is empty.</p>";
}

function summingTheValue() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");
  const newconsolidateCartItems = consolidateCartItems(cartItems);
  let totalPrice = 0;

  for (let i = 0; i < newconsolidateCartItems.length; i++) {
    const item = newconsolidateCartItems[i];
    const price = item.FinalPrice;
    const quantity = item.Quantity;
    totalPrice += price * quantity;
  }

  const rendering = document.querySelector(".total_value_number_span");
  rendering.textContent = totalPrice.toFixed(2);
}

renderCartContents();
summingTheValue();

window.addEventListener("cartUpdated", () => {
  console.log("Evento cartUpdated disparado, atualizando carrinho");
  renderCartContents();
});
