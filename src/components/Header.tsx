import { useState } from "react";
import { Phone, CheckCircle, Sparkles, Scissors, Clock, Menu, X } from "lucide-react";

interface HeaderProps {
  onScrollToElement: (id: string) => void;
  activeSection: string;
}

export default function Header({ onScrollToElement, activeSection }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (id: string) => {
    onScrollToElement(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 backdrop-blur-md bg-vibrant-bg/95 border-b-2 border-vibrant-dark/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-vibrant-red rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 transition-all hover:rotate-0 hover:scale-105 duration-200 shrink-0">
              <span className="text-white text-xl sm:text-2xl font-black">🐾</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-vibrant-dark leading-tight">
                Studio<span className="text-vibrant-red">Pet</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] font-mono tracking-wider text-vibrant-brown uppercase font-bold hidden xs:block sm:block">
                Estética Móvil Premium • Recogida Gratis
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-bold">
            <button
              id="nav-home"
              onClick={() => handleNavClick("home")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSection === "home" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              Inicio
            </button>
            <button
              id="nav-services"
              onClick={() => handleNavClick("services")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSection === "services" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              Servicios
            </button>
            <button
              id="nav-calculator"
              onClick={() => handleNavClick("calculator")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeSection === "calculator" ? "text-vibrant-red scale-105 animate-pulse" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Cotizar Cita
            </button>
            <button
              id="nav-ai-advisor"
              onClick={() => handleNavClick("ai-advisor")}
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
              onClick={() => handleNavClick("faqs")}
              className={`font-sans text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSection === "faqs" ? "text-vibrant-red scale-105" : "text-vibrant-dark hover:text-vibrant-red"
              }`}
            >
              Preguntas
            </button>
          </nav>

          {/* Action Button & Mobile Burger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              id="header-cta-whatsapp"
              href="https://wa.me/573123167203?text=Hola%20Studio%20Pet,%20me%20gustar%C3%ADa%20agendar%20un%20servicio%20de%20ba%C3%B1o/peluquer%C3%ADa%20para%20mi%20mascota%20%F0%9F%90%BE"
              target="_blank"
              referrerPolicy="no-referrer"
              className="relative inline-flex items-center gap-1.5 sm:gap-2 bg-vibrant-turquoise hover:bg-vibrant-turquoise-hover text-white px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-black shadow-lg hover:shadow-vibrant-turquoise/20 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span className="hidden min-[480px]:inline">Citas: 312 316 7203</span>
              <span className="min-[480px]:hidden">Reservar</span>
            </a>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl border-2 border-vibrant-dark/15 text-vibrant-dark bg-white hover:bg-vibrant-bg hover:border-vibrant-dark/30 transition-all duration-200 lg:hidden shrink-0 cursor-pointer"
              aria-label="Abrir Menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-vibrant-dark/10 bg-vibrant-bg/95 backdrop-blur-md px-4 py-6 space-y-4 font-sans font-black shadow-xl animation-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleNavClick("home")}
              className={`p-3.5 text-center text-xs font-black rounded-2xl border-2 transition-all ${
                activeSection === "home"
                  ? "bg-vibrant-red text-white border-vibrant-red shadow-sm"
                  : "bg-white text-vibrant-dark border-vibrant-dark/10 hover:border-vibrant-dark/20"
              }`}
            >
              🐾 Inicio
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("services")}
              className={`p-3.5 text-center text-xs font-black rounded-2xl border-2 transition-all ${
                activeSection === "services"
                  ? "bg-vibrant-red text-white border-vibrant-red shadow-sm"
                  : "bg-white text-vibrant-dark border-vibrant-dark/10 hover:border-vibrant-dark/20"
              }`}
            >
              💇 Servicios & Spa
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("calculator")}
              className={`p-3.5 text-center text-xs font-black rounded-2xl border-2 transition-all col-span-2 flex items-center justify-center gap-1.5 ${
                activeSection === "calculator"
                  ? "bg-vibrant-red text-white border-vibrant-red shadow-sm animate-pulse"
                  : "bg-vibrant-yellow text-vibrant-dark border-vibrant-dark/20 hover:bg-vibrant-yellow/90"
              }`}
            >
              <Sparkles className="w-4 h-4 fill-vibrant-dark/10 text-vibrant-dark" />
              Cotizar & Agendar Cita
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("ai-advisor")}
              className={`p-3.5 text-center text-xs font-black rounded-2xl border-2 transition-all col-span-2 flex items-center justify-center gap-1.5 ${
                activeSection === "ai-advisor"
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-white text-vibrant-dark border-vibrant-dark/10 hover:border-vibrant-dark/20"
              }`}
            >
              ✨ Dermatología & Asesoría IA
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("faqs")}
              className={`p-3.5 text-center text-xs font-black rounded-2xl border-2 transition-all col-span-2 ${
                activeSection === "faqs"
                  ? "bg-vibrant-red text-white border-vibrant-red shadow-sm"
                  : "bg-white text-vibrant-dark border-vibrant-dark/10 hover:border-vibrant-dark/20"
              }`}
            >
              ❓ Preguntas Frecuentes (FAQs)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
