/* eslint-disable no-console */
export default class Alert {
  constructor() {
    this.alerts = [];
    this.currentIndex = 0;
    this.carouselInterval = null;
    console.log("Alert constructor called");
    this.init();
  }

  async init() {
    console.log("!!!Alert init started");
    try {
      this.alerts = await this.fetchAlerts();
      console.log("Alerts fetched:", this.alerts);
      if (!this.alerts || this.alerts.length === 0) {
        console.warn("No alerts found, using fallback alert");
        this.alerts = [{
          message: "Bem-vindo ao Sleep Outside!",
          background: "#ff0",
          color: "#000"
        }];
      }
      this.renderAlerts();
      if (this.alerts.length > 1) {
        this.startCarousel();
      }
    } catch (error) {
      console.error("Error initializing alerts:", error);
      this.alerts = [{
        message: "Erro ao carregar alertas. Tente novamente.",
        background: "#f00",
        color: "#fff"
      }];
      this.renderAlerts();
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
      const data = await response.json();
      console.log("Fetched alerts data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching alerts.json:", error);
      return [];
    }
  }

  renderAlerts() {
    console.log("!!!Rendering alerts");
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
    closeButton.addEventListener("click", () => this.closeAlert(alertList));

    // Assemble carousel
    carousel.appendChild(closeButton);
    carousel.appendChild(prevButton);
    carousel.appendChild(messageContainer);
    carousel.appendChild(nextButton);
    alertList.appendChild(carousel);

    // Append to body
    document.body.appendChild(alertList);
    console.log("!!!Alert appended to body");

    // Add click outside to close functionality with delay
    setTimeout(() => {
      document.addEventListener("click", (event) => this.handleOutsideClick(event, alertList, carousel));
      console.log("Click outside listener attached");
    }, 500); // 500ms delay to avoid page-load events
  }

  handleOutsideClick(event, alertList, carousel) {
    console.log("Click event triggered:", {
      target: event.target.tagName,
      className: event.target.className,
      isTrusted: event.isTrusted
    });

    // Only process user-initiated clicks
    if (!event.isTrusted) {
      console.log("Ignoring non-user-initiated click");
      return;
    }

    // Check if the click is outside the carousel
    if (!carousel.contains(event.target)) {
      console.log("Outside click detected, closing alert");
      this.closeAlert(alertList);
      document.removeEventListener("click", this.handleOutsideClick);
    }
  }

  closeAlert(alertList) {
    console.log("Closing alert");
    this.stopCarousel();
    if (alertList && alertList.parentNode) {
      document.body.removeChild(alertList);
    }
  }

  startCarousel() {
    console.log("Starting carousel");
    this.carouselInterval = setInterval(() => {
      this.showNextAlert();
    }, 5000); // Cycle every 5 seconds
  }

  stopCarousel() {
    console.log("Stopping carousel");
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
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
    if (messages.length === 0) return;
    messages[this.currentIndex].classList.remove("active");
    this.currentIndex =
      (this.currentIndex - 1 + this.alerts.length) % this.alerts.length;
    messages[this.currentIndex].classList.add("active");
  }
}