import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageSrc =
    product.Images?.PrimaryExtraLarge ||
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryMedium ||
    product.Image ||
    "/images/placeholder.jpg";
  if (!imageSrc) {
    console.error(`No image source found for product ID: ${product.Id}`, product.Images, product.Image);
    return "";
  }
  console.log(`Image source for ${product.Id}:`, imageSrc);

  // Lógica para badge de desconto
  let discountBadge = "";
  if (
    product.FinalPrice &&
    product.SuggestedRetailPrice &&
    product.FinalPrice < product.SuggestedRetailPrice
  ) {
    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) *
        100
    );
    discountBadge = `<span class="discount-badge">${discount}% OFF</span>`;
  }

  return `
    <li class="product-card">
      <a href="/product_pages/product.html?product=${product.Id}"> 
        <img src="${imageSrc}" alt="${product.Name || 'Product Image'}">
        <h3>${product.Brand?.Name || 'Unknown Brand'}</h3>
        <p class="product-card__name">${
          product.NameWithoutBrand || product.Name || "Unknown Product"
        }</p>
        <div class="price-container">
        <p class="product-card__price">${
          product.FinalPrice?.toFixed(2) || "0.00"
        }</p>
        <p class="discount-badge">${discountBadge}</p>
        </div>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      console.log(`Starting init for category: ${this.category}`);
      const list = await this.dataSource.getData(this.category);
      console.log(`Products for ${this.category}:`, list);
      console.log("Sample product structure:", list[0]);
      // Log para depurar preços
      list.forEach((product) => {
        console.log(`Product ${product.Id}:`, {
          FinalPrice: product.FinalPrice,
          SuggestedRetailPrice: product.SuggestedRetailPrice,
        });
      });
      this.renderList(list);

      const section = this.listElement.closest("section") || document.body;
      const titleElement = section.querySelector(".title");
      if (titleElement) {
        titleElement.textContent =
          this.category.charAt(0).toUpperCase() + this.category.slice(1);
      } else {
        console.warn(
          `Element with class 'title' not found for category ${this.category}.`
        );
      }
    } catch (error) {
      console.error(`Error loading product list for ${this.category}:`, error);
      this.listElement.innerHTML = "<p>Error loading product list.</p>";
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}