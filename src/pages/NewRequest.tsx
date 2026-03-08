import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, AlertTriangle, Send, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

export default function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    description: "",
    bairro: "",
    date: "",
    timeWindow: "",
    urgency: "medium" as "low" | "medium" | "high",
  });

  const handleSubmit = () => {
    if (!form.category || !form.description || !form.bairro) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    toast.success("Pedido enviado! A procurar profissionais...", {
      description: "O broadcast foi iniciado para trabalhadores próximos.",
    });
    navigate("/");
  };

  const urgencyOptions = [
    { value: "low", label: "Baixa", desc: "Pode esperar", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    { value: "medium", label: "Média", desc: "Esta semana", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    { value: "high", label: "Alta", desc: "Urgente", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  ];

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:bg-surface-hover transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display font-semibold">Novo Pedido de Serviço</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Category */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Categoria *</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.name })}
                  className={`rounded-xl border p-3 text-left text-sm transition-all ${
                    form.category === cat.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <p className="mt-1 font-medium">{cat.name}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-border bg-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Descrição *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o serviço que precisa..."
              rows={4}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <button className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <Camera size={16} /> Adicionar fotos
            </button>
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Localização *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                placeholder="Ex: Talatona, Kilamba, Viana..."
                className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="mt-2 flex items-center gap-2 text-xs text-primary font-medium hover:underline">
              <MapPin size={14} /> Usar minha localização GPS
            </button>
          </motion.div>

          {/* Date & Time */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" /> Data
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" /> Horário
                </label>
                <select
                  value={form.timeWindow}
                  onChange={(e) => setForm({ ...form, timeWindow: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Qualquer</option>
                  <option value="08:00-12:00">Manhã (08-12h)</option>
                  <option value="14:00-18:00">Tarde (14-18h)</option>
                  <option value="19:00-22:00">Noite (19-22h)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Urgency */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-4">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-primary" /> Urgência
            </label>
            <div className="grid grid-cols-3 gap-2">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, urgency: opt.value as any })}
                  className={`rounded-xl border p-3 text-center text-sm transition-all ${
                    form.urgency === opt.value ? opt.color : "border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-[11px] opacity-70 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="pb-4">
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-display font-semibold text-primary-foreground glow-primary-sm hover:opacity-90 transition-opacity"
            >
              <Send size={18} /> Enviar Pedido Broadcast
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              O pedido será enviado para profissionais próximos
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary py-3 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              <Calendar size={16} /> Ou agende com horário específico
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
