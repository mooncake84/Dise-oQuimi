// data.js - Datos centralizados para toda la aplicación
const DATOS_EMPRESAS = {
  empresa1: {
    nombre: "Empresa A (Químicos Industriales)",
    direccion: "Av. Industrial 123, Zona Norte, CDMX",
    contacto: "contacto@empresa-a.com",
    telefono: "(55) 5123-4567",
    giro: "Químicos Industriales y Especializados",
    areas: [
      {
        area: "Laboratorio de Control de Calidad",
        productoRequerido: "Reactivos Analíticos Grado HPLC",
        encargado: "Dr. Roberto Mendoza",
        datosEncargado: "PhD en Química Analítica - 10 años de experiencia",
        correo: "rmendoza@empresa-a.com",
        telefono: "(55) 5123-4568",
      },
      {
        area: "Producción Industrial",
        productoRequerido: "Catalizadores Metálicos y Compuestos Intermedios",
        encargado: "Ing. Laura Sánchez",
        datosEncargado: "Ing. Química Industrial - Especialista en procesos",
        correo: "lsanchez@empresa-a.com",
        telefono: "(55) 5123-4569",
      },
      {
        area: "Investigación y Desarrollo",
        productoRequerido: "Monómeros Especiales y Compuestos de Alta Pureza",
        encargado: "Dra. Elena Torres",
        datosEncargado: "PhD en Polímeros - 15 años en I+D",
        correo: "etorres@empresa-a.com",
        telefono: "(55) 5123-4570",
      },
      {
        area: "Mantenimiento y Servicios Técnicos",
        productoRequerido: "Solventes de Limpieza Técnica y Lubricantes",
        encargado: "Téc. Carlos Ruiz",
        datosEncargado: "Técnico en Mantenimiento Industrial - 8 años",
        correo: "cruiz@empresa-a.com",
        telefono: "(55) 5123-4571",
      },
    ],
  },
  empresa2: {
    nombre: "Empresa B (Farmacéutica Avanzada)",
    direccion: "Blvd. Científico 456, Parque Tecnológico",
    contacto: "info@empresa-b.com",
    telefono: "(55) 5234-5678",
    giro: "Desarrollo Farmacéutico y Biotecnología",
    areas: [
      {
        area: "Control de Calidad Farmacéutico",
        productoRequerido: "Estándares de Referencia USP y Equipos de Análisis",
        encargado: "QFB. Patricia López",
        datosEncargado: "QFB Especializada - Auditora COFEPRIS",
        correo: "plopez@empresa-b.com",
        telefono: "(55) 5234-5679",
      },
      {
        area: "Desarrollo de Formulaciones",
        productoRequerido: "Excipientes Farmacéuticos y Principios Activos",
        encargado: "Dr. Miguel Ángel Reyes",
        datosEncargado: "PhD en Formulación - 12 años experiencia",
        correo: "mreyes@empresa-b.com",
        telefono: "(55) 5234-5680",
      },
      {
        area: "Producción Estéril",
        productoRequerido: "Agentes de Limpieza Estéril y Material de Embalaje",
        encargado: "Ing. Sofía Ramírez",
        datosEncargado: "Ing. Biotecnológica - Certificación GMP",
        correo: "sramirez@empresa-b.com",
        telefono: "(55) 5234-5681",
      },
      {
        area: "Almacén de Materias Primas",
        productoRequerido: "Material de Embalaje Estéril y Contenedores",
        encargado: "Lic. Fernando Castro",
        datosEncargado: "Lic. en Logística - Especialista en cadena de frío",
        correo: "fcastro@empresa-b.com",
        telefono: "(55) 5234-5682",
      },
    ],
  },
  empresa3: {
    nombre: "Empresa C (Agroquímicos Especializados)",
    direccion: "Carretera Agrícola KM 12.5, Valle del Sur",
    contacto: "ventas@empresa-c.com",
    telefono: "(55) 5345-6789",
    giro: "Agroquímicos y Fertilizantes Especializados",
    areas: [
      {
        area: "Desarrollo Agrícola",
        productoRequerido:
          "Fertilizantes Especializados y Correctores de Suelo",
        encargado: "Ing. Agr. Ricardo Morales",
        datosEncargado: "Ing. Agrónomo - Especialista en suelos",
        correo: "rmorales@empresa-c.com",
        telefono: "(55) 5345-6790",
      },
      {
        area: "Producción de Fertilizantes",
        productoRequerido: "Materias Primas Nitrogenadas y Compuestos NPK",
        encargado: "Ing. Jorge Hernández",
        datosEncargado: "Ing. Químico - 14 años en producción",
        correo: "jhernandez@empresa-c.com",
        telefono: "(55) 5345-6791",
      },
      {
        area: "Investigación de Cultivos",
        productoRequerido: "Bioestimulantes Vegetales y Protectores de Cosecha",
        encargado: "Dra. Ana Cristina Vega",
        datosEncargado: "PhD en Fitotecnia - Investigadora senior",
        correo: "avega@empresa-c.com",
        telefono: "(55) 5345-6792",
      },
      {
        area: "Distribución y Logística",
        productoRequerido: "Agentes Humectantes y Estabilizadores",
        encargado: "Lic. Diego Ortega",
        datosEncargado: "Lic. en Comercio Internacional - 9 años",
        correo: "dortega@empresa-c.com",
        telefono: "(55) 5345-6793",
      },
    ],
  },
};

// Exportar para uso en otros archivos
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DATOS_EMPRESAS };
}
