import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Compte créé avec succès !");
      navigate(redirect);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="font-display text-2xl italic text-foreground">Lumière</a>
          <h1 className="font-display text-3xl mt-4">Créer un Compte</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Inscrivez-vous pour gérer vos réservations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Nom</label>
            <input type="text" className={inputClass} placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" className={inputClass} placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Mot de passe</label>
            <input type="password" className={inputClass} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
            {loading ? "Veuillez patienter..." : "S'inscrire"}
          </Button>
        </form>

        <p className="text-center font-body text-sm text-muted-foreground mt-6">
          Vous avez déjà un compte ?{" "}
          <Link to={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            Se Connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
