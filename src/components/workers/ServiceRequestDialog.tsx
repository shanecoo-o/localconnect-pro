import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { X, Check, Clock, Zap, CalendarIcon, MapPin, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { bookingServices, type BookingService } from "@/data/bookingData";
import type { Worker } from "@/data/mockData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: Worker;
  onConfirm: (message: string) => void;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00",
];

export default function ServiceRequestDialog({ open, onOpenChange, worker, onConfirm }: Props) {
  const [step, setStep] = useState<"service" | "details">("service");
  const [selectedService, setSelectedService] = useState<BookingService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Filter services by worker's categories
  const workerServices = bookingServices.filter((s) =>
    worker.categories.some((cat) => s.category === cat)
  );

  const handleSelectService = (s: BookingService) => {
    setSelectedService(s);
    setStep("details");
  };

  const handleConfirm = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const dateStr = format(selectedDate, "EEEE, d 'de' MMMM", { locale: pt });
    const message = `📋 *Pedido de Serviço*\n\n` +
      `🔧 Serviço: ${selectedService.name}\n` +
      `📅 Data: ${dateStr}\n` +
      `🕐 Horário: ${selectedTime}\n` +
      `📍 Local: ${worker.location.bairro}, ${worker.location.cidade}\n` +
      `💰 Preço estimado: ${selectedService.price}\n` +
      `⏱️ Duração: ${selectedService.durationMinutes} min\n\n` +
      `Olá ${worker.name}, gostaria de agendar este serviço. Pode confirmar a disponibilidade?`;

    onConfirm(message);
    // Reset
    setStep("service");
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("service");
    setSelectedDate(undefined);
    setSelectedTime(null);
  };

  const canConfirm = !!selectedService && !!selectedDate && !!selectedTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl border-border">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            {step === "details" && (
              <button onClick={handleBack} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                <X size={16} className="text-muted-foreground rotate-0" />
              </button>
            )}
            <DialogTitle className="font-display text-base font-bold flex-1">
              {step === "service" ? "Escolha o Serviço" : "Detalhes da Marcação"}
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {step === "service"
              ? `Serviços disponíveis por ${worker.name}`
              : `${selectedService?.icon} ${selectedService?.name}`}
          </p>
        </DialogHeader>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {step === "service" ? (
              <motion.div
                key="service"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                {workerServices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Nenhum serviço disponível</p>
                  </div>
                ) : (
                  workerServices.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectService(s)}
                      className="w-full rounded-xl border border-border bg-card p-3 text-left transition-all hover:bg-secondary hover:border-primary/30 flex items-center gap-3 active:scale-[0.98]"
                    >
                      <span className="text-xl">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.durationMinutes} min • {s.price}
                        </p>
                      </div>
                      <Zap size={14} className="text-muted-foreground" />
                    </button>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Date picker */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CalendarIcon size={14} className="text-primary" /> Escolha a data
                  </h4>
                  <div className="rounded-xl border border-border bg-card p-2 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="p-1 pointer-events-auto"
                    />
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Clock size={14} className="text-primary" /> Escolha o horário
                    </h4>
                    <div className="grid grid-cols-4 gap-1.5">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            "rounded-lg px-2 py-2 text-xs font-medium text-center transition-all border",
                            selectedTime === t
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border bg-card text-foreground hover:bg-secondary"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Summary preview */}
                {canConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1.5"
                  >
                    <p className="text-xs font-semibold text-primary">Resumo do pedido</p>
                    <div className="text-xs text-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <span>{selectedService?.icon}</span> {selectedService?.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarIcon size={12} className="text-muted-foreground" />
                        {format(selectedDate!, "d MMM yyyy", { locale: pt })}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock size={12} className="text-muted-foreground" />
                        {selectedTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={12} className="text-muted-foreground" />
                        {worker.location.bairro}, {worker.location.cidade}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Confirm */}
                <button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Enviar Pedido via Mensagem
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
