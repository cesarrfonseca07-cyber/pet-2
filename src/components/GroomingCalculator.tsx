import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES, SIZE_FACTORS } from "../data";
import { BookingState, PetType, PetSize } from "../types";
import { COLOMBIAN_BREEDS } from "./AiAdvisor";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Check, 
  HelpCircle, 
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  Scissors,
  Heart
} from "lucide-react";

export const getFutureDate = (dateStr: string, monthsToAdd: number = 2) => {
  if (!dateStr) return { formatted: "dentro de 2 meses", raw: "" };
  try {
    const parts = dateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    d.setMonth(d.getMonth() + monthsToAdd);

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const formatted = `${d.getDate()} de ${monthNames[d.getMonth()]} de ${d.getFullYear()}`;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const raw = `${d.getFullYear()}-${mm}-${dd}`;
    return { formatted, raw };
  } catch (e) {
    return { formatted: "dentro de 2 meses", raw: "" };
  }
};

interface GroomingCalculatorProps {
  key?: string;
  initialState?: Partial<BookingState>;
  onBookingSubmitted?: (booking: BookingState) => void;
}

export default function GroomingCalculator({ initialState, onBookingSubmitted }: GroomingCalculatorProps) {
  const [step, setStep] = useState<number>(1);
  const [booking, setBooking] = useState<BookingState>({
    petType: "dog",
    petName: "",
    petBreed: "",
    petSize: "small",
    selectedServices: ["baño-premium"],
    clientName: "",
    clientPhone: "",
    address: "",
    date: "",
    time: "Mañana (8:00 AM - 12:00 PM)",
    notes: "",
    ...initialState
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [bookingOverlapError, setBookingOverlapError] = useState<string>("");

  const fetchExistingBookings = () => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExistingBookings(data);
        }
      })
      .catch(err => console.error("Error fetching occupied slots:", err));
  };

  useEffect(() => {
    fetchExistingBookings();
    window.addEventListener("bookings-changed", fetchExistingBookings);
    return () => window.removeEventListener("bookings-changed", fetchExistingBookings);
  }, []);

  const handlePetTypeChange = (type: PetType) => {
    setBooking(prev => ({ 
      ...prev, 
      petType: type,
      // Default to "small" for cats always, can adjust for dogs
      petSize: type === "cat" ? "small" : prev.petSize 
    }));
  };

  const toggleService = (serviceId: string) => {
    setBooking(prev => {
      const selected = prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId];
      return { ...prev, selectedServices: selected };
    });
    // Clear selected service error
    if (errors.services) {
      setErrors(prev => {
         const n = { ...prev };
         delete n.services;
         return n;
      });
    }
  };

  // Calculate prices dynamically
  const sizeMultiplier = SIZE_FACTORS[booking.petSize].factor;
  
  const getServiceCalculatedPrice = (serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return 0;
    return Math.round(service.basePrice * sizeMultiplier);
  };

  const totalPrice = booking.selectedServices.reduce((sum, serviceId) => {
    return sum + getServiceCalculatedPrice(serviceId);
  }, 0);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Step validations
  const validateStep = (currentStep: number): boolean => {
    const nextErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!booking.petName.trim()) {
        nextErrors.petName = "Por favor ingresa el nombre de tu mascota.";
      }
      if (!booking.petBreed.trim()) {
        nextErrors.petBreed = "Por favor especifica la raza o indica si es cruzado/mestizo.";
      }
    } else if (currentStep === 2) {
      if (booking.selectedServices.length === 0) {
        nextErrors.services = "Debes seleccionar al menos un servicio para cotizar.";
      }
    } else if (currentStep === 3) {
      if (!booking.clientName.trim()) {
        nextErrors.clientName = "El nombre del propietario es obligatorio.";
      }
      if (!booking.clientPhone.trim()) {
        nextErrors.clientPhone = "El teléfono de contacto es obligatorio.";
      } else if (!/^\+?[0-9]{8,15}$/.test(booking.clientPhone.replaceAll(" ", ""))) {
        nextErrors.clientPhone = "Ingresa un número telefónico válido.";
      }
      if (!booking.address.trim()) {
        nextErrors.address = "La dirección de recogida es obligatoria.";
      }
      if (!booking.date) {
        nextErrors.date = "Por favor elige una fecha para el servicio.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const generateWhatsAppMessage = () => {
    const serviceListText = booking.selectedServices
      .map(id => {
        const s = SERVICES.find(srv => srv.id === id);
        return `• ${s?.name} (${formatCOP(getServiceCalculatedPrice(id))})`;
      })
      .join("\n");

    const recurrence = getFutureDate(booking.date, 2);

    const message = `✨ *NUEVA CITA - STUDIO PET* ✨
¡Hola Studio Pet! He cotizado y deseo agendar una cita de estética para mi mascota por medio de la web.

🐾 *DATOS DE LA MASCOTA:*
• *Nombre:* ${booking.petName}
• *Tipo:* ${booking.petType === "dog" ? "Perro 🐕" : "Gato 🐈"}
• *Raza:* ${booking.petBreed}
• *Tamaño:* ${SIZE_FACTORS[booking.petSize].name} (${SIZE_FACTORS[booking.petSize].label})

💈 *SERVICIOS SELECCIONADOS:*
${serviceListText}
🚚 *Recogida:* GRATIS (Zona Urbana)

💳 *VALOR COTIZADO TOTAL:* ${formatCOP(totalPrice)}

👤 *DATOS DE CONTACTO y RECOGIDA:*
• *Cliente:* ${booking.clientName}
• *Teléfono:* ${booking.clientPhone}
• *Dirección:* ${booking.address}
• *Fecha propuesta:* ${booking.date}
• *Horario:* ${booking.time}

🔔 *ALERTA DE RETORNO (CARTA DE SERVICIOS & SPA):*
• *Próxima cita recomendada:* ${recurrence.formatted}
• ¡Favor programar recordatorio de regreso con el cliente!

💡 *Notas Adicionales:* ${booking.notes || "Ninguna"}`;

    return `https://wa.me/573123167203?text=${encodeURIComponent(message)}`;
  };

  const handleFinalSubmit = () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    setBookingOverlapError("");

    fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(booking)
    })
      .then(async (res) => {
        setSubmitting(false);
        let data: any = {};
        try {
          data = await res.json();
        } catch (e) {
          console.error("Could not parse back-end response as JSON", e);
        }

        if (!res.ok) {
          setBookingOverlapError(data.message || `Error en el servicio de agendas (Efecto: ${res.status}). Por favor, intenta de nuevo.`);
          return;
        }

        // Successfully stored! Reload the scheduling slots
        fetchExistingBookings();

        if (onBookingSubmitted) {
          onBookingSubmitted(booking);
        }

        // Proceed to success step 4
        setStep(4);

        // Open WhatsApp Link safely without iframe-breaking location fallback
        try {
          window.open(generateWhatsAppMessage(), "_blank");
        } catch (e) {
          console.error("Popup blocked:", e);
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.error("Submit Error:", err);
        setBookingOverlapError("Error de red al conectar con el servidor de agendas de Studio Pet. Intenta de nuevo.");
      });
  };

  // Check which times are booked on the selected date to coordinate schedules without overlap
  const slotsBookedOnSelectedDate = Array.isArray(existingBookings)
    ? existingBookings.filter(b => b.date === booking.date).map(b => b.time)
    : [];

  const isMorningBooked = slotsBookedOnSelectedDate.includes("Mañana (8:00 AM - 12:00 PM)");
  const isAfternoonBooked = slotsBookedOnSelectedDate.includes("Tarde (1:00 PM - 5:00 PM)");
  const isAllDayBooked = slotsBookedOnSelectedDate.includes("Indiferente / Todo el día");

  const handleDateChange = (dateVal: string) => {
    setBookingOverlapError("");
    setErrors(prev => {
      const n = { ...prev };
      delete n.date;
      return n;
    });

    const booked = existingBookings
      .filter(b => b.date === dateVal)
      .map(b => b.time);

    let nextTime = booking.time;
    if (booked.includes(booking.time) || booked.includes("Indiferente / Todo el día")) {
      if (!booked.includes("Mañana (8:00 AM - 12:00 PM)")) {
        nextTime = "Mañana (8:00 AM - 12:00 PM)";
      } else if (!booked.includes("Tarde (1:00 PM - 5:00 PM)")) {
        nextTime = "Tarde (1:00 PM - 5:00 PM)";
      } else {
        nextTime = "Indiferente / Todo el día";
      }
    }

    setBooking(prev => ({ ...prev, date: dateVal, time: nextTime }));
  };

  // Helper template selectors
  const steps = [
    { title: "Tu Mascota", desc: "Especie, tamaño y raza" },
    { title: "Servicios", desc: "Tratamientos y spa" },
    { title: "Agenda", desc: "Dirección, fecha y hora" },
    { title: "Listo", desc: "Confirmación final" }
  ];

  return (
    <div id="calculator-card" className="bg-white rounded-[36px] border-2 border-vibrant-dark/15 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Steps Indicator Progress bar */}
      <div className="bg-vibrant-bg pb-6 pt-8 px-6 sm:px-10 border-b-2 border-vibrant-dark/10">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            
            return (
              <div key={idx} className="flex flex-col items-center flex-1 relative">
                {/* Connecting lines */}
                {idx > 0 && (
                  <div className={`absolute left-[-50%] right-[50%] h-[3px] top-[18px] -z-10 ${
                    stepNum <= step ? "bg-vibrant-turquoise" : "bg-vibrant-dark/10"
                  }`} />
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 border-2 ${
                  isCompleted 
                    ? "bg-vibrant-turquoise text-white border-vibrant-turquoise" 
                    : isActive 
                      ? "bg-vibrant-dark text-white border-vibrant-dark ring-4 ring-vibrant-yellow" 
                      : "bg-slate-100 text-slate-400 border-slate-200"
                }`}>
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNum}
                </div>
                <span className={`text-[11px] mt-2 font-black uppercase tracking-wider hidden sm:block ${
                  isActive ? "text-vibrant-dark" : isCompleted ? "text-vibrant-turquoise" : "text-slate-400"
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: PET SPECS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center max-w-lg mx-auto">
                <h3 className="text-2xl font-black text-vibrant-dark tracking-tight">¡Cuéntanos sobre tu mascota!</h3>
                <p className="text-vibrant-dark/70 text-xs sm:text-sm mt-1.5 font-semibold">
                  Ajustamos nuestros insumos y técnicas de peinado según el tamaño y la especie de tu compañero fiel.
                </p>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button
                  id="select-dog"
                  type="button"
                  onClick={() => handlePetTypeChange("dog")}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    booking.petType === "dog"
                      ? "border-vibrant-red bg-vibrant-red/10 text-vibrant-red font-black shadow-sm"
                      : "border-vibrant-dark/10 hover:border-vibrant-dark/20 text-vibrant-dark bg-white"
                  }`}
                >
                  <span className="text-4xl mb-2">🐕</span>
                  <span className="text-sm font-sans font-black">Perro</span>
                </button>
                <button
                  id="select-cat"
                  type="button"
                  onClick={() => handlePetTypeChange("cat")}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    booking.petType === "cat"
                      ? "border-vibrant-red bg-vibrant-red/10 text-vibrant-red font-black shadow-sm"
                      : "border-vibrant-dark/10 hover:border-vibrant-dark/20 text-vibrant-dark bg-white"
                  }`}
                >
                  <span className="text-4xl mb-2">🐈</span>
                  <span className="text-sm font-sans font-black">Gato</span>
                </button>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                  <label id="lbl-pet-name" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 font-sans">
                    ¿Cómo se llama tu mascota?
                  </label>
                  <div className="relative">
                    <input
                      id="input-pet-name"
                      type="text"
                      placeholder="Ej: Toby, Luna, Bella..."
                      value={booking.petName}
                      onChange={e => setBooking(prev => ({ ...prev, petName: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border-2 font-sans text-xs focus:outline-none bg-vibrant-bg/45 font-semibold text-vibrant-dark ${
                        errors.petName 
                          ? "border-vibrant-red focus:border-vibrant-red" 
                          : "border-vibrant-dark/15 focus:border-vibrant-dark"
                      }`}
                    />
                  </div>
                  {errors.petName && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.petName}
                    </p>
                  )}
                </div>

                <div>
                  <label id="lbl-pet-breed" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 font-sans">
                    ¿Cuál es su raza?
                  </label>
                  <input
                    id="input-pet-breed"
                     type="text"
                     list="calc-colombian-breeds-list"
                     placeholder="Ej: Golden Retriever, Criollo, Persa..."
                     value={booking.petBreed}
                     onChange={e => {
                       const val = e.target.value;
                       setBooking(prev => ({ ...prev, petBreed: val }));
                       if (val.trim()) {
                         setErrors(prev => {
                           const copy = { ...prev };
                           delete copy.petBreed;
                           return copy;
                         });
                       }
                     }}
                     className={`w-full px-4 py-3 rounded-xl border-2 font-sans text-xs focus:outline-none bg-vibrant-bg/45 font-semibold text-vibrant-dark ${
                       errors.petBreed 
                         ? "border-vibrant-red focus:border-vibrant-red" 
                         : "border-vibrant-dark/15 focus:border-vibrant-dark"
                     }`}
                  />
                  <datalist id="calc-colombian-breeds-list">
                    {COLOMBIAN_BREEDS.map((chip, idx) => (
                      <option key={idx} value={chip.breedKey}>
                        {chip.breedKey} ({chip.type === "dog" ? "Perro" : "Gato"})
                      </option>
                    ))}
                  </datalist>
                  <div className="mt-2 space-y-1">
                    <span className="block text-[10px] font-black uppercase text-vibrant-dark/50">
                      Sugerencias en Colombia:
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                      {COLOMBIAN_BREEDS.filter(chip => chip.type === booking.petType).map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBooking(prev => ({ ...prev, petBreed: chip.breedKey }));
                            setErrors(prev => {
                              const copy = { ...prev };
                              delete copy.petBreed;
                              return copy;
                            });
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                            booking.petBreed.toLowerCase() === chip.breedKey.toLowerCase()
                              ? "bg-vibrant-red text-white border-vibrant-red"
                              : "bg-white hover:bg-vibrant-dark/5 text-vibrant-dark/85 border-vibrant-dark/15"
                          }`}
                        >
                          {chip.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.petBreed && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.petBreed}
                    </p>
                  )}
                </div>
              </div>

              {/* Pet sizes - Only for Dogs */}
              {booking.petType === "dog" && (
                <div className="space-y-4 max-w-2xl mx-auto font-sans">
                  <label id="lbl-pet-size" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-1">
                    ¿Cuál es el tamaño aproximado de tu perro?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {(Object.keys(SIZE_FACTORS) as PetSize[]).map((szKey) => {
                      const sizeObj = SIZE_FACTORS[szKey];
                      const isSelected = booking.petSize === szKey;
                      
                      return (
                        <button
                          key={szKey}
                          id={`size-btn-${szKey}`}
                          type="button"
                          onClick={() => setBooking(prev => ({ ...prev, petSize: szKey }))}
                          className={`flex flex-col p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                            isSelected
                              ? "border-vibrant-red bg-vibrant-red/10 shadow-sm"
                              : "border-vibrant-dark/10 hover:border-vibrant-dark/20 hover:bg-vibrant-bg bg-white"
                          }`}
                        >
                          <span className="font-black font-sans text-sm text-vibrant-dark flex items-center gap-1.5">
                            {sizeObj.name}
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-vibrant-red" />}
                          </span>
                          <span className="text-[10px] text-vibrant-dark/60 font-black font-sans mt-0.5 uppercase tracking-wide">
                            {sizeObj.label.split(" ")[1] || "Peso"} {sizeObj.label.split(" ")[2] || ""}
                          </span>
                          <p className="text-[11px] text-vibrant-brown mt-2 font-sans line-clamp-2 leading-relaxed font-semibold">
                            {sizeObj.text.split(",")[0]}, {sizeObj.text.split(",")[1] || ""}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: SERVICES SELECTED */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center max-w-lg mx-auto mb-6">
                <h3 className="text-2xl font-black text-vibrant-dark tracking-tight">Elige el Spa ideal para {booking.petName}</h3>
                <p className="text-vibrant-dark/70 text-xs sm:text-sm mt-1.5 font-semibold">
                  Calculamos los costos según el tamaño de tu mascota: <span className="font-black text-vibrant-red">{SIZE_FACTORS[booking.petSize].name} (Factor x{sizeMultiplier})</span>.
                </p>
              </div>

              {errors.services && (
                <div className="p-4 bg-vibrant-red/10 border-2 border-vibrant-red/25 rounded-2xl text-xs text-vibrant-red flex items-center gap-2 max-w-xl mx-auto font-bold shadow-sm">
                  <AlertCircle className="w-4 h-4 text-vibrant-red flex-shrink-0" />
                  {errors.services}
                </div>
              )}

              {/* Service Cards Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {SERVICES.map((srv) => {
                  const isChecked = booking.selectedServices.includes(srv.id);
                  const calculatedPrice = Math.round(srv.basePrice * sizeMultiplier);
                  
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`group p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none relative flex flex-col justify-between ${
                        isChecked
                          ? "border-vibrant-red bg-vibrant-red/5 shadow-sm"
                          : "border-vibrant-dark/10 hover:border-vibrant-dark/20 hover:bg-vibrant-bg bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2 rounded-xl transition-all ${
                            isChecked 
                              ? "bg-vibrant-red text-white" 
                              : "bg-vibrant-bg text-vibrant-dark group-hover:bg-vibrant-yellow"
                          }`}>
                            {srv.id === "baño-premium" && <CheckCircle className="w-5 h-5" />}
                            {srv.id === "corte-estilo" && <Scissors className="w-5 h-5" />}
                            {srv.id === "spa-aromaterapia" && <Sparkles className="w-5 h-5" />}
                            {srv.id === "deslanado-profundo" && <Truck className="w-5 h-5 animate-pulse" />}
                            {srv.id === "armonizacion-emocional" && <Heart className="w-5 h-5" />}
                          </div>
                          
                          <div className="text-right">
                            <span className="text-base sm:text-lg font-black font-sans text-vibrant-dark">
                              {formatCOP(calculatedPrice)}
                            </span>
                            <p className="text-[10px] text-vibrant-brown font-mono mt-0.5 flex items-center justify-end gap-1 font-bold">
                              <Clock className="w-3 h-3 text-vibrant-turquoise" /> {srv.duration}
                            </p>
                          </div>
                        </div>

                        <h4 className="font-black text-vibrant-dark text-base font-sans">{srv.name}</h4>
                        <p className="text-xs text-vibrant-brown mt-1 line-clamp-2 font-sans mb-3 font-semibold">{srv.description}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-vibrant-dark/5 flex items-center justify-between">
                        <span className="text-[11px] text-vibrant-red font-black uppercase tracking-wider">
                          {isChecked ? "✓ Seleccionado" : "+ Añadir a cotización"}
                        </span>
                        
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isChecked 
                            ? "bg-vibrant-red border-vibrant-red text-white" 
                            : "border-vibrant-dark/10"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Floating Footer inside step */}
              <div className="max-w-xl mx-auto mt-6 p-4 rounded-2xl bg-vibrant-bg border-2 border-vibrant-dark/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black font-sans text-vibrant-dark block">Recogida & Retorno</span>
                    <span className="text-[10px] uppercase font-black font-mono text-emerald-600 tracking-wider">100% Gratis en zona urbana</span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-xs text-vibrant-dark/60 block font-sans font-bold">Total Estimado</span>
                  <span className="text-xl sm:text-2xl font-black font-sans text-vibrant-dark">{formatCOP(totalPrice)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOGISTICS & CONTACT */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center max-w-lg mx-auto">
                <h3 className="text-2xl font-black text-vibrant-dark tracking-tight">Datos del Propietario y Agenda</h3>
                <p className="text-vibrant-dark/70 text-xs sm:text-sm mt-1.5 font-semibold">
                  ¿A dónde vamos a recoger a {booking.petName} y en qué fecha te acomoda más?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
                {/* Name */}
                <div>
                  <label id="lbl-client-name" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 flex items-center gap-1.5 font-sans">
                    <User className="w-4 h-4 text-vibrant-turquoise" /> Nombre del Propietario
                  </label>
                  <input
                    id="input-client-name"
                    type="text"
                    placeholder="Ej: César Sanabria"
                    value={booking.clientName}
                    onChange={e => setBooking(prev => ({ ...prev, clientName: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-sans text-xs focus:outline-none bg-vibrant-bg/40 font-semibold text-vibrant-dark ${
                      errors.clientName 
                        ? "border-vibrant-red focus:border-vibrant-red" 
                        : "border-vibrant-dark/15 focus:border-vibrant-dark"
                    }`}
                  />
                  {errors.clientName && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.clientName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label id="lbl-client-phone" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 flex items-center gap-1.5 font-sans">
                    <Phone className="w-4 h-4 text-vibrant-turquoise" /> Teléfono Celular (WhatsApp)
                  </label>
                  <input
                    id="input-client-phone"
                    type="tel"
                    placeholder="Ej: 3123167203"
                    value={booking.clientPhone}
                    onChange={e => setBooking(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-sans text-xs focus:outline-none bg-vibrant-bg/40 font-semibold text-vibrant-dark ${
                      errors.clientPhone 
                        ? "border-vibrant-red focus:border-vibrant-red" 
                        : "border-vibrant-dark/15 focus:border-vibrant-dark"
                    }`}
                  />
                  {errors.clientPhone && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.clientPhone}
                    </p>
                  )}
                </div>

                {/* Pickup Address */}
                <div className="sm:col-span-2">
                  <label id="lbl-client-address" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-4 h-4 text-vibrant-turquoise" /> Dirección de Recogida (Casa o Trabajo)
                  </label>
                  <input
                    id="input-client-address"
                    type="text"
                    placeholder="Calle, Carrera, Barrio y Apto/Casa (Ej: Calle 45 #12-34 Balcones de Sevilla)"
                    value={booking.address}
                    onChange={e => setBooking(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-sans text-xs focus:outline-none bg-vibrant-bg/40 font-semibold text-vibrant-dark ${
                      errors.address 
                        ? "border-vibrant-red focus:border-vibrant-red" 
                        : "border-vibrant-dark/15 focus:border-vibrant-dark"
                    }`}
                  />
                  <p className="text-[11px] text-emerald-600 mt-1 font-sans font-bold flex items-center gap-1">
                    ✓ Ofrecemos libre cobertura de recogida sin recargos en todo el perímetro urbano principal.
                  </p>
                  {errors.address && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                    </p>
                  )}
                </div>

                {/* Date Selection */}
                <div>
                  <label id="lbl-booking-date" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 flex items-center gap-1.5 font-sans">
                    <Calendar className="w-4 h-4 text-vibrant-turquoise" /> Fecha Sugerida
                  </label>
                  <input
                    id="input-booking-date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={booking.date}
                    onChange={e => handleDateChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-sans text-xs focus:outline-none bg-vibrant-bg/40 font-semibold text-vibrant-dark ${
                      errors.date 
                        ? "border-vibrant-red focus:border-vibrant-red" 
                        : "border-vibrant-dark/15 focus:border-vibrant-dark"
                    }`}
                  />
                  {errors.date && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
                    </p>
                  )}
                </div>

                {/* Time Preference Slot */}
                <div>
                  <label id="lbl-booking-time" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 flex items-center gap-1.5 font-sans">
                    <Clock className="w-4 h-4 text-vibrant-turquoise" /> Jornada de Preferencia
                  </label>
                  <select
                    id="select-booking-time"
                    value={booking.time}
                    onChange={e => {
                      setBookingOverlapError("");
                      setBooking(prev => ({ ...prev, time: e.target.value }));
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-vibrant-dark/15 font-sans text-xs bg-white text-vibrant-dark font-semibold focus:outline-none focus:border-vibrant-dark"
                  >
                    <option 
                      value="Mañana (8:00 AM - 12:00 PM)"
                      disabled={isMorningBooked || isAllDayBooked}
                    >
                      Mañana (8:00 AM - 12:00 PM) {isMorningBooked ? "⚠️ (Ocupado / Reservado)" : "🟢 (Pocas Citas / Libre)"}
                    </option>
                    <option 
                      value="Tarde (1:00 PM - 5:00 PM)"
                      disabled={isAfternoonBooked || isAllDayBooked}
                    >
                      Tarde (1:00 PM - 5:00 PM) {isAfternoonBooked ? "⚠️ (Ocupado / Reservado)" : "🟢 (Pocas Citas / Libre)"}
                    </option>
                    <option 
                      value="Indiferente / Todo el día"
                      disabled={isMorningBooked || isAfternoonBooked || isAllDayBooked}
                    >
                      Cualquier momento del día {isAllDayBooked || isMorningBooked || isAfternoonBooked ? "⚠️ (No disponible)" : "🟢 (Libre)"}
                    </option>
                  </select>
                  {booking.date && isMorningBooked && isAfternoonBooked && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1 leading-snug">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-vibrant-red" /> 
                      ¡Este día ya está lleno! Elige otra fecha para evitar cruces.
                    </p>
                  )}
                  {bookingOverlapError && (
                    <p className="text-xs text-vibrant-red mt-1.5 font-bold flex items-center gap-1 leading-snug">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-vibrant-red" /> 
                      {bookingOverlapError}
                    </p>
                  )}
                </div>

                {/* Notes/Sensitivities */}
                <div className="sm:col-span-2">
                  <label id="lbl-booking-notes" className="block text-xs font-black uppercase tracking-wider text-vibrant-dark/70 mb-2 font-sans">
                    Inquietudes o Sensibilidades de tu mascota
                  </label>
                  <textarea
                    id="textarea-booking-notes"
                    rows={2}
                    placeholder="Ej: Tiene piel muy sensible, le teme al secador fuerte, muerde si le cortan mucho las uñas, etc."
                    value={booking.notes}
                    onChange={e => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-vibrant-dark/15 font-sans text-xs bg-vibrant-bg/40 text-vibrant-dark font-semibold focus:outline-none focus:border-vibrant-dark resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: FINAL SUMMARY & COMPLETED STEP */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-emerald-200">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-black text-vibrant-dark tracking-tight">¡Perfecto! Tu cotización está lista</h3>
                <p className="text-vibrant-dark/70 text-xs sm:text-sm mt-1.5 font-semibold">
                  Hemos resumido tu solicitud. Para confirmar tu cita y coordinar el chofer de recogida gratis, abre el chat directo de WhatsApp.
                </p>
              </div>

              {/* ALERTA DE RETORNO EN TIEMPO REAL */}
              <div id="alerta-retorno-success" className="bg-emerald-50 border-2 border-emerald-500/25 p-5 rounded-[28px] max-w-lg mx-auto text-left flex gap-3.5 shadow-sm">
                <div className="p-3 bg-emerald-500 text-white rounded-2xl flex-shrink-0 self-start">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-black text-xs text-vibrant-dark uppercase tracking-wider block">🔔 Alerta de Retorno: Carta de Servicios & Spa</span>
                  <p className="text-xs text-vibrant-dark/75 font-semibold leading-relaxed mt-1">
                    Para la óptima salud y el bienestar del pelo de <strong>{booking.petName || "tu mascota"}</strong>, recomendamos renovar su baño o corte cada <strong>2 meses (60 días)</strong> en Colombia para prevenir dermatitis y nudos molestos.
                  </p>
                  <div className="mt-3 bg-white py-2 px-3.5 rounded-xl border border-emerald-500/10 flex justify-between items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-vibrant-dark/60 tracking-wider">Próxima fecha sugerida:</span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-lg border border-emerald-200">
                      📅 {getFutureDate(booking.date).formatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Summary Bill card layout */}
              <div className="bg-vibrant-bg border-2 border-vibrant-dark/15 rounded-3xl p-6 max-w-lg mx-auto text-left relative overflow-hidden shadow-sm">
                {/* Visual side decoration */}
                <div className="absolute top-0 right-0 py-1.5 px-3 bg-vibrant-red text-white text-[10px] font-black font-mono tracking-wider uppercase rounded-bl-xl shadow-inner">
                  Cotización ID: {Math.floor(Math.random() * 90000 + 10000)}
                </div>

                <div className="space-y-4 font-sans text-sm text-vibrant-dark">
                  {/* Pet row */}
                  <div className="flex border-b-2 border-dashed border-vibrant-dark/10 pb-3 justify-between items-center">
                    <div>
                      <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black">Mascota</span>
                      <span className="font-black text-vibrant-dark text-base">{booking.petName}</span>
                      <span className="text-xs text-vibrant-brown font-bold ml-1.5">({booking.petBreed} • {SIZE_FACTORS[booking.petSize].name})</span>
                    </div>
                    <span className="text-3xl">{booking.petType === "dog" ? "🐕" : "🐈"}</span>
                  </div>

                  {/* Agenda/Client row */}
                  <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-vibrant-dark/10 pb-4">
                    <div>
                      <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black">Propietario</span>
                      <span className="font-black text-vibrant-dark">{booking.clientName}</span>
                    </div>
                    <div>
                      <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black">Teléfono</span>
                      <span className="font-black text-vibrant-dark">{booking.clientPhone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black">Dirección de Recogida</span>
                      <span className="font-black text-vibrant-dark leading-tight block">{booking.address}</span>
                    </div>
                    <div>
                      <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black">Fecha Sugerida</span>
                      <span className="font-black text-vibrant-dark flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-vibrant-red" /> {booking.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black">Jornada</span>
                      <span className="font-black text-vibrant-dark leading-none">{booking.time.split(" ")[0]}</span>
                    </div>
                  </div>

                  {/* Selected Services breakdown */}
                  <div>
                    <span className="text-vibrant-dark/50 block text-[10px] uppercase tracking-wider font-black mb-2">Servicios Solicitados</span>
                    <ul className="space-y-1.5 text-xs text-vibrant-dark font-semibold">
                      {booking.selectedServices.map(id => {
                        const s = SERVICES.find(srv => srv.id === id);
                        return (
                          <li key={id} className="flex justify-between items-center">
                            <span>{s?.name} <span className="font-mono text-[10px] text-vibrant-brown">(Base x {booking.petSize === "small" ? "1.0" : sizeMultiplier})</span></span>
                            <span className="font-black text-vibrant-dark">{formatCOP(getServiceCalculatedPrice(id))}</span>
                          </li>
                        );
                      })}
                      <li className="flex justify-between items-center text-emerald-600 border-t border-vibrant-dark/10 pt-2 font-black">
                        <span className="flex items-center gap-1 font-sans">
                          🚚 Servicio logístico (Pickup & Return)
                        </span>
                        <span className="font-mono text-xs font-black uppercase">¡Gratis!</span>
                      </li>
                    </ul>
                  </div>

                  {/* Total and notes */}
                  <div className="pt-4 border-t-2 border-vibrant-dark/15 flex justify-between items-baseline">
                    <span className="font-black text-vibrant-dark">Costo Total Estimado:</span>
                    <span className="text-2xl font-black font-sans text-vibrant-red">{formatCOP(totalPrice)}</span>
                  </div>
                  
                  {booking.notes && (
                    <div className="bg-yellow-50 p-3 rounded-xl border-2 border-vibrant-yellow/40 text-xs text-vibrant-dark/95 leading-relaxed font-semibold italic">
                      💡 **Inquietudes**: "{booking.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <a
                  id="final-booking-via-whatsapp"
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all text-sm cursor-pointer border-2 border-emerald-600 block text-center"
                >
                  <Phone className="w-5 h-5 fill-white text-emerald-500 stroke-white shrink-0" />
                  <span>Enviar Cita por WhatsApp</span>
                </a>
                <p className="text-[11px] text-vibrant-brown font-sans font-bold">
                  *¡Cita registrada en agenda de control! Haz clic arriba para enviar los datos por WhatsApp y recibir confirmación inmediata del despachador de recogida gratis.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons Nav Bar inside Card footer */}
        {step < 4 && (
          <div className="mt-8 pt-6 border-t border-vibrant-dark/10 flex justify-between items-center">
            {step > 1 ? (
              <button
                id="btn-prev-step"
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-vibrant-dark hover:text-vibrant-red text-sm font-black py-2 px-4 hover:bg-vibrant-bg border-2 border-transparent hover:border-vibrant-dark/10 rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            ) : (
              <div />
            )}

            <button
              id="btn-next-step"
              type="button"
              onClick={step === 3 ? handleFinalSubmit : handleNext}
              className="flex items-center gap-1.5 bg-vibrant-dark hover:bg-vibrant-dark/90 text-white font-black py-3 px-6 sm:px-8 rounded-xl font-sans text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-2 border-vibrant-dark"
            >
              {step === 3 ? (
                <>
                  <Sparkles className="w-4 h-4 text-vibrant-yellow" />
                  Confirmar y Enviar
                </>
              ) : (
                <>
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Dynamic Reset links for step 4 */}
        {step === 4 && (
          <div className="mt-8 pt-4 text-center">
            <button
              id="btn-restart-calc"
              type="button"
              onClick={() => {
                setStep(1);
                setBooking({
                  petType: "dog",
                  petName: "",
                  petBreed: "",
                  petSize: "small",
                  selectedServices: ["baño-premium"],
                  clientName: "",
                  clientPhone: "",
                  address: "",
                  date: "",
                  time: "Mañana (8:00 AM - 12:00 PM)",
                  notes: ""
                });
              }}
              className="font-sans text-xs underline text-vibrant-brown hover:text-vibrant-red font-bold transition-colors cursor-pointer"
            >
              ¿Quieres cotizar para otra mascota? Reiniciar cotizador
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
