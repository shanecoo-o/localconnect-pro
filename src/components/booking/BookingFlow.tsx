import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  User,
  Users,
  CalendarIcon,
  ChevronRight,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  bookingServices,
  professionals,
  existingBookings,
  type BookingService,
  type Professional,
  type TimeSlot,
  type Booking,
} from "@/data/bookingData";
import {
  generateSlotsForProfessional,
  generateSlotsAnyProfessional,
  findNextAvailableDate,
} from "@/lib/slotEngine";

const STEPS = [
  "Profissional",
  "Serviço",
  "Data",
  "Horário",
  "Resumo",
] as const;

type Step = (typeof STEPS)[number];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [selectedService, setSelectedService] = useState<BookingService | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [anyProfessional, setAnyProfessional] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(existingBookings);

  const goNext = useCallback(() => { setDirection(1); setStep((s) => Math.min(s + 1, STEPS.length - 1)); }, []);
  const goBack = useCallback(() => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); }, []);

  // Filter services based on selected professional's serviceIds
  const filteredServices = useMemo(() => {
    if (!selectedProfessional) return bookingServices;
    return bookingServices.filter((s) => selectedProfessional.serviceIds.includes(s.id));
  }, [selectedProfessional]);

  // Eligible professionals for selected service
  const eligiblePros = useMemo(
    () =>
      selectedService
        ? professionals.filter((p) => p.serviceIds.includes(selectedService.id))
        : professionals,
    [selectedService]
  );

  // Generate slots
  const slots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    if (anyProfessional) {
      return generateSlotsAnyProfessional(eligiblePros, selectedService, selectedDate, bookings);
    }
    if (selectedProfessional) {
      return generateSlotsForProfessional(selectedProfessional, selectedService, selectedDate, bookings);
    }
    return [];
  }, [selectedService, selectedProfessional, anyProfessional, selectedDate, eligiblePros, bookings]);

  const availableSlots = slots.filter((s) => s.status === "available");

  // Next available date hint
  const nextDate = useMemo(() => {
    if (!selectedService || !selectedDate || availableSlots.length > 0) return null;
    return findNextAvailableDate(
      anyProfessional ? null : selectedProfessional,
      eligiblePros,
      selectedService,
      selectedDate,
      bookings
    );
  }, [selectedService, selectedDate, availableSlots.length, anyProfessional, selectedProfessional, eligiblePros, bookings]);

  const handleConfirm = () => {
    if (!selectedService || !selectedDate || !selectedSlot) return;
    const profId = selectedSlot.professionalId || selectedProfessional?.id || "";
    const endMin =
      selectedSlot.time.split(":").map(Number).reduce((h, m) => h * 60 + m, 0) +
      selectedService.durationMinutes;
    const endTime = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      serviceId: selectedService.id,
      professionalId: profId,
      date: selectedDate.toISOString().split("T")[0],
      startTime: selectedSlot.time,
      endTime,
      clientName: "Você",
      status: "confirmed",
    };
    setBookings((prev) => [...prev, newBooking]);
    toast.success("Marcação confirmada com sucesso!");
    // Reset
    setStep(0);
    setSelectedService(null);
    setSelectedProfessional(null);
    setAnyProfessional(false);
    setSelectedDate(undefined);
    setSelectedSlot(null);
  };

  const profForSummary = useMemo(() => {
    if (selectedProfessional) return selectedProfessional;
    if (selectedSlot?.professionalId)
      return professionals.find((p) => p.id === selectedSlot.professionalId) ?? null;
    return null;
  }, [selectedProfessional, selectedSlot]);

  const canProceed = () => {
    switch (step) {
      case 0: return anyProfessional || !!selectedProfessional;
      case 1: return !!selectedService;
      case 2: return !!selectedDate;
      case 3: return !!selectedSlot;
      default: return true;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-4 px-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all duration-300",
                i <= step ? "bg-primary" : "bg-border"
              )}
            />
          </div>
        ))}
      </div>

      {/* Step label */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goBack}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-0 disabled:pointer-events-none transition-all rounded-xl px-3 py-2 -ml-3 hover:bg-secondary active:scale-95 min-h-[40px] md:min-h-0 md:px-2 md:py-1"
        >
          <ArrowLeft size={18} className="md:w-4 md:h-4" /> Voltar
        </button>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {STEPS[step]}
        </span>
        <div className="w-16" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <StepProfessional
              professionals={professionals}
              selected={selectedProfessional}
              anySelected={anyProfessional}
              onSelect={(p) => {
                setSelectedProfessional(p);
                setAnyProfessional(false);
                if (selectedService && !p.serviceIds.includes(selectedService.id)) {
                  setSelectedService(null);
                }
                setSelectedSlot(null);
                // Auto-advance to service step after a tick so AnimatePresence picks up the change
                setTimeout(() => {
                  setDirection(1);
                  setStep(1);
                }, 150);
              }}
              onSelectAny={() => {
                setAnyProfessional(true);
                setSelectedProfessional(null);
                setSelectedSlot(null);
              }}
            />
          )}
          {step === 1 && (
            <StepService
              services={filteredServices}
              selected={selectedService}
              onSelect={(s) => {
                setSelectedService(s);
                setSelectedDate(undefined);
                setSelectedSlot(null);
              }}
              filterLabel={selectedProfessional ? `Serviços de ${selectedProfessional.name}` : undefined}
            />
          )}
          {step === 2 && (
            <StepDate selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }} />
          )}
          {step === 3 && (
            <StepSlots
              slots={slots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
              nextDate={nextDate}
              onJumpDate={(d) => { setSelectedDate(d); setSelectedSlot(null); setStep(2); }}
            />
          )}
          {step === 4 && (
            <StepSummary
              service={selectedService}
              professional={profForSummary}
              anyProfessional={anyProfessional}
              date={selectedDate}
              slot={selectedSlot}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action button */}
      <div className="mt-5">
        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continuar <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Check size={16} /> Confirmar Marcação
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Step Components
// ==========================================

function StepService({
  services,
  selected,
  onSelect,
  filterLabel,
}: {
  services: BookingService[];
  selected: BookingService | null;
  onSelect: (s: BookingService) => void;
  filterLabel?: string;
}) {
  // If filtered by professional, show flat list; otherwise group by category
  const grouped = useMemo(() => {
    if (filterLabel) return null;
    const map = new Map<string, BookingService[]>();
    for (const s of services) {
      const arr = map.get(s.category) || [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return map;
  }, [services, filterLabel]);

  const ServiceButton = ({ s }: { s: BookingService }) => (
    <button
      key={s.id}
      onClick={() => onSelect(s)}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3",
        selected?.id === s.id
          ? "border-primary/50 bg-primary/10"
          : "border-border bg-card hover:bg-secondary"
      )}
    >
      <span className="text-xl">{s.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm">{s.name}</p>
        <p className="text-xs text-muted-foreground">{s.durationMinutes} min • {s.price}</p>
      </div>
      {selected?.id === s.id && (
        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Check size={12} className="text-primary-foreground" />
        </div>
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold text-foreground">Escolha o serviço</h3>
      {filterLabel && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3 py-2">
          <Filter size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">{filterLabel}</span>
        </div>
      )}
      {filterLabel ? (
        <div className="space-y-2">
          {services.map((s) => <ServiceButton key={s.id} s={s} />)}
        </div>
      ) : (
        grouped && Array.from(grouped.entries()).map(([cat, svcs]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {svcs.map((s) => <ServiceButton key={s.id} s={s} />)}
            </div>
          </div>
        ))
      )}

    </div>
  );
}

function StepProfessional({
  professionals: pros,
  selected,
  anySelected,
  onSelect,
  onSelectAny,
}: {
  professionals: Professional[];
  selected: Professional | null;
  anySelected: boolean;
  onSelect: (p: Professional) => void;
  onSelectAny: () => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold text-foreground">Escolha o profissional</h3>

      {/* Any professional option */}
      <button
        onClick={onSelectAny}
        className={cn(
          "w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3",
          anySelected
            ? "border-primary/50 bg-primary/10"
            : "border-border bg-card hover:bg-secondary"
        )}
      >
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Users size={18} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground text-sm">Qualquer disponível</p>
          <p className="text-xs text-muted-foreground">O sistema escolhe o melhor profissional</p>
        </div>
        {anySelected && (
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Check size={12} className="text-primary-foreground" />
          </div>
        )}
      </button>

      <div className="h-px bg-border" />

      {pros.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p)}
          className={cn(
            "w-full rounded-xl border p-3 text-left transition-all",
            selected?.id === p.id
              ? "border-primary/50 bg-primary/10"
              : "border-border bg-card hover:bg-secondary"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <User size={18} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.schedules.map((s) => s.dayOfWeek).join(", ")}
              </p>
            </div>
            {selected?.id === p.id && (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Check size={12} className="text-primary-foreground" />
              </div>
            )}
          </div>
          {/* Specialties */}
          {p.specialties.length > 0 && (
            <div className="mt-2 ml-13 flex flex-wrap gap-1.5">
              {p.specialties.map((spec) => (
                <span
                  key={spec}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function StepDate({
  selected,
  onSelect,
}: {
  selected: Date | undefined;
  onSelect: (d: Date | undefined) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold text-foreground">Escolha a data</h3>
      <div className="rounded-xl border border-border bg-card p-2 flex justify-center">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          className={cn("p-2 pointer-events-auto")}
        />
      </div>
    </div>
  );
}

function StepSlots({
  slots,
  selectedSlot,
  onSelect,
  nextDate,
  onJumpDate,
}: {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (s: TimeSlot) => void;
  nextDate: Date | null;
  onJumpDate: (d: Date) => void;
}) {
  const available = slots.filter((s) => s.status === "available");
  const hasSlots = slots.length > 0;

  if (!hasSlots || available.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-foreground">Horários</h3>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <Clock size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-1">Sem horários disponíveis nesta data</p>
          {nextDate && (
            <button
              onClick={() => onJumpDate(nextDate)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary/15 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/25 transition-colors"
            >
              <Sparkles size={14} />
              Próxima disponibilidade: {format(nextDate, "d MMM", { locale: pt })}
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Show occupied/past slots for context */}
        {hasSlots && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Horários neste dia (indisponíveis)</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <SlotChip key={s.time} slot={s} selected={false} disabled />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold text-foreground">
        Horários disponíveis
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {available.length} slot{available.length !== 1 ? "s" : ""}
        </span>
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((s) => (
          <SlotChip
            key={s.time}
            slot={s}
            selected={selectedSlot?.time === s.time}
            disabled={s.status !== "available"}
            onClick={() => s.status === "available" && onSelect(s)}
          />
        ))}
      </div>
    </div>
  );
}

function SlotChip({
  slot,
  selected,
  disabled,
  onClick,
}: {
  slot: TimeSlot;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base = "rounded-xl px-3 py-2.5 text-sm font-medium text-center transition-all border";
  const variants: Record<string, string> = {
    available: "border-border bg-card text-foreground hover:bg-secondary cursor-pointer",
    selected: "border-primary bg-primary/15 text-primary",
    occupied: "border-border/50 bg-secondary/50 text-muted-foreground/50 line-through cursor-not-allowed",
    unavailable: "border-border/30 bg-secondary/30 text-muted-foreground/30 cursor-not-allowed",
    past: "border-border/30 bg-secondary/30 text-muted-foreground/40 cursor-not-allowed",
  };

  const status = selected ? "selected" : slot.status;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[status])}
    >
      <Clock size={12} className="inline mr-1 -mt-0.5" />
      {slot.time}
    </button>
  );
}

function StepSummary({
  service,
  professional,
  anyProfessional,
  date,
  slot,
}: {
  service: BookingService | null;
  professional: Professional | null;
  anyProfessional: boolean;
  date: Date | undefined;
  slot: TimeSlot | null;
}) {
  if (!service || !date || !slot) return null;

  const endMin =
    slot.time.split(":").map(Number).reduce((h, m) => h * 60 + m, 0) +
    service.durationMinutes;
  const endTime = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;

  const items = [
    { label: "Serviço", value: `${service.icon} ${service.name}` },
    { label: "Profissional", value: professional ? professional.name : "Qualquer disponível" },
    { label: "Data", value: format(date, "EEEE, d 'de' MMMM", { locale: pt }) },
    { label: "Horário", value: `${slot.time} — ${endTime}` },
    { label: "Duração", value: `${service.durationMinutes} minutos` },
    { label: "Preço", value: service.price },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold text-foreground">Resumo da marcação</h3>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
