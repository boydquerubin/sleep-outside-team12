const baseURL = import.meta.env.VITE_SERVER_URL;

// function convertToJson(res) {
//   if (res.ok) {
//     return res.json();
//   } else {
//     return res.text().then(text => {
//       throw new Error(`HTTP ${res.status}: ${text || 'Bad Response'}`);
//     });
//   }
// }

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: 'servicesError',
      message: jsonResponse
    };
  }
}

export default class ExternalServices {
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

  async checkout(order) {
    console.log("Order being sent:", JSON.stringify(order, null, 2));
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    };
    try {
      const response = await fetch(`${baseURL}checkout`, options);
      const result = await convertToJson(response);
      console.log("Checkout response:", result);
      return result;
    } catch (error) {
      console.error('Error submitting order:', error.message);
      throw error;
    }
  }
}