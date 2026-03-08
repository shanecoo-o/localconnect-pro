import { User, Settings, Star, MapPin, LogOut, ChevronRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";

export default function Profile() {
  const menuItems = [
    { label: "Editar Perfil", icon: User },
    { label: "Meus Pedidos", icon: Star },
    { label: "Endereços", icon: MapPin },
    { label: "Definições", icon: Settings },
    { label: "Segurança", icon: Shield },
  ];

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
              U
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-foreground">Utilizador Demo</h3>
            <p className="text-sm text-muted-foreground">demo@bairroworks.ao</p>
            <span className="mt-2 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              Cliente
            </span>
          </motion.div>

          {/* Menu */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            {menuItems.map((item, i) => (
              <button key={item.label} className="flex w-full items-center gap-3 px-5 py-4 text-sm text-foreground hover:bg-surface-hover transition-colors border-b border-border last:border-b-0">
                <item.icon size={18} className="text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut size={18} /> Sair da conta
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
