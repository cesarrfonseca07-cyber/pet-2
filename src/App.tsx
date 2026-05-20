import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Header from "./components/Header";
import GroomingCalculator, { getFutureDate } from "./components/GroomingCalculator";
import GroomingAgenda from "./components/GroomingAgenda";
import AiAdvisor from "./components/AiAdvisor";
import FaqSection from "./components/FaqSection";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import { SERVICES, SIZE_FACTORS } from "./data";
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
    <div className="min-h-screen bg-vibrant-bg text-vibrant-dark selection:bg-vibrant-red selection:text-white antialiased">
      {/* Dynamic Header navigation */}
      <Header onScrollToElement={scrollToSection} activeSection={activeSection} />

      {/* SECTION 1: HERO CONTAINER */}
      <section id="home" className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Playful circular blurred shapes behind elements */}
        <div className="absolute top-20 left-[-10%] w-[35%] h-[35%] rounded-full bg-vibrant-yellow/40 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-[-10%] w-[40%] h-[40%] rounded-full bg-vibrant-red/20 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero text information */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-8 text-center lg:text-left">
              {/* Highlight Tag */}
              <div className="inline-flex items-center gap-1.5 bg-vibrant-red/10 text-vibrant-red px-4 py-1.5 rounded-full text-xs font-black border border-vibrant-red/20 uppercase tracking-wider shadow-sm">
                <Truck className="w-3.5 h-3.5 animate-bounce text-vibrant-red" />
                Estética Móvil Canina y Felina a Domicilio
              </div>

              <div className="space-y-4">
                <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-vibrant-dark tracking-tight leading-[1.1]">
                  Estética de lujo para tu mascota, <span className="bg-gradient-to-r from-vibrant-red to-amber-500 text-transparent bg-clip-text font-black">sin salir de casa</span>
                </h1>
                <p className="font-sans text-vibrant-dark/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                  Recogemos tu mascota en la puerta de tu casa o trabajo y te la devolvemos limpia, perfumada, libre de nudos y muy feliz. 💖 
                  ¡Higiene profesional con el máximo amor y respeto!
                </p>
              </div>

              {/* High Contrast Banner showing pickup is 100% free */}
              <div className="bg-vibrant-yellow border-2 border-vibrant-dark/20 p-5 rounded-[28px] max-w-lg mx-auto lg:mx-0 flex items-center gap-3.5 shadow-md text-left transform -rotate-1 relative overflow-hidden group">
                <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
                <div className="bg-vibrant-dark text-white p-3 rounded-2xl shadow-md flex-shrink-0">
                  <Truck className="w-5 h-5 text-vibrant-yellow" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-vibrant-brown uppercase tracking-widest block font-mono">Beneficio Exclusivo</span>
                  <span className="text-sm font-black text-vibrant-dark block mt-0.5 leading-tight">
                    Recogida y retorno ¡TOTALMENTE GRATIS!
                  </span>
                  <p className="text-[11px] text-vibrant-brown font-semibold leading-normal font-sans mt-0.5">
                    Servicio incluido sin recargo logístico para toda el área urbana.
                  </p>
                </div>
              </div>

              {/* Core Call to Actions */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-go-calculator"
                  onClick={() => scrollToSection("calculator")}
                  className="bg-vibrant-dark hover:bg-slate-800 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-vibrant-yellow" />
                  Cotizar mi Servicio
                </button>
                <button
                  id="hero-go-advisor"
                  onClick={() => scrollToSection("ai-advisor")}
                  className="bg-vibrant-turquoise hover:bg-vibrant-turquoise-hover text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Asesoría de Estilismo IA
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Service assurances ticks list */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 max-w-md mx-auto lg:mx-0 pt-4 border-t-2 border-vibrant-dark/10 text-left font-bold text-xs text-vibrant-dark/80">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  Shampoos Orgánicos Hipoalergénicos
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  Estilistas Certificados Co-Amigables
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  Vehículos Asegurados & Desinfectados
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-vibrant-turquoise text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  Control Estrés Etológico
                </div>
              </div>
            </div>

            {/* Hero Graphical Representation right */}
            <div className="lg:col-span-12 xl:col-span-5 relative mt-8 lg:mt-0 flex justify-center items-center">
              {/* Premium Hero Circle Mask Frame */}
              <div className="relative w-[310px] h-[310px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden border-8 border-white shadow-2xl group select-none">
                <img 
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800" 
                  alt="Perro feliz en Studio Pet" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Embedded badge over photo */}
                <div className="absolute top-6 left-6 bg-vibrant-dark/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 z-10 border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-vibrant-yellow text-vibrant-yellow" />
                  <span className="font-mono text-[10px] font-black tracking-wider uppercase">Servicio Premium 5★</span>
                </div>
              </div>

              {/* Floating review card visual decoration */}
              <div className="absolute bottom-8 -left-4 sm:-left-12 bg-white p-5 rounded-[28px] shadow-xl border-2 border-vibrant-dark/10 max-w-xs flex gap-3.5 animate-bounce delay-1000">
                <span className="text-3xl text-vibrant-red">💖</span>
                <div>
                  <div className="flex gap-0.5 text-vibrant-yellow mb-1">
                    <Star className="w-3 h-3 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-3 h-3 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-3 h-3 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-3 h-3 fill-vibrant-red text-vibrant-red" />
                    <Star className="w-3 h-3 fill-vibrant-red text-vibrant-red" />
                  </div>
                  <p className="text-[11px] text-vibrant-dark leading-tight font-sans italic font-bold">
                    "Volvió oliendo delicioso y súper tranquila. El servicio de recogida gratis es una maravilla."
                  </p>
                  <span className="text-[9px] text-vibrant-brown block mt-1 font-mono uppercase font-black tracking-wider">— Mamá de Milka (Shih Tzu)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICES BREAKDOWN DISPLAY */}
      <section id="services" className="py-24 bg-white border-y-2 border-vibrant-dark/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header layout */}
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-vibrant-red uppercase font-black block">
              Tratamientos VIP Diseñados para ellos
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-vibrant-dark tracking-tight leading-tight">
              Nuestra Carta de Servicios & Spa
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-sm sm:text-base font-semibold">
              Higiene, estilismo y restauración profunda para el manto y la dermis utilizando únicamente productos naturales de alta gama.
            </p>
          </div>

          {/* Cards dynamic list block */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                id={`service-card-item-${srv.id}`}
                className="bg-vibrant-bg rounded-[32px] p-6 border-2 border-vibrant-dark/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Icon and duration header */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-vibrant-red/10 text-vibrant-red border border-vibrant-red/20">
                      {srv.id === "baño-premium" && <Bath className="w-5 h-5" />}
                      {srv.id === "corte-estilo" && <Scissors className="w-5 h-5" />}
                      {srv.id === "spa-aromaterapia" && <Sparkles className="w-5 h-5" />}
                      {srv.id === "deslanado-profundo" && <Award className="w-5 h-5" />}
                      {srv.id === "armonizacion-emocional" && <Heart className="w-5 h-5 fill-vibrant-red/15" />}
                    </div>
                    <span className="font-mono text-[10px] text-vibrant-brown bg-white border-2 border-vibrant-dark/10 rounded-full px-2.5 py-1 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-vibrant-red" /> {srv.duration}
                    </span>
                  </div>

                  {/* Pricing tag */}
                  <div>
                    <h3 className="font-sans font-black text-lg text-vibrant-dark leading-tight">{srv.name}</h3>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span className="text-xs text-vibrant-dark/60 font-black">Desde</span>
                      <span className="text-2xl font-black font-sans text-vibrant-red">{formatCOP(srv.basePrice)}</span>
                      <span className="text-[10px] text-vibrant-dark/60 font-mono font-bold">*Mascotas Chicas</span>
                    </div>
                    <p className="text-xs text-vibrant-dark/70 mt-2 font-sans font-medium leading-relaxed">{srv.description}</p>
                  </div>

                  {/* Features list bullet layout */}
                  <ul className="space-y-1.5 pt-4 border-t-2 border-vibrant-dark/5 text-left font-semibold">
                    {srv.features.slice(0, 5).map((f, fIdx) => (
                      <li key={fIdx} className="text-vibrant-dark/80 font-sans text-xs flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-vibrant-turquoise shrink-0 mt-0.5 stroke-[3]" />
                        <span>{f.replace(/^[^\sA-Za-zñáéíóú]+/g, "").trim()}</span>
                      </li>
                    ))}
                    {srv.features.length > 5 && (
                      <li className="text-[10px] text-vibrant-red font-black font-sans pt-1">
                        + {srv.features.length - 5} tratamientos adicionales ordinarios
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-vibrant-dark/5">
                  <button
                    id={`apply-preset-btn-${srv.id}`}
                    type="button"
                    onClick={() => handleApplyServicePreset(srv.id)}
                    className="w-full text-center py-2.5 rounded-xl border-2 border-vibrant-dark/10 bg-white hover:bg-vibrant-bg text-vibrant-dark text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
                  >
                    Cotizar este Plan
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sizing description informational banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-[36px] bg-vibrant-yellow border-2 border-vibrant-dark/20 flex flex-col md:flex-row gap-6 justify-between items-center max-w-5xl mx-auto shadow-md">
            <div className="flex gap-3.5 items-start">
              <div className="p-2.5 bg-vibrant-dark text-white rounded-full shrink-0">
                <Star className="w-5 h-5 fill-vibrant-yellow text-vibrant-yellow" />
              </div>
              <div>
                <span className="font-black font-sans text-vibrant-dark text-base block">Multiplicador por Categoría de Tamaño</span>
                <p className="text-xs text-vibrant-brown font-semibold mt-0.5 leading-relaxed max-w-xl">
                  Para perros medianos, grandes o gigantes, aplicamos un factor de escala justo sobre la tarifa base para cubrir el mayor uso de productos veterinarios orgánicos y el valioso tiempo de nuestros estilistas.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              {Object.keys(SIZE_FACTORS).map((key) => {
                const sz = SIZE_FACTORS[key as keyof typeof SIZE_FACTORS];
                return (
                  <span key={key} className="px-4 py-2 rounded-xl bg-white border-2 border-vibrant-dark/10 text-xs font-black font-mono text-vibrant-dark shadow-sm">
                    {sz.name}: {sz.factor}x
                  </span>
                );
              })}
            </div>
          </div>

          {/* SIMULADOR / ALERTA DE RETORNO INTERACTIVO */}
          <div id="simulador-retorno-container" className="mt-8 p-6 sm:p-8 rounded-[36px] bg-emerald-500/10 border-2 border-emerald-500/20 max-w-5xl mx-auto shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black font-mono tracking-wider uppercase rounded-full inline-block">
                🕒 Alerta de Retorno Automática
              </span>
              <h3 className="font-sans font-black text-xl text-vibrant-dark tracking-tight">
                Planifica tus Sesiones de Cuidado Higiénico (Retorno cada 60 días)
              </h3>
              <p className="text-xs text-vibrant-dark/85 font-semibold leading-relaxed">
                El manto de perros y gatos acumula grasa, subpelo muerto y nudos. El periodo ideal recomendado en Colombia es de <strong>2 meses (60 días)</strong> para asegurar una piel sana, libre de comezón, oídos limpios y uñas cortas.
              </p>
              <div className="bg-white/85 p-3.5 rounded-2xl border border-emerald-500/10 text-xs text-vibrant-dark/75 leading-normal font-sans font-semibold">
                <strong>¿Cómo funciona?</strong> Ingresa una fecha de servicio (por ejemplo, hoy) y nuestro sistema simulará la alerta de retorno óptima de tu mascota.
              </div>
            </div>

            <div className="md:col-span-5 bg-white p-6 rounded-3xl border-2 border-emerald-500/15 space-y-4">
              <div className="space-y-1.5 font-bold text-xs text-vibrant-dark">
                <label className="block text-[11px] font-black uppercase tracking-wider text-vibrant-dark/65">
                  Fecha de tu última cita o de hoy:
                </label>
                <input
                  type="date"
                  value={returnSimDate}
                  onChange={(e) => setReturnSimDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-vibrant-dark/15 font-sans text-xs focus:outline-none focus:border-emerald-500 bg-vibrant-bg/40 font-semibold text-vibrant-dark"
                />
              </div>

              <div className="bg-emerald-50 py-3.5 px-4 rounded-2xl border border-emerald-200 text-center">
                <span className="text-[10px] font-mono font-black uppercase text-emerald-800 tracking-wider block mb-1">📅 Recomendación Próxima Cita</span>
                <span className="text-[13px] sm:text-sm font-black text-slate-800 font-sans">
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
                className="w-full text-center py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-white shrink-0" />
                Agendar con Fecha Sugerida
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BEFORE / AFTER REVEAL SLIDER */}
      <section className="py-24 bg-vibrant-bg border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-vibrant-red uppercase font-black block">Galería Interactiva</span>
            <h2 className="font-sans font-black text-3xl text-vibrant-dark tracking-tight">El Resultado Profesional de Studio Pet</h2>
            <p className="text-vibrant-dark/70 font-sans text-sm font-semibold">
              Tratamientos diseñados para devolverle el brillo al manto, deslanar de forma efectiva y asegurar una piel saludable y súper hidratada.
            </p>
          </div>

          <BeforeAfterSlider />
        </div>
      </section>

      {/* SECTION 4: PROCESS / HOW IT WORKS */}
      <section className="py-24 bg-white border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-vibrant-red uppercase font-black block">Comodidad y Seguridad Total</span>
            <h2 className="font-sans font-black text-3xl text-vibrant-dark tracking-tight">Nuestro Procedimiento Puerta a Puerta</h2>
            <p className="text-vibrant-dark/70 font-sans text-sm font-semibold">
              Pensado al 100% en la conveniencia de los propietarios y en una experiencia libre de estrés o temores para tus peludos.
            </p>
          </div>

          {/* Timeline steps blocks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-vibrant-red/30 to-vibrant-yellow/80 -z-10" />
            
            <div className="text-center space-y-4 group">
              <div className="relative w-24 h-20 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {/* Toes */}
                <div className="absolute top-2 left-[12px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                <div className="absolute top-0 left-[29px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-0 left-[51px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-2 left-[70px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                {/* Main Pad */}
                <div className="absolute bottom-[4px] left-[20px] w-[56px] h-[48px] bg-vibrant-red text-white rounded-t-2xl rounded-b-[22px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-xl transition-transform duration-300 group-hover:scale-105">
                  1
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-base font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Cotizas y Agendas</h3>
              <p className="text-vibrant-dark/70 text-xs font-semibold leading-relaxed max-w-[210px] mx-auto">
                Elegir tu mascota y servicios en nuestro cotizador de abajo. La orden se envía directa y limpia a nuestro equipo por WhatsApp.
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="relative w-24 h-20 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                {/* Toes */}
                <div className="absolute top-2 left-[12px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                <div className="absolute top-0 left-[29px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-0 left-[51px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-2 left-[70px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                {/* Main Pad */}
                <div className="absolute bottom-[4px] left-[20px] w-[56px] h-[48px] bg-vibrant-red text-white rounded-t-2xl rounded-b-[22px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-xl transition-transform duration-300 group-hover:scale-105">
                  2
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-base font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Recogida Gratis</h3>
              <p className="text-vibrant-dark/70 text-xs font-semibold leading-relaxed max-w-[210px] mx-auto">
                Agendamos la ruta y recogemos a tu mascota en la puerta de tu casa o lugar de labor en guacales de alta gama desinfectados.
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="relative w-24 h-20 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {/* Toes */}
                <div className="absolute top-2 left-[12px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                <div className="absolute top-0 left-[29px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-0 left-[51px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-2 left-[70px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                {/* Main Pad */}
                <div className="absolute bottom-[4px] left-[20px] w-[56px] h-[48px] bg-vibrant-red text-white rounded-t-2xl rounded-b-[22px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-xl transition-transform duration-300 group-hover:scale-105">
                  3
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-base font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Estética & Mimos</h3>
              <p className="text-vibrant-dark/70 text-xs font-semibold leading-relaxed max-w-[210px] mx-auto">
                Consentimos a tu amigo con baño, masajes, cosmetología veterinaria fina, limpieza profunda y corte fino de garras y pelo.
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="relative w-24 h-20 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                {/* Toes */}
                <div className="absolute top-2 left-[12px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                <div className="absolute top-0 left-[29px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-0 left-[51px] w-[16px] h-[16px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5" />
                <div className="absolute top-2 left-[70px] w-[14px] h-[14px] bg-vibrant-red rounded-full border border-vibrant-dark/15 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                {/* Main Pad */}
                <div className="absolute bottom-[4px] left-[20px] w-[56px] h-[48px] bg-vibrant-red text-white rounded-t-2xl rounded-b-[22px] border-2 border-vibrant-dark/15 shadow-md flex items-center justify-center font-sans font-black text-xl transition-transform duration-300 group-hover:scale-105">
                  4
                </div>
              </div>
              <h3 className="font-black text-vibrant-dark text-base font-sans leading-snug group-hover:text-vibrant-red transition-colors duration-200">Retorno Feliz</h3>
              <p className="text-vibrant-dark/70 text-xs font-semibold leading-relaxed max-w-[210px] mx-auto">
                Te lo regresamos en el tiempo acordado oliendo delicioso, hiper limpio, dócil y luciendo un peinado fabuloso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AI ADVISOR */}
      <section id="ai-advisor" className="py-24 bg-vibrant-bg border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-vibrant-red uppercase font-black block">
              Dermatología y Estética Inteligente
            </span>
            <h2 className="font-sans font-black text-3xl text-vibrant-dark tracking-tight">
              Asesoría de Estilismo y Cuidado IA
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-sm font-semibold">
              ¿Tu mascota tiene piel sensible, caspa, enredos graves o muda masiva de pelo? Consulta a nuestro veterinario virtual senior y recibe planificaciones cosméticas ideales.
            </p>
          </div>

          <AiAdvisor onSuggestService={handleAiSuggestPreset} />
        </div>
      </section>

      {/* SECTION 6: SERVICE CALCULATOR */}
      <section id="calculator" className="py-24 bg-vibrant-yellow/15 border-b-2 border-vibrant-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-vibrant-dark/60 uppercase font-black block">
              Cotizador Inteligente 2026
            </span>
            <h2 className="font-sans font-black text-3xl text-vibrant-dark tracking-tight">
              Agenda tu Cita & Cotiza en Línea
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-sm font-semibold">
              Completa el formulario en 4 sencillos pasos. El valor total se calcula en tiempo real para brindarte transparencia absoluta.
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
      <section id="faqs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-vibrant-red uppercase font-black block">
              Esclarecemos todas tus dudas
            </span>
            <h2 className="font-sans font-black text-3xl text-vibrant-dark tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-vibrant-dark/70 font-sans text-sm font-semibold">
              ¿Tienes dudas sobre los traslados, métodos de lavado, adoctrinamiento o formas de pago? Despliega nuestras respuestas oficiales.
            </p>
          </div>

          <FaqSection />
        </div>
      </section>

      {/* FOOTER CONTAINER */}
      <footer className="bg-vibrant-dark text-white pt-16 pb-12 border-t-4 border-vibrant-red shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-12 lg:col-span-5 space-y-4">
              <span className="font-sans font-black text-2xl text-white tracking-tight flex items-center gap-2">
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
