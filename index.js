document.addEventListener("DOMContentLoaded", function () {
  const selectEmpresas = document.getElementById("empresas-select");
  const btnInicioSesion = document.getElementById("iniciar-sesion-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  btnInicioSesion.addEventListener("click", function () {
    const empresa = selectEmpresas.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (empresa && email && password) {
      // La URL de destino DEBE ser una cadena de texto (string).
      const paginaDeDestino = "rastros.html"; // Corregido: eliminado el espacio al final // Redirige al usuario a la nueva página usando la variable STRING

      window.location.href = paginaDeDestino; // Corregido: usando la variable `paginaDeDestino`
    } else {
      alert(
        "Por favor, completa todos los campos (Correo, Contraseña y Empresa)."
      );
    }
  }); // Opcional: Lógica adicional al cambiar la empresa seleccionada

  selectEmpresas.addEventListener("change", function () {
    console.log("Empresa cambiada a:", selectEmpresas.value);
  });
});
