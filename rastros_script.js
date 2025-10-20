document.addEventListener("DOMContentLoaded", function () {
  const selectCambioEmpresa = document.getElementById("select-cambio-empresa");
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");

  // Datos de las empresas
  const datosEmpresas = {
    empresa1: {
      nombre: "Empresa A (Datos Provisional X)",
      direccion: "Dirección Pendiente X - Calle Falsa 123",
      contacto: "email-provisional-A@dominio-x.com",
      telefono: "Teléfono Pendiente (55) XXXX-0001",
      giro: "Giro Industrial Provisional X (Químicos)",
    },
    empresa2: {
      nombre: "Empresa B (Datos Provisional X)",
      direccion: "Dirección Pendiente X - Avenida Siempre Viva 742",
      contacto: "email-provisional-B@dominio-x.com",
      telefono: "Teléfono Pendiente (55) XXXX-0002",
      giro: "Giro Farmacéutico Provisional X (I+D)",
    },
    empresa3: {
      nombre: "Empresa C (Datos Provisional X)",
      direccion: "Dirección Pendiente X - Boulevard Química 101",
      contacto: "email-provisional-c@dominio-x.com",
      telefono: "Teléfono Pendiente (55) XXXX-0003",
      giro: "Giro Agrícola Provisional X (Fertilizantes)",
    },
  };

  /**
   * Actualiza el nombre de la empresa en el header y guarda el ID.
   * @param {string} companyId - El ID de la empresa.
   */
  function actualizarEmpresaVista(companyId) {
    const nombreEmpresa = datosEmpresas[companyId]
      ? datosEmpresas[companyId].nombre
      : "Empresa No Seleccionada";

    nombreEmpresaActual.textContent = `Empresa Actual: ${nombreEmpresa}`;
    selectCambioEmpresa.value = companyId;
    localStorage.setItem("selectedCompany", companyId);
  }

  // Inicialización: Cargar empresa al entrar a la página
  const empresaInicial = localStorage.getItem("selectedCompany") || "empresa1";
  actualizarEmpresaVista(empresaInicial);

  // Evento para cambiar la empresa en el selector del header
  selectCambioEmpresa.addEventListener("change", function () {
    actualizarEmpresaVista(selectCambioEmpresa.value);
  });
});
