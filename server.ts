import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client Lazily & Safely
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured in environment variables. Falling back to demo mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API Routes
app.post("/api/pet-care-advisor", async (req, res) => {
  try {
    const { breed, petType, message, history } = req.body;
    
    // Default fallback advice if Gemini API is missing or fails
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: `🐾 **¡Hola! Actualmente estamos en modo de demostración local.** 

Para tu **${petType === 'cat' ? 'Gato 🐈' : 'Perro 🐕'}** de raza **${breed || 'Mestizo/Otras'}**, aquí tienes algunos consejos personalizados para el cuidado en el trayecto de recogida:

1. **🌿 Frecuencia del Baño**: Aconsejamos bañar a tu perro cada 3-4 semanas y gatos si es necesario cada 6-8 semanas. El exceso de baño barre los aceites naturales de su dermis.
2. **✂️ Cuidado del Manto**: Es clave cepillar su pelo regularmente. Para razas de doble capa (como Golden, Husky o gatos de pelo largo) se recomienda un **Deslanado Profesional** bimestral para controlar las mudas y evitar nudos molestos.
3. **💅 Higiene Básica**: Limpiar regularmente sus oídos con limpiadores libres de alcohol ayuda a combatir la otitis. El corte preventivo de uñas previene dolores articulares.

¡Te invitamos a probar el agendamiento y agendar un **Baño Premium** o un **Spa Relajante con Aromaterapia** de **Studio Pet**! Ofrecemos la recogida y retorno a domicilio totalmente gratis en el área urbana 💖`
      });
    }

    const ai = getAiClient();
    
    const sysInstruction = `Eres un peluquero de mascotas y experto de spa senior de "Studio Pet - Servicio de Estética y Peluquería Canina/Felina a Domicilio".
Tu misión es dar consejos totalmente profesionales, empáticos, informados y prácticos para el cuidado capilar, salud dérmica e higiene general de la mascota (${petType}) de raza o descripción (${breed}) elegida por el usuario.
Incentiva sutilmente a la persona a explorar y elegir entre los estilos de cortes ilustrados con fotos reales en el panel izquierdo ("Tendencias de Estilismo") para su raza específica (por ejemplo: Oso de Peluche, Corte León, Boo, etc.) diciéndole que al hacerlo, se predefinirá automáticamente en su cotización final de WhatsApp.
Mantén un tono cálido, amoroso con los peluditos, sumamente profesional y fácil de entender.
Evita diagnósticos médicos complejos pero comparte pautas de cepillado, baño, deslanado, cuidado de nudos, garras de uñas y salud auricular.
Al finalizar tus respuestas, describe con gran calidez por qué el servicio a domicilio de Studio Pet (con recogida y retorno gratis, mimos y perfumes con aceites esenciales orgánicos) es ideal para su mascota para que quede limpia, perfumada y extremadamente feliz.
Responde de forma concisa y bien estructurada en formato Markdown con subtítulos amigables y emojis (🐾, 🐕, 🐈, 💖, ✂️, 🚿).`;

    let chatContents = [];
    if (history && history.length > 0) {
      chatContents = history.map((item: any) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      }));
      chatContents.push({
        role: "user",
        parts: [{ text: message }]
      });
    } else {
      chatContents = [
        {
          role: "user",
          parts: [{ text: `Hola, tengo un ${petType} de raza o tipo: ${breed || 'mestizo o no especificado'}. Háblame de los requerimientos de cuidado para este amigo y respóndeme la combinación de cuidado ideal para responder a esta inquietud: ${message}` }]
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Advisor Server Error:", error);

    // High-fidelity personalized fallback responder in case of API limits or configuration errors
    const { breed, petType } = req.body;
    const lowercaseBreed = (breed || "mixta").toLowerCase();
    const petLabel = petType === "dog" ? "perro" : "gato";
    let advice = "";

    if (lowercaseBreed.includes("poodle") || lowercaseBreed.includes("caniche")) {
      advice = `🐾 **¡Hola! Un saludo para tu adorable Poodle.**\n\nLos Poodles poseen un pelo rizado de crecimiento continuo que no se cae solo, por lo que es propenso a formar nudos apretados cerca de la piel. Recomendamos:\n\n1. **🌿 Cuidado del Manto**: Es vital cepillar a tu Poodle 3 o 4 veces por semana utilizando una carda suave para esponjar el rulo y un peine metálico para revisar la raíz.\n2. **✂️ Corte Recomendado**: El corte **Oso de Peluche (Teddy Bear)** o el práctico **Corte Cachorro** son ideales. Puedes elegirlos en nuestro panel izquierdo para incluirlos en tu cita.\n3. **🚿 Hidratación Avanzada**: Recomendamos nuestro **Baño Premium** de pH controlado y mascarilla hidratante.\n\n¿Deseas que programemos una visita a domicilio de **Studio Pet** para tu engreído?`;
    } else if (lowercaseBreed.includes("shih") || lowercaseBreed.includes("tzu")) {
      advice = `🐾 **¡Hola! Un saludo para tu hermoso Shih Tzu.**\n\nLos Shih Tzu poseen un manto lacio y sedoso de crecimiento rápido, que requiere cuidados diarios de nudos y atención especial a su lagrimeo facial. Recomendamos:\n\n1. **🌿 Limpieza Ocular y Facial**: Limpiar diariamente el lagrimal con gasa tibia evita manchas de oxidación y hongos.\n2. **✂️ Estilo de Estética**: Te sugerimos el **Estilo Peluche Redondo (Kawaii)** o un **Corte Corto de Juego** para frescura constante. Ambos están disponibles a la izquierda.\n3. **💆 Baño de Mimos**: Champú abrillantador y masaje desestresante a domicilio.\n\n¿Nos permites agendar su ruta de recogida gratis?`;
    } else if (lowercaseBreed.includes("pomer") || lowercaseBreed.includes("boo") || lowercaseBreed.includes("spitz")) {
      advice = `🐾 **¡Hola! Un saludo para tu elegante Pomerania.**\n\nLos Pomeranias son perritos nórdicos con manto de doble capa protectora. **¡Atención!** Jamás se debe rapar a máquina a un Pomerania, ya que daña irreversiblemente los folículos.\n\n1. **🌿 Cepillado Técnico**: Cepillar a contrapelo con peine de mantequilla para retirar subpelo asfixiante.\n2. **✂️ Corte Sugerido**: El **Silueteado Natural a Tijeras** es perfecto para una redondez angelical protectora.\n3. **🚿 Spa de Seda**: Nutre la piel con aceites naturales y perfume de aceites esenciales orgánicos.\n\n¿Coordinamos su recogida gratis para lucir como un osito de película?`;
    } else if (lowercaseBreed.includes("schnau") || lowercaseBreed.includes("esnau")) {
      advice = `🐾 **¡Hola! Un saludo para tu distinguido Schnauzer.**\n\nLos Schnauzers lucen una barba copiosa y faldón en patas icónicos que requieren mantenimiento higiénico para evitar enredos y mal olor:\n\n1. **🌿 Cuidado Pos-Comida**: Cepillar y secar la barba con frecuencia previene motas y decoloración.\n2. **✂️ Estilo Clásico**: El **Corte Schnauzer Tradicional** (espalda al ras, cejas anguladas y faldas flotantes) lo hará lucir señorial.\n3. **💅 Estética de Garras**: Despeje higiénico de almohadillas y limado preventivo.\n\n¿Agendamos una ruta de aseo a domicilio para que luzca radiante?`;
    } else if (lowercaseBreed.includes("persa")) {
      advice = `🐾 **¡Hola! Un saludo especial para tu dulce Gato Persa.**\n\nLos gatos persas tienen el pelo más fino del mundo felino, propenso a nudos apretados en axilas y vientre:\n\n1. **🌿 Peinado Calmado**: Cepillado diario con peine de metal de dientes suaves para evitar tirones.\n2. **✂️ Cortes Exclusivos**: El **Corte León Real** (espalda rasurada, melena libre de nudos y cuello pomposo) es ideal si tiene motas grandes.\n3. **🛁 Baño Técnicamente Amable**: Agua templada, secador ultrasilencioso para evitar estrés felino.\n\n¿Quieres que coordinemos su cita de spa con recogida gratis?`;
    } else if (lowercaseBreed.includes("pincher") || lowercaseBreed.includes("pinscher")) {
      advice = `🐾 **¡Hola! Un saludo afectuoso para tu dinámico Pinscher.**\n\nAunque tu Pinscher tiene el pelo muy corto, su dermis es sumamente sensible al frío, resequedad y requiere cuidados específicos de remoción de pelo muerto de aguja:\n\n1. **🌿 Estimulación Dérmica**: Cepillado 2 veces por semana con cepillo de cerdas suaves o manopla de látex para activar la queratina natural y esparcir aceites protectores.\n2. **🚿 Baño de Manzanilla**: Champús calmantes hipoalergénicos para aliviar pieles irritables.\n3. **💅 Limado de Uñas**: Al ser liviano, no las desgasta solo. El corte preventivo previene dolores de pisada.\n\n¡Nuestras esencias orgánicas lo dejarán súper brillante, dócil y libre de comezón! ¿Agendamos su spa a domicilio con transporte gratuito?`;
    } else if (lowercaseBreed.includes("criollo") || lowercaseBreed.includes("mestizo") || lowercaseBreed.includes("gozque") || lowercaseBreed.includes("cruza")) {
      advice = `🐾 **¡Hola! Un fuerte abrazo para tu asombroso y único Criollo / Mestizo, ¡el orgullo de los hogares en Colombia!**\n\nLos perritos y gatitos criollos destacan por su inteligencia y resistencia, pero sus variados pelajes requieren cuidados preventivos para brillar al máximo:\n\n1. **🌿 Cuidado Multicapa**: Si de herencia tiene pelo corto, requiere masajes de goma para remover muda de aguja. Si es de pelo medio/largo, un cepillado doble por semana evitará el subpelo apelmazado.\n2. **🧼 Desodorización y Brillo**: Nuestro champú de avena y acondicionador frutal potenciarán su brillo natural.\n3. **🚿 Experiencia Consentida**: Recomendamos nuestro **Baño Premium** o **Spa de Aromaterapia** relajante para mimar su enorme corazón.\n\n¿Cuándo pasamos por este campeón en nuestra ruta de recogida gratis?`;
    } else if (lowercaseBreed.includes("bulldog") || lowercaseBreed.includes("frenchie") || lowercaseBreed.includes("boston")) {
      advice = `🐾 **¡Hola! Un saludo para tu alegre y tierno Bulldog.**\n\nLos Bulldogs (especialmente el Bulldog Francés e Inglés, muy queridos en Colombia) poseen una estructura braquicéfala y pliegues faciales característicos que acumulan humedad e irritación:\n\n1. **🌿 Limpieza de Arrugas y Pliegues**: El secado meticuloso entre los pliegues faciales y la cola es vital para prevenir la dermatitis bacteriana.\n2. **🧴 Hidratación de Hocico y Almohadillas**: Aplicamos bálsamo orgánico de karité para su nariz propensa a hiperqueratosis.\n3. **🚿 Secado Técnico Amigable**: Baño con agua templada y soplado ultrasuave indirecto debido a su sensibilidad respiratoria.\n\n¿Coordinamos un baño premium para consentir sus hermosas arrugas a domicilio?`;
    } else if (lowercaseBreed.includes("golden") || lowercaseBreed.includes("labrador") || lowercaseBreed.includes("retriever")) {
      advice = `🐾 **¡Hola! Un saludo especial para tu cariñoso y noble Retriever.**\n\nLos Golden y Labrador retrievers tienen mantos dobles y densos sumamente hermosos, ideales para nadar y jugar, pero propensos a la acumulación de humedad y abundante muda estacional:\n\n1. **🌿 Deslanado Profesional**: El deslanado retira hasta el 90% del subpelo asfixiante, previniendo los nudos en corvejones y axilas.\n2. **🚿 Secado Exhaustivo**: Evita el famoso "olor a perro mojado" y la proliferación de hongos en la piel profunda.\n3. **🐾 Cuidado Auricular**: Sus orejas caídas tienden a acumular humedad física, por lo que una limpieza profunda con gasa seca es clave.\n\n¿Nos permites agendar su deslanado profundo a domicilio para que vuelva radiante y libre de pelos sueltos?`;
    } else if (lowercaseBreed.includes("siames") || lowercaseBreed.includes("siamés")) {
      advice = `🐾 **¡Hola! Un saludo muy especial para tu majestuoso y parlanchín Siamés.**\n\nLos gatos Siameses tienen un manto sedoso, fino y corto muy pegado al cuerpo, pero requieren cuidados de control de grasa dérmica y muda fina:\n\n1. **🌿 Masaje de Silicona**: El cepillado semanal elimina el pelo muerto ultrafino que ingieren al lamerse, evitando las molestas bolas de pelo.\n2. **🛁 Baño Felino Calmado**: Agua tibia, aromaterapia orgánica neutra y un secado sutil para respetar su refinada sensibilidad.\n3. **💅 Corte de Garras e Higiene**: Corte milimétrico y limpieza auricular relajada.\n\n¡Le encantará nuestro spa libre de caniles! ¿Agendamos su recogida gratis?`;
    } else {
      advice = `🐾 **¡Hola! Un saludo súper cálido para tu amada mascota.**\n\nSea de raza mestiza, mixta o única, su bienestar y look nos apasionan en Studio Pet:\n\n1. **🌿 Cepillado regular**: Ayuda a eliminar células muertas, previene la muda masiva de estación y estimula su circulación.\n2. **✂️ Cortes Ilustrados**: Te sugerimos explorar nuestro catálogo interactivo a la izquierda. ¡Al elegir tu favorito, se configurará automáticamente para tu cita de WhatsApp!\n3. **🚐 Servicio Consentidor**: Baño Premium, mimos y perfumes orgánicos con transporte de ida y vuelta gratis.\n\n¿Deseas que coordinemos su cita de spa a domicilio de forma ágil?`;
    }

    res.json({ text: advice });
  }
});

