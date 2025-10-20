// errorManager.js - Manejo centralizado de errores
class ErrorManager {
  constructor() {
    this.errorContainer = null;
    this.init();
  }

  init() {
    // Crear contenedor global de errores si no existe
    if (!document.getElementById("global-error-container")) {
      this.errorContainer = document.createElement("div");
      this.errorContainer.id = "global-error-container";
      this.errorContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
      document.body.appendChild(this.errorContainer);
    } else {
      this.errorContainer = document.getElementById("global-error-container");
    }
  }

  mostrarError(mensaje, tipo = "error", duracion = 5000) {
    const errorId = "error-" + Date.now();
    const errorHTML = `
            <div id="${errorId}" class="error-message ${tipo}" style="
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease;
                ${tipo === "error" ? "background: #f44336;" : ""}
                ${tipo === "warning" ? "background: #ff9800;" : ""}
                ${tipo === "info" ? "background: #2196F3;" : ""}
            ">
                ${mensaje}
            </div>
        `;

    this.errorContainer.insertAdjacentHTML("afterbegin", errorHTML);

    // Auto-remover después de la duración
    if (duracion > 0) {
      setTimeout(() => {
        this.removerError(errorId);
      }, duracion);
    }

    return errorId;
  }

  removerError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 300);
    }
  }

  mostrarErrorCargaEmpresa(empresaId) {
    return this.mostrarError(
      `Error: No se pudo cargar la información de la empresa (ID: ${empresaId})`,
      "error",
      7000
    );
  }

  mostrarErrorLocalStorage(operacion) {
    return this.mostrarError(
      `Error en ${operacion}: No se pudieron guardar/cargar los datos`,
      "error",
      5000
    );
  }

  // Validación de datos empresariales
  validarDatosEmpresa(empresaId) {
    if (!empresaId) {
      throw new Error("ID de empresa no proporcionado");
    }

    if (!DATOS_EMPRESAS[empresaId]) {
      throw new Error(`Empresa con ID "${empresaId}" no encontrada`);
    }

    const empresa = DATOS_EMPRESAS[empresaId];
    const camposRequeridos = [
      "nombre",
      "direccion",
      "contacto",
      "telefono",
      "giro",
      "areas",
    ];

    for (const campo of camposRequeridos) {
      if (!empresa[campo]) {
        throw new Error(
          `Campo requerido "${campo}" faltante en empresa ${empresaId}`
        );
      }
    }

    return true;
  }
}

// Instancia global
const errorManager = new ErrorManager();

// Agregar estilos de animación si no existen
if (!document.getElementById("error-animations")) {
  const style = document.createElement("style");
  style.id = "error-animations";
  style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
}
