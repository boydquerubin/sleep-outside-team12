function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`HTTP ${res.status}: Bad Response`);
  }
}

export default class ProductData {
  constructor() {}

  async getData(category) {
    try {
      const path = `/json/${category}.json`;
      const response = await fetch(path);
      const data = await convertToJson(response);
      console.log(`Raw data for ${category}:`, data);
      const products = data.Result || data;
      console.log(`Processed products for ${category}:`, products);
      return products;
    } catch (error) {
      console.error(`Error fetching /json/${category}.json:`, error);
      return [];
    }
  }

  async findProductById(id) {
    try {
      const categories = ['tents', 'backpacks', 'sleeping-bags'];
      for (const category of categories) {
        const products = await this.getData(category);
        const product = products.find((item) => item.Id === id);
        if (product) {
          return product;
        }
      }
      console.warn(`Product not found for ID: ${id}`);
      return null;
    } catch (error) {
      console.error('Error finding product:', error);
      return null;
    }
  }
}