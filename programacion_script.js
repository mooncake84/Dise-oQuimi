document.addEventListener("DOMContentLoaded", function () {
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");
  const btnGuardar = document.getElementById("btn-guardar-actividad");

  // Función para obtener los datos de la empresa (los mismos de rastros_script.js)
  const datosEmpresas = {
    empresa1: { nombre: "Empresa A (Datos Provisional X)" },
    empresa2: { nombre: "Empresa B (Datos Provisional X)" },
    empresa3: { nombre: "Empresa C (Datos Provisional X)" },
  };

  // 1. Mostrar la empresa seleccionada actualmente
  function cargarEmpresaActual() {
    const selectedCompanyId =
      localStorage.getItem("selectedCompany") || "empresa1";
    const nombreEmpresa = datosEmpresas[selectedCompanyId]
      ? datosEmpresas[selectedCompanyId].nombre
      : "Empresa No Seleccionada";

    nombreEmpresaActual.textContent = `Empresa Actual: ${nombreEmpresa}`;
    return selectedCompanyId;
  }

  const currentCompanyId = cargarEmpresaActual();

  // 2. Lógica para el botón GUARDAR
  btnGuardar.addEventListener("click", function () {
    const fecha = document.getElementById("fecha-actividad").value;
    const hora = document.getElementById("hora-actividad").value;
    const objetivo = document.getElementById("objetivo-visita").value;
    const datos = document.getElementById("datos-adicionales").value;

    if (!fecha || !hora || !objetivo) {
      alert(
        "Por favor, completa los campos obligatorios: Fecha, Hora y Objetivo."
      );
      return;
    }

    // Obtener las actividades existentes o un array vacío
    const actividadesString = localStorage.getItem("actividadesProgramadas");
    let actividades = actividadesString ? JSON.parse(actividadesString) : [];

    // 💥 JSON (Objeto) con la nueva actividad a guardar 💥
    const nuevaActividad = {
      id: Date.now(), // ID único basado en el timestamp
      empresaId: currentCompanyId,
      empresaNombre: nombreEmpresaActual.textContent.replace(
        "Empresa Actual: ",
        ""
      ),
      fecha: fecha,
      hora: hora,
      objetivo: objetivo,
      datosAdicionales:
        datos || "No se especificaron datos adicionales a tomar.",
      estado: "Pendiente", // Nuevo campo de estado
      pedidoEntregado: "",
      cantidadEntregada: "",
      timestampGuardado: new Date().toISOString(),
    };

    // Añadir la nueva actividad y guardar
    actividades.push(nuevaActividad);
    localStorage.setItem("actividadesProgramadas", JSON.stringify(actividades));

    console.log("--- Nueva Actividad Guardada ---");
    console.log(nuevaActividad);

    alert(
      `¡Actividad para ${nuevaActividad.empresaNombre} programada con éxito para el ${fecha} a las ${hora}! \n\n (Guardada en localStorage)`
    );

    // Limpiar el formulario
    document.getElementById("fecha-actividad").value = "";
    document.getElementById("hora-actividad").value = "";
    document.getElementById("objetivo-visita").value = "";
    document.getElementById("datos-adicionales").value = "";
  });
});
