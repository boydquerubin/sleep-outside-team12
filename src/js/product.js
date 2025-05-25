import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Loading header and footer...');
    await loadHeaderFooter(); // Aguarda o carregamento do header e footer

    const productID = getParam('product');
    console.log('Product ID from URL:', productID);

    // Verifica se estamos na página de detalhes (presença do parâmetro product)
    if (!productID) {
      console.warn('No product ID provided in URL, assuming index page');
      // Aqui você pode decidir o que fazer se não houver productID (ex.: carregar a página inicial)
      return;
    }

    console.log('Initializing ProductDetails for product ID:', productID);
    const dataSource = new ProductData();
    const product = new ProductDetails(productID, dataSource);
    await product.init();
  } catch (error) {
    console.error('Error initializing product page:', error);
    // Exibe erro no DOM apenas se for a página de detalhes
    if (getParam('product')) {
      document.querySelector('main').innerHTML = '<p>Error loading product page.</p>';
    }
  }
});