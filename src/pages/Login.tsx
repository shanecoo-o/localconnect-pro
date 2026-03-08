import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wrench, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Bem-vindo de volta!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-5 py-8 sm:px-6">
      <div className="w-full max-w-sm space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-primary glow-primary-sm">
            <Wrench size={24} className="text-primary-foreground sm:[&]:w-7 sm:[&]:h-7" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">BairroWorks</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Entra na tua conta</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
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
                placeholder="••••••"
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
                <LogIn size={16} /> Entrar
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div className="rounded-xl border border-border bg-card/60 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contas demo</p>
          <div className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs text-muted-foreground">
            <p><span className="text-foreground font-medium">Cliente:</span> cliente@demo.com</p>
            <p><span className="text-foreground font-medium">Worker:</span> worker@demo.com</p>
            <p><span className="text-foreground font-medium">Admin:</span> admin@demo.com</p>
            <p className="text-muted-foreground/60 pt-0.5">Password: 123456</p>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Não tens conta?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
