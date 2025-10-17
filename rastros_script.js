document.addEventListener("DOMContentLoaded", function () {
  const btnInfoGeneral = document.getElementById("btn-opcion1");
  const infoModalOverlay = document.getElementById("info-modal-overlay");
  const cerrarModalBtn = document.getElementById("cerrar-modal");

  // 💥 NUEVOS ELEMENTOS DEL HEADER 💥
  const selectCambioEmpresa = document.getElementById("select-cambio-empresa");
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");
  const infoEmpresaDetalle = document.getElementById("info-empresa-detalle");
  const errorEmpresaMsg = document.getElementById("error-empresa");

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
      contacto: "email-provisional-C@dominio-x.com",
      telefono: "Teléfono Pendiente (55) XXXX-0003",
      giro: "Giro Distribución Provisional X (Equipos)",
    },
  };

  // 💥 FUNCIÓN PRINCIPAL PARA SINCRONIZAR Y ACTUALIZAR LA VISTA 💥
  function actualizarEmpresaVista(empresaId) {
    if (datosEmpresas[empresaId]) {
      // Obtiene el nombre legible de la opción seleccionada
      const nombre =
        selectCambioEmpresa.options[selectCambioEmpresa.selectedIndex].text;

      // Actualiza el texto en la parte superior
      nombreEmpresaActual.textContent = `Empresa Actual: ${nombre}`;

      // Guarda el nuevo ID en el almacenamiento local
      localStorage.setItem("selectedCompany", empresaId);

      // Sincroniza el select con el valor cargado
      selectCambioEmpresa.value = empresaId;
      console.log(`Empresa cambiada a: ${nombre} (${empresaId})`);
    }
  }

  // 💥 FUNCIÓN PARA MOSTRAR EL MODAL DE INFORMACIÓN 💥
  function mostrarModalInfo() {
    const selectedCompany = localStorage.getItem("selectedCompany");
    infoEmpresaDetalle.innerHTML = "";
    errorEmpresaMsg.style.display = "none";

    if (selectedCompany && datosEmpresas[selectedCompany]) {
      const datos = datosEmpresas[selectedCompany];

      const infoHTML = `
                <h3>${datos.nombre}</h3>
                <p><strong>Giro:</strong> ${datos.giro}</p>
                <p><strong>Dirección:</strong> ${datos.direccion}</p>
                <p><strong>Contacto Email:</strong> ${datos.contacto}</p>
                <p><strong>Teléfono:</strong> ${datos.telefono}</p>
                <p style="margin-top: 20px; font-style: italic;">*Esta información es provisional y debe ser reemplazada.</p>
            `;
      infoEmpresaDetalle.innerHTML = infoHTML;
      infoModalOverlay.classList.add("visible");
    } else {
      errorEmpresaMsg.textContent =
        "Error: No se pudo cargar la información de la empresa.";
      errorEmpresaMsg.style.display = "block";
      infoModalOverlay.classList.add("visible");
    }
  }

  // --- INICIALIZACIÓN: Cargar empresa al entrar a la página ---
  // Usa la empresa guardada en localStorage o 'empresa1' si no existe
  const empresaInicial = localStorage.getItem("selectedCompany") || "empresa1";
  actualizarEmpresaVista(empresaInicial);

  // --- EVENT LISTENERS ---

  // 1. Evento para cambiar la empresa en el selector del header
  selectCambioEmpresa.addEventListener("change", function () {
    actualizarEmpresaVista(selectCambioEmpresa.value);
  });

  // 2. Evento para el botón INFORMACION GENERAL
  btnInfoGeneral.addEventListener("click", mostrarModalInfo);

  // 3. Cerrar modal
  cerrarModalBtn.addEventListener("click", function () {
    infoModalOverlay.classList.remove("visible");
  });

  // Cerrar el modal al hacer clic en el área oscura (overlay)
  infoModalOverlay.addEventListener("click", function (e) {
    if (e.target === infoModalOverlay) {
      infoModalOverlay.classList.remove("visible");
    }
  });
});
