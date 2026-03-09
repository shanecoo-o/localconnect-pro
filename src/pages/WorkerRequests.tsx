import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ClipboardList, MapPin, Clock, MessageSquare, CheckCircle2,
  XCircle, Play, Eye, Bell, RotateCcw, X, ChevronDown,
  Calendar as CalendarIcon, User, Search, Check, ChevronsUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { serviceRequests, type ServiceRequest } from "@/data/mockData";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

type TabKey = "all" | "new" | "accepted" | "in_progress" | "completed" | "cancelled";
type RequestStatus = ServiceRequest["status"];

const tabs: { key: TabKey; label: string; statuses: string[] }[] = [
  { key: "all",        label: "Todos",      statuses: ["pending_broadcast","accepted","in_progress","completed","cancelled","expired"] },
  { key: "new",        label: "Novos",      statuses: ["pending_broadcast"] },
  { key: "accepted",   label: "Aceites",    statuses: ["accepted"] },
  { key: "in_progress",label: "Em Curso",   statuses: ["in_progress"] },
  { key: "completed",  label: "Concluídos", statuses: ["completed"] },
  { key: "cancelled",  label: "Cancelados", statuses: ["cancelled","expired"] },
];

const urgencyConfig = {
  high:   { label: "Urgente", class: "bg-destructive/15 text-destructive border-destructive/20" },
  medium: { label: "Médio",   class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  low:    { label: "Normal",  class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

const statusConfig: Record<RequestStatus, { label: string; class: string }> = {
  pending_broadcast: { label: "Novo",        class: "bg-amber-500/15 text-amber-400" },
  accepted:          { label: "Aceite",      class: "bg-emerald-500/15 text-emerald-400" },
  in_progress:       { label: "Em Curso",    class: "bg-primary/15 text-primary" },
  completed:         { label: "Concluído",   class: "bg-muted text-muted-foreground" },
  cancelled:         { label: "Cancelado",   class: "bg-destructive/15 text-destructive" },
  expired:           { label: "Expirado",    class: "bg-muted text-muted-foreground" },
};

const timeSlots = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","14:00","14:30","15:00",
  "15:30","16:00","16:30","17:00","17:30","18:00",
];

export default function WorkerRequests() {
  const [activeTab, setActiveTab]     = useState<TabKey>("new");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [requests, setRequests]       = useState<ServiceRequest[]>(serviceRequests);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [showSearch, setShowSearch]   = useState(false);

  const activeStatuses = tabs.find((t) => t.key === activeTab)?.statuses ?? [];

  const filtered = requests
    .filter((r) => activeStatuses.includes(r.status))
    .filter((r) =>
      !search ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.location.bairro.toLowerCase().includes(search.toLowerCase())
    );

  const newCount = requests.filter((r) => r.status === "pending_broadcast").length;

  const updateStatus = (id: string, next: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    toast.success(`Pedido ${statusConfig[next].label.toLowerCase()}!`);
    setExpanded(null);
  };

  const handleReschedule = (id: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Selecione data e hora");
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, requestedDate: format(rescheduleDate, "yyyy-MM-dd"), timeWindow: rescheduleTime! }
          : r
      )
    );
    toast.success("Horário remarcado com sucesso!");
    setRescheduleOpen(null);
    setRescheduleDate(undefined);
    setRescheduleTime(null);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold flex items-center gap-2">
                  <ClipboardList size={20} className="text-primary" /> Pedidos
                </h2>
                <p className="text-xs text-muted-foreground">Gerir pedidos recebidos</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSearch((s) => !s)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary hover:bg-surface-hover transition-colors"
                >
                  <Search size={16} className="text-muted-foreground" />
                </button>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary hover:bg-surface-hover transition-colors">
                  <Bell size={16} className="text-muted-foreground" />
                  {newCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {newCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search bar */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <Input
                    autoFocus
                    placeholder="Pesquisar por cliente, categoria, bairro…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-secondary border-border rounded-xl text-sm h-9"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Filter combobox ───────────────────────────────── */}
          <div className="px-4 md:px-6 pb-3">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={filterOpen}
                  className="w-full justify-between rounded-xl border-border bg-secondary text-sm hover:bg-surface-hover h-9"
                >
                  <span className="flex items-center gap-2">
                    {(() => {
                      const tab = tabs.find((t) => t.key === activeTab)!;
                      const count = requests.filter((r) => tab.statuses.includes(r.status)).length;
                      return (
                        <>
                          {tab.label}
                          {count > 0 && (
                            <span className="rounded-full bg-primary/15 text-primary px-1.5 py-0.5 text-[10px] font-bold">
                              {count}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                    <CommandGroup>
                      {tabs.map((tab) => {
                        const count = requests.filter((r) => tab.statuses.includes(r.status)).length;
                        return (
                          <CommandItem
                            key={tab.key}
                            onSelect={() => {
                              setActiveTab(tab.key);
                              setFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", activeTab === tab.key ? "opacity-100" : "opacity-0")}
                            />
                            {tab.label}
                            {count > 0 && (
                              <span className="ml-auto text-xs text-muted-foreground">{count}</span>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* ── List ───────────────────────────────────────────── */}
        <div className="p-4 md:p-6 space-y-3">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <ClipboardList size={48} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">Sem pedidos nesta categoria</p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Limpar pesquisa
                </button>
              )}
            </motion.div>
          ) : (
            filtered.map((req, i) => {
              const urg    = urgencyConfig[req.urgency];
              const status = statusConfig[req.status];
              const isExp  = expanded === req.id;
              const isRes  = rescheduleOpen === req.id;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  {/* ── Card header (always visible) ── */}
                  <button
                    onClick={() => setExpanded(isExp ? null : req.id)}
                    className="w-full p-4 md:p-5 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Category + badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">{req.category}</span>
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", urg.class)}>
                            {urg.label}
                          </span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ml-auto", status.class)}>
                            {status.label}
                          </span>
                        </div>

                        {/* Client + location */}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User size={11} /> {req.clientName}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {req.location.bairro}</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{req.description}</p>

                        {/* Date + time */}
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={11} /> {req.timeWindow}</span>
                          <span className="flex items-center gap-1"><CalendarIcon size={11} /> {req.requestedDate}</span>
                        </div>
                      </div>

                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 mt-1 text-muted-foreground transition-transform duration-200",
                          isExp && "rotate-180"
                        )}
                      />
                    </div>
                  </button>

                  {/* ── Expanded actions ── */}
                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        key="expanded"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border p-4 md:p-5 space-y-3">

                          {/* ── Actions per status ── */}
                          {req.status === "pending_broadcast" && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => updateStatus(req.id, "accepted")}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-[0.98] min-h-[44px]"
                              >
                                <CheckCircle2 size={16} /> Aceitar Pedido
                              </button>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setRescheduleOpen(isRes ? null : req.id)}
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors min-h-[44px]"
                                >
                                  <RotateCcw size={14} /> Remarcar
                                </button>
                                <button
                                  onClick={() => updateStatus(req.id, "cancelled")}
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 py-3 px-4 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors min-h-[44px]"
                                >
                                  <XCircle size={14} /> Recusar
                                </button>
                              </div>
                            </div>
                          )}

                          {req.status === "accepted" && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => updateStatus(req.id, "in_progress")}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-[0.98] min-h-[44px]"
                              >
                                <Play size={16} /> Iniciar Serviço
                              </button>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setRescheduleOpen(isRes ? null : req.id)}
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors min-h-[44px]"
                                >
                                  <RotateCcw size={14} /> Remarcar
                                </button>
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors min-h-[44px]">
                                  <MessageSquare size={14} /> Chat
                                </button>
                              </div>
                            </div>
                          )}

                          {req.status === "in_progress" && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => updateStatus(req.id, "completed")}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors active:scale-[0.98] min-h-[44px]"
                              >
                                <CheckCircle2 size={16} /> Concluir Serviço
                              </button>
                              <button className="sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors min-h-[44px]">
                                <MessageSquare size={14} /> Contactar Cliente
                              </button>
                            </div>
                          )}

                          {(req.status === "completed" || req.status === "cancelled" || req.status === "expired") && (
                            <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-muted-foreground hover:bg-surface-hover transition-colors min-h-[44px]">
                              <Eye size={14} /> Ver Detalhes Completos
                            </button>
                          )}

                          {/* ── Reschedule panel (inline) ── */}
                          <AnimatePresence>
                            {isRes && (
                              <motion.div
                                key="reschedule"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                      <RotateCcw size={14} className="text-primary" /> Remarcar horário
                                    </h4>
                                    <button
                                      onClick={() => setRescheduleOpen(null)}
                                      className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                                    >
                                      <X size={14} className="text-muted-foreground" />
                                    </button>
                                  </div>

                                  {/* Calendar */}
                                  <div className="rounded-xl border border-border bg-card p-2 flex justify-center">
                                    <Calendar
                                      mode="single"
                                      selected={rescheduleDate}
                                      onSelect={setRescheduleDate}
                                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                      className="p-1 pointer-events-auto"
                                    />
                                  </div>

                                  {/* Time slots */}
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Horário</p>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                                      {timeSlots.map((slot) => (
                                        <button
                                          key={slot}
                                          onClick={() => setRescheduleTime(slot)}
                                          className={cn(
                                            "rounded-lg py-1.5 text-xs font-medium transition-colors border",
                                            rescheduleTime === slot
                                              ? "bg-primary text-primary-foreground border-primary"
                                              : "bg-secondary text-muted-foreground border-border hover:bg-surface-hover"
                                          )}
                                        >
                                          {slot}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Confirm */}
                                  <button
                                    onClick={() => handleReschedule(req.id)}
                                    disabled={!rescheduleDate || !rescheduleTime}
                                    className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
                                  >
                                    Confirmar Remarcação
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
