document.addEventListener("DOMContentLoaded", function () {
  const btnInicioSesion = document.getElementById("iniciar-sesion-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Lógica de transición del carrusel
  let slideIndex = 0;
  const slides = document.querySelectorAll(".carrusel-item");

  function nextSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }

  setInterval(nextSlide, 8000);

  btnInicioSesion.addEventListener("click", function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password) {
      localStorage.setItem("selectedCompany", "empresa1");
      const paginaDeDestino = "rastros.html";
      window.location.href = paginaDeDestino;
    } else {
      alert("Por favor, completa todos los campos (Correo y Contraseña).");
    }
  });
});
