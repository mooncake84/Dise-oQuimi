// editManager.js - VERSIÓN MEJORADA CON RECARGA CONFIABLE
const editManager = {
  modoEdicion: false,
  companyIdActual: null,

  // Inicializar sistema de edición
  inicializar: function () {
    try {
      // Verificar dependencias
      if (typeof errorManager === "undefined") {
        console.error("errorManager no está disponible");
        window.errorManager = {
          mostrarError: (msg, tipo) => {
            console[tipo === "error" ? "error" : "log"](msg);
            alert(msg);
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
    } catch (error) {
      console.error("Error inicializando editManager:", error);
      return false;
    }
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

    if (document.getElementById("btn-activar-edicion")) {
      return;
    }

    const botonesContainer = document.createElement("div");
    botonesContainer.className = "botones-edicion-container";

    const btnActivarEdicion = document.createElement("button");
    btnActivarEdicion.id = "btn-activar-edicion";
    btnActivarEdicion.innerHTML = "✏️ Editar Tabla";
    btnActivarEdicion.className = "btn-edicion";

    const btnGuardarCambios = document.createElement("button");
    btnGuardarCambios.id = "btn-guardar-cambios";
    btnGuardarCambios.innerHTML = "💾 Guardar Cambios";
    btnGuardarCambios.className = "btn-edicion btn-guardar";
    btnGuardarCambios.style.display = "none";

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

    console.log("✅ Botones de edición creados correctamente");
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
      } else if (e.target.id === "btn-nueva-fila") {
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

      document.getElementById("btn-activar-edicion").style.display = "none";
      document.getElementById("btn-guardar-cambios").style.display =
        "inline-block";
      document.getElementById("btn-cancelar-edicion").style.display =
        "inline-block";

      this.agregarControlesTabla();

      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError(
          "Modo edición activado. Puede modificar los datos de la tabla.",
          "info"
        );
      }

      console.log("✅ Modo edición activado correctamente");
    } catch (error) {
      console.error("❌ Error activando modo edición:", error);
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

      if (!DATOS_EMPRESAS[companyId]) {
        throw new Error(`Empresa ${companyId} no encontrada`);
      }

      return companyId;
    } catch (error) {
      console.error("❌ Error obteniendo companyId:", error);
      return "empresa1";
    }
  },

  // Agregar controles a la tabla
  agregarControlesTabla: function () {
    const tabla = document.getElementById("tabla-contactos-areas");
    if (!tabla) {
      console.error("❌ No se encontró la tabla de contactos");
      return;
    }

    console.log("🔧 Agregando controles a la tabla...");

    // Agregar columna de acciones al thead si no existe
    const thead = tabla.querySelector("thead tr");
    const thAccionesExistente = thead.querySelector("th:last-child");

    if (
      !thAccionesExistente ||
      !thAccionesExistente.textContent.includes("Acciones")
    ) {
      const thAcciones = document.createElement("th");
      thAcciones.textContent = "Acciones";
      thAcciones.style.width = "120px";
      thAcciones.style.minWidth = "100px";
      thead.appendChild(thAcciones);
      console.log("✅ Columna 'Acciones' agregada al thead");
    }

    // Agregar controles a cada fila
    const filas = tabla.querySelectorAll("tbody tr");
    console.log(`📝 Procesando ${filas.length} filas...`);

    filas.forEach((fila, index) => {
      let tdAcciones = fila.querySelector(".acciones-tabla");

      if (!tdAcciones) {
        tdAcciones = document.createElement("td");
        tdAcciones.className = "acciones-tabla";
        tdAcciones.innerHTML = `<button class="btn-eliminar-fila" data-index="${index}" title="Eliminar área">🗑️</button>`;
        fila.appendChild(tdAcciones);
        console.log(`✅ Columna acciones agregada a fila ${index}`);
      }

      if (!fila.querySelector(".input-tabla-editable")) {
        this.hacerFilaEditable(fila);
        console.log(`✅ Fila ${index} hecha editable`);
      }
    });

    // Agregar botón para nueva fila si no existe
    if (!document.getElementById("btn-nueva-fila")) {
      this.agregarBotonNuevaFila();
      console.log("✅ Botón 'Nueva Fila' agregado");
    }

    console.log("✅ Controles de tabla agregados correctamente");
  },

  // Hacer fila editable
  hacerFilaEditable: function (fila) {
    const celdas = fila.querySelectorAll("td:not(:last-child)");
    console.log(`🔧 Haciendo editables ${celdas.length} celdas`);

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
    console.log("✅ Nueva fila agregada correctamente");
  },

  // Eliminar fila
  eliminarFila: function (boton) {
    const fila = boton.closest("tr");
    if (fila && confirm("¿Está seguro de que desea eliminar esta área?")) {
      fila.remove();
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError("Área eliminada correctamente", "success");
      }
      console.log("✅ Fila eliminada correctamente");
    }
  },

  // Guardar todos los cambios - RECARGA CONFIABLE
  guardarCambios: function () {
    try {
      console.log("💾 Iniciando proceso de guardado...");

      this.companyIdActual = this.obtenerCompanyIdActual();
      if (!this.companyIdActual) {
        throw new Error("No se pudo determinar la empresa actual");
      }

      const datosActuales = DATOS_EMPRESAS[this.companyIdActual];
      if (!datosActuales) {
        throw new Error(`Empresa ${this.companyIdActual} no encontrada`);
      }

      const areasActualizadas = this.obtenerDatosTablaActualizados();

      console.log("📊 Áreas a guardar:", areasActualizadas);

      if (areasActualizadas.length === 0) {
        if (typeof errorManager !== "undefined") {
          errorManager.mostrarError(
            "Debe haber al menos un área en la tabla",
            "warning"
          );
        }
        return;
      }

      const datosActualizados = {
        ...datosActuales,
        areas: areasActualizadas,
      };

      if (!this.validarDatos(datosActualizados)) {
        return;
      }

      // ACTUALIZACIÓN SÓLIDA DEL OBJETO GLOBAL
      DATOS_EMPRESAS[this.companyIdActual] = datosActualizados;

      // GUARDADO CONFIRMADO
      const exito = guardarCambiosEmpresa(
        this.companyIdActual,
        datosActualizados
      );

      if (exito) {
        this.modoEdicion = false;

        // RECARGA AUTOMÁTICA CONFIRMADA
        console.log("🔄 Recargando datos automáticamente...");

        // Método 1: Recarga suave mediante función
        if (typeof cargarInformacionEmpresa === "function") {
          cargarInformacionEmpresa();
          this.mostrarBotonesNormales();

          if (typeof errorManager !== "undefined") {
            errorManager.mostrarError(
              "✅ Cambios guardados exitosamente. Los datos se han actualizado.",
              "success",
              3000
            );
          }
        } else {
          // Método 2: Recarga de página como fallback
          console.log("⚠️ Usando recarga de página como fallback");
          location.reload();
        }

        console.log("✅ Proceso de guardado completado exitosamente");
      } else {
        throw new Error("Error al guardar cambios en el almacenamiento");
      }
    } catch (error) {
      console.error("❌ Error en el proceso de guardado:", error);
      if (typeof errorManager !== "undefined") {
        errorManager.mostrarError(
          "Error al guardar los cambios: " + error.message
        );
      }
    }
  },

  // Mostrar botones en estado normal
  mostrarBotonesNormales: function () {
    const btnActivar = document.getElementById("btn-activar-edicion");
    const btnGuardar = document.getElementById("btn-guardar-cambios");
    const btnCancelar = document.getElementById("btn-cancelar-edicion");

    if (btnActivar) btnActivar.style.display = "inline-block";
    if (btnGuardar) btnGuardar.style.display = "none";
    if (btnCancelar) btnCancelar.style.display = "none";

    // Remover botón de nueva fila
    const btnNuevaFila = document.getElementById("btn-nueva-fila");
    if (btnNuevaFila) {
      btnNuevaFila.remove();
    }
  },

  // Obtener datos de tabla actualizados
  obtenerDatosTablaActualizados: function () {
    const filas = document.querySelectorAll("#cuerpo-tabla-contactos tr");
    const areas = [];

    filas.forEach((fila, index) => {
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

        if (area.area) {
          areas.push(area);
        }
      }
    });

    return areas;
  },

  // Validar datos antes de guardar
  validarDatos: function (datos) {
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
    console.log("❌ Cancelando edición...");

    this.modoEdicion = false;
    this.mostrarBotonesNormales();

    // Recargar la página para restaurar datos originales
    location.reload();
  },
};

// Inicialización automática
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    console.log("🚀 Inicializando editManager...");
    editManager.inicializar();
  }, 100);
});
