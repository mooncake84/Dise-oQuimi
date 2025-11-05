document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
      localStorage.setItem("selectedCompany", "empresa1");
      window.location.href = "rastros.html";
    } else {
      alert("Por favor, completa todos los campos.");
    }
  });
});
