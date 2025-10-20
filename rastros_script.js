document.addEventListener("DOMContentLoaded", function () {
  const btnInfoGeneral = document.getElementById("btn-opcion1");

  const selectCambioEmpresa = document.getElementById("select-cambio-empresa");
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");

  // DATOS PROVISIONALES 'X' PARA LAS EMPRESAS
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
    selectCambioEmpresa.value = companyId; // Sincroniza el <select>
    localStorage.setItem("selectedCompany", companyId); // Guarda la selección
  }

  // 💥 FUNCIÓN MODIFICADA: Ahora abre una nueva ventana 💥
  function abrirVentanaInfo() {
    // 1. Obtener la empresa seleccionada de localStorage
    const selectedCompany =
      localStorage.getItem("selectedCompany") || "empresa1";

    // 2. Abrir la nueva ventana/pestaña
    // El tamaño y nombre son opcionales. '_blank' asegura una nueva pestaña/ventana.
    const ventana = window.open(
      "info_empresa.html?companyId=" + selectedCompany,
      "InfoEmpresa", // Nombre de la ventana
      "width=600,height=500,resizable=yes,scrollbars=yes" // Características de la ventana (opcional)
    );

    if (ventana) {
      ventana.focus(); // Intenta enfocar la nueva ventana
    } else {
      alert(
        "El navegador bloqueó la ventana emergente. Por favor, permítela para ver la información."
      );
    }
  }
  // --- INICIALIZACIÓN: Cargar empresa al entrar a la página ---
  const empresaInicial = localStorage.getItem("selectedCompany") || "empresa1";
  actualizarEmpresaVista(empresaInicial);

  // --- EVENT LISTENERS ---

  // 1. Evento para cambiar la empresa en el selector del header
  selectCambioEmpresa.addEventListener("change", function () {
    actualizarEmpresaVista(selectCambioEmpresa.value);
  });

  // 2. Evento para el botón INFORMACION GENERAL
  btnInfoGeneral.addEventListener("click", abrirVentanaInfo);

  // ELIMINADOS: Eventos para cerrar el modal
});
