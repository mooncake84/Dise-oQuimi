document.addEventListener("DOMContentLoaded", function () {
  const nombreEmpresaActual = document.getElementById("nombre-empresa-actual");
  const empresaActualIndicador = document.getElementById(
    "empresa-actual-indicador"
  );
  const actividadesBody = document.getElementById("actividades-body");
  const mensajeVacio = document.getElementById("mensaje-vacio");

  // Función para obtener los datos de la empresa (los mismos)
  const datosEmpresas = {
    empresa1: { nombre: "Empresa A (Datos Provisional X)" },
    empresa2: { nombre: "Empresa B (Datos Provisional X)" },
    empresa3: { nombre: "Empresa C (Datos Provisional X)" },
  };

  let currentCompanyId;

  // 1. Cargar y mostrar la empresa seleccionada
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

  // 2. Cargar y renderizar la tabla de actividades
  function renderizarTabla() {
    // 1. Filtrar actividades solo para la empresa actual
    const todasLasActividades = obtenerActividades();
    const actividadesFiltradas = todasLasActividades.filter(
      (act) => act.empresaId === currentCompanyId
    );

    // 2. Limpiar la tabla
    actividadesBody.innerHTML = "";

    // 3. Mostrar/ocultar mensaje de tabla vacía
    if (actividadesFiltradas.length === 0) {
      mensajeVacio.style.display = "block";
      return;
    } else {
      mensajeVacio.style.display = "none";
    }

    // 4. Construir las filas de la tabla
    actividadesFiltradas.forEach((act) => {
      // Determinar si los checkboxes deben estar marcados
      const isCompletado = act.estado === "Completado";
      const isRetraso = act.estado === "Retraso";

      // Determinar clase de estilo para el estado
      let estadoClass = "";
      if (isCompletado) estadoClass = "estado-completado";
      else if (isRetraso) estadoClass = "estado-retraso";
      else estadoClass = "estado-pendiente";

      // HTML para la fila
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

    // 5. Agregar event listeners después de renderizar
    agregarEventListeners();
  }

  // 3. Lógica para manejar interacciones del usuario
  function agregarEventListeners() {
    // Escucha todos los cambios en la tabla (usando delegación de eventos)
    actividadesBody.addEventListener("change", function (event) {
      const target = event.target;
      const id = parseInt(target.getAttribute("data-id"));
      const field = target.getAttribute("data-field");

      if (!id) return; // No es un elemento rastreable

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
    let actividades = obtenerActividades();
    const index = actividades.findIndex((act) => act.id === id);
    if (index !== -1) {
      if (isChecked) {
        actividades[index].estado = "Completado";
        // Desmarcar Retraso si estaba marcado
        if (actividades[index].estado === "Retraso") {
          actividades[index].estado = "Completado";
        }
      } else if (actividades[index].estado === "Completado") {
        // Si se desmarca, regresa al estado Pendiente
        actividades[index].estado = "Pendiente";
      }
      guardarActividades(actividades);
      renderizarTabla(); // Vuelve a dibujar para actualizar estados y checkboxes
    }
  }

  function manejarRetraso(id, isChecked) {
    let actividades = obtenerActividades();
    const index = actividades.findIndex((act) => act.id === id);
    if (index !== -1) {
      if (isChecked) {
        actividades[index].estado = "Retraso";
        // Desmarcar Completado si estaba marcado
        if (actividades[index].estado === "Completado") {
          actividades[index].estado = "Retraso";
        }
      } else if (actividades[index].estado === "Retraso") {
        actividades[index].estado = "Pendiente";
      }
      guardarActividades(actividades);
      renderizarTabla();
    }
  }

  function actualizarCampo(id, campo, valor) {
    let actividades = obtenerActividades();
    const index = actividades.findIndex((act) => act.id === id);
    if (index !== -1) {
      actividades[index][campo] = valor;
      guardarActividades(actividades);
      console.log(`Actividad ${id} actualizada. Campo ${campo}: ${valor}`);
    }
  }

  // --- INICIALIZACIÓN ---
  cargarEmpresaActual();
  renderizarTabla();
});
