import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadHeaderFooter();
    const category = getParam("category");
    if (!category) {
      console.warn("No category specified in URL. Please add ?category=yourCategory to the URL.");
      document.querySelector(".product-list").innerHTML = "<p>Please specify a category.</p>";
      return;
    }
    const dataSource = new ProductData();
    const element = document.querySelector(".product-list");
    if (!element) {
      console.error("Element .product-list not found in the DOM");
      return;
    }
    const listing = new ProductList(category, dataSource, element);
    await listing.init();
  } catch (error) {
    console.error("Error initializing product listing:", error);
    document.querySelector(".product-list").innerHTML = "<p>Error loading products.</p>";
  }
});