// info_empresa_script.js - Actualizado con sistema de edición (solo tablas) - CORREGIDO
document.addEventListener("DOMContentLoaded", function () {
  const infoEmpresaDetalle = document.getElementById("info-empresa-detalle");
  const cuerpoTablaContactos = document.getElementById(
    "cuerpo-tabla-contactos"
  );
  const filtroProducto = document.getElementById("filtro-producto");
  const filtroArea = document.getElementById("filtro-area");

  // Función para cargar información de la empresa
  window.cargarInformacionEmpresa = function () {
    try {
      console.log("🔍 Iniciando carga de información de empresa...");

      // Limpiar contenedores
      infoEmpresaDetalle.innerHTML = "";
      cuerpoTablaContactos.innerHTML = "";

      // Obtener empresa seleccionada
      let selectedCompany = obtenerParametroUrl("companyId");
      if (!selectedCompany) {
        selectedCompany = localStorage.getItem("selectedCompany");
      }
      if (!selectedCompany) {
        selectedCompany = "empresa1";
      }

      console.log("🏢 Empresa seleccionada:", selectedCompany);

      // CARGAR DATOS EDITADOS PRIMERO
      cargarDatosEditados();

      // Verificar que la empresa existe
      if (!DATOS_EMPRESAS[selectedCompany]) {
        throw new Error(`Empresa ${selectedCompany} no encontrada`);
      }

      const datos = DATOS_EMPRESAS[selectedCompany];
      console.log("📊 Datos cargados:", datos);

      // Mostrar información básica
      const infoHTML = `
        <div class="info-basica-container">
          <h3>${datos.nombre}</h3>
          <p><strong>Giro:</strong> ${datos.giro}</p>
          <p><strong>Dirección:</strong> ${datos.direccion}</p>
          <p><strong>Contacto Email:</strong> ${datos.contacto}</p>
          <p><strong>Teléfono:</strong> ${datos.telefono}</p>
        </div>
      `;
      infoEmpresaDetalle.innerHTML = infoHTML;

      // Cargar contactos
      cargarContactosAreas(selectedCompany);

      // Inicializar búsqueda
      inicializarBusquedaYFiltros(selectedCompany);

      // Reinicializar sistema de edición
      setTimeout(() => {
        if (typeof editManager !== "undefined") {
          editManager.modoEdicion = false;
          const exito = editManager.inicializar();
          if (!exito) {
            console.warn("EditManager no se pudo reinicializar");
          }
        }
      }, 1000);
    } catch (error) {
      console.error("❌ Error cargando información:", error);

      if (typeof errorManager !== "undefined") {
        errorManager.mostrarErrorCargaEmpresa(selectedCompany);
      }

      infoEmpresaDetalle.innerHTML = `
        <div class="error-mensaje">
          Error: No se pudo cargar la información.<br>
          Detalle: ${error.message}
        </div>
      `;
    }
  };

  // Función para cargar los contactos por área - CORREGIDA
  function cargarContactosAreas(companyId) {
    try {
      console.log("📋 Cargando contactos para empresa:", companyId);

      cuerpoTablaContactos.innerHTML = "";

      const contactos = DATOS_EMPRESAS[companyId]?.areas || [];
      console.log("👥 Contactos encontrados:", contactos);

      if (contactos.length === 0) {
        cuerpoTablaContactos.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: #666; padding: 20px;">
              No hay datos de contactos disponibles para esta empresa.
            </td>
          </tr>
        `;
        console.log("ℹ️ No hay contactos para mostrar");
        return;
      }

      // Generar las filas de la tabla - CORREGIDO: Solo 6 columnas
      contactos.forEach((contacto, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-index", index);

        // CORREGIDO: Solo 6 columnas para coincidir con el thead
        fila.innerHTML = `
          <td><strong>${contacto.area || "N/A"}</strong></td>
          <td>${contacto.productoRequerido || "N/A"}</td>
          <td>${contacto.encargado || "N/A"}</td>
          <td>${contacto.puesto || "N/A"}</td>
          <td>${
            contacto.correo && contacto.correo !== "S.C"
              ? `<a href="mailto:${contacto.correo}" style="color: #2196F3; text-decoration: none;">${contacto.correo}</a>`
              : "S.C"
          }</td>
          <td>${contacto.telefono || "S.D"}</td>
        `;
        cuerpoTablaContactos.appendChild(fila);
      });

      console.log("✅ Tabla de contactos cargada correctamente");
    } catch (error) {
      console.error("❌ Error cargando contactos:", error);
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError("Error al cargar los contactos por área");
      }

      // Mostrar mensaje de error en la tabla
      cuerpoTablaContactos.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: #d32f2f; padding: 20px;">
            Error al cargar los contactos: ${error.message}
          </td>
        </tr>
      `;
    }
  }

  // Inicializar sistema de búsqueda y filtrado
  function inicializarBusquedaYFiltros(companyId) {
    try {
      console.log("🔍 Inicializando sistema de búsqueda...");

      // Verificar que searchManager existe
      if (typeof searchManager === "undefined") {
        console.warn("SearchManager no está disponible");
        return;
      }

      // Generar opciones de filtro dinámicamente
      const productos = searchManager.generarOpcionesFiltro(
        companyId,
        "producto"
      );
      const areas = searchManager.generarOpcionesFiltro(companyId, "area");

      console.log("📦 Productos para filtro:", productos);
      console.log("🏭 Áreas para filtro:", areas);

      // Llenar filtro de productos
      if (filtroProducto) {
        filtroProducto.innerHTML =
          '<option value="">Todos los productos</option>';
        productos.forEach((producto) => {
          const option = document.createElement("option");
          option.value = producto;
          option.textContent = producto;
          filtroProducto.appendChild(option);
        });
        console.log("✅ Filtro de productos inicializado");
      }

      // Llenar filtro de áreas
      if (filtroArea) {
        filtroArea.innerHTML = '<option value="">Todas las áreas</option>';
        areas.forEach((area) => {
          const option = document.createElement("option");
          option.value = area;
          option.textContent = area;
          filtroArea.appendChild(option);
        });
        console.log("✅ Filtro de áreas inicializado");
      }

      // Inicializar buscador
      searchManager.inicializarBuscador(
        "buscador-contactos",
        "tabla-contactos-areas",
        function (filasVisibles) {
          console.log(
            `👀 Filas visibles después de búsqueda: ${filasVisibles}`
          );
        }
      );

      // Inicializar filtros
      searchManager.inicializarFiltroProducto(
        "filtro-producto",
        "tabla-contactos-areas"
      );
      searchManager.inicializarFiltroArea(
        "filtro-area",
        "tabla-contactos-areas"
      );

      console.log(
        "✅ Sistema de búsqueda y filtrado inicializado correctamente"
      );
    } catch (error) {
      console.error("❌ Error inicializando búsqueda:", error);
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError("Error al inicializar sistema de búsqueda");
      }
    }
  }

  /**
   * Obtiene un parámetro de la URL.
   * @param {string} name - Nombre del parámetro.
   */
  function obtenerParametroUrl(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Función de debug para verificar datos
  function verificarDatosEmpresa(companyId) {
    console.log("🔍 VERIFICANDO DATOS:");
    console.log("Company ID:", companyId);
    console.log("DATOS_EMPRESAS:", DATOS_EMPRESAS);
    console.log("Empresa específica:", DATOS_EMPRESAS[companyId]);
    console.log("Áreas:", DATOS_EMPRESAS[companyId]?.areas);

    // Verificar localStorage
    const datosGuardados = localStorage.getItem("datosEmpresasEditados");
    console.log(
      "LocalStorage:",
      datosGuardados ? JSON.parse(datosGuardados) : "No hay datos"
    );
  }

  // Cargar la información al iniciar la página
  console.log("🚀 Iniciando carga de información de empresa...");
  cargarInformacionEmpresa();

  // Debug
  setTimeout(() => {
    let companyId =
      obtenerParametroUrl("companyId") ||
      localStorage.getItem("selectedCompany") ||
      "empresa1";
    verificarDatosEmpresa(companyId);
  }, 2000);
});