// ==========================================================
// PROGRAMACIÓN DE CITAS Y EXCEL AGENDA DE CONTROL INTERNO
// ==========================================================

const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

interface Booking {
  id: string;
  petType: "dog" | "cat";
  petName: string;
  petBreed: string;
  petSize: string;
  selectedServices: string[];
  clientName: string;
  clientPhone: string;
  address: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

function readBookings(): Booking[] {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      // Mock appointments representing real reservations to demonstrate schedule overlap and view instantly!
      const initial: Booking[] = [
        {
          id: "bk-1",
          petType: "dog",
          petName: "Mateo",
          petBreed: "Golden Retriever",
          petSize: "large",
          selectedServices: ["baño-premium", "deslanado-profesional"],
          clientName: "Diana Silva",
          clientPhone: "3124567890",
          address: "Carrera 15 #82-11 Apt 402, Bogotá",
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
          time: "Mañana (8:00 AM - 12:00 PM)",
          notes: "Muy dócil, le encantan los premios de higadito.",
          createdAt: new Date().toISOString()
        },
        {
          id: "bk-2",
          petType: "dog",
          petName: "Kiara",
          petBreed: "Shih Tzu",
          petSize: "small",
          selectedServices: ["corte-estilo", "spa-aromaterapia"],
          clientName: "Andrés Gómez",
          clientPhone: "3159876543",
          address: "Calle 142 #54-80 Casa 12, Bogotá",
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
          time: "Tarde (1:00 PM - 5:00 PM)",
          notes: "Tiene piel atópica, usar champú hipoalergénico proporcionado.",
          createdAt: new Date().toISOString()
        },
        {
          id: "bk-3",
          petType: "cat",
          petName: "Loki",
          petBreed: "Persa",
          petSize: "small",
          selectedServices: ["baño-premium", "corte-garras"],
          clientName: "Valentina Meza",
          clientPhone: "3201112233",
          address: "Avenida Suba #116-25 Torre A 601, Bogotá",
          date: new Date(Date.now() + 172800000).toISOString().split("T")[0], // In 2 days
          time: "Mañana (8:00 AM - 12:00 PM)",
          notes: "Gatito nervioso con el secador ruidoso.",
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading bookings.json database:", err);
    return [];
  }
}

function writeBookings(bookings: Booking[]) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving to bookings.json:", err);
  }
}

