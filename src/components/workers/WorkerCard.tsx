import { Star, MapPin, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Worker } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function WorkerCard({ worker, index = 0 }: { worker: Worker; index?: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/worker/${worker.id}`)}
      className="group cursor-pointer rounded-xl md:rounded-2xl border border-border bg-card p-3 md:p-4 card-hover"
    >
      <div className="flex items-start gap-2.5 md:gap-3">
        <div className="relative">
          <div className="flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-secondary font-display text-lg md:text-xl font-bold text-primary">
            {worker.name.charAt(0)}
          </div>
          {worker.online && (
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card bg-emerald-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-foreground truncate">{worker.name}</h3>
            {worker.urgentAvailable && (
              <span className="flex items-center gap-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <Zap size={10} /> Urgente
              </span>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {worker.location.bairro}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-primary text-primary" /> {worker.rating}
              <span className="text-muted-foreground">({worker.reviewCount})</span>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {worker.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-primary">{worker.priceRange}</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock size={11} /> {worker.availability.hours[0]}
            </span>
          </div>
        </div>
      </div>

      {worker.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
          {worker.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
