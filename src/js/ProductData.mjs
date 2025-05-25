const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`HTTP ${res.status}: Bad Response`);
  }
}

export default class ProductData {
  constructor() {
  }

  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      console.log(`Raw data for ${category}:`, data);
      const products = data.Result || data; 
      console.log(`Processed products for ${category}:`, products);
      return products;
    } catch (error) {
      console.error(`Error fetching ${baseURL}products/search/${category}:`, error);
      return [];
    }
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      const product = data.Result || data;
      if (!product) {
        console.warn(`Product not found for ID: ${id}`);
        return null;
      }
      console.log(`Product found for ID ${id}:`, product);
      return product;
    } catch (error) {
      console.error(`Error finding product with ID ${id}:`, error);
      return null;
    }
  }
}