// programacion_script.js - Actualizado con validaciones robustas
document.addEventListener("DOMContentLoaded", function () {
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");
  const btnGuardar = document.getElementById("btn-guardar-actividad");
  const fechaInput = document.getElementById("fecha-actividad");
  const formulario = document.querySelector(".form-container");

  // Crear contenedor de errores del formulario
  const erroresContainer = document.createElement("div");
  erroresContainer.id = "errores-formulario";
  erroresContainer.style.cssText = `
    margin-bottom: 20px;
    border-radius: 5px;
    overflow: hidden;
  `;
  formulario.parentNode.insertBefore(erroresContainer, formulario);

  // Establecer fecha mínima como hoy
  function establecerFechaMinima() {
    try {
      const hoy = new Date();
      const fechaFormateada = hoy.toISOString().split("T")[0];
      fechaInput.setAttribute("min", fechaFormateada);

      // Establecer fecha por defecto como hoy
      fechaInput.value = fechaFormateada;
    } catch (error) {
      console.error("Error estableciendo fecha mínima:", error);
      errorManager.mostrarError("Error al configurar fecha del sistema");
    }
  }

  // Mostrar la empresa seleccionada actualmente
  function cargarEmpresaActual() {
    try {
      const selectedCompanyId =
        localStorage.getItem("selectedCompany") || "empresa1";

      if (!DATOS_EMPRESAS[selectedCompanyId]) {
        throw new Error(`Empresa ${selectedCompanyId} no encontrada`);
      }

      const nombreEmpresa = DATOS_EMPRESAS[selectedCompanyId].nombre;
      nombreEmpresaActual.textContent = `Empresa Actual: ${nombreEmpresa}`;
      return selectedCompanyId;
    } catch (error) {
      console.error("Error cargando empresa actual:", error);
      errorManager.mostrarError("Error al cargar información de la empresa");
      return "empresa1";
    }
  }

  const currentCompanyId = cargarEmpresaActual();

  // Validar formulario completo
  function validarYEnviarFormulario() {
    try {
      // Obtener datos del formulario
      const formData = {
        fecha: fechaInput.value,
        hora: document.getElementById("hora-actividad").value,
        objetivo: document.getElementById("objetivo-visita").value,
        datosAdicionales: document.getElementById("datos-adicionales").value,
      };

      // Sanitizar entradas
      const formDataSanitizado = {
        fecha: formValidator.sanitizarInput(formData.fecha),
        hora: formValidator.sanitizarInput(formData.hora),
        objetivo: formValidator.sanitizarInput(formData.objetivo),
        datosAdicionales: formValidator.sanitizarInput(
          formData.datosAdicionales
        ),
      };

      // Validar formulario
      const resultadoValidacion =
        formValidator.validarProgramacionActividad(formDataSanitizado);

      // Mostrar errores en la UI
      formValidator.mostrarErroresEnUI("errores-formulario");

      if (!resultadoValidacion.esValido) {
        // Scroll a los errores
        erroresContainer.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      // Si es válido, guardar la actividad
      guardarActividad(formDataSanitizado);
    } catch (error) {
      console.error("Error en validación de formulario:", error);
      errorManager.mostrarError("Error inesperado al procesar el formulario");
    }
  }

  // Guardar actividad en localStorage
  function guardarActividad(formData) {
    try {
      // Obtener las actividades existentes o un array vacío
      const actividadesString = localStorage.getItem("actividadesProgramadas");
      let actividades = actividadesString ? JSON.parse(actividadesString) : [];

      // Validar que actividades sea un array
      if (!Array.isArray(actividades)) {
        actividades = [];
      }

      // Crear nueva actividad
      const nuevaActividad = {
        id: Date.now(),
        empresaId: currentCompanyId,
        empresaNombre: nombreEmpresaActual.textContent.replace(
          "Empresa Actual: ",
          ""
        ),
        fecha: formData.fecha,
        hora: formData.hora,
        objetivo: formData.objetivo,
        datosAdicionales:
          formData.datosAdicionales ||
          "No se especificaron datos adicionales a tomar.",
        estado: "Pendiente",
        pedidoEntregado: "",
        cantidadEntregada: "",
        timestampGuardado: new Date().toISOString(),
      };

      // Añadir la nueva actividad y guardar
      actividades.push(nuevaActividad);
      localStorage.setItem(
        "actividadesProgramadas",
        JSON.stringify(actividades)
      );

      console.log("--- Nueva Actividad Guardada ---", nuevaActividad);

      // Mostrar mensaje de éxito
      errorManager.mostrarError(
        `¡Actividad para ${nuevaActividad.empresaNombre} programada con éxito para el ${formData.fecha} a las ${formData.hora}!`,
        "info",
        5000
      );

      // Limpiar el formulario
      limpiarFormulario();
    } catch (error) {
      console.error("Error guardando actividad:", error);
      errorManager.mostrarErrorLocalStorage("guardar actividad");
    }
  }

  // Limpiar formulario después de guardar
  function limpiarFormulario() {
    try {
      document.getElementById("fecha-actividad").value = "";
      document.getElementById("hora-actividad").value = "";
      document.getElementById("objetivo-visita").value = "";
      document.getElementById("datos-adicionales").value = "";

      // Limpiar errores
      formValidator.limpiarErrores();
      document.getElementById("errores-formulario").innerHTML = "";

      // Restablecer fecha mínima
      establecerFechaMinima();
    } catch (error) {
      console.error("Error limpiando formulario:", error);
    }
  }

  // Lógica para el botón GUARDAR
  btnGuardar.addEventListener("click", function (e) {
    e.preventDefault();
    validarYEnviarFormulario();
  });

  // Validación en tiempo real para campos críticos
  document
    .getElementById("objetivo-visita")
    .addEventListener("blur", function () {
      const objetivo = this.value;
      if (objetivo.trim().length > 0 && objetivo.trim().length < 10) {
        errorManager.mostrarError(
          "El objetivo debe tener al menos 10 caracteres",
          "warning",
          3000
        );
      }
    });

  // Inicializar fecha mínima al cargar
  establecerFechaMinima();
});
