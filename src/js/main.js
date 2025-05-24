import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("main.js: DOMContentLoaded triggered");
  try {
    await loadHeaderFooter();
    console.log("Header and footer loaded successfully");
  } catch (error) {
    console.error("Error in loadHeaderFooter:", error);
  }
});