import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "client" | "worker" | "admin";
export type UserStatus = "active" | "disabled";
export type WorkerMode = "professional" | "client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  phone?: string;
  status: UserStatus;
  location?: string;
  createdAt: string;
  rating?: number;
  completedJobsCount?: number;
  acceptanceRate?: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  workerMode: WorkerMode;
  setWorkerMode: (mode: WorkerMode) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: "client" | "worker" }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const defaultAuth: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  workerMode: "professional",
  setWorkerMode: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? defaultAuth;
}

// Mock users for MVP
const MOCK_USERS: (UserProfile & { password: string })[] = [
  {
    id: "u1", name: "João Cliente", email: "cliente@demo.com", password: "123456",
    role: "client", bio: "Cliente demo", status: "active", location: "Talatona, Luanda",
    createdAt: "2026-01-15T10:00:00", phone: "+244 923 456 789",
  },
  {
    id: "u2", name: "Carlos Mendes", email: "worker@demo.com", password: "123456",
    role: "worker", bio: "Canalizador profissional", status: "active", location: "Talatona, Luanda",
    createdAt: "2025-11-20T08:00:00", phone: "+244 912 345 678",
    rating: 4.8, completedJobsCount: 245, acceptanceRate: 92,
  },
  {
    id: "u3", name: "Admin BairroWorks", email: "admin@demo.com", password: "123456",
    role: "admin", bio: "Administrador", status: "active", location: "Luanda",
    createdAt: "2025-06-01T00:00:00",
  },
];

// Export for admin page
export const ALL_MOCK_USERS: UserProfile[] = [
  ...MOCK_USERS.map(({ password, ...u }) => u),
  {
    id: "u4", name: "Ana Sousa", email: "ana@demo.com", role: "worker", bio: "Limpeza profissional",
    status: "active", location: "Kilamba, Luanda", createdAt: "2025-12-10T09:00:00",
    phone: "+244 934 567 890", rating: 4.9, completedJobsCount: 380, acceptanceRate: 95,
  },
  {
    id: "u5", name: "Miguel Santos", email: "miguel@demo.com", role: "worker", bio: "Eletricista certificado",
    status: "disabled", location: "Viana, Luanda", createdAt: "2026-01-05T14:00:00",
    phone: "+244 945 678 901", rating: 4.6, completedJobsCount: 156, acceptanceRate: 88,
  },
  {
    id: "u6", name: "Maria Silva", email: "maria@demo.com", role: "client", bio: "",
    status: "active", location: "Talatona, Luanda", createdAt: "2026-02-01T11:00:00",
    phone: "+244 956 789 012",
  },
  {
    id: "u7", name: "Pedro Nunes", email: "pedro@demo.com", role: "worker", bio: "Pedreiro profissional",
    status: "active", location: "Benfica, Luanda", createdAt: "2025-10-15T07:00:00",
    phone: "+244 967 890 123", rating: 4.7, completedJobsCount: 112, acceptanceRate: 90,
  },
  {
    id: "u8", name: "Teresa Gomes", email: "teresa@demo.com", role: "client", bio: "",
    status: "disabled", location: "Morro Bento, Luanda", createdAt: "2026-02-20T16:00:00",
    phone: "+244 978 901 234",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("bw_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [workerMode, setWorkerMode] = useState<WorkerMode>(() => {
    return (localStorage.getItem("bw_worker_mode") as WorkerMode) || "professional";
  });

  const handleSetWorkerMode = useCallback((mode: WorkerMode) => {
    setWorkerMode(mode);
    localStorage.setItem("bw_worker_mode", mode);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      setIsLoading(false);
      throw new Error("Email ou palavra-passe incorretos");
    }
    if (found.status === "disabled") {
      setIsLoading(false);
      throw new Error("Esta conta está desativada. Contacte o suporte.");
    }
    const { password: _, ...profile } = found;
    setUser(profile);
    localStorage.setItem("bw_user", JSON.stringify(profile));
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; role: "client" | "worker" }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (MOCK_USERS.some((u) => u.email === data.email)) {
      setIsLoading(false);
      throw new Error("Este email já está registado");
    }
    const newUser: UserProfile = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("bw_user", JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("bw_user");
    localStorage.removeItem("bw_worker_mode");
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      workerMode, setWorkerMode: handleSetWorkerMode,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
