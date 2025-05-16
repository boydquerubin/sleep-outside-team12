// src/js/main.js
import { getLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

// Function to update the cart count display
function updateCartCount() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartItems.length;
    cartCountElement.style.display = cartItems.length > 0 ? 'block' : 'none';
  }
}

// Function to check if an image exists and is valid
async function checkImageExists(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
    };
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

// Function to display products dynamically
async function displayProducts() {
  try {
    const products = await dataSource.getData();
    const productList = document.getElementById('product-list');
    const template = document.getElementById('product-card-template').content;

    if (!productList || !template) {
      return;
    }

    for (const product of products) {
      const imageUrl = product.Image.replace('../', '/');
      const imageExists = await checkImageExists(imageUrl);
      if (!imageExists) {
        continue;
      }

      // Create and populate product card
      const productElement = document.importNode(template, true);
      const link = productElement.querySelector('a');
      const img = productElement.querySelector('img');
      link.href = `product_pages/index.html?product=${product.Id}`;
      productElement.querySelector('.card__brand').textContent = product.Brand.Name;
      productElement.querySelector('.product-card__price').textContent = `$${product.FinalPrice}`;
      productElement.querySelector('.card__name').textContent = product.NameWithoutBrand;
      img.src = imageUrl;
      img.alt = product.Name;
      productList.appendChild(productElement);
    }
  } catch {
    console.log('Error fetching product data');
  }
}

// Initialize cart count and products when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  displayProducts();
});

// Update cart count when cart is updated
window.addEventListener('cartUpdated', updateCartCount);