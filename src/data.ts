import { Service, FAQItem, PetSize, ModelPet } from "./types";

export const SERVICES: Service[] = [
  {
    id: "baño-premium",
    name: "Baño Premium & Higiene",
    description: "La higiene base ideal con el máximo cuidado y caricias.",
    basePrice: 40000,
    duration: "1.5 - 2 horas",
    iconName: "Bath",
    features: [
      "🚿 Baño con agua temperada",
      "🌿 Shampoo hipoalergénico orgánico según tipo de manto",
      "💨 Soplado profesional con control de temperatura",
      "💆 Masaje capilar relajante durante el baño",
      "👂 Limpieza profunda y segura de oídos",
      "💅 Corte de uñas y limado preventivo",
      "✂️ Despeje sanitario mínimo",
      "💖 Perfume premium francés hipoalergénico"
    ]
  },
  {
    id: "corte-estilo",
    name: "Corte y Estilismo Profesional",
    description: "Diseño de corte según la morfología, raza y estilo único.",
    basePrice: 65000,
    duration: "2 - 3 horas",
    iconName: "Scissors",
    features: [
      "✨ Todo lo incluido en el Baño Premium",
      "✂️ Corte según estándar de raza o estilo personalizado",
      "💇 Perfilado de cabeza, patitas y pompones",
      "🧼 Rapado higiénico de almohadillas y zona íntima",
      "🪮 Cepillado exhaustivo contra nudos",
      "🎀 Detalle de moño o pañoleta de cortesía"
    ]
  },
  {
    id: "spa-aromaterapia",
    name: "Spa de Relajación & Hidratación",
    description: "Una experiencia multisensorial sublime para calmar y restaurar.",
    basePrice: 55000,
    duration: "2 horas",
    iconName: "Sparkles",
    features: [
      "🫧 Todo lo incluido en el Baño Premium",
      "🌸 Baño con aromaterapia relajante de lavanda y manzanilla",
      "🧴 Mascarilla capilar ultrahidratante de Aloe Vera y Keratina",
      "🐾 Masaje dactilar sensitivo desestresante",
      "💧 Bálsamo regenerador orgánico para almohadillas húmedas",
      "✨ Nutrición intensiva para hocicos/trufas resecas"
    ]
  },
  {
    id: "deslanado-profundo",
    name: "Deslanado de Doble Capa",
    description: "Retiro masivo de subpelo muerto. ¡Mantén tu hogar libre de pelos!",
    basePrice: 50000,
    duration: "2 - 2.5 horas",
    iconName: "ShieldAlert",
    features: [
      "✨ Todo lo incluido en el Baño Premium",
      "🪮 Tratamiento de soplado masivo de subpelo muerto",
      "🛠️ Cepillado profesional con herramientas Furminator e instrumental específico",
      "📉 Reduce la caída de pelo en el hogar hasta un 90%",
      "🌬️ Oxigenación profunda de la dermis para evitar dermatitis",
      "🍂 Ideal para Golden, Husky, Pomerania, Samoyedo o gatos de pelo denso"
    ]
  }
];

export const SIZE_FACTORS: Record<PetSize, { name: string; label: string; factor: number; text: string }> = {
  small: {
    name: "Pequeño",
    label: "Pequeño (1 - 10 kg)",
    factor: 1.0,
    text: "Pomerania, Caniche Toy, Shih Tzu, Yorkshire, Pug, Gatos de cualquier tipo."
  },
  medium: {
    name: "Mediano",
    label: "Mediano (11 - 20 kg)",
    factor: 1.25,
    text: "Bulldog Francés/Inglés, Cocker Spaniel, Beagle, Boston Terrier, Schnauzer."
  },
  large: {
    name: "Grande",
    label: "Grande (21 - 35 kg)",
    factor: 1.55,
    text: "Golden Retriever, Labrador, Pastor Alemán, Boxer, Husky."
  },
  giant: {
    name: "Gigante",
    label: "Gigante (+35 kg)",
    factor: 1.9,
    text: "San Bernardo, Boyero de Berna, Terranova, Gran Danés."
  }
};

export const FAQS: FAQItem[] = [
  {
    question: "¿La recogida y el retorno a domicilio son realmente gratis?",
    answer: "¡Sí, es totalmente gratis! En toda la zona urbana. Nuestro equipo recoge a tu peludito en la puerta de tu casa u oficina, viaja cómodo en nuestros vehículos higienizados y te lo regresamos limpio, feliz y perfumado sin ningún costo de flete."
  },
  {
    question: "¿Cómo son transportadas las mascotas?",
    answer: "Contamos con camionetas climatizadas, seguras y adaptadas con guacales transportadores individuales de alta calidad. Cada transportador se desinfecta meticulosamente con amonio cuaternario después de cada traslado de un peludo para garantizar higiene absoluta."
  },
  {
    question: "¿Cuánto dura todo el proceso?",
    answer: "Normalmente, de 1.5 a 3 horas, dependiendo del pelaje de la mascota, los servicios seleccionados y la distancia logística. Siempre te mantendremos informado por WhatsApp cuando estemos listos para regresar a su hogar."
  },
  {
    question: "¿Qué productos utilizan en el baño y tratamiento?",
    answer: "Utilizamos cosmética canina y felina importada súper premium: fórmulas orgánicas libres de sal, sulfatos y siliconas, 100% hipoalergénicas, con pH balanceado y no testeadas en animales. Protegemos al máximo la barrera lipídica cutánea de tu compañero."
  },
  {
    question: "¿Puedo coordinar citas para razas de pelo difícil o con muchos nudos?",
    answer: "Por supuesto. Nuestros estilistas son idóneos para manejar mantos complejos, desenredar nudos con sprays acondicionadores de coco u optar por cortes higiénicos de rescate según el bienestar animal de tu mascota."
  },
  {
    question: "¿Cómo agendo y cuáles son los medios de pago?",
    answer: "Puedes cotizar tu servicio ideal en esta plataforma web y enviarnos los datos de agendamiento directo por WhatsApp. El pago se efectúa al momento del regreso de tu mascota por transferencia (Nequi, Daviplata, Bancolombia) o efectivo."
  }
];

export const MODEL_PETS: ModelPet[] = [
  {
    name: "Milka",
    breed: "Golden Retriever",
    service: "Baño Premium + Cepillado",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Aki",
    breed: "Pomerania",
    service: "Corte Estilo Oso",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Rocco",
    breed: "Bulldog Francés",
    service: "Spa Aromaterapia & Baño",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Luna",
    breed: "Gato Persa",
    service: "Deslanado Especial",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Simba",
    breed: "Gato Siamés",
    service: "Baño Higiene Completa",
    image: "https://images.unsplash.com/photo-1513360309081-36f5e878fc9e?auto=format&fit=crop&q=80&w=300"
  }
];

