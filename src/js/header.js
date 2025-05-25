import { getLocalStorage } from "./utils.mjs";

// Function to initialize the cart count badge
function initCartCount() {
  const cartLink = document.querySelector(".cart a");
  if (!cartLink) {
    console.error("Element .cart a not found");
    return;
  }

  // Create the cart count span if it doesn't exist
  let cartCountElement = document.getElementById("cart-count");
  if (!cartCountElement) {
    cartCountElement = document.createElement("span");
    cartCountElement.id = "cart-count";
    cartCountElement.className = "cart-count";
    cartLink.appendChild(cartCountElement);
  }

  updateCartCount();
}

// Function to update the cart count display
function updateCartCount() {
  try {
    const cartItems = getLocalStorage("so-cart") || [];
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      const totalQuantity = cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0);
      cartCountElement.textContent = totalQuantity > 0 ? totalQuantity : '';
      cartCountElement.style.display = totalQuantity > 0 ? "block" : "none";
    } else {
      console.error("cart-count element não encontrado");
    }
  } catch (error) {
    console.error("Erro ao atualizar cart count:", error);
  }
}

// Initialize cart count after header/footer are loaded
window.addEventListener("headerFooterLoaded", () => {
  initCartCount();
});

// Update cart count when cart is updated
window.addEventListener("cartUpdated", () => {
  updateCartCount();
});