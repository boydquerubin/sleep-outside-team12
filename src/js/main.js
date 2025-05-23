import { getLocalStorage } from './utils.mjs';

// Function to update the cart count display
function updateCartCount() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartItems.length;
    cartCountElement.style.display = cartItems.length > 0 ? 'block' : 'none';
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Update cart count when cart is updated
window.addEventListener("cartUpdated", updateCartCount);