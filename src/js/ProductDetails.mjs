import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      if (!this.product) {
        console.error(`Product not found for ID: ${this.productId}`);
        document.querySelector(".product-detail").innerHTML =
          "<p>Product not found.</p>";
        return;
      }
      console.log("Product data:", this.product);
      this.renderProductDetails();
      const addToCartButton = document.getElementById("addToCart");
      if (addToCartButton) {
        addToCartButton.addEventListener(
          "click",
          this.addProductToCart.bind(this),
        );
      } else {
        console.warn("Add to Cart button not found");
      }
    } catch (error) {
      console.error("Error initializing product details:", error);
      document.querySelector(".product-detail").innerHTML =
        "<p>Error loading product details.</p>";
    }
  }

  addProductToCart() {
    try {
      const cartItems = getLocalStorage("so-cart") || [];
      if (!Array.isArray(cartItems)) {
        cartItems = [];
      }

      const existingItem = cartItems.find(
        (item) => item.Id === this.product.Id,
      );

      if (existingItem) {
        existingItem.Quantity = (existingItem.Quantity || 1) + 1;
      } else {
        cartItems.push({ ...this.product, Quantity: 1 });
      }

      setLocalStorage("so-cart", cartItems);
      console.log("Cart updated:", cartItems);
      window.dispatchEvent(new Event("cartUpdated"));

      // Feedback visual
      const addToCartButton = document.getElementById("addToCart");
      if (addToCartButton) {
        addToCartButton.textContent = "Added!";
        setTimeout(() => {
          addToCartButton.textContent = "Add to Cart";
        }, 1000);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }

  renderProductDetails() {
    try {
      const brand = document.querySelector(".product__brand");
      const name = document.querySelector(".product__name");
      const image = document.querySelector(".product__image");
      const price = document.querySelector(".product-card__price");
      const color = document.querySelector(".product__color");
      const description = document.querySelector(".product__description");
      const addToCart = document.getElementById("addToCart");

      if (
        !brand ||
        !name ||
        !image ||
        !price ||
        !color ||
        !description ||
        !addToCart
      ) {
        console.error(
          "One or more DOM elements not found for product details",
          {
            brand,
            name,
            image,
            price,
            color,
            description,
            addToCart,
          },
        );
        document.querySelector(".product-detail").innerHTML =
          "<p>Error rendering product details.</p>";
        return;
      }

      // Priorizar PrimaryExtraLarge como imagem principal
      const imageSrc =
        this.product.Images?.PrimaryExtraLarge ||
        this.product.Images?.PrimaryLarge ||
        this.product.Images?.PrimaryMedium ||
        this.product.Image;
      console.log("Image source selected:", imageSrc); // Log para depuração
      if (!imageSrc) {
        console.warn(
          `No image source found for product ID: ${this.product.Id}`,
        );
        image.src = "/images/placeholder.jpg";
        image.alt = "No image available";
      } else {
        image.src = imageSrc; // URL absoluta da API, não precisa de replace('..', '')
        image.alt = this.product.NameWithoutBrand || "Product Image";
      }

      brand.textContent = this.product.Brand?.Name || "Unknown Brand";
      name.textContent = this.product.NameWithoutBrand || "Unknown Product";

      const finalPrice = this.product.FinalPrice;
      const originalPrice = this.product.SuggestedRetailPrice;
      if (finalPrice && originalPrice && finalPrice < originalPrice) {
        const amountSaved = (originalPrice - finalPrice).toFixed(2);
        const percentSaved = Math.round(
          ((originalPrice - finalPrice) / originalPrice) * 100,
        );
        price.innerHTML = `
        <span class="original-price">$${originalPrice.toFixed(2)}</span>
        <span class="final-price">$${finalPrice.toFixed(2)}</span>
        <span class="savings">You save $${amountSaved} (${percentSaved}%)</span>
      `;
      } else {
        price.textContent = finalPrice
          ? `$${finalPrice.toFixed(2)}`
          : "Price unavailable";
      }

      color.textContent =
        this.product.Colors?.length > 0
          ? this.product.Colors[0].ColorName || "N/A"
          : "N/A";
      description.innerHTML =
        this.product.DescriptionHtmlSimple || "No description available";
      addToCart.dataset.id = this.product.Id || "";
    } catch (error) {
      console.error("Error rendering product details:", error);
      document.querySelector(".product-detail").innerHTML =
        "<p>Error rendering product details.</p>";
    }
  }
}
