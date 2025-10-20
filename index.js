document.addEventListener("DOMContentLoaded", function () {
  // 💥 ELIMINADO: selectEmpresas ha sido removido. 💥
  const btnInicioSesion = document.getElementById("iniciar-sesion-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Lógica de transición del carrusel (mover esto a index.js para un proyecto limpio)
  let slideIndex = 0;
  const slides = document.querySelectorAll(".carrusel-item");

  function nextSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }

  setInterval(nextSlide, 8000); // Cambia cada 8 segundos

  btnInicioSesion.addEventListener("click", function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password) {
      // 💥 CRÍTICO: GUARDAR LA EMPRESA POR DEFECTO (EMPRESA A) 💥
      // Al no haber selector, asumimos una empresa inicial (Empresa A) al iniciar sesión.
      localStorage.setItem("selectedCompany", "empresa1");

      const paginaDeDestino = "rastros.html";
      window.location.href = paginaDeDestino;
    } else {
      alert("Por favor, completa todos los campos (Correo y Contraseña).");
    }
  });
});
