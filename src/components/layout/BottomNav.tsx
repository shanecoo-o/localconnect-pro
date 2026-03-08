import { Home, Search, PlusCircle, LayoutDashboard, ClipboardList, MessageSquare, User, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import WorkerModeSwitch from "@/components/workers/WorkerModeSwitch";

const clientNav = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/explore", icon: Search, label: "Explorar" },
  { path: "/new-request", icon: PlusCircle, label: "Pedido", center: true },
  { path: "/messages", icon: MessageSquare, label: "Chat" },
  { path: "/profile", icon: User, label: "Perfil" },
];

const workerProfNav = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/worker-requests", icon: ClipboardList, label: "Pedidos" },
  { path: "/messages", icon: MessageSquare, label: "Chat" },
  { path: "/profile", icon: User, label: "Perfil" },
];

const workerClientNav = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/explore", icon: Search, label: "Explorar" },
  { path: "/new-request", icon: PlusCircle, label: "Pedido", center: true },
  { path: "/messages", icon: MessageSquare, label: "Chat" },
  { path: "/profile", icon: User, label: "Perfil" },
];

const adminNav = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/messages", icon: MessageSquare, label: "Chat" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, workerMode } = useAuth();

  const getNav = () => {
    if (!isAuthenticated || !user) return clientNav;
    switch (user.role) {
      case "admin": return adminNav;
      case "worker": return workerMode === "professional" ? workerProfNav : workerClientNav;
      default: return clientNav;
    }
  };

  const navItems = getNav();

  // Worker mode indicator on mobile
  const showModeSwitch = isAuthenticated && user?.role === "worker";

  return (
    <>
      {/* Worker mode bar on mobile */}
      {showModeSwitch && (
        <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-3 py-1.5">
          <WorkerModeSwitch />
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl bottom-nav-safe md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const isCenter = "center" in item && item.center;

            if (isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 -mt-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                    <item.icon size={20} className="text-primary-foreground" />
                  </div>
                  <span className="text-[9px] font-medium text-primary mt-0.5">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1.5"
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-0.5 h-0.5 w-5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
                <span className={`text-[9px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