// Get ordered bookings to populate administrative agendas
app.get("/api/bookings", (req, res) => {
  const bookings = readBookings();
  const sorted = [...bookings].sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.time.localeCompare(b.time);
  });
  res.json(sorted);
});

// Create appointment & enforce overlap scheduling prevention
app.post("/api/bookings", (req, res) => {
  const { petType, petName, petBreed, petSize, selectedServices, clientName, clientPhone, address, date, time, notes } = req.body;
  
  if (!petName || !clientName || !clientPhone || !address || !date || !time) {
    return res.status(400).json({ error: "MISSING_FIELDS", message: "Faltan datos obligatorios para registrar la cita en la agenda." });
  }

  const bookings = readBookings();

  // Validate overlap constraints to coordinate hours perfectly
  const timeConflict = bookings.find(b => b.date === date && b.time === time);

  if (timeConflict) {
    return res.status(400).json({ 
      error: "OVERLAP", 
      message: `¡Conflicto de Horario! La jornada para el ${date} en el horario de "${time}" ya se encuentra reservada. Por favor, selecciona otro horario o fecha de servicio de estética.`
    });
  }

  const newBooking: Booking = {
    id: "bk-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    petType: petType || "dog",
    petName,
    petBreed: petBreed || "Cruza",
    petSize: petSize || "medium",
    selectedServices: selectedServices || [],
    clientName,
    clientPhone,
    address,
    date,
    time,
    notes: notes || "",
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  res.status(201).json({ success: true, booking: newBooking });
});

// Delete specific booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const bookings = readBookings();
  const filtered = bookings.filter(b => b.id !== id);
  if (filtered.length === bookings.length) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Cita no encontrada." });
  }
  writeBookings(filtered);
  res.json({ success: true });
});

