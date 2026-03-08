import { Home, Search, PlusCircle, MessageSquare, User, Wrench, LogIn, LogOut, LayoutDashboard, ClipboardList, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import WorkerModeSwitch from "@/components/workers/WorkerModeSwitch";

const clientItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/explore", icon: Search, label: "Explorar" },
  { path: "/new-request", icon: PlusCircle, label: "Novo Pedido" },
];

const workerProfessionalItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/worker-requests", icon: ClipboardList, label: "Pedidos" },
];

const workerClientItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/explore", icon: Search, label: "Explorar" },
  { path: "/new-request", icon: PlusCircle, label: "Novo Pedido" },
];

const adminItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/users", icon: Users, label: "Utilizadores" },
];

const commonAuthItems = [
  { path: "/messages", icon: MessageSquare, label: "Mensagens" },
  { path: "/profile", icon: User, label: "Perfil" },
];

function NavButton({ item, active, onClick }: { item: { path: string; icon: any; label: string }; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebarIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <item.icon size={20} />
      <span>{item.label}</span>
    </button>
  );
}

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, workerMode } = useAuth();

  const getNavItems = () => {
    if (!isAuthenticated || !user) return clientItems;
    switch (user.role) {
      case "admin":
        return adminItems;
      case "worker":
        return workerMode === "professional" ? workerProfessionalItems : workerClientItems;
      default:
        return clientItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-64 flex-col border-r border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
          <Wrench size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">BairroWorks</h1>
          <p className="text-xs text-muted-foreground">Serviços locais</p>
        </div>
      </div>

      {/* Worker mode switch */}
      {isAuthenticated && user?.role === "worker" && (
        <div className="px-4 mb-2">
          <WorkerModeSwitch />
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}

        {isAuthenticated && (
          <>
            <div className="my-3 mx-4 h-px bg-border" />
            {commonAuthItems.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-border p-4 space-y-1">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2 mb-1">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <LogIn size={20} />
            <span>Entrar</span>
          </button>
        )}
      </div>
    </aside>
  );
}
