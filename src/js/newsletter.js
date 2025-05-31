document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const message = document.getElementById("newsletter-message");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;

    if (!email.includes("@")) {
      message.textContent = "Please enter a valid email address.";
      message.style.color = "red";
      return;
    }

    message.textContent = "Thank you for subscribing!";
    message.style.color = "green";
    form.reset();
  });
});
