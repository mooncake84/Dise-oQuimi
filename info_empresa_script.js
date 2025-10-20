document.addEventListener("DOMContentLoaded", function () {
  const infoEmpresaDetalle = document.getElementById("info-empresa-detalle");

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
   * Obtiene un parámetro de la URL.
   * @param {string} name - Nombre del parámetro.
   */
  function obtenerParametroUrl(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Obtener el ID de la empresa desde la URL
  const selectedCompany = obtenerParametroUrl("companyId");

  infoEmpresaDetalle.innerHTML = "";

  if (selectedCompany && datosEmpresas[selectedCompany]) {
    const datos = datosEmpresas[selectedCompany];

    // Construir el HTML con los datos de la empresa
    const infoHTML = `
      <h3>${datos.nombre}</h3>
      <p><strong>Giro:</strong> ${datos.giro}</p>
      <p><strong>Dirección:</strong> ${datos.direccion}</p>
      <p><strong>Contacto Email:</strong> ${datos.contacto}</p>
      <p><strong>Teléfono:</strong> ${datos.telefono}</p>
      <p style="margin-top: 20px; font-style: italic;">*Esta información es provisional y debe ser reemplazada.</p>
    `;
    infoEmpresaDetalle.innerHTML = infoHTML;
  } else {
    // Caso de error: no hay datos de empresa
    infoEmpresaDetalle.innerHTML = `
        <p class="error-mensaje">Error: No se pudo cargar la información de la empresa seleccionada.</p>
    `;
  }
});
