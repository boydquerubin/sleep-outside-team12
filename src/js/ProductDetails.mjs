import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

//   async init() {
//     this.product = await this.dataSource.findProductById(this.productId);
//     if (!this.product) {
//       return;
//     }

//     // Check if image exists
//     const imageUrl = this.product.Image.replace('..', '');
//     const imageExists = await this.checkImageExists(imageUrl);
//     if (!imageExists) {
//       return;
//     }

//     this.renderProductDetails();

//     // Add event listener for "Add to Cart" button
//     const addToCartButton = document.getElementById('addToCart');
//     if (addToCartButton) {
//       addToCartButton.addEventListener('click', this.addProductToCart.bind(this));
//     }
//   }

//   // Function to check if an image exists
//   async checkImageExists(imageUrl) {
//     try {
//       const response = await fetch(imageUrl, { method: 'HEAD' });
//       return response.ok;
//     } catch {
//       return false;
//     }
//   }

//   addProductToCart() {
//     const cartItems = getLocalStorage('so-cart') || [];
//     cartItems.push(this.product);
//     setLocalStorage('so-cart', cartItems);
//     window.dispatchEvent(new Event('cartUpdated'));
//   }

//   renderProductDetails() {
//     const h3 = document.querySelector('h3');
//     const h2 = document.querySelector('h2.divider');
//     const img = document.querySelector('img.divider');
//     const price = document.querySelector('.product-card__price');
//     const color = document.querySelector('.product__color');
//     const description = document.querySelector('.product__description');
//     const addToCart = document.querySelector('#addToCart');

//     if (h3) h3.textContent = this.product.Brand.Name;
//     if (h2) h2.textContent = this.product.NameWithoutBrand;
//     if (img) {
//       img.src = this.product.Image.replace('..', '');
//       img.alt = this.product.Name;
//     }
    
//     // replacing this line -> "if (price) price.textContent = `$${this.product.FinalPrice}`;"

//     if (price) {
//             const final = this.product.FinalPrice;
//             const original = this.product.SuggestedRetailPrice;

//             if (final < original) {
//                 const amountSaved = (original - final).toFixed(2);
//                 const percentSaved = Math.round(((original - final) / original) * 100);

//                 price.innerHTML = `
//                 <span class="original-price">$${original.toFixed(2)}</span>
//                 <span class="final-price">$${final.toFixed(2)}</span>
//                 <span class="savings">You save $${amountSaved} (${percentSaved}%)</span>
//                 `;
//             } else {
//                 price.textContent = `$${final.toFixed(2)}`;
//             }
//         }

//     if (color) color.textContent = this.product.Colors[0].ColorName;
//     if (description) description.innerHTML = this.product.DescriptionHtmlSimple;
//     if (addToCart) addToCart.dataset.id = this.product.Id;
//   }
// }