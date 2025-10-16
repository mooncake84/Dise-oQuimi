document.addEventListener("DOMContentLoaded", function () {
  const btnOpcion1 = document.getElementById("btn-opcion1");
  const btnOpcion2 = document.getElementById("btn-opcion2");
  const btnOpcion3 = document.getElementById("btn-opcion3");

  // Función genérica de redirección
  function redirigir(pagina) {
    window.location.href = pagina;
  }

  // Asignar eventos de clic a cada botón
  btnOpcion1.addEventListener("click", function () {
    redirigir("opcion1_destino.html"); // Cambia esto por tu URL real
  });

  btnOpcion2.addEventListener("click", function () {
    redirigir("opcion2_destino.html"); // Cambia esto por tu URL real
  });

  btnOpcion3.addEventListener("click", function () {
    redirigir("opcion3_destino.html"); // Cambia esto por tu URL real
  });
});
