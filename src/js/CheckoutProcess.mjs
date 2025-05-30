import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    console.log("Constructing CheckoutProcess with key:", key, "selector:", outputSelector);
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    try {
      this.list = getLocalStorage(this.key) || [];
      console.log("Cart items:", this.list);
      this.calculateItemSubTotal();
    } catch (error) {
      console.error("Error initializing CheckoutProcess:", error);
    }
  }

  calculateItemSubTotal() {
    try {
      this.itemTotal = this.list.reduce((sum, item) => {
        const price = item.FinalPrice || 0;
        const quantity = item.Quantity || 1;
        return sum + price * quantity;
      }, 0);
      console.log("Calculated itemTotal:", this.itemTotal);
      const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
      if (subtotalElement) {
        subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
      } else {
        console.error("Subtotal element not found with selector:", `${this.outputSelector} #subtotal`);
      }
    } catch (error) {
      console.error("Error calculating subtotal:", error);
    }
  }

  calculateOrderTotal() {
    try {
      this.tax = this.itemTotal * 0.06;
      this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
      this.orderTotal = this.itemTotal + this.tax + this.shipping;
      console.log("Calculated totals:", { tax: this.tax, shipping: this.shipping, orderTotal: this.orderTotal });
      this.displayOrderTotals();
    } catch (error) {
      console.error("Error calculating order totals:", error);
    }
  }

  displayOrderTotals() {
    try {
      const taxElement = document.querySelector(`${this.outputSelector} #tax`);
      const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
      const totalElement = document.querySelector(`${this.outputSelector} #total`);

      if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
      else console.error("Tax element not found:", `${this.outputSelector} #tax`);
      if (shippingElement) shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
      else console.error("Shipping element not found:", `${this.outputSelector} #shipping`);
      if (totalElement) totalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
      else console.error("Total element not found:", `${this.outputSelector} #total`);
    } catch (error) {
      console.error("Error displaying order totals:", error);
    }
  }

  packageItems(items) {
    try {
      return items.map(item => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.Quantity || 1
      }));
    } catch (error) {
      console.error("Error packaging items:", error);
      return [];
    }
  }

  async checkout(form) {
    event.preventDefault();
    try {
      const formData = this.formDataToJSON(form);
      if (!this.validateForm(formData)) {
        console.log("Form validation failed: All fields are required.");
        return;
      }

      const order = {
        orderDate: new Date().toISOString(),
        fname: formData.fname,
        lname: formData.lname,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        cardNumber: formData.cardNumber,
        expiration: formData.expiration,
        code: formData.code,
        items: this.packageItems(this.list),
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping.toFixed(2),
        tax: this.tax.toFixed(2)
      };

      const response = await this.services.checkout(order);
      console.log("Order submitted successfully:", response);
    } catch (error) {
      console.error("Error in checkout process:", error);
    }
  }

  validateForm(formData) {
    try {
      const isValid = Object.values(formData).every(value => value.trim() !== "");
      console.log("Form validation result:", isValid);
      return isValid;
    } catch (error) {
      console.error("Error validating form:", error);
      return false;
    }
  }

  formDataToJSON(formElement) {
    try {
      const formData = new FormData(formElement);
      const convertedJSON = {};
      formData.forEach((value, key) => {
        convertedJSON[key] = value;
      });
      console.log("Form data converted to JSON:", convertedJSON);
      return convertedJSON;
    } catch (error) {
      console.error("Error converting form data to JSON:", error);
      return {};
    }
  }
}