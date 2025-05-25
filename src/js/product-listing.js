import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadHeaderFooter();
    const category = getParam("category");
    const dataSource = new ProductData();

    if (category) {
      const element = document.querySelector(".product-list");
      if (!element) {
        console.error("Element .product-list not found in the DOM");
        return;
      }
      const listing = new ProductList(category, dataSource, element);
      await listing.init();
    } else {
      const categories = ['tents', 'backpacks', 'sleeping-bags'];
      categories.forEach(category => {
        const element = document.querySelector(`#${category}-list`);
        if (element) {
          const listing = new ProductList(category, dataSource, element);
          listing.init();
        } else {
          console.warn(`Element #${category}-list not found in the DOM`);
        }
      });
    }
  } catch (error) {
    console.error("Error initializing product listing:", error);
    document.querySelector(".product-list").innerHTML = "<p>Error loading products.</p>";
  }
});