// src/js/main.js
import { getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// Function to update the cart count display
function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartItems.length;
    cartCountElement.style.display = cartItems.length > 0 ? "block" : "none";
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
    const productList = document.getElementById("product-list");
    const template = document.getElementById("product-card-template").content;

    if (!productList || !template) {
      return;
    }

    for (const product of products) {
      const imageUrl = product.Image.replace("../", "/");
      const imageExists = await checkImageExists(imageUrl);
      if (!imageExists) {
        continue;
      }

      // Create and populate product card
      const productElement = document.importNode(template, true);
      const link = productElement.querySelector("a");
      const img = productElement.querySelector("img");
      link.href = `product_pages/index.html?product=${product.Id}`;
      productElement.querySelector(".card__brand").textContent =
        product.Brand.Name;
      productElement.querySelector(".product-card__price").textContent =
        `$${product.FinalPrice}`;
      productElement.querySelector(".card__name").textContent =
        product.NameWithoutBrand;
      img.src = imageUrl;
      img.alt = product.Name;
      productList.appendChild(productElement);
    }
  } catch {
    console.log("Error fetching product data");
  }
}

// Get search input and button elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Add event listener to search button
searchButton.addEventListener("click", searchProducts);

// Function to search products
function searchProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const productData = dataSource.getData();
  productData.then((productList) => {
    const filteredProducts = productList.filter(
      (product) =>
        product.Name.toLowerCase().includes(searchTerm) ||
        product.Brand.Name.toLowerCase().includes(searchTerm),
    );

    // Render filtered products
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    filteredProducts.forEach((product) => {
      const productCard = document.createElement("li");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <a href="product_pages/index.html?product=${product.Id}">
          <h3 class="card__brand">${product.Brand.Name}</h3>
          <img src="${product.Image.replace("../", "/")}" alt="${product.Name}" />
          <h2 class="card__name">${product.NameWithoutBrand}</h2>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      `;
      list.appendChild(productCard);
    });
  });
}

// Initialize cart count and products when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayProducts();
});

// Update cart count when cart is updated
window.addEventListener("cartUpdated", updateCartCount);

window.addEventListener("cartUpdated", updateCartCount);
