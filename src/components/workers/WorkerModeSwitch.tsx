import { Wrench, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function WorkerModeSwitch() {
  const { workerMode, setWorkerMode } = useAuth();
  const navigate = useNavigate();

  const toggle = () => {
    const next = workerMode === "professional" ? "client" : "professional";
    setWorkerMode(next);
    navigate(next === "professional" ? "/dashboard" : "/");
  };

  return (
    <button
      onClick={toggle}
      className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 transition-colors hover:bg-surface-hover"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
        workerMode === "professional" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
      }`}>
        {workerMode === "professional" ? <Wrench size={14} /> : <ShoppingBag size={14} />}
      </div>
      <div className="flex-1 text-left">
        <p className="text-xs font-medium text-foreground">
          {workerMode === "professional" ? "Modo Profissional" : "Modo Cliente"}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {workerMode === "professional" ? "Trocar para cliente" : "Trocar para profissional"}
        </p>
      </div>
      <div className="h-5 w-9 rounded-full bg-muted p-0.5 transition-colors">
        <div className={`h-4 w-4 rounded-full bg-primary transition-transform ${
          workerMode === "client" ? "translate-x-4" : "translate-x-0"
        }`} />
      </div>
    </button>
  );
}
