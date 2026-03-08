import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wrench, Eye, EyeOff, UserPlus, User, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<"client" | "worker">("client");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A palavra-passe deve ter pelo menos 6 caracteres");
      return;
    }
    try {
      await register({ name, email, password, role });
      toast.success("Conta criada com sucesso!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-5 py-8 sm:px-6">
      <div className="w-full max-w-sm space-y-5 sm:space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-primary glow-primary-sm">
            <Wrench size={24} className="text-primary-foreground sm:[&]:w-7 sm:[&]:h-7" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">BairroWorks</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Cria a tua conta</p>
          </div>
        </div>

        {/* Role selector */}
        <div className="flex gap-2">
          {[
            { value: "client" as const, label: "Cliente", icon: User, desc: "Procurar serviços" },
            { value: "worker" as const, label: "Profissional", icon: Briefcase, desc: "Oferecer serviços" },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cn(
                "flex-1 rounded-xl border p-2.5 sm:p-3 text-left transition-all",
                role === r.value
                  ? "border-primary/50 bg-primary/10"
                  : "border-border bg-card hover:bg-secondary"
              )}
            >
              <r.icon size={16} className={cn("sm:[&]:w-[18px] sm:[&]:h-[18px]", role === r.value ? "text-primary" : "text-muted-foreground")} />
              <p className="font-medium text-xs sm:text-sm text-foreground mt-1 sm:mt-1.5">{r.label}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{r.desc}</p>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="O teu nome"
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Palavra-passe</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 sm:px-4 sm:py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-primary py-2.5 sm:py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 glow-primary-sm"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={16} /> Criar conta
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Já tens conta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
