import React, { useState } from "react";
import { 
  Database, 
  Layers, 
  Check, 
  Settings, 
  FileSpreadsheet, 
  Activity, 
  ArrowRightLeft, 
  Cpu, 
  Users, 
  FileText, 
  Clock, 
  Sparkles,
  Info,
  Brain,
  Globe,
  Radio,
  Workflow,
  Lock
} from "lucide-react";

interface TogafMatrixCell {
  val: string; // "C", "R", "U", "D", "CR", "RU", "CRUD", or "-"
  desc: string; // Explanation of the operation
}

interface TogafProcess {
  id: string;
  code: string;
  name: string;
  desc: string;
  domain: "Negocio" | "Aplicación" | "Soporte";
}

interface TogafEntity {
  id: string;
  code: string;
  name: string;
  desc: string;
  owner: string;
}

interface VisionImpact {
  domain: string;
  year2026: { title: string; desc: string; icon: string };
  year2036: { title: string; desc: string; icon: string };
  preparation: string;
}

export default function TogafArchitecture() {
  const [activeTab, setActiveTab] = useState<"matrix" | "asis-tobe" | "vision-2036">("matrix");
  const [selectedCell, setSelectedCell] = useState<{ pCode: string; eCode: string } | null>({
    pCode: "P5",
    eCode: "E6"
  });
  const [selectedVisionDomain, setSelectedVisionDomain] = useState<number>(0);

  // Since this component is now mounted strictly inside the PIN-locked GroomingAgenda modal, it is unlocked automatically
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "studiopet" || pinInput === "admin" || pinInput === "1234") {
      setIsUnlocked(true);
      localStorage.setItem("owner_unlocked_togaf", "true");
      setPinError("");
      setPinInput("");
    } else {
      setPinError("Código PIN incorrecto o desautorizado para visualizar la Matriz CRUD.");
    }
  };

  const handleLockAgain = () => {
    setIsUnlocked(false);
    localStorage.removeItem("owner_unlocked_togaf");
  };

  // Define TOGAF Business/App Processes
  const processes: TogafProcess[] = [
    { 
      id: "p1", 
      code: "P1", 
      name: "Cotización y Simulación de Retorno", 
      desc: "Simula tarifas en tiempo real según tamaño de mascota y calcula la alerta de retorno óptima de 60 días.",
      domain: "Negocio"
    },
    { 
      id: "p2", 
      code: "P2", 
      name: "Registro de Pacientes / Mascotas", 
      desc: "Captura el nombre, tipo de peludo, raza, tamaño y sensibilidades especiales del paciente.",
      domain: "Negocio"
    },
    { 
      id: "p3", 
      code: "P3", 
      name: "Agendamiento de Citas On-Demand", 
      desc: "Reserva un cupo en el calendario seleccionando fecha, hora, dirección y notas de estilismo.",
      domain: "Negocio"
    },
    { 
      id: "p4", 
      code: "P4", 
      name: "Asesoría de Estilismo IA", 
      desc: "Diagnostica problemas de subpelo, resequedad o sensibilidad externa usando el modelo Gemini y sugiere planes óptimos.",
      domain: "Aplicación"
    },
    { 
      id: "p5", 
      code: "P5", 
      name: "Consolidación de Historiales (Excel)", 
      desc: "Alimenta la base de datos central en segundo plano y genera el reporte CSV Excel de administración de manera privada.",
      domain: "Aplicación"
    },
    { 
      id: "p6", 
      code: "P6", 
      name: "Monitoreo de Alerta de Retorno", 
      desc: "Automatiza y calcula fechas ideales de retorno preventivas contra enredos y dermatitis canina/felina.",
      domain: "Soporte"
    }
  ];

  // Define TOGAF Data Entities
  const entities: TogafEntity[] = [
    { 
      id: "e1", 
      code: "E1", 
      name: "Cliente / Propietario", 
      desc: "Datos de contacto (nombre, teléfono WhatsApp, dirección física, zona metropolitana de cobertura).",
      owner: "Gestión de Clientes" 
    },
    { 
      id: "e2", 
      code: "E2", 
      name: "Mascota / Paciente", 
      desc: "Expediente del peludo (raza, tipo, tamaño físico, multiplicador de insumos y notas de comportamiento).",
      owner: "Veterinaria / Estilo" 
    },
    { 
      id: "e3", 
      code: "E3", 
      name: "Servicio de Estética / Spa", 
      desc: "Definición de servicios de la carta de spa, tarifas base por tipo y duración de tratamientos.",
      owner: "Línea de Negocio" 
    },
    { 
      id: "e4", 
      code: "E4", 
      name: "Cita / Reserva (BookingState)", 
      desc: "Estado transaccional de la cita: fecha, hora elegida, servicios contratados, estilista y estado de pago.",
      owner: "Operaciones Móviles" 
    },
    { 
      id: "e5", 
      code: "E5", 
      name: "Alerta de Retorno", 
      desc: "Cálculo de periodicidad recomendada (60 días) y fechas sugeridas generadas preventivamente para la salud del manto.",
      owner: "Fidelización de Clientes" 
    },
    { 
      id: "e6", 
      code: "E6", 
      name: "Base de Datos / Registro Excel", 
      desc: "Almacenamiento unificado y estructurado de reservas, diseñado para alimentar hojas de cálculo sin exposición directa al usuario.",
      owner: "Administración / TI" 
    }
  ];

  // Define the exact CRUD Matrix values and descriptions mapping Processes (P1-P6) to Entities (E1-E6)
  const crudData: Record<string, Record<string, TogafMatrixCell>> = {
    P1: {
      E1: { val: "R", desc: "Lee los datos de localización del cliente para simular recargas de cobertura urbana (gratuitos)." },
      E2: { val: "R", desc: "Lee el tamaño del peludo para calcular la multiplicación volumétrica del precio base." },
      E3: { val: "R", desc: "Lee los precios bases del catálogo de Baño, Corte, Deslanado y Armonización Emocional." },
      E4: { val: "-", desc: "No altera reservas creadas en esta fase de cotización preliminar." },
      E5: { val: "C", desc: "Genera y simula de forma preventiva la posible fecha futura de retorno (60 días después)." },
      E6: { val: "-", desc: "No alimenta la base de datos oficial hasta que el usuario confirme la orden." }
    },
    P2: {
      E1: { val: "U", desc: "Vincula o actualiza el registro telefónico con los datos del Propietario." },
      E2: { val: "C", desc: "Crea el perfil clínico/físico de la mascota (tipo, raza, tamaño, afecciones epidérmicas)." },
      E3: { val: "-", desc: "No lee ni modifica el catálogo tarifario de servicios." },
      E4: { val: "R", desc: "Asocia el paciente creado a futuras o pasadas citas del mismo dueño." },
      E5: { val: "-", desc: "No calcula directamente alertas en la fase exclusiva de registro." },
      E6: { val: "-", desc: "No escribe directamente en la base de datos hasta culminar el flujo comercial." }
    },
    P3: {
      E1: { val: "RU", desc: "Lee y actualiza información de contacto y geolocalización para asignar la ruta logística móvil." },
      E2: { val: "R", desc: "Consulta el tamaño y raza para bloquear el tiempo de agenda correspondiente en el itinerario." },
      E3: { val: "R", desc: "Valida los servicios elegidos para estructurar el subtotal final y asignación de materiales." },
      E4: { val: "CRUD", desc: "Gestiona completamente el ciclo de vida de la Cita: Crea al reservar, Lee en agendas, Actualiza al reprogramar, Elimina al cancelar." },
      E5: { val: "C", desc: "Fija y programa permanentemente la fecha teórica de la alerta de retorno basada en el día de la cita." },
      E6: { val: "C", desc: "Alimenta inmediatamente el backend seguro express para escribir la transacción de la reserva." }
    },
    P4: {
      E1: { val: "-", desc: "La IA no requiere leer ni procesar datos confidenciales del Propietario en el diagnóstico." },
      E2: { val: "RU", desc: "Analiza el historial/raza de la mascota y sugiere anotaciones especiales de hidratación or piel sensible." },
      E3: { val: "R", desc: "Recomienda planes específicos de la carta de spa (como Deslanado Profundo o Armonización Emocional)." },
      E4: { val: "U", desc: "Actualiza las notas transaccionales de la cita con las sugerencias clínicas veterinarias provistas por la IA." },
      E5: { val: "R", desc: "Valida la urgencia de retorno preventivo según el estado de pelaje analizado." },
      E6: { val: "-", desc: "No interactúa de forma directa con la base de datos estructurada." }
    },
    P5: {
      E1: { val: "R", desc: "Extrae de la base de datos los nombres y teléfonos de clientes registrados para consolidar." },
      E2: { val: "R", desc: "Extrae raza, tamaño y nombre de la mascota para el mapeo administrativo." },
      E3: { val: "R", desc: "Mapea los subtotales e ingresos generados según los servicios cargados." },
      E4: { val: "R", desc: "Extrae las citas asignadas para volcar en el archivo de backup Excel / CSV." },
      E5: { val: "R", desc: "Lista las fechas de retorno para programar notificaciones telefónicas manuales de fidelización." },
      E6: { val: "RU", desc: "Alimenta en segundo plano, actualiza de forma segura y consolida el archivo Excel administrativo protegido." }
    },
    P6: {
      E1: { val: "R", desc: "Filtra la información de contacto celular (WhatsApp) de los clientes que ya deben retornar." },
      E2: { val: "R", desc: "Monitorea qué mascota es la postulante a recibir su baño preventivo." },
      E3: { val: "R", desc: "Aconseja el plan de estética recomendado anteriormente para refrescar la salud de su pelaje." },
      E4: { val: "R", desc: "Examina fechas históricas de las citas para compararlas contra la fecha actual del servidor." },
      E5: { val: "RU", desc: "Lee alertas inactivas y las marca como 'VENCIDA / LISTO PARA CONTACTAR' cada que se superan los 60 días." },
      E6: { val: "-", desc: "Monitorea localmente sin alterar las tablas crudas de la base de datos." }
    }
  };

  // Evolution Data from 2026 to 2036
  const visionData: VisionImpact[] = [
    {
      domain: "Arquitectura de Negocio (Business)",
      year2026: {
        title: "Estética Móvil Sincronizada",
        desc: "Rutas manuales, furgonetas operadas por humanos, cotizaciones web y reservas tradicionales con recordatorio automatizado por WhatsApp.",
        icon: "🚐"
      },
      year2036: {
        title: "Ecosistema Autónomo Hiper-Personalizado",
        desc: "Furgonetas automatizadas autopropulsadas (EV self-driving styling pods) con IA robótica a bordo. Disparos inmediatos basados en telemetría de collares biocrónicos.",
        icon: "🤖"
      },
      preparation: "Diseñar el catálogo de servicios modularizado hoy (Baño, Corte, Armonización). El empaquetamiento estricto de APIs permitirá que agentes autónomos los programen sin intervención humana en el futuro."
    },
    {
      domain: "Arquitectura de Aplicaciones (Apps)",
      year2026: {
        title: "Aplicación Full-Stack con Soporte IA",
        desc: "Panel web React SPA, servidor backend Express y análisis generativo externo vía API Gemini para diagnósticos interactivos bajo demanda.",
        icon: "💻"
      },
      year2036: {
        title: "Agentes Cognitivos Proactivos (No-UI)",
        desc: "Orquestación multiagente sin pantallas manuales. La IA del peludo conversa directamente con la IA de Studio Pet, agendando de forma invisible según el clima local.",
        icon: "🧠"
      },
      preparation: "Fomentar la arquitectura 'API-First' y desacoplar la interfaz del motor lógico. Esto asegura que la migración a agentes autónomos o interfaces de voz en 2036 no requiera rehacer la base del sistema."
    },
    {
      domain: "Arquitectura de Datos (Data)",
      year2026: {
        title: "Bases de Datos Relacionales & Excel",
        desc: "Persistencia centralizada estructurada, auditoría con backups seguros en SQL o hojas de cálculo (CSV) protegidos con controles de acceso por PIN.",
        icon: "📊"
      },
      year2036: {
        title: "Bases de Datos Vectoriales & Edge Biométrico",
        desc: "Registros en tiempo real en la periferia (Edge Databases). Mapeo genómico continuo del manto animal y flujos de datos biométricos de estrés canino encriptados.",
        icon: "🛸"
      },
      preparation: "Mantener los datos limpios y tipados estrictamente (PetType, BookingState). La estructura rígida de datos actual es la base sólida indispensable para entrenar los modelos predictivos propietarios de mañana."
    },
    {
      domain: "Arquitectura Tecnológica (Tech)",
      year2026: {
        title: "Infraestructura Cloud Serverless",
        desc: "Hospedaje en contenedores seguros (Google Cloud Run), microservicios Node/Express y API REST estandarizadas.",
        icon: "☁️"
      },
      year2036: {
        title: "Compute de Periféricos & Redes Satelitales",
        desc: "Orquestación en la niebla (Fog Computing) sobre furgonetas autónomas. Conectividad intersatelital 7G continua con latencia de nanosegundos y criptoreserva soberana.",
        icon: "🛰️"
      },
      preparation: "Familiarizarse con sistemas tolerantes a la desconexión y sincronizaciones offline (con bases de datos locales móviles). El cómputo en movimiento requiere inmunidad a la pérdida temporal de señal."
    }
  ];

  const getCellClass = (val: string, pCode: string, eCode: string) => {
    const isSelected = selectedCell?.pCode === pCode && selectedCell?.eCode === eCode;
    let bg = "bg-white hover:bg-slate-50";
    let text = "text-slate-600";
    
    if (val === "CRUD") {
      bg = isSelected ? "bg-red-500 text-white" : "bg-red-50 text-red-700 font-bold hover:bg-red-100";
      text = "";
    } else if (val.includes("C") && val.includes("R") && val.includes("U")) {
      bg = isSelected ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 font-bold hover:bg-amber-100";
      text = "";
    } else if (val.includes("C")) {
      bg = isSelected ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100";
      text = "";
    } else if (val === "R") {
      bg = isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 font-bold hover:bg-blue-100";
      text = "";
    } else if (val.includes("U") || val === "RU") {
      bg = isSelected ? "bg-cyan-600 text-white" : "bg-cyan-50 text-cyan-800 font-bold hover:bg-cyan-100";
      text = "";
    } else if (val === "-") {
      bg = isSelected ? "bg-slate-700 text-slate-100" : "bg-slate-100/40 text-slate-300 hover:bg-slate-100";
    }

    return `${bg} ${text} transition-all duration-150 cursor-pointer text-center font-mono text-[11px] h-12 w-16 border border-slate-200 relative`;
  };

  return (
    <div id="togaf-architecture-workspace" className="bg-white rounded-[36px] border-2 border-vibrant-dark/15 p-6 sm:p-8 md:p-10 max-w-6xl mx-auto shadow-sm space-y-8">
      {/* SECCIÓN EDUCATIVA: ¿QUÉ ES ARQUITECTURA EMPRESARIAL? Y ¡SÍ, LA TENEMOS! */}
      <div className="bg-gradient-to-r from-teal-50/70 to-emerald-50/70 rounded-3xl border-2 border-emerald-500/20 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
        <div className="space-y-2.5 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-vibrant-yellow animate-pulse" />
            Concepto de Arquitectura de Empresa
          </div>
          <h4 className="font-sans font-black text-xl sm:text-2xl text-vibrant-dark tracking-tight leading-none">
            ¿Qué es la Arquitectura Empresarial?
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed max-w-3xl">
            Es un marco de referencia y una <strong>metodología que busca identificar y describir los componentes de una empresa, sus relaciones, cómo colaboran e interactúan entre sí</strong>. Su fin primordial es alinear la estrategia de negocio con la infraestructura tecnológica para evitar silos operacionales.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-black font-mono shadow-sm">🚐 Capa Negocio</span>
            <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-black font-mono shadow-sm">🤖 Capa Aplicaciones</span>
            <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-black font-mono shadow-sm">📊 Capa Datos</span>
            <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-black font-mono shadow-sm">☁️ Capa Tecnología</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-emerald-500/20 p-5 shrink-0 w-full md:w-80 border-l-[6px] border-l-emerald-500 shadow-sm">
          <span className="text-[9px] font-mono font-black text-emerald-600 uppercase tracking-widest block">¿La tenemos implementada?</span>
          <strong className="text-sm font-sans font-black text-slate-800 block mt-1">¡Sí, de manera integral!</strong>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
            En <strong>Studio Pet</strong> está representada con la <strong>metodología TOGAF</strong>. Conectamos los procesos diarios (Simular, Agendar) con entidades de datos limpias, un motor seguro que alimenta backups en Excel y consejos automatizados por Inteligencia Artificial.
          </p>
        </div>
      </div>

      {!isUnlocked ? (
        <div id="togaf-locked-view" className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200/80 p-8 sm:p-12 text-center space-y-5">
          <div className="w-14 h-14 bg-vibrant-red/10 text-vibrant-red rounded-full flex items-center justify-center mx-auto border border-vibrant-red/20 shadow-sm animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          
          <div className="space-y-1.5">
            <span className="inline-block bg-vibrant-dark text-vibrant-yellow text-[9px] font-black uppercase px-2.5 py-1 rounded font-mono tracking-wider shadow-sm">
              🔐 MÓDULO PRIVADO DE GOBERNANZA
            </span>
            <h5 className="font-sans font-black text-lg text-vibrant-dark">
              Verificación de Dueño Requerida
            </h5>
            <p className="text-xs text-vibrant-dark/60 font-semibold leading-relaxed max-w-md mx-auto">
              La Matriz CRUD de procesos corporativos, la gobernanza de datos y la proyección estratégica de evolución a 10 años (2036) contienen información confidencial del negocio.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto space-y-3 pt-2">
            <div>
              <input
                type="password"
                placeholder="Escribe PIN administrador..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError("");
                }}
                className={`w-full px-4 py-2.5 rounded-xl border-2 text-center font-sans text-xs focus:outline-none bg-white font-semibold text-vibrant-dark transition-all ${
                  pinError ? "border-vibrant-red focus:border-vibrant-red" : "border-vibrant-dark/10 focus:border-vibrant-dark"
                }`}
              />
              {pinError && (
                <p className="text-[10px] text-vibrant-red mt-1.5 font-bold">
                  ⚠️ {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-center py-2.5 rounded-xl bg-vibrant-dark hover:bg-vibrant-dark/90 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
            >
              Autenticar como Dueño
            </button>
          </form>

          <p className="text-[10px] text-slate-400 font-semibold">
            Área protegida por el Estándar de Certificación TOGAF ADM. El PIN es el mismo de la administración (ej. <strong>studiopet</strong>, <strong>admin</strong> o <strong>1234</strong>).
          </p>
        </div>
      ) : (
        <>
          {/* Dynamic Header Badge and Intro */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-vibrant-yellow px-4 py-1.5 rounded-full text-[10px] font-black border border-slate-700 uppercase tracking-widest shadow-sm">
                <Layers className="w-3.5 h-3.5 text-vibrant-yellow animate-pulse" />
                TOGAF Fase C: Arquitectura de Datos & Negocio
              </div>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-vibrant-dark tracking-tight leading-none">
                Gobernanza & Mapeo de Entidades
              </h3>
              <p className="text-xs sm:text-sm text-vibrant-dark/70 font-sans font-semibold leading-relaxed max-w-2xl">
                Alineación del flujo de procesos de Studio Pet con el modelo de datos. Esta división de responsabilidades armoniza los componentes y demuestra cómo <strong className="text-vibrant-red">se alimenta el archivo Excel unificado de reservas en segundo plano</strong> de forma segura sin contaminar la UI pública del cliente.
              </p>
            </div>

            {/* View Switch / Tabs with secure Lock button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("matrix")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === "matrix" 
                      ? "bg-white text-vibrant-dark shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Matriz CRUD
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("asis-tobe")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === "asis-tobe" 
                      ? "bg-white text-vibrant-dark shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  AS-IS / TO-BE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vision-2036")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === "vision-2036" 
                      ? "bg-gradient-to-r from-vibrant-dark to-slate-800 text-vibrant-yellow shadow-md" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-vibrant-yellow animate-bounce" />
                  Evolución 10 Años (2036)
                </button>
              </div>

              <button
                type="button"
                onClick={handleLockAgain}
                className="p-2 py-1.5 bg-vibrant-red/10 border border-vibrant-red/15 hover:bg-vibrant-red/15 text-vibrant-red rounded-2xl font-black transition-all text-xs flex items-center gap-1 cursor-pointer h-full"
                title="Volver a bloquear vista del Dueño"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            </div>
          </div>

      {activeTab === "matrix" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Matrix Table */}
          <div className="lg:col-span-8 space-y-3">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 text-[11px] font-semibold text-slate-500 flex justify-between items-center px-4">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Haz clic en cualquier celda para inspeccionar el flujo y armonización del dato.
              </span>
              <span className="hidden sm:inline font-mono text-[9px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">CRUD: Create, Read, Update, Delete</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border-2 border-slate-200/80 bg-white shadow-sm">
              <table className="w-full min-w-[650px] border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <td className="p-3 text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider font-mono w-40">Proceso \ Entidad</td>
                    {entities.map((e) => (
                      <td key={e.code} className="p-2 border-l border-slate-200 text-center w-16 group">
                        <span className="text-[10px] font-black text-slate-800 block cursor-help" title={e.name}>
                          {e.code}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 block tracking-tighter truncate font-mono">
                          {e.name.split(" ")[0]}
                        </span>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p) => (
                    <tr key={p.code} className="border-b border-slate-200/80 hover:bg-slate-50/50">
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            p.domain === "Negocio" ? "bg-blue-400" : p.domain === "Aplicación" ? "bg-violet-400" : "bg-emerald-400"
                          }`} />
                          <span className="font-mono text-[10px] font-black text-slate-400 shrink-0">{p.code}</span>
                          <span className="font-sans font-black text-[11px] text-vibrant-dark/95 leading-tight tracking-tight max-w-[140px] truncate block" title={p.name}>
                            {p.name}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-wide uppercase font-bold block ml-3 mt-0.5">
                          {p.domain}
                        </span>
                      </td>
                      {entities.map((e) => {
                        const cell = crudData[p.code]?.[e.code] || { val: "-", desc: "Sin interacción directa." };
                        const isSelected = selectedCell?.pCode === p.code && selectedCell?.eCode === e.code;
                        return (
                          <td 
                            key={e.code} 
                            onClick={() => setSelectedCell({ pCode: p.code, eCode: e.code })}
                            className={getCellClass(cell.val, p.code, e.code)}
                          >
                            <span className="text-xs">{cell.val}</span>
                            {isSelected && (
                              <div className="absolute inset-0 border-2 border-black/30 pointer-events-none rounded-sm"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend indicators */}
            <div className="flex flex-wrap gap-3 pt-1 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-300 inline-block shrink-0 text-[9px] font-mono flex items-center justify-center font-bold text-emerald-800">C</span>
                <span>Creación (C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-100 border border-blue-300 inline-block shrink-0 text-[9px] font-mono flex items-center justify-center font-bold text-blue-800">R</span>
                <span>Lectura (R)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-cyan-100 border border-cyan-300 inline-block shrink-0 text-[9px] font-mono flex items-center justify-center font-bold text-cyan-800">U</span>
                <span>Actualización (U)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-red-100 border border-red-300 inline-block shrink-0 text-[9px] font-mono flex items-center justify-center font-bold text-red-800">D</span>
                <span>Borrado completo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Proc. Negocio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                <span>Proc. Aplicación</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Proc. Soporte</span>
              </div>
            </div>
          </div>

          {/* Interactive Inspection Workspace Panel */}
          <div className="lg:col-span-4 bg-slate-50 rounded-[28px] border-2 border-slate-200/80 p-5 space-y-4 self-stretch flex flex-col justify-between">
            {selectedCell ? (
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-vibrant-yellow shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black uppercase text-slate-400 block">Inspección de Relación CRUD</span>
                    <span className="text-sm font-sans font-black text-slate-800 leading-tight block mt-0.5">
                      {selectedCell.pCode} ⇄ {selectedCell.eCode}
                    </span>
                  </div>
                </div>

                {/* Process context detail */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black uppercase text-slate-400 block">PROCESO DE NEGOCIO:</span>
                  <p className="text-[11px] font-sans font-black text-slate-700 leading-tight">
                    {processes.find(p => p.code === selectedCell.pCode)?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {processes.find(p => p.code === selectedCell.pCode)?.desc}
                  </p>
                </div>

                {/* Entity context detail */}
                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <span className="text-[9px] font-mono font-black uppercase text-slate-400 block">ENTIDAD DE DATOS (TOGAF):</span>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-black text-slate-700 leading-tight">
                      {entities.find(e => e.code === selectedCell.eCode)?.name}
                    </span>
                    <span className="text-[8px] bg-slate-200 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded">
                      Dueño: {entities.find(e => e.code === selectedCell.eCode)?.owner}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {entities.find(e => e.code === selectedCell.eCode)?.desc}
                  </p>
                </div>

                {/* Mapped integration action desc */}
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black uppercase text-slate-400">FLUJO OPERATIVO:</span>
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                      crudData[selectedCell.pCode]?.[selectedCell.eCode]?.val === "-" 
                        ? "bg-slate-100 text-slate-500" 
                        : "bg-vibrant-yellow text-vibrant-dark border border-vibrant-dark/10"
                    }`}>
                      Acción: {crudData[selectedCell.pCode]?.[selectedCell.eCode]?.val || "Ninguna"}
                    </span>
                  </div>
                  <p className="text-xs text-vibrant-dark/90 font-semibold leading-relaxed font-sans">
                    {crudData[selectedCell.pCode]?.[selectedCell.eCode]?.desc || "No hay relación directa de herencia o mutación de estado en este nodo del ciclo."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center items-center gap-2">
                <span className="text-3xl">👈</span>
                <p className="text-xs text-slate-400 font-sans font-bold">Selecciona una celda en la matriz para ver el detalle de gobernanza.</p>
              </div>
            )}

            {/* Bottom mini assurance notice */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 text-[10px] font-sans font-semibold leading-snug border border-slate-800 mt-2">
              💡 <strong>Regla de Gobernanza de Datos:</strong>
              <div className="text-slate-300 mt-1">
                La entidad <strong>E6 (Base de Datos / Registro Excel)</strong> está expresamente protegida por un PIN administrativo para prevenir fugas de datos de contacto de clientes en Colombia.
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "asis-tobe" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AS-IS (State) */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-slate-50 border-2 border-slate-200/80 space-y-4">
            <div className="flex gap-3.5 items-center pb-3 border-b border-slate-200">
              <div className="p-2.5 bg-slate-200 text-slate-600 rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 bg-slate-300/60 text-slate-600 font-mono font-bold text-[9px] uppercase tracking-wider rounded-md">Entorno Original</span>
                <h4 className="font-sans font-black text-lg text-slate-800 leading-none mt-1">Arquitectura de Datos AS-IS</h4>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs font-semibold text-slate-600">
              <li className="flex gap-2.5 items-start">
                <span className="text-vibrant-red text-base shrink-0 mt-0.5">❌</span>
                <div>
                  <strong className="text-slate-800">Silos de Información:</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Las cotizaciones se hacían manualmente usando libretas de apuntes y calculadoras ordinarias promediando a ojo el peso de la mascota.</p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="text-vibrant-red text-base shrink-0 mt-0.5">❌</span>
                <div>
                  <strong className="text-slate-800">Falta de Registro Excel de Reservas:</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Los horarios se cruzaban frecuentemente en el calendario porque no había validación ni persistencia automatizada en tablas.</p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="text-vibrant-red text-base shrink-0 mt-0.5">❌</span>
                <div>
                  <strong className="text-slate-800">Sin Alerta Predictiva de Retorno:</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Los dueños postergaban el baño preventivo hasta 4 o 5 meses, provocando problemas graves de nudos consolidados y dermatitis en los perros.</p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="text-vibrant-red text-base shrink-0 mt-0.5">❌</span>
                <div>
                  <strong className="text-slate-800">Falta de Armonización con IA:</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">El estilista diagnosticaba visualmente en sitio, sin planes recomendados de forma inteligente ni anticipación de sensibilidades específicas.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* TO-BE (Modern architecture) */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-emerald-500/5 border-2 border-emerald-500/20 space-y-4">
            <div className="flex gap-3.5 items-center pb-3 border-b border-emerald-500/10">
              <div className="p-2.5 bg-emerald-500 text-white rounded-2xl">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono font-bold text-[9px] uppercase tracking-wider rounded-md">Entorno Optimizado</span>
                <h4 className="font-sans font-black text-lg text-vibrant-dark leading-none mt-1">Arquitectura Armonizada TO-BE</h4>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs font-semibold text-emerald-950">
              <li className="flex gap-2.5 items-start">
                <span className="text-emerald-500 text-base shrink-0 mt-0.5">✅</span>
                <div>
                  <strong className="text-emerald-900">Cotizador y Diagnóstico Interactivo:</strong>
                  <p className="text-[11px] text-emerald-800/80 leading-relaxed mt-0.5">Mapeo automatizado de tamaño de mascota, raza y catálogo de spa con sumatorias dinámicas libres de errores de cálculo.</p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="text-emerald-500 text-base shrink-0 mt-0.5">✅</span>
                <div>
                  <strong className="text-emerald-900">Excel Permanente en Segundo Plano:</strong>
                  <p className="text-[11px] text-emerald-800/80 leading-relaxed mt-0.5">Las transacciones alimentan la base de datos de manera invisible a los clientes ordinarios, permitiendo a los administradores exportar el CSV limpio estructurado.</p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="text-emerald-500 text-base shrink-0 mt-0.5">✅</span>
                <div>
                  <strong className="text-emerald-900">Motor de Alerta de Retorno Automática:</strong>
                  <p className="text-[11px] text-emerald-800/80 leading-relaxed mt-0.5">El sistema calcula de forma exacta la fecha de su próximo servicio (60 días después de agendar) y se lo advierte de forma educacional en tiempo real al usuario.</p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="text-emerald-500 text-base shrink-0 mt-0.5">✅</span>
                <div>
                  <strong className="text-emerald-900">Acompañamiento por IA (Gemini V2):</strong>
                  <p className="text-[11px] text-emerald-800/80 leading-relaxed mt-0.5">Los elixires y tratamientos de Armonización Emocional, Spa y Deslanado se sugieren proactivamente adaptándose a afecciones detectadas en la dermis.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        /* VISION 2036 VIEW */
        <div className="space-y-8 animate-fade-in">
          {/* Intro Projection Alert */}
          <div className="bg-gradient-to-r from-slate-900 to-vibrant-dark text-white rounded-[28px] p-6 sm:p-8 border-2 border-slate-700/50 flex flex-col md:flex-row items-center gap-6 justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="space-y-2 relative z-10">
              <span className="inline-block bg-vibrant-yellow text-vibrant-dark text-[9px] font-black uppercase px-2.5 py-1 rounded font-mono">
                🚀 Proyección Tecnológica a 10 Años
              </span>
              <h4 className="font-sans font-black text-xl sm:text-2xl text-vibrant-yellow tracking-tight leading-none">
                La Revolución de Studio Pet (2026 ⇄ 2036)
              </h4>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed max-w-2xl">
                Al fusionar la arquitectura empresarial con las tecnologías emergentes de la próxima década, la estética y el cuidado animal a domicilio mutarán de un modelo Reactivo Multicanal a un Modelo Sincrónico Autónomo Descentralizado. ¡Mira cómo prepararte hoy mismo!
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center shrink-0 min-w-[130px]">
              <span className="text-xs font-black text-slate-400 block uppercase">Horizonte temporal</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-vibrant-yellow block">2036</span>
              <span className="text-[10px] text-vibrant-yellow/80 font-black block mt-0.5">Ready to Scale</span>
            </div>
          </div>

          {/* Interactive Domain Exploration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Domain selectors list (Left 5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block pl-2">
                Selecciona la Capa de Arquitectura:
              </span>
              {visionData.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedVisionDomain(idx)}
                  className={`w-full text-left p-4 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex gap-4 items-center group ${
                    selectedVisionDomain === idx
                      ? "bg-slate-900 border-slate-800 text-white shadow-md scale-[1.01]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300"
                  }`}
                >
                  <div className={`p-3 rounded-2xl text-xl shrink-0 ${
                    selectedVisionDomain === idx 
                      ? "bg-slate-800 text-vibrant-yellow" 
                      : "bg-white text-slate-600 border border-slate-200 shadow-sm"
                  }`}>
                    {idx === 0 && <Workflow className="w-5 h-5 text-current" />}
                    {idx === 1 && <Brain className="w-5 h-5 text-current animate-pulse" />}
                    {idx === 2 && <Database className="w-5 h-5 text-current" />}
                    {idx === 3 && <Radio className="w-5 h-5 text-current" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-mono font-black uppercase block tracking-wider ${
                      selectedVisionDomain === idx ? "text-vibrant-yellow" : "text-slate-400"
                    }`}>
                      TOGAF Layer {idx + 1}
                    </span>
                    <strong className="text-xs sm:text-sm font-sans font-black tracking-tight block truncate mt-0.5">
                      {v.domain}
                    </strong>
                  </div>
                  <span className={`text-base font-bold transition-transform ${
                    selectedVisionDomain === idx ? "text-vibrant-yellow translate-x-1" : "text-slate-300 group-hover:translate-x-1"
                  }`}>
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* Interactive Analysis View (Right 7 cols) */}
            <div className="lg:col-span-7 bg-slate-50 rounded-[35px] border-2 border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                {/* Layer indicator header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-xs font-mono font-black uppercase text-slate-400">
                    Mapeo de Evolución de Capas de TOGAF
                  </span>
                  <span className="text-[10px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded-lg font-black uppercase">
                    Fase {["A / B", "C (Apps)", "C (Data)", "D (Tech)"][selectedVisionDomain]}
                  </span>
                </div>

                <h5 className="font-sans font-black text-xl text-vibrant-dark tracking-tight">
                  {visionData[selectedVisionDomain].domain}
                </h5>

                {/* 2026 vs 2036 Side-by-Side Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Year 2026 */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2.5 relative">
                    <span className="absolute top-3 right-3 text-2xl" role="img" aria-label="icon">
                      {visionData[selectedVisionDomain].year2026.icon}
                    </span>
                    <div className="text-[10px] font-mono font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded inline-block">
                      Año 2026 (Moderno)
                    </div>
                    <h6 className="font-sans font-black text-xs text-slate-800 leading-tight">
                      {visionData[selectedVisionDomain].year2026.title}
                    </h6>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {visionData[selectedVisionDomain].year2026.desc}
                    </p>
                  </div>

                  {/* Year 2036 */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-800 text-white space-y-2.5 relative shadow-md">
                    <span className="absolute top-3 right-3 text-2xl" id="img-evolution-icon">
                      {visionData[selectedVisionDomain].year2036.icon}
                    </span>
                    <div className="text-[10px] font-mono font-black px-2 py-0.5 bg-vibrant-yellow text-vibrant-dark rounded inline-block">
                      Año 2036 (Futuro)
                    </div>
                    <h6 className="font-sans font-black text-xs text-vibrant-yellow leading-tight">
                      {visionData[selectedVisionDomain].year2036.title}
                    </h6>
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                      {visionData[selectedVisionDomain].year2036.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Plan preparation block */}
              <div className="p-4 bg-vibrant-yellow/10 rounded-2xl border-2 border-vibrant-yellow/15 space-y-2 mt-4">
                <span className="text-[9px] font-mono font-black text-vibrant-brown uppercase tracking-wider block">
                  ⚙️ CÓMO PREPARARSE HOY (Mitigación & Readiness):
                </span>
                <p className="text-xs text-vibrant-dark font-sans font-black leading-relaxed">
                  {visionData[selectedVisionDomain].preparation}
                </p>
              </div>
            </div>
          </div>

          {/* Golden Rules of future proofing checklist */}
          <div className="bg-slate-900 text-white rounded-[32px] p-6 lg:p-8 border-2 border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 md:border-r border-slate-800 pr-4">
              <span className="text-2xl">⚡</span>
              <h6 className="text-sm font-sans font-black text-white">1. Arquitectura Sin Interfaces</h6>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                En 10 años, las interfaces de usuario (UI) pasarán a un plano secundario. Las aplicaciones serán alimentadas por flujos conversacionales directos y gestos neuronales en el hogar. Desacopla tu lógica con endpoints API limpios y estructurados.
              </p>
            </div>
            <div className="space-y-1.5 md:border-r border-slate-800 pr-5">
              <span className="text-2xl">🔒</span>
              <h6 className="text-sm font-sans font-black text-white">2. Privacidad Cuántica & Biometría</h6>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                La seguridad pasará del PIN administrativo o contraseñas simples al cifrado biocrónico y blockchain soberano. Proteger las bases de datos de mascotas hoy con buenas prácticas de sanitización garantiza la adaptabilidad de futuras llaves encriptadas.
              </p>
            </div>
            <div className="space-y-1.5 pr-4">
              <span className="text-2xl">🔮</span>
              <h6 className="text-sm font-sans font-black text-white">3. Armonización Holística</h6>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                El spa animal superará la limpieza epidérmica básica, integrando biosensores de estrés, frecuencias sintonizadas y esencias botánicas bio-fieles de forma autónoma. El registro de hoy es el plan de estimulación preventiva del mañana.
              </p>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Corporate Architecture Footnote */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-5 bg-vibrant-dark text-white rounded-3xl border-2 border-white/10 text-xs font-sans font-bold">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Cpu className="w-4 h-4 text-vibrant-yellow" />
          </div>
          <span>Unificación en Capa de Datos: React + Express (CRUD Server Engine) </span>
        </div>
        <div className="flex gap-1.5 items-center font-mono text-[10px] text-vibrant-yellow bg-vibrant-yellow/10 px-3 py-1 rounded-xl border border-vibrant-yellow/15">
          <span>Gobernanza ISO/IEC 38500</span>
          <span>•</span>
          <span>TOGAF ADM Standard compliant</span>
        </div>
      </div>
    </div>
  );
}
