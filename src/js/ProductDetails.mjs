import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // Busca o produto pelo ID
      this.product = await this.dataSource.findProductById(this.productId);
      if (!this.product) {
        console.error(`Product not found for ID: ${this.productId}`);
        document.querySelector('.product-detail').innerHTML = '<p>Product not found.</p>';
        return;
      }
      console.log('Product data:', this.product); // Log para depuração
      // Renderiza os detalhes do produto
      this.renderProductDetails();
      // Adiciona o listener para o botão "Add to Cart"
      const addToCartButton = document.getElementById('addToCart');
      if (addToCartButton) {
        addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
      } else {
        console.warn('Add to Cart button not found');
      }
    } catch (error) {
      console.error('Error initializing product details:', error);
      document.querySelector('.product-detail').innerHTML = '<p>Error loading product details.</p>';
    }
  }

  addProductToCart() {
    try {
      const cartItems = getLocalStorage('so-cart') || [];
      cartItems.push(this.product);
      setLocalStorage('so-cart', cartItems);
      window.dispatchEvent(new Event('cartUpdated')); // Dispara evento para atualizar o carrinho
      // Feedback visual (opcional, requer CSS)
      const addToCartButton = document.getElementById('addToCart');
      if (addToCartButton) {
        addToCartButton.textContent = 'Added!';
        setTimeout(() => {
          addToCartButton.textContent = 'Add to Cart';
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  renderProductDetails() {
    try {
      // Seletores do HTML
      const brand = document.querySelector('.product__brand'); // <h3>
      const name = document.querySelector('.product__name'); // <h2>
      const image = document.querySelector('.product__image'); // <img>
      const price = document.querySelector('.product-card__price'); // <p>
      const color = document.querySelector('.product__color'); // <p>
      const description = document.querySelector('.product__description'); // <p>
      const addToCart = document.getElementById('addToCart'); // <button>

      // Verifica se todos os elementos existem
      if (!brand || !name || !image || !price || !color || !description || !addToCart) {
        console.error('One or more DOM elements not found for product details', {
          brand, name, image, price, color, description, addToCart
        });
        document.querySelector('.product-detail').innerHTML = '<p>Error rendering product details.</p>';
        return;
      }

      // Suporta Image (tents) e Images.PrimaryMedium (backpacks, sleeping-bags)
      const imageSrc = this.product.Images?.PrimaryMedium || this.product.Image;
      if (!imageSrc) {
        console.warn(`No image source found for product ID: ${this.product.Id}`);
        image.src = '/images/placeholder.jpg'; // Placeholder se necessário
        image.alt = 'No image available';
      } else {
        image.src = imageSrc.replace('..', ''); // Remove '..' para caminhos relativos
        image.alt = this.product.NameWithoutBrand || 'Product Image';
      }

      // Atualiza os elementos com os dados do produto
      brand.textContent = this.product.Brand?.Name || 'Unknown Brand';
      name.textContent = this.product.NameWithoutBrand || 'Unknown Product';

      // Lógica de preço com desconto
      const finalPrice = this.product.FinalPrice;
      const originalPrice = this.product.SuggestedRetailPrice;
      if (finalPrice && originalPrice && finalPrice < originalPrice) {
        const amountSaved = (originalPrice - finalPrice).toFixed(2);
        const percentSaved = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
        price.innerHTML = `
          <span class="original-price">$${originalPrice.toFixed(2)}</span>
          <span class="final-price">$${finalPrice.toFixed(2)}</span>
          <span class="savings">You save $${amountSaved} (${percentSaved}%)</span>
        `;
      } else {
        price.textContent = finalPrice ? `$${finalPrice.toFixed(2)}` : 'Price unavailable';
      }

      // Validação adicional para Colors
      color.textContent = this.product.Colors?.length > 0 ? this.product.Colors[0].ColorName || 'N/A' : 'N/A';
      description.innerHTML = this.product.DescriptionHtmlSimple || 'No description available';
      addToCart.dataset.id = this.product.Id || '';
    } catch (error) {
      console.error('Error rendering product details:', error);
      document.querySelector('.product-detail').innerHTML = '<p>Error rendering product details.</p>';
    }
  }
}