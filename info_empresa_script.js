// info_empresa_script.js - VERSIÓN OPTIMIZADA
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
      console.log("🔍 Cargando información de empresa...");

      // Limpiar contenedores
      infoEmpresaDetalle.innerHTML = "";
      cuerpoTablaContactos.innerHTML = "";

      // Obtener empresa seleccionada
      let selectedCompany =
        obtenerParametroUrl("companyId") ||
        localStorage.getItem("selectedCompany") ||
        "empresa1";

      console.log("🏢 Empresa seleccionada:", selectedCompany);

      // Cargar datos editados
      cargarDatosEditados();

      if (!DATOS_EMPRESAS[selectedCompany]) {
        throw new Error(`Empresa ${selectedCompany} no encontrada`);
      }

      const datos = DATOS_EMPRESAS[selectedCompany];

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

      console.log("✅ Información de empresa cargada correctamente");
    } catch (error) {
      console.error("❌ Error cargando información:", error);

      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError(
          "Error al cargar la información de la empresa"
        );
      }

      infoEmpresaDetalle.innerHTML = `
        <div class="error-mensaje">
          Error: No se pudo cargar la información.<br>
          Detalle: ${error.message}
        </div>
      `;
    }
  };

  // Función para cargar los contactos por área
  function cargarContactosAreas(companyId) {
    try {
      cuerpoTablaContactos.innerHTML = "";

      const contactos = DATOS_EMPRESAS[companyId]?.areas || [];

      if (contactos.length === 0) {
        cuerpoTablaContactos.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: #666; padding: 20px;">
              No hay datos de contactos disponibles para esta empresa.
            </td>
          </tr>
        `;
        return;
      }

      // Generar las filas de la tabla
      contactos.forEach((contacto, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-index", index);

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
    }
  }

  // Inicializar sistema de búsqueda y filtrado
  function inicializarBusquedaYFiltros(companyId) {
    try {
      if (typeof searchManager === "undefined") {
        console.warn("SearchManager no está disponible");
        return;
      }

      // Generar opciones de filtro
      const productos = searchManager.generarOpcionesFiltro(
        companyId,
        "producto"
      );
      const areas = searchManager.generarOpcionesFiltro(companyId, "area");

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
      }

      // Inicializar buscador y filtros
      searchManager.inicializarBuscador(
        "buscador-contactos",
        "tabla-contactos-areas"
      );
      searchManager.inicializarFiltroProducto(
        "filtro-producto",
        "tabla-contactos-areas"
      );
      searchManager.inicializarFiltroArea(
        "filtro-area",
        "tabla-contactos-areas"
      );

      console.log("✅ Sistema de búsqueda inicializado correctamente");
    } catch (error) {
      console.error("❌ Error inicializando búsqueda:", error);
    }
  }

  // Obtener parámetro de la URL
  function obtenerParametroUrl(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Cargar la información al iniciar la página
  console.log("🚀 Iniciando aplicación...");
  cargarInformacionEmpresa();
});
