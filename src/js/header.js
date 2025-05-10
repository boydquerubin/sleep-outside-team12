import { getLocalStorage } from "./utils.mjs";

// Function to initialize the cart count badge
function initCartCount() {
  console.log("Inicializando cart count");
  const cartLink = document.querySelector(".cart a");
  if (!cartLink) {
    console.error("Elemento .cart a não encontrado");
    return;
  }
  
  // Create the cart count span if it doesn't exist
  let cartCountElement = document.getElementById("cart-count");
  if (!cartCountElement) {
    cartCountElement = document.createElement("span");
    cartCountElement.id = "cart-count";
    cartCountElement.className = "cart-count";
    cartLink.appendChild(cartCountElement);
    console.log("cart-count span criado");
  }
  
  updateCartCount();
}

// Function to update the cart count display
function updateCartCount() {
  try {
    const cartItems = getLocalStorage("so-cart") || [];
    console.log("Itens no carrinho:", cartItems.length);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = cartItems.length;
      cartCountElement.style.display = cartItems.length > 0 ? "block" : "none";
    } else {
      console.error("cart-count element não encontrado");
    }
  } catch (error) {
    console.error("Erro ao atualizar cart count:", error);
  }
}

// Initialize cart count when the page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded disparado");
  initCartCount();
});

// Update cart count when cart is updated
window.addEventListener("cartUpdated", () => {
  console.log("Evento cartUpdated disparado");
  updateCartCount();
});