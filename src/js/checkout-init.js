import CheckoutProcess from "./CheckoutProcess.mjs";

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("DOMContentLoaded: Initializing CheckoutProcess");
    const checkout = new CheckoutProcess("so-cart", "#order-summary");
    checkout.init();

    const form = document.getElementById("checkout-form");
    const zipInput = document.getElementById("zip");

    if (!form) {
      console.error("Checkout form not found with ID: checkout-form");
      return;
    }
    if (!zipInput) {
      console.error("Zip input not found with ID: zip");
      return;
    }

    zipInput.addEventListener("input", () => {
      console.log("Zip code input changed:", zipInput.value);
      if (zipInput.value.trim()) {
        checkout.calculateOrderTotal();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Form submitted");
      await checkout.checkout(form);
    });
  } catch (error) {
    console.error("Error in checkout initialization:", error);
  }
});