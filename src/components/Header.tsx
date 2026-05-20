import { Phone, CheckCircle, Sparkles, Scissors, Clock } from "lucide-react";

interface HeaderProps {
  onScrollToElement: (id: string) => void;
  activeSection: string;
}

export default function Header({ onScrollToElement, activeSection }: HeaderProps) {
  return (
    <header id="app-header" className="sticky top-0 z-50 backdrop-blur-md bg-vibrant-bg/95 border-b-2 border-vibrant-dark/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onScrollToElement("home")}>
            <div className="w-12 h-12 bg-vibrant-red rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 transition-all hover:rotate-0 hover:scale-105 duration-200 shrink-0">
              <span className="text-white text-2xl font-black">🐾</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-vibrant-dark">
                Studio<span className="text-vibrant-red">Pet</span>
              </h1>
              <p className="text-[10px] font-mono tracking-wider text-vibrant-brown uppercase font-bold hidden sm:block">
                Estética Móvil Premium • Recogida Gratis
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-bold">
            <button
              id="nav-home"
              onClick={() => onScrollToElement("home")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSection === "home" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              Inicio
            </button>
            <button
              id="nav-services"
              onClick={() => onScrollToElement("services")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSection === "services" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              Servicios
            </button>
            <button
              id="nav-calculator"
              onClick={() => onScrollToElement("calculator")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeSection === "calculator" ? "text-vibrant-red scale-105 animate-pulse" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Cotizar Cita
            </button>
            <button
              id="nav-ai-advisor"
              onClick={() => onScrollToElement("ai-advisor")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeSection === "ai-advisor" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              <span className="bg-gradient-to-r from-violet-600 to-vibrant-red text-transparent bg-clip-text font-extrabold">
                Asesoría IA
              </span>
            </button>
            <button
              id="nav-faqs"
              onClick={() => onScrollToElement("faqs")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSection === "faqs" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              Preguntas
            </button>
          </nav>

          {/* Call to Action Button */}
          <div className="flex items-center gap-3">
            <a
              id="header-cta-whatsapp"
              href="https://wa.me/573123167203?text=Hola%20Studio%20Pet,%20me%20gustar%C3%ADa%20agendar%20un%20servicio%20de%20ba%C3%B1o/peluquer%C3%ADa%20para%20mi%20mascota%20%F0%9F%90%BE"
              target="_blank"
              referrerPolicy="no-referrer"
              className="relative inline-flex items-center gap-2 bg-vibrant-turquoise hover:bg-vibrant-turquoise-hover text-white px-5 py-3 rounded-full text-sm font-black shadow-xl hover:shadow-vibrant-turquoise/20 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span className="hidden xs:inline">Citas: 312 316 7203</span>
              <span className="xs:hidden">Escríbenos</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
