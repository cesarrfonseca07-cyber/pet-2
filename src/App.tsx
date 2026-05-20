import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Header from "./components/Header";
import GroomingCalculator, { getFutureDate } from "./components/GroomingCalculator";
import GroomingAgenda from "./components/GroomingAgenda";
import AiAdvisor from "./components/AiAdvisor";
import FaqSection from "./components/FaqSection";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import { SERVICES, SIZE_FACTORS, MODEL_PETS } from "./data";
import { BookingState, PetType } from "./types";
import { 
  Bath, 
  Scissors, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Star, 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  Activity, 
  ChevronRight, 
  Award,
  Lock,
  X
} from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [activeServiceTab, setActiveServiceTab] = useState<string>("baño-premium");
  const [calculatorPreset, setCalculatorPreset] = useState<Partial<BookingState>>({
    petType: "dog",
    petName: "",
    petBreed: "",
    petSize: "small",
    selectedServices: ["baño-premium"]
  });

  const [lastSubmission, setLastSubmission] = useState<BookingState | null>(null);
  const [isAgendaOpen, setIsAgendaOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [bookingsCount, setBookingsCount] = useState<number>(3);
  const [returnSimDate, setReturnSimDate] = useState<string>(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${mm}-${dd}`;
  });

  const refreshBookingsCount = () => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookingsCount(data.length);
        }
      })
      .catch(err => console.error("Error updating bookings count:", err));
  };

  useEffect(() => {
    refreshBookingsCount();
    window.addEventListener("bookings-changed", refreshBookingsCount);
    return () => window.removeEventListener("bookings-changed", refreshBookingsCount);
  }, []);

  // Monitor scrolling to highlight correct headers matching standard categories
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "calculator", "ai-advisor", "faqs"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -85; // accounts for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleApplyServicePreset = (serviceId: string) => {
    setCalculatorPreset({
      petType: "dog",
      petName: "",
      petBreed: "",
      petSize: "small",
      selectedServices: [serviceId]
    });
    scrollToSection("calculator");
  };

  const handleAiSuggestPreset = (type: PetType, breed: string, services: string[], extraNotes?: string) => {
    setCalculatorPreset({
      petType: type,
      petName: "Mi Peludo",
      petBreed: breed,
      petSize: "small",
      selectedServices: services,
      notes: extraNotes || ""
    });
    scrollToSection("calculator");
  };

  const handleBookingSubmitted = (booking: BookingState) => {
    setLastSubmission(booking);
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(val);
  };
  return (
    <div className="min-h-screen bg-pet-pattern text-vibrant-dark selection:bg-vibrant-red selection:text-white antialiased">
      {/* Dynamic Header navigation */}
      <Header onScrollToElement={scrollToSection} activeSection={activeSection} />
      {/* SECTION 1: HERO CONTAINER */}
      <section id="home" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
        {/* Playful circular blurred shapes behind elements */}
        <div className="absolute top-20 left-[-10%] w-[35%] h-[35%] rounded-full bg-vibrant-yellow/40 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-[-10%] w-[40%] h-[40%] rounded-full bg-vibrant-red/20 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Hero text information */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-5 text-center lg:text-left">
              {/* Highlight Tag */}
              <div className="inline-flex items-center gap-1.5 bg-vibrant-red/10 text-vibrant-red px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black border border-vibrant-red/20 uppercase tracking-wider shadow-sm">
                <Truck className="w-3 h-3 animate-bounce text-vibrant-red" />
                Estética Móvil Premium a Domicilio
              </div>

              <div className="space-y-3">
                <h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-vibrant-dark tracking-tight leading-[1.15]">
                  Estética de lujo para tu mascota, <span className="bg-gradient-to-r from-vibrant-red to-amber-500 text-transparent bg-clip-text font-black">sin salir de casa</span>
                </h1>
                <p className="font-sans text-vibrant-dark/80 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                  Recogemos tu mascota en la puerta de tu casa o trabajo y te la devolvemos limpia, perfumada, libre de nudos y muy feliz. 💖 ¡Higiene profesional con el máximo amor!
                </p>
              </div>

              {/* High Contrast Banner showing pickup is 100% free */}
              <div className="bg-vibrant-yellow border-2 border-vibrant-dark/20 p-4 rounded-[22px] max-w-lg mx-auto lg:mx-0 flex items-center gap-3 shadow-md text-left transform -rotate-1 relative overflow-hidden group">
                <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/30 rounded-full blur-xl animate-none"></div>
                <div className="bg-vibrant-dark text-white p-2.5 rounded-xl shadow-md flex-shrink-0">
                  <Truck className="w-4.5 h-4.5 text-vibrant-yellow" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-vibrant-brown uppercase tracking-widest block font-mono">Beneficio Exclusivo</span>
                  <span className="text-xs sm:text-sm font-black text-vibrant-dark block mt-0.5 leading-tight">
                    Recogida y retorno ¡TOTALMENTE GRATIS!
                  </span>
                  <p className="text-[10px] text-vibrant-brown font-semibold leading-normal font-sans mt-0.5">
                    Servicio de recogida gratuito en todo el perímetro urbano consolidado.
                  </p>
                </div>
              </div>

              {/* Core Call to Actions */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-1">
                <button
                  id="hero-go-calculator"
                  onClick={() => scrollToSection("calculator")}
                  className="bg-vibrant-dark hover:bg-slate-800 text-white font-black py-3 px-6 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-vibrant-yellow" />
                  Cotizar mi Servicio
                </button>
                <button
                  id="hero-go-advisor"
                  onClick={() => scrollToSection("ai-advisor")}
                  className="bg-vibrant-turquoise hover:bg-vibrant-turquoise-hover text-white font-black py-3 px-6 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Asesoría de Estilismo IA
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Service assurances ticks list */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 max-w-md mx-auto lg:mx-0 pt-3 border-t-2 border-vibrant-dark/10 text-left font-bold text-[11px] text-vibrant-dark/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  Shampoos Orgánicos
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  Estilistas Certificados
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  Vehículos Desinfectados
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  Etológica Co-Amigable
                </div>
              </div>
            </div>

            {/* Hero Graphical Representation right */}
            <div className="lg:col-span-12 xl:col-span-5 relative mt-4 lg:mt-0 flex justify-center items-center">
              {/* Premium Hero Circle Mask Frame */}
              <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full overflow-hidden border-4 border-white shadow-xl group select-none">
                <img 
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800" 
                  alt="Perro feliz en Studio Pet" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Embedded badge over photo */}
                <div className="absolute top-4 left-4 bg-vibrant-dark/95 backdrop-blur-md text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 z-10 border border-white/10">
                  <Star className="w-3 h-3 fill-vibrant-yellow text-vibrant-yellow" />
                  <span className="font-mono text-[9px] font-black tracking-wider uppercase">Servicio Premium 5★</span>
                </div>
              </div>

              {/* Floating review card visual decoration */}
              <div className="absolute bottom-4 -left-2 sm:-left-6 bg-white p-4 rounded-[22px] shadow-lg border-2 border-vibrant-dark/10 max-w-[210px] sm:max-w-xs flex gap-2.5 animate-none">
                <span className="text-2xl text-vibrant-red">💖</span>
                <div>
                  <div className="flex gap-0.5 text-vibrant-yellow mb-0.5">
                    <Star className="w-2.5 h-2.5 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-2.5 h-2.5 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-2.5 h-2.5 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-2.5 h-2.5 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-2.5 h-2.5 fill-vibrant-red text-vibrant-red" />
                  </div>
                  <p className="text-[10px] text-vibrant-dark leading-tight font-sans italic font-bold">
                    "Volvió oliendo delicioso y súper tranquila. El servicio gratis es genial."
                  </p>
                  <span className="text-[8px] text-vibrant-brown block mt-0.5 font-mono uppercase font-black tracking-wider">— Mamá de Milka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICES BREAKDOWN DISPLAY */}
      <section id="services" className="py-6 sm:py-8 bg-white/95 border-y-2 border-vibrant-dark/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header layout */}
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">
              Tratamientos VIP Diseñados para ellos
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-vibrant-dark tracking-tight leading-tight">
              Nuestra Carta de Servicios & Spa
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-xs sm:text-sm font-semibold">
              Higiene, estilismo y restauración para el manto utilizando productos orgánicos de alta gama.
            </p>
          </div>

          {/* Tabs bar */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 max-w-4xl mx-auto">
            {SERVICES.map((srv) => {
              const isSelected = activeServiceTab === srv.id;
              return (
                <button
                  key={srv.id}
                  id={`service-tab-trigger-${srv.id}`}
                  type="button"
                  onClick={() => setActiveServiceTab(srv.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
                    isSelected
                      ? "bg-vibrant-dark text-white border-vibrant-dark shadow"
                      : "bg-vibrant-bg text-vibrant-dark/80 border-vibrant-dark/10 hover:border-vibrant-dark/20"
                  }`}
                >
                  <span className="text-xs sm:text-sm">
                    {srv.id === "baño-premium" && "🚿"}
                    {srv.id === "corte-estilo" && "✂️"}
                    {srv.id === "spa-aromaterapia" && "🌸"}
                    {srv.id === "deslanado-profundo" && "🪮"}
                  </span>
                  <span>{srv.name.split(" ")[0]} {srv.name.split(" ")[1] || ""}</span>
                </button>
              );
            })}
          </div>

          {/* Active plan card details */}
          {(() => {
            const activeSrv = SERVICES.find(s => s.id === activeServiceTab) || SERVICES[0];
            return (
              <div 
                id="active-service-details-panel"
                className="bg-vibrant-bg rounded-[24px] border-2 border-vibrant-dark/15 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto shadow-md hover:shadow-lg transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
              >
                {/* Column 1: Details */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="p-2.5 rounded-xl bg-vibrant-red/10 text-vibrant-red border border-vibrant-red/25 inline-flex">
                        {activeSrv.id === "baño-premium" && <Bath className="w-5 h-5" />}
                        {activeSrv.id === "corte-estilo" && <Scissors className="w-5 h-5" />}
                        {activeSrv.id === "spa-aromaterapia" && <Sparkles className="w-5 h-5" />}
                        {activeSrv.id === "deslanado-profundo" && <Award className="w-5 h-5" />}
                      </div>
                      <span className="font-mono text-[9px] text-vibrant-brown bg-white border border-vibrant-dark/10 rounded-full px-2.5 py-1 flex items-center gap-1 font-bold">
                        <Clock className="w-3.5 h-3.5 text-vibrant-red" /> {activeSrv.duration}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-sans font-black text-lg text-vibrant-dark leading-tight">{activeSrv.name}</h3>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-[10px] text-vibrant-dark/60 font-black">Desde</span>
                        <span className="text-xl font-black font-sans text-vibrant-red">{formatCOP(activeSrv.basePrice)}</span>
                        <span className="text-[9px] text-vibrant-dark/60 font-mono font-bold">*Mascotas Chicas</span>
                      </div>
                      <p className="text-xs text-vibrant-dark/80 mt-2 font-sans font-semibold leading-relaxed">{activeSrv.description}</p>
                    </div>
                  </div>

                  <button
                    id={`apply-preset-btn-${activeSrv.id}`}
                    type="button"
                    onClick={() => handleApplyServicePreset(activeSrv.id)}
                    className="w-full text-center py-2.5 rounded-xl border border-vibrant-dark/20 bg-vibrant-dark hover:bg-slate-800 text-white text-[11px] font-black transition-all cursor-pointer shadow hover:shadow-md active:scale-95"
                  >
                    Cotizar este Plan Especial en el Formulario
                  </button>
                </div>

                {/* Column 2: Specific treats and checklist */}
                <div className="md:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-vibrant-dark/10 flex flex-col justify-center">
                  <span className="text-[10px] font-mono tracking-widest text-vibrant-turquoise uppercase font-black block mb-3 pb-1 border-b border-vibrant-dark/10">
                    Tratamientos & Mimos Incluidos en {activeSrv.name.split(" ")[0]}:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSrv.features.map((f, fIdx) => (
                      <div key={fIdx} className="text-vibrant-dark/85 font-sans text-[11px] leading-snug flex items-start gap-1.5 p-1 hover:bg-vibrant-bg/40 rounded-lg transition-colors">
                        <div className="w-4 h-4 rounded-full bg-vibrant-turquoise/15 text-vibrant-turquoise flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="font-semibold">{f.replace(/^[^\sA-Za-zñáéíóú]+/g, "").trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* SIMULADOR / ALERTA DE RETORNO INTERACTIVO */}
          <div id="simulador-retorno-container" className="mt-8 p-4 sm:p-5 rounded-[24px] bg-emerald-500/10 border-2 border-emerald-500/20 max-w-5xl mx-auto shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 space-y-2">
              <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black font-mono tracking-wider uppercase rounded-full inline-block">
                🕒 Alerta de Retorno Automática
              </span>
              <h3 className="font-sans font-black text-lg text-vibrant-dark tracking-tight">
                Planifica tus Sesiones de Cuidado Higiénico (Retorno cada 60 días)
              </h3>
              <p className="text-[11px] text-vibrant-dark/85 font-semibold leading-relaxed">
                El manto acumula grasa and nudos. El periodo ideal recomendado en Bogotá/Colombia es de <strong>2 meses</strong> para asegurar una piel sana and oídos limpios.
              </p>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-500/10 text-[11px] text-vibrant-dark/75 leading-normal font-sans font-semibold">
                <strong>¿Cómo funciona?</strong> Pon la fecha de hoy y se simulará la recomendación de retorno automática.
              </div>
            </div>

            <div className="md:col-span-5 bg-white p-4 rounded-2xl border-2 border-emerald-500/15 space-y-3">
              <div className="space-y-1 font-bold text-xs text-vibrant-dark">
                <label className="block text-[10px] font-black uppercase tracking-wider text-vibrant-dark/65">
                  Fecha de tu última cita o de hoy:
                </label>
                <input
                  type="date"
                  value={returnSimDate}
                  onChange={(e) => setReturnSimDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-vibrant-dark/15 font-sans text-xs focus:outline-none focus:border-emerald-500 bg-vibrant-bg/40 font-semibold text-vibrant-dark"
                />
              </div>

              <div className="bg-emerald-50 py-2.5 px-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-[9px] font-mono font-black uppercase text-emerald-800 tracking-wider block mb-0.5">📅 Recomendación Próxima Cita</span>
                <span className="text-xs sm:text-xs font-black text-slate-800 font-sans">
                  {getFutureDate(returnSimDate).formatted}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const fut = getFutureDate(returnSimDate);
                  setCalculatorPreset(prev => ({
                    ...prev,
                    date: fut.raw
                  }));
                  const el = document.getElementById("calculator");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full text-center py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-white shrink-0" />
                Agendar con Fecha Sugerida
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BEFORE / AFTER REVEAL SLIDER */}
      <section className="py-6 sm:py-8 border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">Galería Interactiva</span>
            <h2 className="font-sans font-black text-2xl text-vibrant-dark tracking-tight">El Resultado de Studio Pet</h2>
            <p className="text-vibrant-dark/70 font-sans text-xs font-semibold">
              Tratamientos diseñados para devolverle el brillo al manto y asegurar una piel saludable y súper hidratada.
            </p>
          </div>

          <BeforeAfterSlider />
        </div>
      </section>

      {/* SECCIÓN NUEVA: MASCOTAS MODELO / EMBAJADORES */}
      <section id="mascotas-modelos" className="py-8 sm:py-10 bg-vibrant-bg/65 border-b-2 border-vibrant-dark/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">Clientes de la Semana</span>
            <h2 className="font-sans font-black text-2xl text-vibrant-dark tracking-tight">Nuestras Mascotas Consentidas</h2>
            <p className="text-vibrant-dark/70 font-sans text-xs font-semibold">
              Conoce a algunos de nuestros queridos amigos de cuatro patas que lucen su peinado y cuidado de Studio Pet.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto justify-center">
            {MODEL_PETS.map((pet, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-[24px] p-4 border-2 border-vibrant-dark/15 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Pet Image Frame with rounded borders and highlight */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-4 border-vibrant-bg/85 shadow-inner group-hover:scale-105 transition-all duration-500">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Absolute Badge styling */}
                  <span className="absolute bottom-1 right-1 bg-vibrant-yellow text-vibrant-dark text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border border-vibrant-dark/10 shadow-sm animate-pulse">
                    ✨
                  </span>
                </div>

                {/* Name underneath with Breed & Service details */}
                <div className="mt-3.5 space-y-1">
                  <h3 className="font-sans font-black text-sm text-vibrant-dark tracking-tight group-hover:text-vibrant-red transition-colors duration-150">
                    {pet.name}
                  </h3>
                  <div className="text-[9px] font-mono font-black text-vibrant-brown bg-vibrant-yellow/15 px-2 py-0.5 rounded-full inline-block border border-vibrant-yellow/15">
                    {pet.breed}
                  </div>
                  <p className="text-[10px] text-vibrant-dark/65 font-bold italic leading-tight pt-1">
                    "{pet.service}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PROCESS / HOW IT WORKS */}
      <section className="py-6 sm:py-8 bg-white/95 border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">Comodidad y Seguridad Total</span>
            <h2 className="font-sans font-black text-2xl text-vibrant-dark tracking-tight">Nuestro Procedimiento Puerta a Puerta</h2>
            <p className="text-vibrant-dark/70 font-sans text-xs font-semibold">
              Pensado al 100% en la conveniencia de los propietarios y en una experiencia libre de estrés o temores para tus peludos.
            </p>
          </div>

          {/* Timeline steps blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
            <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-vibrant-red/30 to-vibrant-yellow/80 -z-10" />
            
            <div className="text-center space-y-2 group">
              <div className="relative w-20 h-16 mx-auto transition-transform duration-300 group-hover:scale-105">
                {/* Toes */}
                <div className="absolute top-1 left-[10px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[24px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[43px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-1 left-[57px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                {/* Main Pad */}
                <div className="absolute bottom-[2px] left-[16px] w-[46px] h-[38px] bg-vibrant-red text-white rounded-t-xl rounded-b-[18px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-base">
                  1
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-sm font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Cotizas y Agendas</h3>
              <p className="text-vibrant-dark/70 text-[11px] font-semibold leading-relaxed max-w-[190px] mx-auto">
                Elige tu mascota y servicios en nuestro cotizador de abajo. La orden se envía directa y limpia a nuestro WhatsApp.
              </p>
            </div>

            <div className="text-center space-y-2 group">
              <div className="relative w-20 h-16 mx-auto transition-transform duration-300 group-hover:scale-105">
                {/* Toes */}
                <div className="absolute top-1 left-[10px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[24px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[43px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-1 left-[57px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                {/* Main Pad */}
                <div className="absolute bottom-[2px] left-[16px] w-[46px] h-[38px] bg-vibrant-red text-white rounded-t-xl rounded-b-[18px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-base">
                  2
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-sm font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Recogida Gratis</h3>
              <p className="text-vibrant-dark/70 text-[11px] font-semibold leading-relaxed max-w-[190px] mx-auto">
                Agendamos la ruta y recogemos a tu mascota en la puerta de tu casa en guacales de alta gama desinfectados.
              </p>
            </div>

            <div className="text-center space-y-2 group">
              <div className="relative w-20 h-16 mx-auto transition-transform duration-300 group-hover:scale-105">
                {/* Toes */}
                <div className="absolute top-1 left-[10px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[24px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[43px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-1 left-[57px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                {/* Main Pad */}
                <div className="absolute bottom-[2px] left-[16px] w-[46px] h-[38px] bg-vibrant-red text-white rounded-t-xl rounded-b-[18px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-base">
                  3
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-sm font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Estética & Mimos</h3>
              <p className="text-vibrant-dark/70 text-[11px] font-semibold leading-relaxed max-w-[190px] mx-auto">
                Consentimos a tu amigo con baño, masajes, cosmética veterinaria fina, limpieza profunda y corte de garras.
              </p>
            </div>

            <div className="text-center space-y-2 group">
              <div className="relative w-20 h-16 mx-auto transition-transform duration-300 group-hover:scale-105">
                {/* Toes */}
                <div className="absolute top-1 left-[10px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[24px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-0 left-[43px] w-[13px] h-[13px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                <div className="absolute top-1 left-[57px] w-[11px] h-[11px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm" />
                {/* Main Pad */}
                <div className="absolute bottom-[2px] left-[16px] w-[46px] h-[38px] bg-vibrant-red text-white rounded-t-xl rounded-b-[18px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-base">
                  4
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-sm font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Retorno Feliz</h3>
              <p className="text-vibrant-dark/70 text-[11px] font-semibold leading-relaxed max-w-[190px] mx-auto">
                Te lo regresamos en el tiempo acordado oliendo delicioso, súper limpio, dócil y luciendo un peinado fabuloso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AI ADVISOR */}
      <section id="ai-advisor" className="py-6 sm:py-8 border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">
              Dermatología y Estética Inteligente
            </span>
            <h2 className="font-sans font-black text-2xl text-vibrant-dark tracking-tight">
              Asesoría de Estilismo y Cuidado IA
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-xs font-semibold">
              ¿Tu mascota tiene piel sensible, enredos graves o muda masiva? Consulta a nuestro veterinario virtual y recibe planificaciones cosméticas ideales.
            </p>
          </div>

          <AiAdvisor onSuggestService={handleAiSuggestPreset} />
        </div>
      </section>

      {/* SECTION 6: SERVICE CALCULATOR */}
      <section id="calculator" className="py-6 sm:py-8 bg-vibrant-yellow/5 border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-dark/60 uppercase font-black block">
              Cotizador Inteligente 2026
            </span>
            <h2 className="font-sans font-black text-2xl text-vibrant-dark tracking-tight">
              Agenda tu Cita & Cotiza en Línea
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-xs font-semibold">
              Completa el formulario en sencillos pasos. El valor total se calcula en tiempo real para brindarte transparencia absoluta.
            </p>
          </div>

          {/* Core Booking Component wrapped with preset keys for dynamic reactivity */}
          <GroomingCalculator 
            key={JSON.stringify(calculatorPreset)} 
            initialState={calculatorPreset} 
            onBookingSubmitted={handleBookingSubmitted} 
          />
        </div>
      </section>

      {/* SECTION 7: FAQS ACCORDION */}
      <section id="faqs" className="py-6 sm:py-8 bg-white/95 border-b border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">
              Esclarecemos todas tus dudas
            </span>
            <h2 className="font-sans font-black text-2xl text-vibrant-dark tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-xs font-semibold">
              ¿Tienes dudas sobre los traslados, métodos de lavado o formas de pago? Despliega nuestras respuestas oficiales.
            </p>
          </div>

          <FaqSection />
        </div>
      </section>

      {/* FOOTER CONTAINER */}
      <footer className="bg-vibrant-dark text-white pt-10 pb-8 border-t-4 border-vibrant-red shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Main layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-12 lg:col-span-5 space-y-3">
              <span className="font-sans font-black text-xl text-white tracking-tight flex items-center gap-2">
                <div className="w-10 h-10 bg-vibrant-red rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 duration-150">
                  <span className="text-white text-xl">🐾</span>
                </div>
                StudioPet <span className="text-xs font-black px-2 py-0.5 rounded-full bg-vibrant-red/20 text-vibrant-red border border-vibrant-red/25">Domicilio</span>
              </span>
              <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-sm">
                Somos la primera estética y peluquería canina/felina premium que ofrece recogida y entrega de regreso totalmente gratuita, garantizando que tu mejor amigo regrese limpio, perfumado y muy feliz.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-black text-vibrant-yellow bg-vibrant-yellow/15 px-3 py-1.5 rounded-xl border border-vibrant-yellow/20 font-sans">
                  🚚 Recogida Urbana Gratis
                </span>
                <span className="text-xs font-black text-vibrant-turquoise bg-vibrant-turquoise/15 px-3 py-1.5 rounded-xl border border-vibrant-turquoise/20 font-sans">
                  🌿 pH Orgánico Balanceado
                </span>
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-4 space-y-4">
              <h4 className="font-black text-sm tracking-wider uppercase text-vibrant-red">Cobertura & Ubicación</h4>
              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-semibold">
                <p className="flex items-start gap-2 max-w-xs">
                  <MapPin className="w-5 h-5 text-vibrant-red shrink-0" />
                  <span>Servicio premium en todo el Perímetro Urbano y Barriadas del Área Metropolitana habitual de operaciones.</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-vibrant-turquoise shrink-0" />
                  <span>Lun - Sáb: 8:00 AM - 6:00 PM (Sujeto a reservas previas)</span>
                </p>
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-3 space-y-4">
              <h4 className="font-black text-sm tracking-wider uppercase text-vibrant-turquoise">Atención Directa</h4>
              <div className="space-y-3">
                <a 
                  href="https://wa.me/573123167203" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="flex items-center gap-2.5 bg-vibrant-turquoise hover:bg-vibrant-turquoise-hover text-white p-3.5 rounded-2xl transition-all cursor-pointer text-xs font-black shadow-lg text-center justify-center transform hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4 fill-white text-white font-medium" />
                  <span>WhatsApp: 312 316 7203</span>
                </a>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-bold">
                  *Las llamadas directas pueden no completarse si nuestros vehículos están en ruta. Por favor déjanos un mensaje por WhatsApp para agendarte al instante.
                </p>
              </div>
            </div>
          </div>

          {/* Underlay credits strip */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-sans font-bold">
            <p>© {new Date().getFullYear()} Studio Pet - Servicio a Domicilio. Todos los derechos reservados.</p>
            <div className="flex gap-4 text-vibrant-yellow/80 items-center">
              <span>Higiene con Amor 🐾</span>
              <span className="text-slate-700">•</span>
              <span>100% Pet Friendly</span>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(true)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px] underline block decoration-dashed"
              >
                🔐 Área Administrativa (Excel)
              </button>
            </div>
          </div>
        </div>
      </footer>

      <GroomingAgenda isOpen={isAgendaOpen} onClose={() => setIsAgendaOpen(false)} />

      {/* PIN Verification Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vibrant-dark/65 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full border-2 border-vibrant-dark/15 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setIsPinModalOpen(false);
                setPinInput("");
                setPinError("");
              }}
              className="absolute top-4 right-4 p-2 text-vibrant-dark/40 hover:text-vibrant-dark hover:bg-vibrant-bg rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-vibrant-red/10 text-vibrant-red rounded-full flex items-center justify-center mx-auto border border-vibrant-red/20 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-black text-lg text-vibrant-dark">Personal Autorizado</h3>
                <p className="text-xs text-vibrant-dark/60 font-semibold leading-relaxed">
                  Ingresa el código PIN de seguridad de Studio Pet para ingresar al módulo de control y descargar el reporte Excel.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pinInput === "studiopet" || pinInput === "admin" || pinInput === "1234") {
                    setIsPinModalOpen(false);
                    setPinInput("");
                    setPinError("");
                    setIsAgendaOpen(true);
                  } else {
                    setPinError("Código PIN incorrecto o desautorizado.");
                  }
                }}
                className="space-y-3 pt-2"
              >
                <div>
                  <input
                    type="password"
                    placeholder="Escribe PIN administrador..."
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError("");
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-center font-sans text-xs focus:outline-none bg-vibrant-bg/50 font-semibold text-vibrant-dark ${
                      pinError ? "border-vibrant-red" : "border-vibrant-dark/10 focus:border-vibrant-dark"
                    }`}
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-[11px] text-vibrant-red mt-1.5 font-bold">
                      ⚠️ {pinError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full text-center py-3 rounded-xl bg-vibrant-dark text-white text-xs font-black transition-all hover:bg-vibrant-dark/90 cursor-pointer shadow-md"
                >
                  Verificar Acceso
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
