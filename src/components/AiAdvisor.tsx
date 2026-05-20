import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquare, Send, Bot, User, Trash2, CheckCircle2, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { ChatMessage, PetType } from "../types";

interface AiAdvisorProps {
  onSuggestService: (petType: PetType, breed: string, recommendedServices: string[], extraNotes?: string) => void;
}

export const COLOMBIAN_BREEDS = [
  // DOGS
  { name: "Mestizo / Criollo 🐶", breedKey: "Criollo", type: "dog" as const },
  { name: "Pinscher / Pincher 🐕", breedKey: "Pinscher", type: "dog" as const },
  { name: "Poodle 🐩", breedKey: "Poodle", type: "dog" as const },
  { name: "Shih Tzu 🐾", breedKey: "Shih Tzu", type: "dog" as const },
  { name: "Bulldog Francés 🐷", breedKey: "Bulldog Francés", type: "dog" as const },
  { name: "Pomerania 🦊", breedKey: "Pomerania", type: "dog" as const },
  { name: "Schnauzer 🦴", breedKey: "Schnauzer", type: "dog" as const },
  { name: "Golden Retriever 🦮", breedKey: "Golden Retriever", type: "dog" as const },
  { name: "Labrador 🐕‍🦺", breedKey: "Labrador", type: "dog" as const },
  { name: "Pug / Carlino 🐸", breedKey: "Pug", type: "dog" as const },
  { name: "Beagle 🍩", breedKey: "Beagle", type: "dog" as const },
  { name: "Yorkshire / Yorkie 🎀", breedKey: "Yorkshire", type: "dog" as const },
  { name: "Cocker Spaniel 🪵", breedKey: "Cocker Spaniel", type: "dog" as const },
  { name: "Pitbull ⚡", breedKey: "Pitbull", type: "dog" as const },
  { name: "Husky Siberiano ❄️", breedKey: "Husky", type: "dog" as const },
  { name: "Pastor Alemán 🛡️", breedKey: "Pastor Alemán", type: "dog" as const },
  { name: "Boxer 🥊", breedKey: "Boxer", type: "dog" as const },
  { name: "Maltés ☁️", breedKey: "Maltés", type: "dog" as const },
  { name: "Otros / No especificado 🐾", breedKey: "Otro (Perro)", type: "dog" as const },

  // CATS
  { name: "Criollo / Mestizo 🐱", breedKey: "Criollo", type: "cat" as const },
  { name: "Siamés 🐾", breedKey: "Siamés", type: "cat" as const },
  { name: "Persa 🐈", breedKey: "Persa", type: "cat" as const },
  { name: "Angora ☁️", breedKey: "Angora", type: "cat" as const },
  { name: "Azul Ruso 💎", breedKey: "Azul Ruso", type: "cat" as const },
  { name: "Maine Coon 🦁", breedKey: "Maine Coon", type: "cat" as const },
  { name: "Bengala 🐯", breedKey: "Bengala", type: "cat" as const },
  { name: "Otros / No especificado 🐾", breedKey: "Otro (Gato)", type: "cat" as const }
];

interface HelpCut {
  id: string;
  name: string;
  description: string;
  image: string;
  tag: string;
}

