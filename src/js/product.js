// src/js/product.js
import { getParam, loadHeaderFooter  } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();

// Get product ID from URL
const productId = getParam('product');
if (!productId) {
  console.error('No product ID provided in URL');
} else {
  const dataSource = new ProductData('tents');
  const product = new ProductDetails(productId, dataSource);

  // Initialize product details
  product.init();

  (async () => {
    const productData = await dataSource.findProductById(productId);
    console.log('Product data:', productData);
  })();
}