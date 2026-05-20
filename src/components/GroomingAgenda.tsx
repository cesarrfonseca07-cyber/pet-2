import { useState, useEffect } from "react";
import { 
  Calendar, 
  Download, 
  Trash2, 
  User, 
  MapPin, 
  Phone, 
  Search, 
  FileSpreadsheet, 
  AlertCircle, 
  X, 
  ExternalLink,
  Clock,
  Scissors
} from "lucide-react";
import { SERVICES, SIZE_FACTORS } from "../data";
import TogafArchitecture from "./TogafArchitecture";

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

interface GroomingAgendaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroomingAgenda({ isOpen, onClose }: GroomingAgendaProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "togaf">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading agenda bookings:", err);
        setErrorMsg("No se pudieron cargar las citas de la agenda.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  // Listen for external updates so the agenda stays fresh
  useEffect(() => {
    const handleSync = () => {
      fetchBookings();
    };
    window.addEventListener("bookings-changed", handleSync);
    return () => window.removeEventListener("bookings-changed", handleSync);
  }, []);

  const handleDelete = (id: string, petName: string) => {
    if (!confirm(`¿Estás seguro de que deseas cancelar la cita de ${petName} y liberar este horario en la agenda?`)) {
      return;
    }

    fetch(`/api/bookings/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Trigger global notification to refresh slot markers in other components
          window.dispatchEvent(new Event("bookings-changed"));
          fetchBookings();
        } else {
          alert("No se pudo eliminar la cita.");
        }
      })
      .catch(err => {
        console.error("Error deleting:", err);
        alert("Ocurrió un error al conectar con el servidor.");
      });
  };

  const getServiceCalculatedPrice = (serviceId: string, petSize: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return 0;
    const factor = SIZE_FACTORS[petSize]?.factor || 1.0;
    return Math.round(service.basePrice * factor);
  };

  const calculateTotal = (selectedServices: string[], petSize: string) => {
    return selectedServices.reduce((sum, serviceId) => {
      return sum + getServiceCalculatedPrice(serviceId, petSize);
    }, 0);
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExportCSV = () => {
    window.location.href = "/api/bookings/export-csv";
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const textMatch = 
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.petBreed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const dateMatch = !dateFilter || b.date === dateFilter;

    return textMatch && dateMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop blur overlay */}
      <div className="fixed inset-0 bg-vibrant-dark/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        <div className="relative w-full max-w-5xl bg-white rounded-[32px] border-4 border-vibrant-dark shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Banner */}
          <div className="bg-vibrant-dark text-white p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-vibrant-dark/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-vibrant-yellow p-2.5 rounded-xl shadow-inner text-vibrant-dark">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight family-sans">Agenda de Citas & Control de Excel</h3>
                <p className="text-xs text-white/80 font-mono tracking-wider uppercase font-bold">
                  Coordinación de Horarios de Studio Pet sin Cruces
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-vibrant-yellow text-vibrant-dark hover:bg-white hover:text-vibrant-dark font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-vibrant-dark/30 hover:-translate-y-0.5"
                title="Descargar para abrir directamente en Excel, Numbers u otros programas"
              >
                <Download className="w-4 h-4" />
                Descargar Excel (CSV)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Internal Administration Tab Selection */}
          <div className="bg-slate-900 px-6 sm:px-8 py-2.5 border-b border-white/10 shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "bookings"
                  ? "bg-vibrant-yellow text-vibrant-dark shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Ver Citas Registradas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("togaf")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "togaf"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md animate-pulse"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Scissors className="w-4 h-4 text-vibrant-yellow" />
              Gobernanza & Matriz TOGAF
            </button>
          </div>

          {activeTab === "bookings" && (
            <>
              {/* Quick Informational Warning Banner on Coordination */}
              <div className="bg-vibrant-bg border-b border-vibrant-dark/10 p-4 shrink-0 flex items-start gap-2.5 text-xs text-vibrant-brown/90 font-bold">
                <AlertCircle className="w-4 h-4 text-vibrant-red shrink-0 mt-0.5" />
                <div>
                  <p>
                    💡 **Política de Bloqueo Automático**: Studio Pet limita meticulosamente las citas dadas por día. Solo se permite **una mascota por jornada (Mañana / Tarde)**. Al confirmarse un registro por WhatsApp, el horario queda bloqueado para evitar solapamiento. Puedes liberar cupos o coordinar cambios libres eliminando citas aquí.
                  </p>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="p-4 sm:p-6 border-b border-vibrant-dark/15 bg-white shrink-0 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-vibrant-dark/40" />
                  <input
                    type="text"
                    placeholder="Buscar cliente, mascota, dirección, raza..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-vibrant-dark/15 text-xs bg-vibrant-bg/20 text-vibrant-dark font-semibold focus:outline-none focus:border-vibrant-dark font-sans"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-vibrant-dark/15 text-xs bg-vibrant-bg/20 text-vibrant-dark font-semibold focus:outline-none focus:border-vibrant-dark font-sans"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(""); setDateFilter(""); }}
                    className="w-full font-black text-xs text-vibrant-red bg-vibrant-red/10 border border-vibrant-red/20 hover:bg-vibrant-red hover:text-white py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Body Content list of bookings */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-vibrant-bg/40">
            {activeTab === "togaf" ? (
              <TogafArchitecture />
            ) : (
              <>
                {errorMsg && (
                  <div className="bg-red-50 text-vibrant-red p-4 rounded-xl border border-red-200 text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {errorMsg}
                  </div>
                )}

                {loading ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-vibrant-dark border-t-vibrant-red rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono tracking-wider text-vibrant-dark/60 font-black uppercase">
                      Cargando Base de Citas...
                    </p>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-vibrant-dark/15 rounded-2xl bg-white p-6">
                    <Calendar className="w-12 h-12 text-vibrant-dark/30 mx-auto mb-2" />
                    <h4 className="text-base font-black text-vibrant-dark font-sans">No hay citas en la agenda</h4>
                    <p className="text-xs text-vibrant-dark/60 font-semibold max-w-sm mx-auto mt-1">
                      {searchTerm || dateFilter 
                        ? "Ninguna cita coincide con los filtros aplicados en este momento de la búsqueda." 
                        : "No se registran citas guardadas en el sistema. Los nuevos agendamientos se guardarán de forma automática."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBookings.map((b) => {
                      const bPrice = calculateTotal(b.selectedServices, b.petSize);
                      return (
                        <div 
                          key={b.id} 
                          className="bg-white border-2 border-vibrant-dark/15 hover:border-vibrant-dark rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
                        >
                          {/* Top Bar ID & Badge */}
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <span className="bg-vibrant-dark text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                              {b.id}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-vibrant-dark/50">
                              Registro: {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Info layout */}
                          <div className="space-y-3 flex-1 text-xs">
                            {/* Date Time info highlight */}
                            <div className="bg-vibrant-bg p-2.5 rounded-xl border border-vibrant-dark/10 flex items-center justify-between gap-1">
                              <span className="font-extrabold flex items-center gap-1 text-vibrant-dark font-sans text-xs">
                                <Calendar className="w-3.5 h-3.5 text-vibrant-red shrink-0" /> {b.date}
                              </span>
                              <span className="font-extrabold flex items-center gap-1 text-vibrant-turquoise font-sans text-[11px]">
                                <Clock className="w-3.5 h-3.5 text-vibrant-turquoise shrink-0" /> {b.time}
                              </span>
                            </div>

                            {/* Customer & Pet information row */}
                            <div className="grid grid-cols-2 gap-3 border-b border-vibrant-dark/5 pb-2">
                              <div>
                                <p className="text-[10px] text-vibrant-dark/50 font-black tracking-wider uppercase">Propietario / WhatsApp</p>
                                <p className="font-sans font-black text-vibrant-dark mt-0.5 flex items-center gap-1">
                                  <User className="w-3.5 h-3.5 text-vibrant-dark/40" /> {b.clientName}
                                </p>
                                <a 
                                  href={`https://wa.me/${b.clientPhone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  referrerPolicy="no-referrer"
                                  className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 hover:underline mt-0.5"
                                >
                                  <Phone className="w-2.5 h-2.5" /> {b.clientPhone} <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              </div>

                              <div>
                                <p className="text-[10px] text-vibrant-dark/50 font-black tracking-wider uppercase">Mascota / Raza</p>
                                <p className="font-sans font-black text-vibrant-dark mt-0.5">
                                  {b.petType === "dog" ? "🐕" : "🐈"} {b.petName}
                                </p>
                                <p className="text-[11px] font-semibold text-vibrant-brown/95">
                                  {b.petBreed} • <span className="uppercase text-[10px]">{b.petSize}</span>
                                </p>
                              </div>
                            </div>

                            {/* Address */}
                            <div className="border-b border-vibrant-dark/5 pb-2">
                              <p className="text-[10px] text-vibrant-dark/50 font-black tracking-wider uppercase">Dirección de Recogida</p>
                              <p className="font-sans font-semibold text-vibrant-dark/90 mt-0.5 flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 text-vibrant-red mt-0.5 shrink-0" /> 
                                <span>{b.address}</span>
                              </p>
                            </div>

                            {/* Services */}
                            <div className="border-b border-vibrant-dark/5 pb-2">
                              <p className="text-[10px] text-vibrant-dark/50 font-black tracking-wider uppercase">Peluquería y Spa Contratados</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {b.selectedServices.map(srvId => {
                                  const s = SERVICES.find(srv => srv.id === srvId);
                                  return (
                                    <span key={srvId} className="bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold px-1.5 py-0.5 border border-emerald-100 flex items-center gap-0.5">
                                      <Scissors className="w-2.5 h-2.5" />
                                      {s?.name || srvId}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Notes */}
                            {b.notes && (
                              <div className="bg-yellow-50/50 p-2 rounded-xl border border-vibrant-yellow/30 font-semibold italic text-vibrant-dark/80 text-[11px]">
                                💡 "{b.notes}"
                              </div>
                            )}
                          </div>

                          {/* Footer Cost & Trash Delete Action */}
                          <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-dashed border-vibrant-dark/10">
                            <div>
                              <p className="text-[9px] text-vibrant-dark/50 font-black tracking-wider uppercase">Total Estimado</p>
                              <p className="font-sans text-sm font-black text-vibrant-red">{formatCOP(bPrice)}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(b.id, b.petName)}
                              className="flex items-center gap-1.5 bg-red-50 text-vibrant-red hover:bg-vibrant-red hover:text-white border border-vibrant-red/30 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer"
                              title="Cancelar cita y liberar horario ocupado"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Cancelar Cita
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Dialog Footer status panel */}
          <div className="bg-vibrant-dark text-white p-4 shrink-0 text-center text-xs font-mono font-bold tracking-wider uppercase border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <span>🔴 Se muestran {filteredBookings.length} de {bookings.length} citas totales</span>
            <span className="text-white/60">Studio Pet Admin Panel • Bogotá 🇨🇴</span>
          </div>

        </div>
      </div>
    </div>
  );
}
