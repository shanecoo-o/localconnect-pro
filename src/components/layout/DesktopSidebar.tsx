import { Home, Search, PlusCircle, MessageSquare, User, Settings, Wrench, LogIn, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const publicItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/explore", icon: Search, label: "Explorar" },
  { path: "/new-request", icon: PlusCircle, label: "Novo Pedido" },
  { path: "/dashboard", icon: Wrench, label: "Dashboard" },
];

const authItems = [
  { path: "/messages", icon: MessageSquare, label: "Mensagens" },
  { path: "/profile", icon: User, label: "Perfil" },
];

function NavButton({ item, active, onClick }: { item: typeof publicItems[0]; active: boolean; onClick: () => void }) {
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
  const { isAuthenticated, user, logout } = useAuth();

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

      <nav className="flex-1 px-3 py-4 space-y-1">
        {publicItems.map((item) => (
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
            {authItems.map((item) => (
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
                <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
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
