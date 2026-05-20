import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { Sparkles, ArrowLeftRight, HelpCircle } from "lucide-react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const startDrag = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const stopDrag = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[32px] border-2 border-vibrant-dark/15 p-6 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h4 className="font-sans font-black text-vibrant-dark text-lg flex justify-center items-center gap-1.5 mb-1">
          <Sparkles className="w-5 h-5 text-vibrant-yellow fill-vibrant-yellow" />
          Desliza para ver el Cambio
        </h4>
        <p className="text-xs text-vibrant-dark/70 font-sans font-semibold">
          Mueve el control deslizable en el centro para ver el estado antes y después del Spa Deluxe de Studio Pet.
        </p>
      </div>

      {/* Slider viewport */}
      <div 
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-vibrant-dark/10 shadow-inner"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={(e) => { e.preventDefault(); startDrag(); }}
        onTouchStart={startDrag}
      >
        {/* AFTER IMAGE (Background - fully revealed at position 0, hidden at 100) */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=900" 
            alt="Mascota después del Spa de Studio Pet" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* After Tag */}
          <div className="absolute bottom-4 right-4 bg-vibrant-turquoise text-white font-mono text-[10px] font-black tracking-widest uppercase px-3.5 py-2 rounded-xl border border-b-2 border-vibrant-dark/10 shadow-md z-10 select-none">
            Después ✨ Limpio & Feliz
          </div>
        </div>

        {/* BEFORE IMAGE (Foreground - clip-pathed over After image) */}
        <div 
          className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"
          style={{ width: `${sliderPosition}%`, overflow: "hidden" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=900" 
            alt="Mascota esperando Baño Premium" 
            referrerPolicy="no-referrer"
            className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current?.getBoundingClientRect().width }}
          />
          {/* Before Tag */}
          <div className="absolute bottom-4 left-4 bg-vibrant-dark text-slate-200 font-mono text-[10px] font-black tracking-widest uppercase px-3.5 py-2 rounded-xl border border-b-2 border-black/30 shadow-md z-10 select-none w-max">
            Antes 🐾 Oloroso / Enredado
          </div>
        </div>

        {/* Slider Handle (Visual control bar) */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-md flex items-center justify-center transition-all duration-75 animate-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-white text-vibrant-dark border-2 border-vibrant-dark shadow-xl flex items-center justify-center -translate-x-1/2 cursor-ew-resize pointer-events-none transform hover:scale-105">
            <ArrowLeftRight className="w-4 h-4 text-vibrant-red stroke-[3]" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-vibrant-dark/65 font-bold font-sans px-2">
        <span>🐕 Toby antes de la recogida</span>
        <span>🧼 Toby de regreso en casa perfumado</span>
      </div>
    </div>
  );
}
