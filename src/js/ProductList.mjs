export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData();
      this.renderList(list);
    } catch (error) {
      console.error('Error loading product list:', error);
    }
  }

  renderList(productList) {
    this.listElement.innerHTML = "";

    productList.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      let discountBadge = "";
      if (product.FinalPrice < product.SuggestedRetailPrice) {
        const discount = Math.round(
          ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
        );
        discountBadge = `<span class="discount-badge">${discount}% OFF</span>`;
      }

      card.innerHTML = `
        <img src="${product.Image.replace('..', '')}" alt="${product.Name}" class="product-image" />
        <h2 class="product-name">${product.Name}</h2>
        <p class="product-price">$${product.FinalPrice}</p>
        ${discountBadge}
      `;

      this.listElement.appendChild(card);
    });
  }
}
