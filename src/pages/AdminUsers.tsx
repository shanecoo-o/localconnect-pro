import { useState, useMemo } from "react";
import { Users, Search, Shield, UserCheck, UserX, MapPin, Star, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { ALL_MOCK_USERS, type UserProfile, type UserRole, type UserStatus } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>(ALL_MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [confirmUser, setConfirmUser] = useState<UserProfile | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    workers: users.filter((u) => u.role === "worker").length,
    clients: users.filter((u) => u.role === "client").length,
    active: users.filter((u) => u.status === "active").length,
    disabled: users.filter((u) => u.status === "disabled").length,
  }), [users]);

  const toggleStatus = (user: UserProfile) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: u.status === "active" ? "disabled" : "active" } : u
      )
    );
    toast.success(`${user.name} foi ${user.status === "active" ? "desativado" : "ativado"}`);
    setConfirmUser(null);
  };

  const statCards = [
    { label: "Total", value: stats.total, icon: Users, color: "text-primary" },
    { label: "Workers", value: stats.workers, icon: Shield, color: "text-amber-400" },
    { label: "Clientes", value: stats.clients, icon: UserCheck, color: "text-emerald-400" },
    { label: "Ativos", value: stats.active, icon: UserCheck, color: "text-emerald-400" },
    { label: "Desativados", value: stats.disabled, icon: UserX, color: "text-destructive" },
  ];

  const roleChips: { key: UserRole | "all"; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "client", label: "Cliente" },
    { key: "worker", label: "Worker" },
    { key: "admin", label: "Admin" },
  ];

  const statusChips: { key: UserStatus | "all"; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Ativos" },
    { key: "disabled", label: "Desativados" },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-3 py-2 md:px-6 md:py-3">
          <h2 className="font-display text-lg md:text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" /> Gestão de Utilizadores
          </h2>
          <p className="text-xs text-muted-foreground">{stats.total} utilizadores registados</p>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-3 md:p-4"
              >
                <s.icon size={16} className={s.color} />
                <p className="font-display text-xl md:text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-[10px] md:text-[11px] text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] text-muted-foreground self-center mr-1">Role:</span>
              {roleChips.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setRoleFilter(c.key)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    roleFilter === c.key
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground border border-border hover:bg-surface-hover"
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <span className="text-[11px] text-muted-foreground self-center ml-2 mr-1">Estado:</span>
              {statusChips.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setStatusFilter(c.key)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    statusFilter === c.key
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground border border-border hover:bg-surface-hover"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* User List */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Nenhum utilizador encontrado</p>
              </div>
            ) : (
              filtered.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 md:p-4 card-hover cursor-pointer"
                >
                  {/* Avatar */}
                  <div className={`shrink-0 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl font-display text-sm md:text-lg font-bold ${
                    u.status === "disabled" ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                  }`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${
                        u.role === "admin" ? "bg-purple-500/15 text-purple-400" :
                        u.role === "worker" ? "bg-amber-500/15 text-amber-400" :
                        "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        {u.role}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        u.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-destructive/15 text-destructive"
                      }`}>
                        {u.status === "active" ? "Ativo" : "Desativado"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                      {u.location && (
                        <span className="flex items-center gap-0.5"><MapPin size={9} /> {u.location}</span>
                      )}
                      {u.rating != null && (
                        <span className="flex items-center gap-0.5"><Star size={9} className="text-amber-400" /> {u.rating}</span>
                      )}
                      {u.completedJobsCount != null && (
                        <span>{u.completedJobsCount} serviços</span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmUser(u); }}
                    className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-medium transition-colors ${
                      u.status === "active"
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                    }`}
                  >
                    {u.status === "active" ? "Desativar" : "Ativar"}
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!confirmUser} onOpenChange={() => setConfirmUser(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {confirmUser?.status === "active" ? "Desativar" : "Ativar"} utilizador
            </DialogTitle>
            <DialogDescription>
              {confirmUser?.status === "active"
                ? `Tem a certeza que deseja desativar ${confirmUser?.name}? O utilizador não poderá aceder à plataforma.`
                : `Deseja reativar ${confirmUser?.name}? O utilizador voltará a ter acesso à plataforma.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setConfirmUser(null)}
              className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-hover transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => confirmUser && toggleStatus(confirmUser)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 ${
                confirmUser?.status === "active"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-gradient-primary text-primary-foreground"
              }`}
            >
              Confirmar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
