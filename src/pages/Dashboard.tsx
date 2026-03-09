import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { TrendingUp, CheckCircle2, Star, Clock, Zap, Calendar, Wrench, Plus, X, Play, XCircle, MessageSquare, RotateCcw, ChevronDown, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { serviceRequests, type ServiceRequest } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Pedidos esta semana", value: "12", icon: Zap, change: "+3" },
  { label: "Taxa aceitação", value: "92%", icon: TrendingUp, change: "+2%" },
  { label: "Rating médio", value: "4.8", icon: Star, change: "+0.1" },
  { label: "Completados", value: "245", icon: CheckCircle2, change: "+8" },
];

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const defaultHours = ["08:00-12:00", "14:00-18:00", "19:00-22:00"];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

type RequestStatus = ServiceRequest["status"];

export default function Dashboard() {
  const [selectedDays, setSelectedDays] = useState(["Seg", "Ter", "Qua", "Qui", "Sex"]);
  const [customHours, setCustomHours] = useState<string[]>(defaultHours);
  const [selectedHours, setSelectedHours] = useState(["08:00-12:00", "14:00-18:00"]);
  const [newStart, setNewStart] = useState("08:00");
  const [newEnd, setNewEnd] = useState("12:00");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Request management state
  const [requests, setRequests] = useState<ServiceRequest[]>(serviceRequests);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);
  const [newlyArrivedIds, setNewlyArrivedIds] = useState<Set<string>>(new Set());
  const [hasPulse, setHasPulse] = useState(false);
  const poolIndexRef = useRef(0);

  const incomingPool: ServiceRequest[] = [
    {
      id: "sim-1",
      clientId: "c10",
      clientName: "Beatriz Monteiro",
      category: "Canalizador",
      description: "Torneira da casa de banho a pingar. Preciso de reparação.",
      location: { lat: -8.840, lng: 13.231, bairro: "Talatona" },
      requestedDate: "2026-03-10",
      timeWindow: "10:00-12:00",
      urgency: "medium",
      status: "pending_broadcast",
      createdAt: new Date().toISOString(),
      countdown: 90,
    },
    {
      id: "sim-2",
      clientId: "c11",
      clientName: "Rui Pacheco",
      category: "Canalizador",
      description: "Instalação de esquentador novo. Cozinha T2.",
      location: { lat: -8.828, lng: 13.245, bairro: "Kilamba" },
      requestedDate: "2026-03-11",
      timeWindow: "14:00-17:00",
      urgency: "low",
      status: "pending_broadcast",
      createdAt: new Date().toISOString(),
    },
    {
      id: "sim-3",
      clientId: "c12",
      clientName: "Filomena Dias",
      category: "Canalizador",
      description: "Entupimento no WC. Urgente, água a transbordar.",
      location: { lat: -8.835, lng: 13.238, bairro: "Benfica" },
      requestedDate: "2026-03-09",
      timeWindow: "08:00-10:00",
      urgency: "high",
      status: "pending_broadcast",
      createdAt: new Date().toISOString(),
      countdown: 60,
    },
    {
      id: "sim-4",
      clientId: "c13",
      clientName: "André Lopes",
      category: "Canalizador",
      description: "Substituição de canos antigos no quintal.",
      location: { lat: -8.820, lng: 13.250, bairro: "Viana" },
      requestedDate: "2026-03-12",
      timeWindow: "09:00-12:00",
      urgency: "low",
      status: "pending_broadcast",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const pool = incomingPool;
      const idx = poolIndexRef.current % pool.length;
      const next = pool[idx];
      poolIndexRef.current += 1;

      setRequests((prev) => {
        if (prev.find((r) => r.id === next.id)) return prev;
        return [next, ...prev];
      });

      setNewlyArrivedIds((prev) => new Set(prev).add(next.id));
      setHasPulse(true);

      setTimeout(() => {
        setNewlyArrivedIds((prev) => {
          const s = new Set(prev);
          s.delete(next.id);
          return s;
        });
        setHasPulse(false);
      }, 3000);
    }, 8000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Filter incoming requests
  const incomingRequests = requests.filter(
    (r) => r.status === "pending_broadcast" || r.status === "accepted" || r.status === "in_progress"
  );

  // Update request status
  const updateRequestStatus = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    const statusLabels: Record<RequestStatus, string> = {
      pending_broadcast: "Novo",
      accepted: "Aceite",
      in_progress: "Em curso",
      completed: "Concluído",
      cancelled: "Cancelado",
      expired: "Expirado",
    };
    toast.success(`Pedido ${statusLabels[newStatus].toLowerCase()}!`);
    setExpandedRequest(null);
  };

  // Handle reschedule
  const handleReschedule = (id: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Selecione data e hora");
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              requestedDate: format(rescheduleDate, "d MMM", { locale: pt }),
              timeWindow: rescheduleTime,
            }
          : r
      )
    );
    toast.success("Horário remarcado com sucesso!");
    setRescheduleOpen(null);
    setRescheduleDate(undefined);
    setRescheduleTime(null);
  };

  const getStatusBadge = (status: RequestStatus) => {
    const config: Record<RequestStatus, { label: string; class: string }> = {
      pending_broadcast: { label: "Novo", class: "bg-amber-500/15 text-amber-400" },
      accepted: { label: "Aceite", class: "bg-emerald-500/15 text-emerald-400" },
      in_progress: { label: "Em curso", class: "bg-primary/15 text-primary" },
      completed: { label: "Concluído", class: "bg-muted text-muted-foreground" },
      cancelled: { label: "Cancelado", class: "bg-destructive/15 text-destructive" },
      expired: { label: "Expirado", class: "bg-muted text-muted-foreground" },
    };
    return config[status];
  };

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap size={18} className="text-primary" /> Pedidos Recebidos
              <span className="ml-auto flex items-center gap-2">
                {hasPulse && (
                  <motion.span
                    key="bell"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400"
                  >
                    <BellRing size={11} className="animate-bounce" /> Novo
                  </motion.span>
                )}
                {incomingRequests.length > 0 && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    {incomingRequests.length}
                  </span>
                )}
              </span>
            </h3>

            {incomingRequests.length === 0 ? (
              <div className="text-center py-8">
                <Zap size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Sem pedidos pendentes</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                {incomingRequests.map((req) => {
                  const statusBadge = getStatusBadge(req.status);
                  const isExpanded = expandedRequest === req.id;
                  const isRescheduling = rescheduleOpen === req.id;
                  const isNew = newlyArrivedIds.has(req.id);

                  return (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: -16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={cn(
                        "rounded-xl border bg-secondary overflow-hidden transition-colors duration-700",
                        isNew ? "border-amber-500/50 shadow-[0_0_0_2px_hsl(var(--primary)/0.15)]" : "border-border"
                      )}
                    >
                      {/* Main info row - clickable on mobile */}
                      <button
                        onClick={() => setExpandedRequest(isExpanded ? null : req.id)}
                        className="w-full p-3 md:p-4 text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-foreground text-sm">{req.category}</p>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadge.class}`}>
                                {statusBadge.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{req.clientName} • {req.location.bairro}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock size={11} /> {req.timeWindow}</span>
                              <span className="flex items-center gap-1"><Calendar size={11} /> {req.requestedDate}</span>
                            </div>
                          </div>
                          <ChevronDown
                            size={16}
                            className={cn(
                              "shrink-0 text-muted-foreground transition-transform md:hidden",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </div>
                      </button>

                      {/* Expanded actions - mobile accordion / desktop always visible */}
                      <AnimatePresence>
                        {(isExpanded || typeof window !== "undefined") && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={cn(
                              "border-t border-border overflow-hidden",
                              !isExpanded && "hidden md:block"
                            )}
                          >
                            <div className="p-3 md:p-4 space-y-3">
                              {/* Actions based on status */}
                              {req.status === "pending_broadcast" && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => updateRequestStatus(req.id, "accepted")}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-[0.98] min-h-[44px]"
                                  >
                                    <CheckCircle2 size={16} /> Aceitar
                                  </button>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setRescheduleOpen(req.id)}
                                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors active:scale-[0.98] min-h-[44px]"
                                    >
                                      <RotateCcw size={14} />
                                      <span className="sm:hidden">Remarcar</span>
                                    </button>
                                    <button
                                      onClick={() => updateRequestStatus(req.id, "cancelled")}
                                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 py-2.5 px-4 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors active:scale-[0.98] min-h-[44px]"
                                    >
                                      <XCircle size={14} />
                                      <span className="sm:hidden">Recusar</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {req.status === "accepted" && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => updateRequestStatus(req.id, "in_progress")}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-[0.98] min-h-[44px]"
                                  >
                                    <Play size={16} /> Iniciar Serviço
                                  </button>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setRescheduleOpen(req.id)}
                                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors active:scale-[0.98] min-h-[44px]"
                                    >
                                      <RotateCcw size={14} />
                                      <span className="sm:hidden">Remarcar</span>
                                    </button>
                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors active:scale-[0.98] min-h-[44px]">
                                      <MessageSquare size={14} />
                                      <span className="sm:hidden">Chat</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {req.status === "in_progress" && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => updateRequestStatus(req.id, "completed")}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors active:scale-[0.98] min-h-[44px]"
                                  >
                                    <CheckCircle2 size={16} /> Concluir Serviço
                                  </button>
                                  <button className="sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors active:scale-[0.98] min-h-[44px]">
                                    <MessageSquare size={14} />
                                    <span className="sm:hidden">Contactar Cliente</span>
                                    <span className="hidden sm:inline">Chat</span>
                                  </button>
                                </div>
                              )}

                              {/* Reschedule dialog inline */}
                              <AnimatePresence>
                                {isRescheduling && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4"
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-semibold text-foreground">Remarcar horário</h4>
                                      <button
                                        onClick={() => setRescheduleOpen(null)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                                      >
                                        <X size={14} className="text-muted-foreground" />
                                      </button>
                                    </div>

                                    {/* Date picker */}
                                    <div className="rounded-xl border border-border bg-card p-2 flex justify-center">
                                      <CalendarUI
                                        mode="single"
                                        selected={rescheduleDate}
                                        onSelect={setRescheduleDate}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        className="p-1 pointer-events-auto"
                                      />
                                    </div>

                                    {/* Time slots */}
                                    {rescheduleDate && (
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-2">Escolha o horário</p>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                                          {timeSlots.map((t) => (
                                            <button
                                              key={t}
                                              onClick={() => setRescheduleTime(t)}
                                              className={cn(
                                                "rounded-lg px-2 py-2 text-xs font-medium text-center transition-all border",
                                                rescheduleTime === t
                                                  ? "border-primary bg-primary/15 text-primary"
                                                  : "border-border bg-card text-foreground hover:bg-secondary"
                                              )}
                                            >
                                              {t}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Confirm */}
                                    <button
                                      onClick={() => handleReschedule(req.id)}
                                      disabled={!rescheduleDate || !rescheduleTime}
                                      className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                      Confirmar novo horário
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </div>
            )}
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
              {customHours.map((h) => (
                <div key={h} className="relative group">
                  <button
                    onClick={() => toggleHour(h)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-all ${
                      selectedHours.includes(h)
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-secondary text-muted-foreground border border-border hover:bg-surface-hover"
                    }`}
                  >
                    <Clock size={14} /> {h}
                  </button>
                  {!defaultHours.includes(h) && (
                    <button
                      onClick={() => removeCustomHour(h)}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button className="rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-1.5 border border-dashed border-border text-muted-foreground hover:bg-surface-hover transition-all">
                    <Plus size={14} /> Adicionar
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[340px]">
                  <DialogHeader>
                    <DialogTitle>Novo horário</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Início</label>
                        <Input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
                      </div>
                      <span className="text-muted-foreground mt-4">—</span>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Fim</label>
                        <Input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
                      </div>
                    </div>
                    <button
                      onClick={addCustomHour}
                      className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Adicionar horário
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
