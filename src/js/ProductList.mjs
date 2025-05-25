import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageSrc = product.Images?.PrimaryMedium || product.Image;
  if (!imageSrc) {
    console.error(`No image source found for product ID: ${product.Id}`, product);
    return '';
  }

  return `
    <li class="product-card">
      <a href="/product_pages/product.html?product=${product.Id}"> 
        <img src="${imageSrc}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p class="product-card__name">${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
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
      const list = await this.dataSource.getData(this.category);
      console.log(`Products for ${this.category}:`, list);
      this.renderList(list);
      
      const titleElement = document.querySelector(".title");
      if (titleElement) {
        titleElement.textContent = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      } else {
        console.warn("Element with class 'title' not found.");
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