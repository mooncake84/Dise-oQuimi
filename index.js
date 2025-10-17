document.addEventListener("DOMContentLoaded", function () {
  // 💥 ELIMINADO: selectEmpresas ha sido removido. 💥
  const btnInicioSesion = document.getElementById("iniciar-sesion-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

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
