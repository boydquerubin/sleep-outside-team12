// src/js/ProductDetails.mjs
import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      return;
    }

    // Check if image exists
    const imageUrl = this.product.Image.replace('..', '');
    const imageExists = await this.checkImageExists(imageUrl);
    if (!imageExists) {
      return;
    }

    this.renderProductDetails();

    // Add event listener for "Add to Cart" button
    const addToCartButton = document.getElementById('addToCart');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
    }
  }

  // Function to check if an image exists
  async checkImageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
    window.dispatchEvent(new Event('cartUpdated'));
  }

  renderProductDetails() {
    const h3 = document.querySelector('h3');
    const h2 = document.querySelector('h2.divider');
    const img = document.querySelector('img.divider');
    const price = document.querySelector('.product-card__price');
    const color = document.querySelector('.product__color');
    const description = document.querySelector('.product__description');
    const addToCart = document.querySelector('#addToCart');

    if (h3) h3.textContent = this.product.Brand.Name;
    if (h2) h2.textContent = this.product.NameWithoutBrand;
    if (img) {
      img.src = this.product.Image.replace('..', '');
      img.alt = this.product.Name;
    }
    
    // replacing this line -> "if (price) price.textContent = `$${this.product.FinalPrice}`;"

    if (price) {
            const final = this.product.FinalPrice;
            const original = this.product.SuggestedRetailPrice;

            if (final < original) {
                const amountSaved = (original - final).toFixed(2);
                const percentSaved = Math.round(((original - final) / original) * 100);

                price.innerHTML = `
                <span class="original-price">$${original.toFixed(2)}</span>
                <span class="final-price">$${final.toFixed(2)}</span>
                <span class="savings">You save $${amountSaved} (${percentSaved}%)</span>
                `;
            } else {
                price.textContent = `$${final.toFixed(2)}`;
            }
        }

    if (color) color.textContent = this.product.Colors[0].ColorName;
    if (description) description.innerHTML = this.product.DescriptionHtmlSimple;
    if (addToCart) addToCart.dataset.id = this.product.Id;
  }
}