import { Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import WorkerMap from "@/components/map/WorkerMap";
import { workers } from "@/data/mockData";

export default function Explore() {
  return (
    <AppLayout>
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <h2 className="font-display text-lg font-bold">Explorar Mapa</h2>
        <p className="text-xs text-muted-foreground">Encontre profissionais perto de si</p>
      </div>
      <div className="h-[calc(100vh-130px)] md:h-[calc(100vh-80px)] p-4">
        <WorkerMap workers={workers} />
      </div>
    </AppLayout>
  );
}
