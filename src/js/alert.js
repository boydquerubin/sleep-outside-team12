/* eslint-disable no-console */
export default class Alert {
  constructor() {
    this.alerts = [];
    this.currentIndex = 0;
    this.carouselInterval = null;
    this.init();
  }

  async init() {
    try {
      this.alerts = await this.fetchAlerts();
      if (this.alerts && this.alerts.length > 0) {
        this.renderAlerts();
        if (this.alerts.length > 1) {
          this.startCarousel();
        }
      }
    } catch (error) {
      console.error("Error initializing alerts:", error);
    }
  }

  async fetchAlerts() {
    try {
      console.log("Attempting to fetch /json/alerts.json");
      const response = await fetch("/json/alerts.json");
      console.log("Fetch response status:", response.status, "OK:", response.ok);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, URL: /json/alerts.json, Response: ${text.slice(0, 100)}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching alerts.json:", error);
      return [];
    }
  }

  renderAlerts() {
    const alertList = document.createElement("section");
    alertList.className = "alert-list";

    // Create carousel container
    const carousel = document.createElement("div");
    carousel.className = "alert-carousel";

    // Create message container
    const messageContainer = document.createElement("div");
    messageContainer.className = "alert-messages";

    // Add messages
    this.alerts.forEach((alert, index) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      p.className = "alert-message" + (index === 0 ? " active" : "");
      messageContainer.appendChild(p);
    });

    // Create navigation arrows
    const prevButton = document.createElement("button");
    prevButton.className = "alert-nav prev";
    prevButton.textContent = "◄";
    prevButton.addEventListener("click", () => this.showPrevAlert());

    const nextButton = document.createElement("button");
    nextButton.className = "alert-nav next";
    nextButton.textContent = "►";
    nextButton.addEventListener("click", () => this.showNextAlert());

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.className = "alert-close";
    closeButton.textContent = "✕";
    closeButton.addEventListener("click", () => {
      this.stopCarousel();
      document.body.removeChild(alertList);
    });

    // Assemble carousel
    carousel.appendChild(closeButton);
    carousel.appendChild(prevButton);
    carousel.appendChild(messageContainer);
    carousel.appendChild(nextButton);
    alertList.appendChild(carousel);

    // Append to body
    document.body.appendChild(alertList);
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.showNextAlert();
    }, 5000); // Cycle every 5 seconds
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null; // Reset interval ID
    }
  }

  showNextAlert() {
    const messages = document.querySelectorAll(".alert-message");
    if (messages.length === 0) return;
    messages[this.currentIndex].classList.remove("active");
    this.currentIndex = (this.currentIndex + 1) % this.alerts.length;
    messages[this.currentIndex].classList.add("active");
  }

  showPrevAlert() {
    const messages = document.querySelectorAll(".alert-message");
    if (messages.length === 0) return; // Safety check
    messages[this.currentIndex].classList.remove("active");
    this.currentIndex = (this.currentIndex - 1 + this.alerts.length) % this.alerts.length;
    messages[this.currentIndex].classList.add("active");
  }
}