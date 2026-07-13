import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      navigate(redirect);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="font-display text-2xl italic text-foreground">Lumière</a>
          <h1 className="font-display text-2xl sm:text-3xl mt-4">Bon Retour</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" className={inputClass} placeholder="spa@admin.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Mot de passe</label>
            <input type="password" className={inputClass} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
            {loading ? "Veuillez patienter..." : "Se Connecter"}
          </Button>
        </form>

        <p className="text-center font-body text-sm text-muted-foreground mt-6">
          Pas encore de compte ?{" "}
          <Link to={`/register${redirect !== "/admin" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
