document.addEventListener("DOMContentLoaded", function () {
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");
  const empresaActualIndicador = document.getElementById(
    "empresa-actual-indicador"
  );
  const actividadesBody = document.getElementById("actividades-body");
  const mensajeVacio = document.getElementById("mensaje-vacio");

  // Datos de las empresas
  const datosEmpresas = {
    empresa1: { nombre: "Empresa A (Datos Provisional X)" },
    empresa2: { nombre: "Empresa B (Datos Provisional X)" },
    empresa3: { nombre: "Empresa C (Datos Provisional X)" },
  };

  let currentCompanyId;

  // Cargar y mostrar la empresa seleccionada
  function cargarEmpresaActual() {
    currentCompanyId = localStorage.getItem("selectedCompany") || "empresa1";
    const nombreEmpresa = datosEmpresas[currentCompanyId]
      ? datosEmpresas[currentCompanyId].nombre
      : "Empresa No Seleccionada";

    nombreEmpresaActual.textContent = `Empresa Actual: ${nombreEmpresa}`;
    empresaActualIndicador.innerHTML = `Mostrando actividades para: <strong>${nombreEmpresa}</strong>`;
  }

  // Helper: Obtener actividades del Local Storage
  function obtenerActividades() {
    const actividadesString = localStorage.getItem("actividadesProgramadas");
    return actividadesString ? JSON.parse(actividadesString) : [];
  }

  // Helper: Guardar actividades en el Local Storage
  function guardarActividades(actividades) {
    localStorage.setItem("actividadesProgramadas", JSON.stringify(actividades));
  }

  // Mostrar mensaje temporal
  function mostrarMensaje(mensaje, tipo = "success") {
    const mensajeElement = document.createElement("div");
    mensajeElement.textContent = mensaje;
    mensajeElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: ${tipo === "success" ? "#4CAF50" : "#f44336"};
      color: white;
      border-radius: 5px;
      z-index: 1000;
      animation: fadeInOut 3s ease-in-out;
    `;

    document.body.appendChild(mensajeElement);

    setTimeout(() => {
      document.body.removeChild(mensajeElement);
    }, 3000);
  }

  // Cargar y renderizar la tabla de actividades
  function renderizarTabla() {
    const todasLasActividades = obtenerActividades();
    const actividadesFiltradas = todasLasActividades.filter(
      (act) => act.empresaId === currentCompanyId
    );

    actividadesBody.innerHTML = "";

    if (actividadesFiltradas.length === 0) {
      mensajeVacio.style.display = "block";
      return;
    } else {
      mensajeVacio.style.display = "none";
    }

    actividadesFiltradas.forEach((act) => {
      const isCompletado = act.estado === "Completado";
      const isRetraso = act.estado === "Retraso";

      let estadoClass = "";
      if (isCompletado) estadoClass = "estado-completado";
      else if (isRetraso) estadoClass = "estado-retraso";
      else estadoClass = "estado-pendiente";

      const rowHTML = `
            <tr>
                <td>${act.fecha} <br> (${act.hora})</td>
                <td>${act.empresaNombre}</td>
                <td>${act.objetivo}<br><small style="color: #666;">${
        act.datosAdicionales
      }</small></td>
                <td class="${estadoClass}">${act.estado}</td>
                <td>
                    <input type="checkbox" 
                           data-id="${act.id}" 
                           data-field="completado" 
                           ${isCompletado ? "checked" : ""}
                           ${isRetraso ? "disabled" : ""}>
                </td>
                <td>
                    <input type="checkbox" 
                           data-id="${act.id}" 
                           data-field="retraso" 
                           ${isRetraso ? "checked" : ""}
                           ${isCompletado ? "disabled" : ""}>
                </td>
                <td>
                    <input type="text" 
                           class="input-tabla" 
                           data-id="${act.id}" 
                           data-field="pedidoEntregado" 
                           value="${act.pedidoEntregado || ""}"
                           placeholder="N° Pedido">
                </td>
                <td>
                    <input type="text" 
                           class="input-tabla" 
                           data-id="${act.id}" 
                           data-field="cantidadEntregada" 
                           value="${act.cantidadEntregada || ""}"
                           placeholder="Cant.">
                </td>
            </tr>
        `;
      actividadesBody.insertAdjacentHTML("beforeend", rowHTML);
    });

    agregarEventListeners();
  }

  // Lógica para manejar interacciones del usuario
  function agregarEventListeners() {
    actividadesBody.addEventListener("change", function (event) {
      const target = event.target;
      const id = parseInt(target.getAttribute("data-id"));
      const field = target.getAttribute("data-field");

      if (!id) return;

      if (field === "completado") {
        manejarCompletado(id, target.checked);
      } else if (field === "retraso") {
        manejarRetraso(id, target.checked);
      } else if (field === "pedidoEntregado" || field === "cantidadEntregada") {
        actualizarCampo(id, field, target.value);
      }
    });
  }

  function manejarCompletado(id, isChecked) {
    if (
      isChecked &&
      !confirm(
        "¿Estás seguro de que quieres marcar esta actividad como COMPLETADA?"
      )
    ) {
      // Si el usuario cancela, volver a renderizar para desmarcar el checkbox
      renderizarTabla();
      return;
    }

    let actividades = obtenerActividades();
    const index = actividades.findIndex((act) => act.id === id);
    if (index !== -1) {
      if (isChecked) {
        actividades[index].estado = "Completado";
      } else if (actividades[index].estado === "Completado") {
        actividades[index].estado = "Pendiente";
      }
      guardarActividades(actividades);
      renderizarTabla();
      mostrarMensaje("Actividad actualizada correctamente");
    }
  }

  function manejarRetraso(id, isChecked) {
    let actividades = obtenerActividades();
    const index = actividades.findIndex((act) => act.id === id);
    if (index !== -1) {
      if (isChecked) {
        actividades[index].estado = "Retraso";
      } else if (actividades[index].estado === "Retraso") {
        actividades[index].estado = "Pendiente";
      }
      guardarActividades(actividades);
      renderizarTabla();
      mostrarMensaje("Actividad actualizada correctamente");
    }
  }

  function actualizarCampo(id, campo, valor) {
    let actividades = obtenerActividades();
    const index = actividades.findIndex((act) => act.id === id);
    if (index !== -1) {
      actividades[index][campo] = valor;
      guardarActividades(actividades);
      mostrarMensaje(
        `${
          campo === "pedidoEntregado" ? "Pedido" : "Cantidad"
        } actualizado correctamente`
      );
    }
  }

  // Inicialización
  cargarEmpresaActual();
  renderizarTabla();
});