const BREED_CUTS: Record<string, HelpCut[]> = {
  poodle: [
    {
      id: "poodle-teddy",
      name: "Oso de Peluche (Teddy Bear)",
      description: "Carita ultra redondeada con bozal pomposo y cuerpo corto esponjado. Le da un aspecto infantil de osito adorable.",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400",
      tag: "Más Elegido 💖"
    },
    {
      id: "poodle-lion",
      name: "Corte León Clásico",
      description: "Melena tupida en el pecho, cuartos traseros rasurados finamente con majestuosos pompones en tobillos y cola.",
      image: "https://images.unsplash.com/photo-1605897472359-85e4b9482221?auto=format&fit=crop&q=80&w=400",
      tag: "De Concurso 🏆"
    },
    {
      id: "poodle-puppy",
      name: "Corte de Cachorro (Puppy)",
      description: "Pelo uniforme y mullido de 2 a 4 cm de largo. Práctico, fácil de peinar y previene nudos en el lomo.",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=400",
      tag: "Bajo Cuidado 🧼"
    }
  ],
  shihtzu: [
    {
      id: "shihtzu-teddy",
      name: "Estilo Peluche Redondo",
      description: "Limpia y despeja el lagrimal, redondea las orejas y deja las mejillas rellenas como bombón dulce.",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400",
      tag: "Estilo Kawaii 🌸"
    },
    {
      id: "shihtzu-puppy",
      name: "Corte Corto de Juego",
      description: "Pelo muy rebajado en vientre y patas traseras. Brinda máxima frescura y comodidad frente al calor.",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
      tag: "Fresco & Limpio 🍃"
    },
    {
      id: "shihtzu-show",
      name: "Capa de Exposición Asiática",
      description: "Manto lacio largo acariciando el suelo con recogido delantero de coleta. Ideal si cepillas a diario.",
      image: "https://images.unsplash.com/photo-1620440220931-fcca1e6d3092?auto=format&fit=crop&q=80&w=400",
      tag: "Alta Gala 🌟"
    }
  ],
  pomeranian: [
    {
      id: "pomeranian-boo",
      name: "Estilo Redondeado Boo",
      description: "Imita la silueta esférica del famoso perrito Boo. Cuerpo corto perfilado y carita en aureola circular.",
      image: "https://images.unsplash.com/photo-1521580877964-433b70999ccd?auto=format&fit=crop&q=80&w=400",
      tag: "De Película 📸"
    },
    {
      id: "pomeranian-natural",
      name: "Silueteado Natural Tijeras",
      description: "Remoción sutil de puntas despeinadas preservando la doble capa primitiva que protege su delicada piel.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400",
      tag: "Salud Cutánea 🌱"
    }
  ],
  schnauzer: [
    {
      id: "schnauzer-standard",
      name: "Corte Schnauzer Tradicional",
      description: "Elegante barba larga, cejas icónicas en ángulo agudo y faldón extendido en patas. Lomo bajo higiénico.",
      image: "https://images.unsplash.com/photo-1629747490241-624f07d40e5e?auto=format&fit=crop&q=80&w=400",
      tag: "Señorial ✨"
    },
    {
      id: "schnauzer-puppy",
      name: "Corte Cachorro Práctico",
      description: "Versión de bajo mantenimiento donde se rebaja la falda y la barba a la mitad para evitar recolección de suciedad.",
      image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400",
      tag: "Práctico 🐾"
    }
  ],
  persa: [
    {
      id: "persa-leon",
      name: "Corte León Real",
      description: "Espalda rasurada al ras para evitar nudos apretados, dejando una melena esférica preciosa e imponente.",
      image: "https://images.unsplash.com/photo-1614963326505-843867e1d333?auto=format&fit=crop&q=80&w=400",
      tag: "Majestuoso 🦁"
    },
    {
      id: "persa-pluma",
      name: "Rebaje Pluma Sedoso",
      description: "Mantenimiento higiénico en base trasera, axilas y pancita para evitar motas, peinado a fondo con acondicionador.",
      image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400",
      tag: "Suave Algodón ☁️"
    }
  ],
  universal: [
    {
      id: "universal-summer",
      name: "Corte de Verano Higiénico",
      description: "Despeje completo de almohadillas, vientre y áreas sanitarias. Alivio térmico y frescura prolongada.",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?auto=format&fit=crop&q=80&w=400",
      tag: "Control de Calor ☀️"
    },
    {
      id: "universal-tips",
      name: "Perfilado de Puntas & Desenredado",
      description: "Peinado exhaustivo contra nudos con spray de coco y sutil emparejamiento con de tijeras de esculpir.",
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400",
      tag: "Mantenimiento 🪮"
    }
  ]
};

