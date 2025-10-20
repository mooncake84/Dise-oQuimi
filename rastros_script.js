// rastros_script.js - Actualizado con manejo de errores
document.addEventListener("DOMContentLoaded", function () {
  const selectCambioEmpresa = document.getElementById("select-cambio-empresa");
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");

  /**
   * Actualiza el nombre de la empresa en el header y guarda el ID.
   * @param {string} companyId - El ID de la empresa.
   */
  function actualizarEmpresaVista(companyId) {
    try {
      // Validar que la empresa existe
      if (!DATOS_EMPRESAS[companyId]) {
        throw new Error(`Empresa ${companyId} no encontrada`);
      }

      const nombreEmpresa = DATOS_EMPRESAS[companyId].nombre;
      nombreEmpresaActual.textContent = `Empresa Actual: ${nombreEmpresa}`;
      selectCambioEmpresa.value = companyId;
      localStorage.setItem("selectedCompany", companyId);
    } catch (error) {
      console.error("Error actualizando vista de empresa:", error);
      errorManager.mostrarError("Error al cambiar de empresa");
    }
  }

  // Función para abrir información general con la empresa actual
  window.abrirInformacionGeneral = function () {
    try {
      const selectedCompany =
        localStorage.getItem("selectedCompany") || "empresa1";

      // Validar que la empresa existe
      if (!DATOS_EMPRESAS[selectedCompany]) {
        throw new Error(`Empresa ${selectedCompany} no encontrada`);
      }

      window.location.href = `info_empresa.html?companyId=${selectedCompany}`;
    } catch (error) {
      console.error("Error abriendo información general:", error);
      errorManager.mostrarError("Error al abrir información de la empresa");
    }
  };

  // Inicialización: Cargar empresa al entrar a la página
  try {
    const empresaInicial =
      localStorage.getItem("selectedCompany") || "empresa1";
    actualizarEmpresaVista(empresaInicial);
  } catch (error) {
    console.error("Error en inicialización:", error);
    errorManager.mostrarError("Error al inicializar la aplicación");
  }

  // Evento para cambiar la empresa en el selector del header
  selectCambioEmpresa.addEventListener("change", function () {
    actualizarEmpresaVista(selectCambioEmpresa.value);
  });
});
