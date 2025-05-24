import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
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
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
    
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}

// export default class ProductList {
//   constructor(category, dataSource, listElement) {
//     this.category = category;
//     this.dataSource = dataSource;
//     this.listElement = listElement;
//   }

//   async init() {
//     try {
//       const list = await this.dataSource.getData();
//       this.renderList(list);
//     } catch (error) {
//       console.error('Error loading product list:', error);
//     }
//   }

//   renderList(productList) {
//     this.listElement.innerHTML = "";

//     productList.forEach(product => {
//       const card = document.createElement("div");
//       card.classList.add("product-card");

//       let discountBadge = "";
//       if (product.FinalPrice < product.SuggestedRetailPrice) {
//         const discount = Math.round(
//           ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
//         );
//         discountBadge = `<span class="discount-badge">${discount}% OFF</span>`;
//       }

//       card.innerHTML = `
//         <img src="${product.Image.replace('..', '')}" alt="${product.Name}" class="product-image" />
//         <h2 class="product-name">${product.Name}</h2>
//         <p class="product-price">$${product.FinalPrice}</p>
//         ${discountBadge}
//       `;

//       this.listElement.appendChild(card);
//     });
//   }
// }
