import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
  <a href="/product_pages/index.html?product=${product.Id}">
  <img
    src="${product.Images.PrimaryMedium}"
    alt="Image of ${product.Name}"
  />
  <h3 class="card__brand">${product.Brand.Name}</h3>
  <h2 class="card__name">${product.Name}</h2>
  <p class="product-card__price">$${product.FinalPrice}</p></a>
</li>`;
}


function sortProducts(products, sortOption) {
  switch (sortOption) {
    case "price-asc":
      return products.sort((a, b) => a.FinalPrice - b.FinalPrice);
    case "price-desc":
      return products.sort((a, b) => b.FinalPrice - a.FinalPrice);
    case "name-asc":
      return products.sort((a, b) => a.Name.localeCompare(b.Name));
    case "name-desc":
      return products.sort((a, b) => b.Name.localeCompare(a.Name));
    default:
      return products;
  }
}

export default class ProductList {
  constructor(category, dataSource, listElement, sortElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.sortElement = sortElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    this.addSortEventListener(list);
    document.querySelector(".title").innerHTML = this.category;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  addSortEventListener(list) {
    this.sortElement.addEventListener("change", (e) => {
      const sortOption = e.target.value;
      const sortedList = sortProducts([...list], sortOption);
      this.renderList(sortedList);
    });
  }
}


