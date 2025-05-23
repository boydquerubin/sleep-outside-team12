const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  constructor() {
    // this.category = category;
    // this.path = `/json/${this.category}.json`;
  }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    
    return data.Result;
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      console.log(data.Result);
      return data.Result;
      // const products = await this.getData();
      // const product = products.find((item) => item.Id === id);
      // if (!product) {
      //   console.error('Product not found for ID:', id);
      // }
      // return product;
    } catch (error) {
      console.error('Error finding product:', error);
      return null;
    }
  }
}