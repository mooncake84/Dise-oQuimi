// info_empresa_script.js - Actualizado con nuevas funcionalidades
document.addEventListener("DOMContentLoaded", function () {
  const infoEmpresaDetalle = document.getElementById("info-empresa-detalle");
  const cuerpoTablaContactos = document.getElementById(
    "cuerpo-tabla-contactos"
  );
  const filtroProducto = document.getElementById("filtro-producto");
  const filtroArea = document.getElementById("filtro-area");

  // Función para cargar información de la empresa
  function cargarInformacionEmpresa() {
    try {
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

      console.log("Empresa seleccionada:", selectedCompany);

      // Validar que DATOS_EMPRESAS existe
      if (typeof DATOS_EMPRESAS === "undefined") {
        throw new Error("Datos de empresas no cargados");
      }

      // Validar datos de la empresa
      errorManager.validarDatosEmpresa(selectedCompany);

      const datos = DATOS_EMPRESAS[selectedCompany];

      // Construir el HTML con los datos de la empresa
      const infoHTML = `
        <div class="info-basica-container">
          <h3>${datos.nombre}</h3>
          <p><strong>Giro:</strong> ${datos.giro}</p>
          <p><strong>Dirección:</strong> ${datos.direccion}</p>
          <p><strong>Contacto Email:</strong> ${datos.contacto}</p>
          <p><strong>Teléfono:</strong> ${datos.telefono}</p>
          <p style="margin-top: 20px; font-style: italic; color: #666;">
            *Esta información es provisional y debe ser reemplazada.
          </p>
        </div>
      `;
      infoEmpresaDetalle.innerHTML = infoHTML;

      // Cargar los datos de contacto por área
      cargarContactosAreas(selectedCompany);

      // Inicializar sistema de búsqueda y filtrado
      inicializarBusquedaYFiltros(selectedCompany);
    } catch (error) {
      console.error("Error cargando información de empresa:", error);
      errorManager.mostrarErrorCargaEmpresa(selectedCompany);

      infoEmpresaDetalle.innerHTML = `
        <div class="error-mensaje">
          Error: No se pudo cargar la información de la empresa.<br>
          Detalle: ${error.message}
        </div>
      `;
    }
  }

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
      contactos.forEach((contacto) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td><strong>${contacto.area}</strong></td>
          <td>${contacto.productoRequerido}</td>
          <td>${contacto.encargado}</td>
          <td>${contacto.datosEncargado}</td>
          <td><a href="mailto:${contacto.correo}" style="color: #2196F3; text-decoration: none;">${contacto.correo}</a></td>
          <td>${contacto.telefono}</td>
        `;
        cuerpoTablaContactos.appendChild(fila);
      });
    } catch (error) {
      console.error("Error cargando contactos:", error);
      errorManager.mostrarError("Error al cargar los contactos por área");
    }
  }

  // Inicializar sistema de búsqueda y filtrado
  function inicializarBusquedaYFiltros(companyId) {
    try {
      // Verificar que searchManager existe
      if (typeof searchManager === "undefined") {
        throw new Error("SearchManager no está disponible");
      }

      // Generar opciones de filtro dinámicamente
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

      // Inicializar buscador
      searchManager.inicializarBuscador(
        "buscador-contactos",
        "tabla-contactos-areas",
        function (filasVisibles) {
          console.log(`Filas visibles después de búsqueda: ${filasVisibles}`);
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
    } catch (error) {
      console.error("Error inicializando búsqueda:", error);
      errorManager.mostrarError("Error al inicializar sistema de búsqueda");
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

  // Cargar la información al iniciar la página
  cargarInformacionEmpresa();
});
