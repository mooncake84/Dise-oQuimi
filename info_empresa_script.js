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

  // Función para cargar información de la empresa
  function cargarInformacionEmpresa() {
    // Limpiar el contenedor
    infoEmpresaDetalle.innerHTML = "";

    // Intentar obtener el companyId de la URL primero
    let selectedCompany = obtenerParametroUrl("companyId");

    // Si no hay parámetro en la URL, intentar obtener del localStorage
    if (!selectedCompany) {
      selectedCompany = localStorage.getItem("selectedCompany");
    }

    // Si aún no hay empresa seleccionada, usar empresa1 por defecto
    if (!selectedCompany) {
      selectedCompany = "empresa1";
    }

    console.log("Empresa seleccionada:", selectedCompany); // Para debugging

    if (selectedCompany && datosEmpresas[selectedCompany]) {
      const datos = datosEmpresas[selectedCompany];

      // Construir el HTML con los datos de la empresa
      const infoHTML = `
        <h3>${datos.nombre}</h3>
        <p><strong>Giro:</strong> ${datos.giro}</p>
        <p><strong>Dirección:</strong> ${datos.direccion}</p>
        <p><strong>Contacto Email:</strong> ${datos.contacto}</p>
        <p><strong>Teléfono:</strong> ${datos.telefono}</p>
        <p style="margin-top: 20px; font-style: italic; color: #666;">
          *Esta información es provisional y debe ser reemplazada.
        </p>
        <div style="margin-top: 20px; text-align: center;">
          <button onclick="window.history.back()" style="
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">
            ← Volver
          </button>
        </div>
      `;
      infoEmpresaDetalle.innerHTML = infoHTML;
    } else {
      // Caso de error: no hay datos de empresa
      infoEmpresaDetalle.innerHTML = `
        <p class="error-mensaje">
          Error: No se pudo cargar la información de la empresa seleccionada.<br>
          ID de empresa: ${selectedCompany || "No disponible"}
        </p>
        <div style="margin-top: 20px; text-align: center;">
          <button onclick="window.history.back()" style="
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">
            ← Volver
          </button>
        </div>
      `;
    }
  }

  // Cargar la información al iniciar la página
  cargarInformacionEmpresa();
});
