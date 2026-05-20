import { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, Search, MessageCircleQuestion, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  const filteredFAQs = FAQS.filter(
    item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="faq-inner-container" className="max-w-3xl mx-auto space-y-6">
      {/* Search Bar filter */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-vibrant-dark/50">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="faq-search-input"
          type="text"
          placeholder="Buscar dudas (Ej: recogida, shampoo, pagos...)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-vibrant-dark/10 focus:outline-none focus:border-vibrant-dark font-sans text-xs sm:text-sm bg-white font-semibold text-vibrant-dark shadow-sm"
        />
      </div>

      {/* FAQs list list Accordion cards */}
      <div className="space-y-3">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <div
                key={idx}
                id={`faq-accordion-item-${idx}`}
                className="bg-white rounded-2xl border-2 border-vibrant-dark/15 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex justify-between items-center gap-4 bg-white hover:bg-vibrant-bg cursor-pointer transition-colors"
                >
                  <span className="font-sans font-black text-vibrant-dark text-sm sm:text-base flex items-center gap-2.5">
                    <MessageCircleQuestion className="w-5 h-5 text-vibrant-red flex-shrink-0" />
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                    isOpen ? "bg-vibrant-turquoise/15 text-vibrant-turquoise rotate-180" : "bg-slate-100 text-slate-500"
                  }`}>
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-vibrant-dark/80 font-sans text-xs sm:text-sm leading-relaxed border-t-2 border-vibrant-dark/10 bg-vibrant-bg/30 font-semibold">
                    <p className="whitespace-pre-line leading-relaxed pb-1">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border-2 border-vibrant-dark/10 p-8">
            <HelpCircle className="w-10 h-10 text-vibrant-dark/30 mx-auto mb-2" />
            <span className="font-black text-vibrant-dark block text-sm">No encontramos respuestas para tu búsqueda</span>
            <p className="text-vibrant-dark/60 text-xs mt-1 font-semibold">Escríbenos directamente a WhatsApp y te solucionaremos cualquier inquietud con gusto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
