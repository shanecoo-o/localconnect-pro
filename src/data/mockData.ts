export interface Worker {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  categories: string[];
  skills: string[];
  location: { lat: number; lng: number; bairro: string; cidade: string };
  availability: { days: string[]; hours: string[] };
  priceRange: string;
  urgentAvailable: boolean;
  rating: number;
  reviewCount: number;
  badges: string[];
  online: boolean;
  portfolio: string[];
  acceptanceRate: number;
  completedJobs: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  workerId?: string;
  category: string;
  description: string;
  location: { lat: number; lng: number; bairro: string };
  requestedDate: string;
  timeWindow: string;
  urgency: "low" | "medium" | "high";
  status: "pending_broadcast" | "accepted" | "in_progress" | "completed" | "cancelled" | "expired";
  createdAt: string;
  countdown?: number;
}

export const categories: Category[] = [
  { id: "1", name: "Canalizador", icon: "🔧", count: 24 },
  { id: "2", name: "Eletricista", icon: "⚡", count: 18 },
  { id: "3", name: "Pedreiro", icon: "🧱", count: 31 },
  { id: "4", name: "Pintor", icon: "🎨", count: 15 },
  { id: "5", name: "Carpinteiro", icon: "🪚", count: 12 },
  { id: "6", name: "Limpeza", icon: "🧹", count: 42 },
  { id: "7", name: "Jardinagem", icon: "🌿", count: 20 },
  { id: "8", name: "Técnico AC", icon: "❄️", count: 9 },
];

export const workers: Worker[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    avatar: "",
    bio: "Canalizador com 15 anos de experiência. Especialista em reparações urgentes e instalações de canalização.",
    categories: ["Canalizador"],
    skills: ["Reparação de fugas", "Instalação sanitária", "Desentupimentos", "Aquecimento central"],
    location: { lat: -8.838, lng: 13.234, bairro: "Talatona", cidade: "Luanda" },
    availability: { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], hours: ["08:00-12:00", "14:00-18:00"] },
    priceRange: "5.000 - 25.000 Kz",
    urgentAvailable: true,
    rating: 4.8,
    reviewCount: 127,
    badges: ["Disponível agora", "Responde rápido", "Top Worker"],
    online: true,
    portfolio: [],
    acceptanceRate: 92,
    completedJobs: 245,
  },
  {
    id: "2",
    name: "Ana Sousa",
    avatar: "",
    bio: "Especialista em limpezas residenciais e comerciais. Equipa organizada e pontual.",
    categories: ["Limpeza"],
    skills: ["Limpeza profunda", "Pós-obra", "Escritórios", "Vidros"],
    location: { lat: -8.826, lng: 13.242, bairro: "Kilamba", cidade: "Luanda" },
    availability: { days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"], hours: ["07:00-12:00", "13:00-17:00"] },
    priceRange: "3.000 - 15.000 Kz",
    urgentAvailable: false,
    rating: 4.9,
    reviewCount: 203,
    badges: ["Top Worker", "Responde rápido"],
    online: true,
    portfolio: [],
    acceptanceRate: 95,
    completedJobs: 380,
  },
  {
    id: "3",
    name: "Miguel Santos",
    avatar: "",
    bio: "Eletricista certificado. Instalações elétricas residenciais e industriais.",
    categories: ["Eletricista"],
    skills: ["Instalação elétrica", "Disjuntores", "Iluminação", "Gerador"],
    location: { lat: -8.815, lng: 13.228, bairro: "Viana", cidade: "Luanda" },
    availability: { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], hours: ["08:00-12:00", "14:00-18:00"] },
    priceRange: "8.000 - 40.000 Kz",
    urgentAvailable: true,
    rating: 4.6,
    reviewCount: 89,
    badges: ["Disponível agora"],
    online: false,
    portfolio: [],
    acceptanceRate: 88,
    completedJobs: 156,
  },
  {
    id: "4",
    name: "Pedro Nunes",
    avatar: "",
    bio: "Pedreiro profissional. Construção, remodelação e acabamentos de qualidade.",
    categories: ["Pedreiro"],
    skills: ["Construção", "Reboco", "Azulejos", "Remodelação"],
    location: { lat: -8.845, lng: 13.250, bairro: "Benfica", cidade: "Luanda" },
    availability: { days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"], hours: ["07:00-16:00"] },
    priceRange: "10.000 - 50.000 Kz",
    urgentAvailable: false,
    rating: 4.7,
    reviewCount: 64,
    badges: ["Responde rápido"],
    online: true,
    portfolio: [],
    acceptanceRate: 90,
    completedJobs: 112,
  },
  {
    id: "5",
    name: "Teresa Gomes",
    avatar: "",
    bio: "Pintora decorativa. Transformo qualquer espaço com cores e técnicas modernas.",
    categories: ["Pintor"],
    skills: ["Pintura interior", "Pintura exterior", "Decorativa", "Textura"],
    location: { lat: -8.830, lng: 13.240, bairro: "Morro Bento", cidade: "Luanda" },
    availability: { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], hours: ["08:00-17:00"] },
    priceRange: "6.000 - 30.000 Kz",
    urgentAvailable: true,
    rating: 4.9,
    reviewCount: 156,
    badges: ["Top Worker", "Disponível agora", "Responde rápido"],
    online: true,
    portfolio: [],
    acceptanceRate: 97,
    completedJobs: 298,
  },
  {
    id: "6",
    name: "João Ferreira",
    avatar: "",
    bio: "Carpinteiro artesanal. Móveis sob medida e reparações de madeira.",
    categories: ["Carpinteiro"],
    skills: ["Móveis", "Portas", "Janelas", "Deck"],
    location: { lat: -8.820, lng: 13.235, bairro: "Camama", cidade: "Luanda" },
    availability: { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], hours: ["08:00-12:00", "14:00-18:00"] },
    priceRange: "7.000 - 35.000 Kz",
    urgentAvailable: false,
    rating: 4.5,
    reviewCount: 42,
    badges: [],
    online: false,
    portfolio: [],
    acceptanceRate: 85,
    completedJobs: 78,
  },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "1",
    clientId: "c1",
    clientName: "Maria Silva",
    workerId: "1",
    category: "Canalizador",
    description: "Fuga de água na cozinha. Preciso de reparação urgente.",
    location: { lat: -8.838, lng: 13.234, bairro: "Talatona" },
    requestedDate: "2026-03-08",
    timeWindow: "08:00-12:00",
    urgency: "high",
    status: "in_progress",
    createdAt: "2026-03-08T07:30:00",
  },
  {
    id: "2",
    clientId: "c2",
    clientName: "António Costa",
    category: "Eletricista",
    description: "Instalar pontos de luz no quarto e sala.",
    location: { lat: -8.826, lng: 13.242, bairro: "Kilamba" },
    requestedDate: "2026-03-09",
    timeWindow: "14:00-18:00",
    urgency: "medium",
    status: "pending_broadcast",
    createdAt: "2026-03-08T10:00:00",
    countdown: 120,
  },
  {
    id: "3",
    clientId: "c3",
    clientName: "Joana Lopes",
    workerId: "2",
    category: "Limpeza",
    description: "Limpeza pós-obra de apartamento T3.",
    location: { lat: -8.815, lng: 13.228, bairro: "Viana" },
    requestedDate: "2026-03-10",
    timeWindow: "08:00-17:00",
    urgency: "low",
    status: "accepted",
    createdAt: "2026-03-07T15:00:00",
  },
];
