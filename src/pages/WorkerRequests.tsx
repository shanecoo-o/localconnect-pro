import { useState } from "react";
import { ClipboardList, MapPin, Clock, MessageSquare, CheckCircle2, XCircle, Play, Eye, ChevronDown, Bell } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { serviceRequests } from "@/data/mockData";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TabKey = "new" | "accepted" | "in_progress" | "completed" | "cancelled";

const tabs: { key: TabKey; label: string }[] = [
  { key: "new", label: "Novos" },
  { key: "accepted", label: "Aceites" },
  { key: "in_progress", label: "Em Curso" },
  { key: "completed", label: "Concluídos" },
  { key: "cancelled", label: "Cancelados" },
];

const statusMap: Record<TabKey, string[]> = {
  new: ["pending_broadcast"],
  accepted: ["accepted"],
  in_progress: ["in_progress"],
  completed: ["completed"],
  cancelled: ["cancelled", "expired"],
};

const urgencyConfig = {
  high: { label: "Urgente", class: "bg-destructive/15 text-destructive" },
  medium: { label: "Médio", class: "bg-amber-500/15 text-amber-400" },
  low: { label: "Normal", class: "bg-emerald-500/15 text-emerald-400" },
};

export default function WorkerRequests() {
  const [activeTab, setActiveTab] = useState<TabKey>("new");

  const filtered = serviceRequests.filter((r) => statusMap[activeTab].includes(r.status));
  const newCount = serviceRequests.filter((r) => statusMap.new.includes(r.status)).length;

  const handleAction = (action: string, id: string) => {
    toast.success(`Pedido ${id}: ${action}`);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg md:text-xl font-bold flex items-center gap-2">
                <ClipboardList size={20} className="text-primary" /> Pedidos
              </h2>
              <p className="text-xs text-muted-foreground">Gerir pedidos recebidos</p>
            </div>
            {/* Notification bell */}
            <button className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl border border-border bg-secondary hover:bg-surface-hover transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              {newCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[9px] md:text-[10px] font-bold text-primary-foreground">
                  {newCount}
                </span>
              )}
            </button>
          </div>

          {/* Combobox filter */}
          <div className="mt-2">
            <Select value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
              <SelectTrigger className="w-full rounded-xl border-border bg-secondary text-sm h-9 md:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => {
                  const count = serviceRequests.filter((r) => statusMap[tab.key].includes(r.status)).length;
                  return (
                    <SelectItem key={tab.key} value={tab.key}>
                      {tab.label} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Request list */}
        <div className="p-4 md:p-6 space-y-3">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <ClipboardList size={48} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Sem pedidos nesta categoria</p>
            </motion.div>
          ) : (
            filtered.map((req, i) => {
              const urg = urgencyConfig[req.urgency];
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-4 md:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground text-sm">{req.category}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${urg.class}`}>
                          {urg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <UserIcon size={12} /> {req.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> {req.location.bairro}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock size={11} /> {req.timeWindow}</span>
                        <span>{req.requestedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {activeTab === "new" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAction("aceite", req.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <CheckCircle2 size={14} /> Aceitar
                      </button>
                      <button
                        onClick={() => handleAction("recusado", req.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-hover transition-colors"
                      >
                        <XCircle size={14} /> Recusar
                      </button>
                    </div>
                  )}
                  {activeTab === "accepted" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAction("em curso", req.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <Play size={14} /> Iniciar
                      </button>
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground hover:bg-surface-hover transition-colors">
                        <MessageSquare size={14} /> Chat
                      </button>
                    </div>
                  )}
                  {activeTab === "in_progress" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAction("concluído", req.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                      >
                        <CheckCircle2 size={14} /> Concluir
                      </button>
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground hover:bg-surface-hover transition-colors">
                        <MessageSquare size={14} /> Chat
                      </button>
                    </div>
                  )}
                  {(activeTab === "completed" || activeTab === "cancelled") && (
                    <div className="mt-3">
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground hover:bg-surface-hover transition-colors w-full">
                        <Eye size={14} /> Ver detalhes
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function UserIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
