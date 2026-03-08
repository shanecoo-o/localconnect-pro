import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "client" | "worker" | "admin";
  bio?: string;
  phone?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: "client" | "worker" }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const defaultAuth: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
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
  { id: "u1", name: "João Cliente", email: "cliente@demo.com", password: "123456", role: "client", bio: "Cliente demo" },
  { id: "u2", name: "Carlos Mendes", email: "worker@demo.com", password: "123456", role: "worker", bio: "Canalizador profissional" },
  { id: "u3", name: "Admin BairroWorks", email: "admin@demo.com", password: "123456", role: "admin", bio: "Administrador" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("bw_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      setIsLoading(false);
      throw new Error("Email ou palavra-passe incorretos");
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
    };
    setUser(newUser);
    localStorage.setItem("bw_user", JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("bw_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
