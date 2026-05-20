export type PetType = 'dog' | 'cat';

export type PetSize = 'small' | 'medium' | 'large' | 'giant';

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Base price for small dogs or cats
  duration: string;
  iconName: string; // Lucide icon name mapping
  features: string[];
}

export interface BookingState {
  petType: PetType;
  petName: string;
  petBreed: string;
  petSize: PetSize;
  selectedServices: string[];
  clientName: string;
  clientPhone: string;
  address: string;
  date: string;
  time: string;
  notes: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ModelPet {
  name: string;
  breed: string;
  service: string;
  image: string;
}
