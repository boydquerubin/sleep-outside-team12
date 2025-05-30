import { getParam } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  try {
    const orderId = getParam("orderId");
    console.log("Order ID from URL:", orderId);
    const orderIdElement = document.getElementById("order-id");
    if (orderId && orderIdElement) {
      orderIdElement.textContent = orderId;
    } else {
      console.warn("Order ID not found or element missing");
      orderIdElement.textContent = "N/A";
    }
  } catch (error) {
    console.error("Error initializing order confirmation:", error);
  }
});