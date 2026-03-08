import { useEffect, useRef } from "react";
import { Worker } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkerMap({ workers }: { workers: Worker[] }) {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-border bg-card relative">
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="text-primary" />
          <span>Luanda, Angola</span>
        </div>
        <span className="text-xs text-muted-foreground">{workers.length} profissionais</span>
      </div>

      {/* Map area with worker pins */}
      <div className="relative z-10 h-[calc(100%-60px)] p-4 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {workers.map((worker, i) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/worker/${worker.id}`)}
              className="cursor-pointer rounded-xl border border-border bg-secondary/80 p-3 card-hover"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card font-display text-sm font-bold text-primary">
                    {worker.name.charAt(0)}
                  </div>
                  {worker.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-secondary bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{worker.name}</p>
                  <p className="text-[11px] text-muted-foreground">{worker.categories[0]}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={11} /> {worker.location.bairro}
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <Star size={11} className="fill-primary" /> {worker.rating}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
