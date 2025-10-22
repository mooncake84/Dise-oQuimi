// editManager.js - Gestión de edición de datos de empresa (solo tablas) - CORREGIDO
const editManager = {
  modoEdicion: false,
  companyIdActual: null,

  // Inicializar sistema de edición
  inicializar: function () {
    // Verificar dependencias
    if (typeof errorManager === "undefined") {
      console.error("errorManager no está disponible");
      // Proveer un fallback básico
      window.errorManager = {
        mostrarError: (msg, tipo) => {
          const method = tipo === "error" ? "error" : "log";
          console[method](msg);
          alert(msg); // Fallback simple
        },
      };
    }

    if (typeof guardarCambiosEmpresa === "undefined") {
      console.error("guardarCambiosEmpresa no está disponible");
      return false;
    }

    this.crearBotonesEdicion();
    this.agregarEventListeners();
    return true;
  },

  // Crear botones de edición
  crearBotonesEdicion: function () {
    const seccionTabla = document.querySelector(".seccion-tabla h3");
    if (!seccionTabla) {
      console.warn(
        "No se encontró la sección de tabla para agregar botones de edición"
      );
      return;
    }

    // Verificar si ya existen botones
    if (document.getElementById("btn-activar-edicion")) {
      return;
    }

    // Crear contenedor de botones
    const botonesContainer = document.createElement("div");
    botonesContainer.className = "botones-edicion-container";
    botonesContainer.style.cssText = `
      display: inline-flex;
      gap: 10px;
      margin-left: 20px;
    `;

    // Botón Activar Edición
    const btnActivarEdicion = document.createElement("button");
    btnActivarEdicion.id = "btn-activar-edicion";
    btnActivarEdicion.innerHTML = "✏️ Editar Tabla";
    btnActivarEdicion.className = "btn-edicion";

    // Botón Guardar Cambios (inicialmente oculto)
    const btnGuardarCambios = document.createElement("button");
    btnGuardarCambios.id = "btn-guardar-cambios";
    btnGuardarCambios.innerHTML = "💾 Guardar Cambios";
    btnGuardarCambios.className = "btn-edicion btn-guardar";
    btnGuardarCambios.style.display = "none";

    // Botón Cancelar Edición (inicialmente oculto)
    const btnCancelarEdicion = document.createElement("button");
    btnCancelarEdicion.id = "btn-cancelar-edicion";
    btnCancelarEdicion.innerHTML = "❌ Cancelar";
    btnCancelarEdicion.className = "btn-edicion btn-cancelar";
    btnCancelarEdicion.style.display = "none";

    botonesContainer.appendChild(btnActivarEdicion);
    botonesContainer.appendChild(btnGuardarCambios);
    botonesContainer.appendChild(btnCancelarEdicion);

    seccionTabla.style.display = "flex";
    seccionTabla.style.alignItems = "center";
    seccionTabla.style.flexWrap = "wrap";
    seccionTabla.appendChild(botonesContainer);
  },

  // Agregar event listeners
  agregarEventListeners: function () {
    document.addEventListener("click", (e) => {
      if (e.target.id === "btn-activar-edicion") {
        this.activarModoEdicion();
      } else if (e.target.id === "btn-guardar-cambios") {
        this.guardarCambios();
      } else if (e.target.id === "btn-cancelar-edicion") {
        this.cancelarEdicion();
      } else if (e.target.classList.contains("btn-eliminar-fila")) {
        this.eliminarFila(e.target);
      }
    });

    // Event listener para el botón de nueva fila (se agrega dinámicamente)
    document.addEventListener("click", (e) => {
      if (e.target.id === "btn-nueva-fila") {
        this.agregarNuevaFila();
      }
    });
  },

  // Activar modo edición
  activarModoEdicion: function () {
    try {
      this.modoEdicion = true;
      this.companyIdActual = this.obtenerCompanyIdActual();

      if (!this.companyIdActual) {
        throw new Error("No se pudo determinar la empresa actual");
      }

      // Mostrar/ocultar botones
      document.getElementById("btn-activar-edicion").style.display = "none";
      document.getElementById("btn-guardar-cambios").style.display =
        "inline-block";
      document.getElementById("btn-cancelar-edicion").style.display =
        "inline-block";

      // Agregar controles a la tabla
      this.agregarControlesTabla();

      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError(
          "Modo edición activado. Puede modificar los datos de la tabla.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error activando modo edición:", error);
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError(
          "Error al activar modo edición: " + error.message
        );
      }
    }
  },

  // Obtener companyId actual
  obtenerCompanyIdActual: function () {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let companyId = urlParams.get("companyId");

      if (!companyId) {
        companyId = localStorage.getItem("selectedCompany") || "empresa1";
      }

      // Validar que la empresa existe
      if (!DATOS_EMPRESAS[companyId]) {
        throw new Error(`Empresa ${companyId} no encontrada`);
      }

      return companyId;
    } catch (error) {
      console.error("Error obteniendo companyId:", error);
      return "empresa1"; // Fallback
    }
  },

  // Agregar controles a la tabla
  agregarControlesTabla: function () {
    const tabla = document.getElementById("tabla-contactos-areas");
    if (!tabla) {
      console.error("No se encontró la tabla de contactos");
      return;
    }

    // Agregar columna de acciones al thead si no existe
    const thead = tabla.querySelector("thead tr");
    if (
      !thead.querySelector("th:last-child").textContent.includes("Acciones")
    ) {
      const thAcciones = document.createElement("th");
      thAcciones.textContent = "Acciones";
      thAcciones.style.width = "120px";
      thAcciones.style.minWidth = "100px";
      thead.appendChild(thAcciones);
    }

    // Agregar controles a cada fila
    const filas = tabla.querySelectorAll("tbody tr");
    filas.forEach((fila, index) => {
      // Verificar si ya tiene columna de acciones
      if (!fila.querySelector(".acciones-tabla")) {
        const tdAcciones = document.createElement("td");
        tdAcciones.className = "acciones-tabla";

        tdAcciones.innerHTML = `
          <button class="btn-eliminar-fila" data-index="${index}" title="Eliminar área">🗑️</button>
        `;

        fila.appendChild(tdAcciones);
      }

      // Hacer celdas editables si no lo están ya
      if (!fila.querySelector(".input-tabla-editable")) {
        this.hacerFilaEditable(fila);
      }
    });

    // Agregar botón para nueva fila si no existe
    if (!document.getElementById("btn-nueva-fila")) {
      this.agregarBotonNuevaFila();
    }
  },

  // Hacer fila editable
  hacerFilaEditable: function (fila) {
    const celdas = fila.querySelectorAll("td:not(:last-child)");
    celdas.forEach((celda, index) => {
      const textoOriginal = celda.textContent.trim();
      const esEmail = index === 4 && textoOriginal.includes("@");

      if (esEmail) {
        celda.innerHTML = `<input type="email" class="input-tabla-editable" value="${textoOriginal}">`;
      } else {
        celda.innerHTML = `<input type="text" class="input-tabla-editable" value="${textoOriginal}">`;
      }
    });
  },

  // Agregar botón para nueva fila
  agregarBotonNuevaFila: function () {
    const contenedorTabla = document.querySelector(".seccion-tabla");
    if (!contenedorTabla) return;

    const botonNuevaFila = document.createElement("button");
    botonNuevaFila.id = "btn-nueva-fila";
    botonNuevaFila.innerHTML = "➕ Agregar Nueva Área";
    botonNuevaFila.className = "btn-nueva-fila";

    contenedorTabla.appendChild(botonNuevaFila);
  },

  // Agregar nueva fila a la tabla
  agregarNuevaFila: function () {
    const tbody = document.getElementById("cuerpo-tabla-contactos");
    if (!tbody) return;

    const nuevaFila = document.createElement("tr");

    nuevaFila.innerHTML = `
      <td><input type="text" class="input-tabla-editable" placeholder="Nombre del área"></td>
      <td><input type="text" class="input-tabla-editable" placeholder="Producto requerido"></td>
      <td><input type="text" class="input-tabla-editable" placeholder="Encargado"></td>
      <td><input type="text" class="input-tabla-editable" placeholder="Puesto"></td>
      <td><input type="email" class="input-tabla-editable" placeholder="correo@empresa.com"></td>
      <td><input type="text" class="input-tabla-editable" placeholder="Teléfono"></td>
      <td class="acciones-tabla">
        <button class="btn-eliminar-fila" title="Eliminar área">🗑️</button>
      </td>
    `;

    tbody.appendChild(nuevaFila);
  },

  // Eliminar fila
  eliminarFila: function (boton) {
    const fila = boton.closest("tr");
    if (fila && confirm("¿Está seguro de que desea eliminar esta área?")) {
      fila.remove();
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError("Área eliminada correctamente", "success");
      }
    }
  },

  // Guardar todos los cambios
  guardarCambios: function () {
    try {
      // Obtener datos actuales de la empresa (sin modificar información básica)
      const datosActuales = DATOS_EMPRESAS[this.companyIdActual];
      if (!datosActuales) {
        throw new Error(`Empresa ${this.companyIdActual} no encontrada`);
      }

      const datosActualizados = {
        ...datosActuales,
        areas: this.obtenerDatosTablaActualizados(),
      };

      // Validar datos
      if (!this.validarDatos(datosActualizados)) {
        return;
      }

      // Guardar cambios
      const exito = guardarCambiosEmpresa(
        this.companyIdActual,
        datosActualizados
      );

      if (exito) {
        this.modoEdicion = false;
        this.actualizarVista();
        if (typeof errorManager !== "undefined") {
          errorManager.mostrarError(
            "Cambios en la tabla guardados exitosamente",
            "success"
          );
        }
      } else {
        throw new Error("Error al guardar cambios en localStorage");
      }
    } catch (error) {
      console.error("Error guardando cambios:", error);
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError(
          "Error al guardar los cambios: " + error.message
        );
      }
    }
  },

  // Obtener datos de tabla actualizados
  obtenerDatosTablaActualizados: function () {
    const filas = document.querySelectorAll("#cuerpo-tabla-contactos tr");
    const areas = [];

    filas.forEach((fila) => {
      const inputs = fila.querySelectorAll(".input-tabla-editable");
      if (inputs.length >= 6) {
        const area = {
          area: inputs[0].value.trim(),
          productoRequerido: inputs[1].value.trim(),
          encargado: inputs[2].value.trim(),
          puesto: inputs[3].value.trim(),
          correo: inputs[4].value.trim(),
          telefono: inputs[5].value.trim(),
        };

        // Solo agregar si tiene al menos área
        if (area.area) {
          areas.push(area);
        }
      }
    });

    return areas;
  },

  // Validar datos antes de guardar
  validarDatos: function (datos) {
    // Validar emails en áreas
    for (let area of datos.areas) {
      if (
        area.correo &&
        area.correo !== "S.C" &&
        area.correo !== "" &&
        !this.validarEmail(area.correo)
      ) {
        if (typeof errorManager !== "undefined") {
          errorManager.mostrarError(`El email "${area.correo}" no es válido`);
        }
        return false;
      }
    }

    return true;
  },

  // Validar formato email
  validarEmail: function (email) {
    if (email === "S.C" || email === "") return true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Cancelar edición
  cancelarEdicion: function () {
    this.modoEdicion = false;

    // Restaurar botones
    const btnActivar = document.getElementById("btn-activar-edicion");
    const btnGuardar = document.getElementById("btn-guardar-cambios");
    const btnCancelar = document.getElementById("btn-cancelar-edicion");

    if (btnActivar) btnActivar.style.display = "inline-block";
    if (btnGuardar) btnGuardar.style.display = "none";
    if (btnCancelar) btnCancelar.style.display = "none";

    // Recargar la página para restaurar datos originales
    location.reload();
  },

  // Actualizar vista después de guardar
  actualizarVista: function () {
    // Recargar la información
    if (typeof cargarInformacionEmpresa === "function") {
      cargarInformacionEmpresa();
    }

    // Restaurar botones
    const btnActivar = document.getElementById("btn-activar-edicion");
    const btnGuardar = document.getElementById("btn-guardar-cambios");
    const btnCancelar = document.getElementById("btn-cancelar-edicion");

    if (btnActivar) btnActivar.style.display = "inline-block";
    if (btnGuardar) btnGuardar.style.display = "none";
    if (btnCancelar) btnCancelar.style.display = "none";

    // Remover botón de nueva fila si existe
    const btnNuevaFila = document.getElementById("btn-nueva-fila");
    if (btnNuevaFila) {
      btnNuevaFila.remove();
    }
  },
};

// Inicialización automática cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      editManager.inicializar();
    }, 100);
  });
} else {
  setTimeout(() => {
    editManager.inicializar();
  }, 100);
}
