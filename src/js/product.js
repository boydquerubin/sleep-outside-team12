import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Loading header and footer...');
    await loadHeaderFooter();

    const productID = getParam('product');
    console.log('Product ID from URL:', productID);

    if (!productID) {
      console.warn('No product ID provided in URL, assuming index page');
      return;
    }

    console.log('Initializing ProductDetails for product ID:', productID);
    const dataSource = new ExternalServices();
    const product = new ProductDetails(productID, dataSource);
    await product.init();

    window.addEventListener('cartUpdated', () => {
      console.log('Product added to cart, cart updated.');
    });
  } catch (error) {
    console.error('Error initializing product page:', error);
    if (getParam('product')) {
      document.querySelector('main').innerHTML = '<p>Error loading product page.</p>';
    }
  }
});