const PRESET_CONCERNS = [
  { id: "shedding", label: "Caída de pelo masiva / Muda de estación", question: "¿Cómo controlo la caída excesiva de pelo y qué servicios de deslanado me recomiendan?" },
  { id: "matted", label: "Nudos, enredos y melena descuidada", question: "Tiene muchos nudos apretados en las patas y lomo, ¿es mejor rapar o se puede rescatar el manto?" },
  { id: "skin", label: "Piel sensible, enrojecida o alergias", question: "Tiene la piel muy sensible y se rasca constantemente. ¿Qué shampoo o tratamiento de spa me recomiendan?" },
  { id: "odor", label: "Mal olor persistente", question: "Incluso después de bañar en casa, huele mal a los pocos días. ¿Hay algún tratamiento que elimine el mal olor en la raíz?" },
  { id: "puppy", label: "Primer baño de cachorro / gatito", question: "Es un cachorro y es su primera vez en una estética. ¿Cómo es el proceso y cómo evitar que se asuste?" }
];

export default function AiAdvisor({ onSuggestService }: AiAdvisorProps) {
  const [petType, setPetType] = useState<PetType>("dog");
  const [breed, setBreed] = useState<string>("");
  const [selectedConcern, setSelectedConcern] = useState<string>("");
  const [userQuery, setUserQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [selectedCutId, setSelectedCutId] = useState<string | null>(null);
  
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "¡Hola! Soy tu **Asesor IA de Studio Pet** 🐾. Estoy aquí para recomendarte el mejor plan de estilismo y spa según la raza y necesidades particulares de tu mejor amigo. Escribe la raza y elige una inquietud o hazme una pregunta libre."
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // Rotate loading sub-messages during Gemini generation
  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const loadingMessages = [
    "🐾 Analizando la morfología y el tipo de manto de la raza...",
    "🧼 Formulando sugerencias de cosmética y pH balanceado...",
    "✂️ Evaluando cortes recomendados y técnicas de deslanado...",
    "💆 Diseñando plan personalizado de Spa y aromaterapia..."
  ];

  const handleApplyConcern = (concernId: string, question: string) => {
    setSelectedConcern(concernId);
    setUserQuery(question);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const query = userQuery.trim();
    if (!query) return;

    const breedInfo = breed.trim() || "Raza Mixta / Mestizo";
    const completeMessage = `Para mi ${petType === "dog" ? "Perro" : "Gato"} de raza "${breedInfo}": ${query}`;

    // Add user message to state
    const newHistory = [...history, { role: "user" as const, text: query }];
    setHistory(newHistory);
    setUserQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/pet-care-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petType,
          breed: breedInfo,
          message: query,
          history: history.slice(1) // skip the initial greeting
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setHistory(prev => [...prev, { role: "model", text: data.text }]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [
        ...prev, 
        { 
          role: "model", 
          text: "🐾 **¡Ups! Tuvimos un pequeño inconveniente de red.** \n\nSin embargo, basándonos en tu consulta para un **" + (petType === 'dog' ? 'Perro' : 'Gato') + "** " + breedInfo + ", te sugerimos encarecidamente nuestro **Baño Premium** combinado con un **Spa de Aromaterapia** relajante para calmar cualquier molestia o estrés. ¡Su pelaje quedará acondicionado y con un aroma espectacular! \n\n¿Deseas que coordinemos una cita a domicilio con recogida gratis?" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setHistory([
      {
        role: "model",
        text: "¡Chat reiniciado! Dime, ¿qué mascota tienes hoy y qué te preocupa de su pelaje?"
      }
    ]);
    setSelectedConcern("");
    setUserQuery("");
    setSelectedCutId(null);
  };

  const getBreedKey = () => {
    const b = breed.toLowerCase().trim();
    if (b.includes("poodle") || b.includes("caniche")) return "poodle";
    if (b.includes("shih") || b.includes("tzu")) return "shihtzu";
    if (b.includes("pomer") || b.includes("boo") || b.includes("spitz")) return "pomeranian";
    if (b.includes("schnau") || b.includes("esnau")) return "schnauzer";
    if (b.includes("persa")) return "persa";
    return "universal";
  };

  const handleSelectCut = (cut: HelpCut) => {
    setSelectedCutId(cut.id);

    // Add user preference selection to chat history
    const userMsg = `Me encanta el estilo de corte **${cut.name}** (${cut.tag}). ¡Quiero agendar este corte para mi mascota!`;
    const modelMsg = `¡Excelente elección! El estilo de corte **${cut.name}** es perfecto para tu engreído. \n\nHe seleccionado e ingresado este estilo en los detalles de tu cita y he configurado el servicio de **Corte y Estilismo Profesional** (✂️) en el cotizador en la sección de abajo. \n\n¡Por favor, continúa completando tus datos allí para agendar tu cita!`;

    setHistory(prev => [
      ...prev,
      { role: "user" as const, text: userMsg },
      { role: "model" as const, text: modelMsg }
    ]);

    // Automatically trigger suggest service, selecting "corte-estilo"
    onSuggestService(
      petType, 
      breed || "Raza mixta", 
      ["corte-estilo"], 
      `Estilo de corte elegido: ${cut.name} (${cut.tag})`
    );
  };

  // Helper function to format rich text/markdown strings on the fly inside custom bubbles safely
  const formatAdvisorText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      let styledLine = line;
      
      // Check headers (### or ##)
      if (line.trim().startsWith("###")) {
        return (
          <h4 key={idx} className="font-sans font-black text-vibrant-dark text-sm mt-4 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-vibrant-red rounded-full" />
            {line.replace("###", "").replaceAll("*", "").trim()}
          </h4>
        );
      }
      if (line.trim().startsWith("##") || line.trim().startsWith("#")) {
        return (
          <h3 key={idx} className="font-sans font-black text-vibrant-dark text-base mt-5 mb-2.5 border-b-2 border-vibrant-dark/10 pb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-vibrant-yellow fill-vibrant-yellow" />
            {line.replaceAll("#", "").replaceAll("*", "").trim()}
          </h3>
        );
      }

      // Check lists (starts with *, -, or numbers)
      const isBullet = line.trim().startsWith("*") || line.trim().startsWith("-");
      const isNumbered = /^[0-9]+\.\s/.test(line.trim());

      // Parse bold elements inside the line e.g. **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(styledLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(styledLine.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-black text-vibrant-dark bg-vibrant-yellow/60 px-1 rounded-md text-[13px]">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < styledLine.length) {
        parts.push(styledLine.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : styledLine;

      if (isBullet) {
        // Stripe bullet symbol
        const lineContent = typeof content === "string" 
          ? content.replace(/^[\s*-]+/, "") 
          : content;
        return (
          <li key={idx} className="list-none pl-5 py-0.5 relative font-sans text-xs text-vibrant-dark/80 leading-relaxed my-1 font-semibold">
            <span className="absolute left-1.5 top-2.5 w-1.5 h-1.5 bg-vibrant-red rounded-full" />
            {lineContent}
          </li>
        );
      }

      if (isNumbered) {
        return (
          <div key={idx} className="pl-4 py-1 font-sans text-xs text-vibrant-dark/80 leading-relaxed my-1.5 border-l-2 border-vibrant-dark/20 italic font-semibold">
            {content}
          </div>
        );
      }

      // Empty standard spaces
      if (!line.trim()) return <div key={idx} className="h-2" />;

      // Normal paragraph
      return (
        <p key={idx} className="font-sans text-xs text-vibrant-dark/80 leading-relaxed mb-2.5 font-semibold">
          {content}
        </p>
      );
    });
  };

  // Helper functions to auto-select suggested service in the visual quote tool
  const triggerAutoSuggest = (serviceId: string) => {
    onSuggestService(petType, breed || "Raza mixta", [serviceId]);
  };

  return (
    <div id="ai-advisor-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* LEFT COLUMN: PARAMETERS AND CONCERNS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-[32px] border-2 border-vibrant-dark/15 shadow-sm space-y-5">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-vibrant-red uppercase font-black block mb-1">
              Asistencia Virtual Avanzada
            </span>
            <h3 className="text-xl font-black text-vibrant-dark tracking-tight">Ficha de Consulta</h3>
            <p className="text-vibrant-dark/75 text-xs leading-relaxed mt-1 font-semibold">
              Ingresa la especie y raza para que la IA elaboro un análisis específico del pelo y dermis.
            </p>
          </div>

          {/* Type picker */}
          <div className="flex gap-2">
            <button
              id="ai-type-dog"
              type="button"
              onClick={() => setPetType("dog")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                petType === "dog"
                  ? "border-vibrant-red bg-vibrant-red/10 text-vibrant-red"
                  : "border-vibrant-dark/10 hover:border-vibrant-dark/20 text-vibrant-dark bg-white"
              }`}
            >
              🐕 Perro
            </button>
            <button
              id="ai-type-cat"
              type="button"
              onClick={() => setPetType("cat")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                petType === "cat"
                  ? "border-vibrant-red bg-vibrant-red/10 text-vibrant-red"
                  : "border-vibrant-dark/10 hover:border-vibrant-dark/20 text-vibrant-dark bg-white"
              }`}
            >
              🐈 Gato
            </button>
          </div>

          {/* Breed input */}
          <div className="space-y-1.5 font-bold text-xs">
            <label id="ai-lbl-breed" className="block text-[11px] font-black uppercase tracking-wider text-vibrant-dark/70">
              Raza de tu mascota
            </label>
            <input
              id="ai-input-breed"
              type="text"
              list="ai-colombian-breeds-list"
              placeholder="Ej: Golden Retriever, Criollo, Siamés..."
              value={breed}
              onChange={e => setBreed(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-vibrant-dark/10 font-sans text-xs focus:outline-none focus:border-vibrant-dark bg-vibrant-bg font-semibold"
            />
            <datalist id="ai-colombian-breeds-list">
              {COLOMBIAN_BREEDS.map((chip, idx) => (
                <option key={idx} value={chip.breedKey}>
                  {chip.breedKey} ({chip.type === "dog" ? "Perro" : "Gato"})
                </option>
              ))}
            </datalist>
          </div>

          {/* Quick breed selection chips */}
          <div className="space-y-1.5 font-bold text-xs pt-1">
            <span className="block text-[10px] font-black uppercase tracking-wider text-vibrant-dark/60">
              Sugerencias de Raza populares en Colombia:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {COLOMBIAN_BREEDS.filter(chip => chip.type === petType).map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setBreed(chip.breedKey);
                    setSelectedConcern("");
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-wide border transition-all cursor-pointer ${
                    breed.toLowerCase() === chip.breedKey.toLowerCase()
                      ? "bg-vibrant-red text-white border-vibrant-red"
                      : "bg-vibrant-bg hover:bg-vibrant-dark/5 text-vibrant-dark/80 border-vibrant-dark/15"
                  }`}
                >
                  {chip.name}
                </button>
              ))}
            </div>
          </div>

          {/* Concern triggers */}
          <div className="space-y-2 pt-2 border-t-2 border-vibrant-dark/5">
            <span className="block text-[11px] font-black uppercase tracking-wider text-vibrant-dark/70 mb-1">
              Inquietudes Comunes IA
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {PRESET_CONCERNS.map((concern) => (
                <button
                  key={concern.id}
                  id={`ai-preset-${concern.id}`}
                  type="button"
                  onClick={() => handleApplyConcern(concern.id, concern.question)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs leading-normal font-sans border-2 transition-all cursor-pointer block font-semibold ${
                    selectedConcern === concern.id
                      ? "bg-vibrant-red text-white border-vibrant-red font-black"
                      : "bg-white text-vibrant-dark border-vibrant-dark/10 hover:border-vibrant-dark/20 hover:bg-vibrant-bg"
                  }`}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Haircut catalog card */}
        <div className="bg-white p-6 rounded-[32px] border-2 border-vibrant-dark/15 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b-2 border-vibrant-dark/5 pb-2.5">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-vibrant-turquoise uppercase font-black block mb-0.5">
                Tendencias de Estilismo
              </span>
              <h3 className="text-sm font-black text-vibrant-dark tracking-tight flex items-center gap-1.5">
                ✂️ Cortes para {breed || (petType === "dog" ? "Perros" : "Gatos")}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-vibrant-yellow text-vibrant-dark text-[9px] uppercase font-mono font-black tracking-wider">
              {getBreedKey() === "universal" ? "Universales" : "Exclusivos"}
            </span>
          </div>

          <p className="text-vibrant-dark/75 text-[11px] font-semibold leading-normal">
            Haz clic en tu corte preferido con fotos reales para seleccionarlo y agregarlo automáticamente a tu cita de estética:
          </p>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {BREED_CUTS[getBreedKey()].map((cut) => {
              const isSelected = selectedCutId === cut.id;
              return (
                <div 
                  key={cut.id}
                  className={`border-2 rounded-2xl p-3 flex gap-3 transition-all ${
                    isSelected 
                      ? "border-vibrant-red bg-vibrant-red/5 ring-3 ring-vibrant-yellow/45 scale-[1.01]" 
                      : "border-vibrant-dark/10 hover:border-vibrant-dark/15 bg-white"
                  }`}
                >
                  <img 
                    src={cut.image} 
                    alt={cut.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-vibrant-dark/10 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-sans font-black text-xs text-vibrant-dark leading-tight line-clamp-1">{cut.name}</span>
                        <span className="text-[8px] font-black uppercase bg-vibrant-bg text-vibrant-turquoise px-1 py-0.5 rounded border border-vibrant-dark/5 whitespace-nowrap shrink-0">{cut.tag}</span>
                      </div>
                      <p className="text-[10px] text-vibrant-dark/70 font-semibold line-clamp-2 leading-relaxed">{cut.description}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleSelectCut(cut)}
                      className={`w-full text-center py-1 mt-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-vibrant-dark text-white hover:bg-vibrant-red"
                      }`}
                    >
                      {isSelected ? "✓ Seleccionado para Cita" : "Elegir este Estilo ✂️"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic trigger card to match selected package */}
        <div className="bg-vibrant-dark text-white p-5 rounded-[32px] space-y-4 shadow-md border-b-4 border-black/35">
          <div className="flex gap-2 items-start">
            <div className="p-2 rounded-xl bg-vibrant-red/20 text-vibrant-red">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-black text-sm block tracking-tight text-white">¿Tienes un veredicto?</span>
              <p className="text-slate-300 text-xs font-semibold font-sans mt-0.5 leading-relaxed">
                Aplica la sugerencia de la IA directamente en nuestro cotizador de citas con un solo clic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1.5">
            <button
              id="shortcut-bath"
              onClick={() => triggerAutoSuggest("baño-premium")}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[11px] font-sans font-black text-slate-100 border border-white/10 text-left flex flex-col justify-between h-20 transition-all cursor-pointer"
            >
              <span>🫧 Baño Premium</span>
              <span className="text-vibrant-yellow font-black text-[10px] flex items-center gap-0.5">
                Ver cotización <ChevronRight className="w-3 h-3 text-vibrant-yellow" />
              </span>
            </button>
            <button
              id="shortcut-cut"
              onClick={() => triggerAutoSuggest("corte-estilo")}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[11px] font-sans font-black text-slate-100 border border-white/10 text-left flex flex-col justify-between h-20 transition-all cursor-pointer"
            >
              <span>✂️ Corte & Estilo</span>
              <span className="text-vibrant-yellow font-black text-[10px] flex items-center gap-0.5">
                Ver cotización <ChevronRight className="w-3 h-3 text-vibrant-yellow" />
              </span>
            </button>
            <button
              id="shortcut-spa"
              onClick={() => triggerAutoSuggest("spa-aromaterapia")}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[11px] font-sans font-black text-slate-100 border border-white/10 text-left flex flex-col justify-between h-20 transition-all cursor-pointer"
            >
              <span>🌸 Spa Relajante</span>
              <span className="text-vibrant-yellow font-black text-[10px] flex items-center gap-0.5">
                Ver cotización <ChevronRight className="w-3 h-3 text-vibrant-yellow" />
              </span>
            </button>
            <button
              id="shortcut-deslanado"
              onClick={() => triggerAutoSuggest("deslanado-profundo")}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[11px] font-sans font-black text-slate-100 border border-white/10 text-left flex flex-col justify-between h-20 transition-all cursor-pointer"
            >
              <span>🦁 Deslanado Especial</span>
              <span className="text-vibrant-yellow font-black text-[10px] flex items-center gap-0.5">
                Ver cotización <ChevronRight className="w-3 h-3 text-vibrant-yellow" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE CONVERSATION SCREEN */}
      <div className="lg:col-span-8 flex flex-col h-[520px] bg-white border-2 border-vibrant-dark/15 rounded-[32px] overflow-hidden shadow-sm">
        {/* Chat window Header */}
        <div className="bg-vibrant-bg border-b-2 border-vibrant-dark/10 px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-vibrant-dark text-white flex items-center justify-center relative flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-vibrant-yellow" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-ping" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-vibrant-dark block leading-tight">Advisor de Estética Canina IA</span>
              <span className="text-[10px] font-mono font-black text-vibrant-turquoise uppercase tracking-widest block mt-0.5">● Inteligencia Artificial</span>
            </div>
          </div>

          <button
            id="clear-chat-history"
            type="button"
            onClick={clearChat}
            className="p-2.5 rounded-xl text-vibrant-dark/50 hover:text-vibrant-red hover:bg-vibrant-red/10 transition-all cursor-pointer"
            title="Reiniciar asesoría"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat message flow lists */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-vibrant-bg/40">
          <AnimatePresence initial={false}>
            {history.map((msg, index) => {
              const isAI = msg.role === "model";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Small Avatar icon wrapper */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-md ${
                    isAI 
                      ? "bg-vibrant-dark text-white" 
                      : "bg-vibrant-turquoise text-white"
                  }`}>
                    {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble wrapper */}
                  <div className={`p-4 rounded-3xl font-sans text-xs sm:text-sm leading-normal shadow-sm relative ${
                    isAI 
                      ? "bg-white text-vibrant-dark rounded-tl-none border-2 border-vibrant-dark/10" 
                      : "bg-vibrant-turquoise text-white rounded-tr-none font-bold"
                  }`}>
                    {isAI ? (
                      <div className="space-y-1">
                        {formatAdvisorText(msg.text)}
                      </div>
                    ) : (
                      <p className="leading-relaxed leading-normal">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Chat Loading block */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 max-w-[85%] mr-auto"
              >
                <div className="w-8 h-8 rounded-lg bg-vibrant-dark text-white flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 animate-spin text-vibrant-yellow" />
                </div>
                <div className="bg-white border-2 border-vibrant-dark/10 p-4 rounded-3xl rounded-tl-none shadow-sm flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 min-w-[120px]">
                    <span className="w-2.5 h-2.5 bg-vibrant-red rounded-full animate-bounce delay-75" />
                    <span className="w-2.5 h-2.5 bg-vibrant-red rounded-full animate-bounce delay-150" />
                    <span className="w-2.5 h-2.5 bg-vibrant-red rounded-full animate-bounce delay-225" />
                  </div>
                  <span className="text-[10px] font-black font-sans text-vibrant-dark/50 uppercase tracking-widest animate-pulse">
                    {loadingMessages[loadingStep]}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Form bottom query Bar input */}
        <form onSubmit={handleSendMessage} className="bg-vibrant-bg border-t-2 border-vibrant-dark/10 p-4 flex gap-2 items-center">
          <input
            id="chat-user-advise-query"
            type="text"
            placeholder={breed ? `Pregunta sobre el cuidado de tu ${breed}...` : "Escribe la raza y haz tu pregunta o selecciona un preset..."}
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-vibrant-dark/10 font-sans text-xs sm:text-sm focus:outline-none focus:border-vibrant-dark bg-white disabled:bg-slate-100/50 font-semibold text-vibrant-dark"
          />
          <button
            id="submit-query-to-advisor"
            type="submit"
            disabled={loading || !userQuery.trim()}
            className="p-3.5 rounded-2xl bg-vibrant-dark hover:bg-slate-800 active:scale-95 text-white disabled:bg-slate-200 disabled:scale-100 transition-all flex justify-center items-center cursor-pointer"
          >
            <Send className="w-4 h-4 text-white shrink-0 fill-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
