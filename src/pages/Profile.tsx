import { User, Settings, Star, MapPin, LogOut, ChevronRight, Shield, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import WorkerModeSwitch from "@/components/workers/WorkerModeSwitch";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Editar Perfil", icon: User },
    { label: "Meus Pedidos", icon: Star },
    { label: "Endereços", icon: MapPin },
    { label: "Definições", icon: Settings },
    { label: "Segurança", icon: Shield },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
          <h2 className="font-display text-lg font-bold">Perfil</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* User card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary font-display text-3xl font-bold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-foreground">{user?.name || "Utilizador"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary capitalize">
              {user?.role || "cliente"}
            </span>
            {user?.location && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <MapPin size={12} /> {user.location}
              </p>
            )}
          </motion.div>

          {/* Worker mode switch */}
          {user?.role === "worker" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <WorkerModeSwitch />
            </motion.div>
          )}

          {/* Menu */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            {menuItems.map((item) => (
              <button key={item.label} className="flex w-full items-center gap-3 px-5 py-4 text-sm text-foreground hover:bg-surface-hover transition-colors border-b border-border last:border-b-0">
                <item.icon size={18} className="text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={18} /> Sair da conta
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
