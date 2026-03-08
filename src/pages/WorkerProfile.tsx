import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Zap, Phone, MessageSquare, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { workers } from "@/data/mockData";
import ServiceRequestDialog from "@/components/workers/ServiceRequestDialog";
import { toast } from "sonner";

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const worker = workers.find((w) => w.id === id);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);

  if (!worker) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Profissional não encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:bg-surface-hover transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-semibold">Perfil do Profissional</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Header card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary font-display text-3xl font-bold text-primary">
                  {worker.name.charAt(0)}
                </div>
                {worker.online && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-card bg-emerald-500" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold text-foreground">{worker.name}</h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} /> {worker.location.bairro}, {worker.location.cidade}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <Star size={14} className="fill-primary" /> {worker.rating}
                  </span>
                  <span className="text-muted-foreground">({worker.reviewCount} avaliações)</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{worker.bio}</p>

            {/* Badges */}
            {worker.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {worker.badges.map((b) => (
                  <span key={b} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
            {[
              { label: "Trabalhos", value: worker.completedJobs, icon: CheckCircle2 },
              { label: "Aceitação", value: `${worker.acceptanceRate}%`, icon: TrendingUp },
              { label: "Rating", value: worker.rating, icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                <stat.icon size={18} className="mx-auto text-primary mb-1" />
                <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Competências</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((s) => (
                <span key={s} className="rounded-xl bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Disponibilidade
            </h3>
            <div className="grid grid-cols-7 gap-1.5 mb-3">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((d) => (
                <span
                  key={d}
                  className={`rounded-lg py-2 text-xs font-medium text-center ${
                    worker.availability.days.includes(d)
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {worker.availability.hours.map((h) => (
                <span key={h} className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                  <Clock size={12} /> {h}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Price */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Preço aproximado</p>
              <p className="font-display text-lg font-bold text-primary">{worker.priceRange}</p>
            </div>
            {worker.urgentAvailable && (
              <span className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
                <Zap size={14} /> Urgente disponível
              </span>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3 pb-4">
            <button
              onClick={() => navigate("/new-request")}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3.5 font-display font-semibold text-primary-foreground glow-primary-sm hover:opacity-90 transition-opacity"
            >
              <Zap size={18} /> Pedir Serviço
            </button>
            <button className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground hover:bg-surface-hover transition-colors">
              <MessageSquare size={20} />
            </button>
            <button className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground hover:bg-surface-hover transition-colors">
              <Phone size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
