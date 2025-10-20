// searchManager.js - Gestión de búsqueda y filtrado
const searchManager = {
  inicializarBuscador: function (inputId, tablaId, callback) {
    const buscador = document.getElementById(inputId);
    if (!buscador) return;

    buscador.addEventListener(
      "input",
      function (e) {
        this.filtrarTabla(tablaId, e.target.value, callback);
      }.bind(this)
    );
  },

  filtrarTabla: function (tablaId, texto, callback) {
    const tabla = document.getElementById(tablaId);
    if (!tabla) return;

    const filas = tabla.querySelectorAll("tbody tr");
    let filasVisibles = 0;
    const textoLower = texto.toLowerCase();

    filas.forEach((fila) => {
      const textoFila = fila.textContent.toLowerCase();
      const esVisible = textoLower === "" || textoFila.includes(textoLower);
      fila.style.display = esVisible ? "" : "none";
      if (esVisible) filasVisibles++;
    });

    if (callback) callback(filasVisibles);
  },

  generarOpcionesFiltro: function (companyId, tipo) {
    const empresa = DATOS_EMPRESAS[companyId];
    if (!empresa || !empresa.areas) return [];

    const valores = new Set();
    empresa.areas.forEach((area) => {
      if (tipo === "producto" && area.productoRequerido) {
        valores.add(area.productoRequerido);
      } else if (tipo === "area" && area.area) {
        valores.add(area.area);
      }
    });

    return Array.from(valores).sort();
  },

  inicializarFiltroProducto: function (selectId, tablaId) {
    this.inicializarFiltroGenerico(selectId, tablaId, 1); // Columna 1 = Producto
  },

  inicializarFiltroArea: function (selectId, tablaId) {
    this.inicializarFiltroGenerico(selectId, tablaId, 0); // Columna 0 = Área
  },

  inicializarFiltroGenerico: function (selectId, tablaId, columnaIndex) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.addEventListener(
      "change",
      function (e) {
        this.aplicarFiltroColumna(tablaId, columnaIndex, e.target.value);
      }.bind(this)
    );
  },

  aplicarFiltroColumna: function (tablaId, columnaIndex, valorFiltro) {
    const tabla = document.getElementById(tablaId);
    if (!tabla) return;

    const filas = tabla.querySelectorAll("tbody tr");

    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length > columnaIndex) {
        const textoCelda = celdas[columnaIndex].textContent.trim();
        const coincide = valorFiltro === "" || textoCelda === valorFiltro;
        fila.style.display = coincide ? "" : "none";
      }
    });
  },

  limpiarFiltros: function () {
    // Limpiar campos de búsqueda
    const buscador = document.getElementById("buscador-contactos");
    if (buscador) buscador.value = "";

    // Limpiar selects
    const filtroProducto = document.getElementById("filtro-producto");
    const filtroArea = document.getElementById("filtro-area");
    if (filtroProducto) filtroProducto.value = "";
    if (filtroArea) filtroArea.value = "";

    // Mostrar todas las filas
    const tablas = document.querySelectorAll(".tabla-areas");
    tablas.forEach((tabla) => {
      const filas = tabla.querySelectorAll("tbody tr");
      filas.forEach((fila) => {
        fila.style.display = "";
      });
    });

    // Mostrar mensaje de filtros limpiados
    if (typeof errorManager !== "undefined") {
      errorManager.mostrarError("Filtros limpiados correctamente", "success");
    }
  },
};
