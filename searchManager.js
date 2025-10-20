// searchManager.js - Sistema de búsqueda y filtrado
class SearchManager {
  constructor() {
    this.filtrosActivos = {
      texto: "",
      producto: "",
      area: "",
    };
  }

  // Búsqueda en tiempo real con debounce
  inicializarBuscador(inputId, tablaId, callback) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Debounce para evitar búsquedas excesivas
    const buscarConDebounce = this.debounce((termino) => {
      this.filtrosActivos.texto = termino;
      this.aplicarFiltros(tablaId, callback);
    }, 300);

    input.addEventListener("input", (e) => {
      buscarConDebounce(e.target.value.trim().toLowerCase());
    });
  }

  // Filtrado por producto
  inicializarFiltroProducto(selectId, tablaId, callback) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.addEventListener("change", (e) => {
      this.filtrosActivos.producto = e.target.value;
      this.aplicarFiltros(tablaId, callback);
    });
  }

  // Filtrado por área
  inicializarFiltroArea(selectId, tablaId, callback) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.addEventListener("change", (e) => {
      this.filtrosActivos.area = e.target.value;
      this.aplicarFiltros(tablaId, callback);
    });
  }

  // Aplicar todos los filtros activos
  aplicarFiltros(tablaId, callback) {
    const tabla = document.getElementById(tablaId);
    if (!tabla) return;

    const filas = tabla.querySelectorAll("tbody tr");
    let filasVisibles = 0;

    filas.forEach((fila) => {
      const textoFila = fila.textContent.toLowerCase();
      const productoFila = fila.cells[1]?.textContent.toLowerCase() || "";
      const areaFila = fila.cells[0]?.textContent.toLowerCase() || "";

      const coincideTexto =
        !this.filtrosActivos.texto ||
        textoFila.includes(this.filtrosActivos.texto);

      const coincideProducto =
        !this.filtrosActivos.producto ||
        productoFila.includes(this.filtrosActivos.producto.toLowerCase());

      const coincideArea =
        !this.filtrosActivos.area ||
        areaFila.includes(this.filtrosActivos.area.toLowerCase());

      const mostrarFila = coincideTexto && coincideProducto && coincideArea;

      fila.style.display = mostrarFila ? "" : "none";
      if (mostrarFila) filasVisibles++;
    });

    // Ejecutar callback si se proporciona (para actualizar contadores, etc.)
    if (callback && typeof callback === "function") {
      callback(filasVisibles);
    }

    this.mostrarResultadosFiltro(filasVisibles, filas.length);
  }

  mostrarResultadosFiltro(visibles, total) {
    // Buscar o crear contador de resultados
    let contador = document.getElementById("contador-resultados");
    if (!contador) {
      contador = document.createElement("div");
      contador.id = "contador-resultados";
      contador.style.cssText = `
                padding: 10px;
                margin: 10px 0;
                background: #e3f2fd;
                border-radius: 5px;
                font-size: 14px;
                color: #1976d2;
            `;

      // Insertar después del buscador o al inicio de la tabla
      const buscador = document.querySelector(".herramientas-busqueda");
      if (buscador) {
        buscador.parentNode.insertBefore(contador, buscador.nextSibling);
      }
    }

    if (visibles === total) {
      contador.textContent = `Mostrando todos los ${total} contactos`;
    } else {
      contador.textContent = `Mostrando ${visibles} de ${total} contactos`;

      if (visibles === 0) {
        contador.style.background = "#ffebee";
        contador.style.color = "#c62828";
        contador.textContent = `No se encontraron contactos con los filtros aplicados`;
      } else {
        contador.style.background = "#e3f2fd";
        contador.style.color = "#1976d2";
      }
    }
  }

  // Limpiar todos los filtros
  limpiarFiltros() {
    this.filtrosActivos = {
      texto: "",
      producto: "",
      area: "",
    };

    // Limpiar inputs
    const buscador = document.getElementById("buscador-contactos");
    if (buscador) buscador.value = "";

    const filtroProducto = document.getElementById("filtro-producto");
    if (filtroProducto) filtroProducto.value = "";

    const filtroArea = document.getElementById("filtro-area");
    if (filtroArea) filtroArea.value = "";

    // Re-aplicar filtros (mostrar todo)
    this.aplicarFiltros("cuerpo-tabla-contactos");
  }

  // Debounce para optimizar búsquedas
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Generar opciones de filtro dinámicamente
  generarOpcionesFiltro(empresaId, tipo) {
    if (!DATOS_EMPRESAS[empresaId]) return [];

    const areas = DATOS_EMPRESAS[empresaId].areas;
    const opciones = new Set();

    areas.forEach((area) => {
      if (tipo === "producto") {
        opciones.add(area.productoRequerido);
      } else if (tipo === "area") {
        opciones.add(area.area);
      }
    });

    return Array.from(opciones).sort();
  }
}

// Instancia global
const searchManager = new SearchManager();