// Export beautiful Excel-ready spreadsheet CSV! It uses semicolons and UTF-8 BOM so Spanish characters look perfect.
app.get("/api/bookings/export-csv", (req, res) => {
  const bookings = readBookings();
  
  // Headers to download directly as a spreadsheet file
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=agenda_control_estetica_pet.csv");
  
  // Write the UTF-8 BOM byte sequence
  res.write("\uFEFF");
  
  const headers = [
    "ID de Cita",
    "Fecha Cita",
    "Jornada",
    "Nombre Cliente",
    "WhatsApp Cliente",
    "Nombre Mascota",
    "Especie Mascota",
    "Raza",
    "Tamaño",
    "Servicios Seleccionados",
    "Dirección de Recogida",
    "Notas",
    "Fecha Creación Cita"
  ];
  
  let csvContent = headers.join(";") + "\r\n";
  
  const sorted = [...bookings].sort((a, b) => {
    const dComp = a.date.localeCompare(b.date);
    if (dComp !== 0) return dComp;
    return a.time.localeCompare(b.time);
  });

  sorted.forEach(b => {
    const escape = (val: string) => {
      if (!val) return "";
      let cleaned = val.replace(/"/g, '""').replace(/\n/g, " ").replace(/\r/g, " ");
      if (cleaned.includes(";") || cleaned.includes(",") || cleaned.includes('"')) {
        return `"${cleaned}"`;
      }
      return cleaned;
    };

    const row = [
      b.id,
      b.date,
      b.time,
      escape(b.clientName),
      escape(b.clientPhone),
      escape(b.petName),
      b.petType === "dog" ? "Perro 🐕" : "Gato 🐈",
      escape(b.petBreed),
      b.petSize.toUpperCase(),
      escape(b.selectedServices.join(", ")),
      escape(b.address),
      escape(b.notes),
      b.createdAt
    ];
    csvContent += row.join(";") + "\r\n";
  });
  
  res.write(csvContent);
  res.end();
});

// Setup Vite Dev Server / Static Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Studio Pet Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
