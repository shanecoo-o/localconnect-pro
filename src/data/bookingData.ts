// ==========================================
// Booking System — Types & Mock Data
// ==========================================

export interface BookingService {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: string;
  icon: string;
}

export interface ProfessionalSchedule {
  /** e.g. "Seg","Ter",… */
  dayOfWeek: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  breaks: { start: string; end: string }[];
}

export interface Professional {
  id: string;
  name: string;
  avatar: string;
  serviceIds: string[];
  schedules: ProfessionalSchedule[];
  bufferMinutes: number; // gap between appointments
  blockedDates: string[]; // ISO dates fully blocked
}

export type SlotStatus =
  | "available"
  | "selected"
  | "occupied"
  | "unavailable"
  | "past";

export interface TimeSlot {
  time: string; // "HH:mm"
  status: SlotStatus;
  professionalId?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  professionalId: string;
  date: string; // ISO date
  startTime: string; // "HH:mm"
  endTime: string;
  clientName: string;
  status: "confirmed" | "cancelled" | "completed";
}

// ---- Mock Services ----
export const bookingServices: BookingService[] = [
  { id: "s1", name: "Reparação rápida", category: "Canalizador", durationMinutes: 30, price: "5.000 Kz", icon: "🔧" },
  { id: "s2", name: "Instalação sanitária", category: "Canalizador", durationMinutes: 60, price: "15.000 Kz", icon: "🚿" },
  { id: "s3", name: "Limpeza residencial", category: "Limpeza", durationMinutes: 90, price: "8.000 Kz", icon: "🧹" },
  { id: "s4", name: "Limpeza pós-obra", category: "Limpeza", durationMinutes: 120, price: "15.000 Kz", icon: "🏗️" },
  { id: "s5", name: "Instalação elétrica", category: "Eletricista", durationMinutes: 50, price: "12.000 Kz", icon: "⚡" },
  { id: "s6", name: "Diagnóstico elétrico", category: "Eletricista", durationMinutes: 20, price: "3.000 Kz", icon: "🔍" },
  { id: "s7", name: "Pintura de quarto", category: "Pintor", durationMinutes: 90, price: "20.000 Kz", icon: "🎨" },
  { id: "s8", name: "Carpintaria sob medida", category: "Carpinteiro", durationMinutes: 60, price: "25.000 Kz", icon: "🪚" },
];

// ---- Mock Professionals ----
const weekdaySchedule: ProfessionalSchedule[] = [
  { dayOfWeek: "Seg", startTime: "08:00", endTime: "17:00", breaks: [{ start: "12:00", end: "13:00" }] },
  { dayOfWeek: "Ter", startTime: "08:00", endTime: "17:00", breaks: [{ start: "12:00", end: "13:00" }] },
  { dayOfWeek: "Qua", startTime: "08:00", endTime: "17:00", breaks: [{ start: "12:00", end: "13:00" }] },
  { dayOfWeek: "Qui", startTime: "08:00", endTime: "17:00", breaks: [{ start: "12:00", end: "13:00" }] },
  { dayOfWeek: "Sex", startTime: "08:00", endTime: "17:00", breaks: [{ start: "12:00", end: "13:00" }] },
];

export const professionals: Professional[] = [
  {
    id: "p1",
    name: "Carlos Mendes",
    avatar: "",
    serviceIds: ["s1", "s2"],
    schedules: weekdaySchedule,
    bufferMinutes: 10,
    blockedDates: ["2026-03-12"],
  },
  {
    id: "p2",
    name: "Ana Sousa",
    avatar: "",
    serviceIds: ["s3", "s4"],
    schedules: [
      ...weekdaySchedule,
      { dayOfWeek: "Sab", startTime: "08:00", endTime: "13:00", breaks: [] },
    ],
    bufferMinutes: 15,
    blockedDates: [],
  },
  {
    id: "p3",
    name: "Miguel Santos",
    avatar: "",
    serviceIds: ["s5", "s6"],
    schedules: weekdaySchedule,
    bufferMinutes: 10,
    blockedDates: [],
  },
  {
    id: "p4",
    name: "Teresa Gomes",
    avatar: "",
    serviceIds: ["s7"],
    schedules: weekdaySchedule,
    bufferMinutes: 15,
    blockedDates: [],
  },
  {
    id: "p5",
    name: "João Ferreira",
    avatar: "",
    serviceIds: ["s8"],
    schedules: weekdaySchedule,
    bufferMinutes: 10,
    blockedDates: ["2026-03-10", "2026-03-11"],
  },
];

// ---- Mock Existing Bookings ----
export const existingBookings: Booking[] = [
  { id: "b1", serviceId: "s1", professionalId: "p1", date: "2026-03-09", startTime: "09:20", endTime: "09:50", clientName: "Maria Silva", status: "confirmed" },
  { id: "b2", serviceId: "s1", professionalId: "p1", date: "2026-03-09", startTime: "10:40", endTime: "11:10", clientName: "João Costa", status: "confirmed" },
  { id: "b3", serviceId: "s3", professionalId: "p2", date: "2026-03-09", startTime: "08:00", endTime: "09:30", clientName: "Ana Lopes", status: "confirmed" },
  { id: "b4", serviceId: "s5", professionalId: "p3", date: "2026-03-10", startTime: "14:00", endTime: "14:50", clientName: "Pedro Nunes", status: "confirmed" },
  { id: "b5", serviceId: "s2", professionalId: "p1", date: "2026-03-10", startTime: "08:00", endTime: "09:00", clientName: "Sofia Almeida", status: "confirmed" },
];

// ---- Holidays ----
export const holidays: string[] = [
  "2026-03-15", // example holiday
];

// ---- Day name mapping ----
const dayMap: Record<number, string> = {
  0: "Dom", 1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sab",
};

export function getDayName(date: Date): string {
  return dayMap[date.getDay()];
}
