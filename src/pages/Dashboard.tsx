import { useState } from "react";
import { TrendingUp, CheckCircle2, Star, Clock, Zap, Calendar, Wrench, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { serviceRequests } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const stats = [
  { label: "Pedidos esta semana", value: "12", icon: Zap, change: "+3" },
  { label: "Taxa aceitação", value: "92%", icon: TrendingUp, change: "+2%" },
  { label: "Rating médio", value: "4.8", icon: Star, change: "+0.1" },
  { label: "Completados", value: "245", icon: CheckCircle2, change: "+8" },
];

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const defaultHours = ["08:00-12:00", "14:00-18:00", "19:00-22:00"];

export default function Dashboard() {
  const [selectedDays, setSelectedDays] = useState(["Seg", "Ter", "Qua", "Qui", "Sex"]);
  const [customHours, setCustomHours] = useState<string[]>(defaultHours);
  const [selectedHours, setSelectedHours] = useState(["08:00-12:00", "14:00-18:00"]);
  const [newStart, setNewStart] = useState("08:00");
  const [newEnd, setNewEnd] = useState("12:00");
  const [dialogOpen, setDialogOpen] = useState(false);

  const addCustomHour = () => {
    const slot = `${newStart}-${newEnd}`;
    if (newStart >= newEnd) {
      toast.error("Hora de início deve ser antes da hora de fim");
      return;
    }
    if (customHours.includes(slot)) {
      toast.error("Este horário já existe");
      return;
    }
    setCustomHours((prev) => [...prev, slot]);
    setDialogOpen(false);
    toast.success(`Horário ${slot} adicionado`);
  };

  const removeCustomHour = (h: string) => {
    setCustomHours((prev) => prev.filter((x) => x !== h));
    setSelectedHours((prev) => prev.filter((x) => x !== h));
  };

  const toggleDay = (d: string) =>
    setSelectedDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  const toggleHour = (h: string) =>
    setSelectedHours((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

  const incomingRequests = serviceRequests.filter(
    (r) => r.status === "pending_broadcast" || r.status === "accepted" || r.status === "in_progress"
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Wrench size={14} className="text-primary-foreground" />
            </div>
            <h1 className="font-display text-base font-bold">BairroWorks</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="font-display text-xl font-bold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Gerir a sua atividade</p>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <s.icon size={18} className="text-primary" />
                  <span className="text-[11px] font-semibold text-emerald-400">{s.change}</span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Incoming requests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap size={18} className="text-primary" /> Pedidos Recebidos
            </h3>
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div key={req.id} className="rounded-xl border border-border bg-secondary p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{req.category}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{req.clientName} • {req.location.bairro}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      req.status === "pending_broadcast" ? "bg-amber-500/15 text-amber-400" :
                      req.status === "in_progress" ? "bg-primary/15 text-primary" :
                      "bg-emerald-500/15 text-emerald-400"
                    }`}>
                      {req.status === "pending_broadcast" ? "Novo" : req.status === "in_progress" ? "Em curso" : "Aceite"}
                    </span>
                  </div>
                  {req.status === "pending_broadcast" && (
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-xl bg-gradient-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                        Aceitar
                      </button>
                      <button className="flex-1 rounded-xl border border-border bg-secondary py-2 text-sm font-medium text-muted-foreground hover:bg-surface-hover transition-colors">
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Disponibilidade
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Dias disponíveis</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    selectedDays.includes(d)
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground border border-border hover:bg-surface-hover"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Horários</p>
            <div className="flex flex-wrap gap-2">
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => toggleHour(h)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-all ${
                    selectedHours.includes(h)
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground border border-border hover:bg-surface-hover"
                  }`}
                >
                  <Clock size={14} /> {h}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
