// data.js - Datos de las empresas
const DATOS_EMPRESAS = {
  empresa1: {
    nombre: "RASTRO TORREON",
    giro: "Planta de procesamiento de carnes",
    direccion: "CARRETERA TORREÓN MIELERAS KM 8.5 FRACCIONAMIENTO SAN ESTEBAN",
    contacto: "S.C",
    telefono: "8717329515 y 8711698106",
    areas: [
      {
        area: "Sacrificio Porcino",
        productoRequerido: "Zone 20 - ALK CL FOAM B",
        encargado: "Ismael Mares",
        puesto: "Ismael Mares",
        correo: "Ivrrigm@gmail.com",
        telefono: "8717350768",
      },
      {
        area: "Calderas",
        productoRequerido: "SAL PELEX - NPQT 20",
        encargado: "CONRADO",
        puesto: "S.D",
        correo: "S.C",
        telefono: "8713463015",
      },
      {
        area: "Lavado de Viceras",
        productoRequerido: "PG 1000 - PG 2000",
        encargado: "Dra. Carmen Torres",
        puesto: "S.D",
        correo: "S.C",
        telefono: "(55) 5123-4570",
      },
      {
        area: "Charca Sanitaria",
        productoRequerido: "QUIMISAN",
        encargado: "Susana Castillo",
        puesto: "S.D",
        correo: "S.C",
        telefono: "",
      },
      {
        area: "Lavado de Rolas",
        productoRequerido: "SUPER ML EN POLVO",
        encargado: "MVZ ALEJANDRA RODRÍGUEZ",
        puesto: "S.D",
        correo: "S.C",
        telefono: "",
      },
    ],
  },
  empresa2: {
    nombre: "BioChem México",
    giro: "Productos Bioquímicos y Farmacéuticos",
    direccion: "Blvd. Tecnológico 456, Guadalajara, Jal.",
    contacto: "info@biochem.com.mx",
    telefono: "(33) 3654-7890",
    areas: [
      {
        area: "Control de Calidad",
        productoRequerido: "Reactivos para Análisis Microbiológico",
        encargado: "QFB. Ana García",
        puesto:
          "Especialista en Control Microbiológico - 7 años de experiencia",
        correo: "agarcia@biochem.com.mx",
        telefono: "(33) 3654-7891",
      },
    ],
  },
  empresa3: {
    nombre: "Empresa C (Datos Provisional X)",
    giro: "Giro Provisional",
    direccion: "Dirección Provisional",
    contacto: "contacto@empresac.com",
    telefono: "(55) 0000-0000",
    areas: [],
  },
};

// Función para guardar cambios en localStorage
function guardarCambiosEmpresa(companyId, datosActualizados) {
  try {
    DATOS_EMPRESAS[companyId] = datosActualizados;

    // Guardar en localStorage para persistencia
    localStorage.setItem(
      "datosEmpresasEditados",
      JSON.stringify(DATOS_EMPRESAS)
    );

    return true;
  } catch (error) {
    console.error("Error guardando cambios:", error);
    return false;
  }
}

// Cargar datos editados al iniciar
function cargarDatosEditados() {
  try {
    const datosGuardados = localStorage.getItem("datosEmpresasEditados");
    if (datosGuardados) {
      const datosParseados = JSON.parse(datosGuardados);
      Object.assign(DATOS_EMPRESAS, datosParseados);
    }
  } catch (error) {
    console.error("Error cargando datos editados:", error);
  }
}

// Inicializar cargando datos editados
cargarDatosEditados();
