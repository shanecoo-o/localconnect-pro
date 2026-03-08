import { useState } from "react";
import { Map, List, Search, Bell, Wrench, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import WorkerCard from "@/components/workers/WorkerCard";
import CategoryFilter from "@/components/workers/CategoryFilter";
import WorkerMap from "@/components/map/WorkerMap";
import { workers, categories } from "@/data/mockData";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = workers.filter((w) => {
    const catMatch =
      !selectedCategory ||
      w.categories.some(
        (c) => categories.find((cat) => cat.id === selectedCategory)?.name === c
      );
    const searchMatch =
      !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.categories.some((c) => c.toLowerCase().includes(search.toLowerCase())) ||
      w.location.bairro.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Wrench size={14} className="text-primary-foreground" />
            </div>
            <h1 className="font-display text-base font-bold">BairroWorks</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="font-display text-xl font-bold">Encontrar Profissionais</h2>
            <p className="text-sm text-muted-foreground">Serviços locais ao seu alcance</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-secondary text-muted-foreground hover:bg-surface-hover transition-colors">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 md:h-4 md:w-4 items-center justify-center rounded-full bg-primary text-[8px] md:text-[9px] font-bold text-primary-foreground">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-2 md:px-6 md:pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground md:left-3.5" />
            <input
              type="text"
              placeholder="Pesquisar serviço, bairro ou profissional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg md:rounded-xl border border-border bg-secondary py-2 md:py-2.5 pl-9 md:pl-10 pr-3 md:pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Categories + view toggle */}
        <div className="flex items-center gap-2 px-3 pb-2 md:gap-3 md:px-6 md:pb-3">
          <div className="flex-1 min-w-0">
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
          <div className="flex shrink-0 rounded-lg md:rounded-xl border border-border bg-secondary p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md md:rounded-lg p-1.5 md:p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={14} className="md:hidden" />
              <List size={16} className="hidden md:block" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`rounded-md md:rounded-lg p-1.5 md:p-2 transition-colors ${viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Map size={14} className="md:hidden" />
              <Map size={16} className="hidden md:block" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 md:p-6"
          >
            <div className="mb-2 md:mb-3 flex items-center justify-between">
              <p className="text-xs md:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> profissionais
              </p>
              <select className="rounded-lg border border-border bg-secondary px-2 md:px-3 py-1 md:py-1.5 text-[11px] md:text-xs text-secondary-foreground focus:outline-none">
                <option>Mais próximos</option>
                <option>Melhor rating</option>
                <option>Mais ativos</option>
              </select>
            </div>
            <div className="grid gap-2.5 md:gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((worker, i) => (
                <WorkerCard key={worker.id} worker={worker} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={48} className="text-muted-foreground/30 mb-4" />
                <p className="font-display text-lg font-semibold text-muted-foreground">Nenhum profissional encontrado</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Tente ajustar os filtros</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100vh-220px)] md:h-[calc(100vh-200px)] p-4 md:p-6"
          >
            <WorkerMap workers={filtered} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
