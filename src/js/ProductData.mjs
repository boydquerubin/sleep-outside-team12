
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  async getData() {
    try {
      return await fetch(this.path).then(convertToJson);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async findProductById(id) {
    try {
      const products = await this.getData();
      const product = products.find((item) => item.Id === id);
      if (!product) {
        console.error('Product not found for ID:', id);
      }
      return product;
    } catch (error) {
      console.error('Error finding product:', error);
      return null;
    }
  }
}