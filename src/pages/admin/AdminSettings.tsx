import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { changeAdminPassword } from "@/lib/auth";
import { LogOut, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const { user, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setSaving(true);
    const { error } = await changeAdminPassword(currentPassword, newPassword);
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Mot de passe modifié avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const inputClass =
    "w-full bg-background border border-border rounded-sm px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display">Paramètres</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Préférences du compte et de l'application</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Compte</CardTitle>
          <CardDescription>Détails de votre compte administrateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? "Admin"}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <Button variant="destructive" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Se Déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Lock className="h-4 w-4" /> Changer le Mot de Passe
          </CardTitle>
          <CardDescription>Modifiez le mot de passe administrateur. Il sera enregistré dans la base de données.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de Passe Actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau Mot de Passe</Label>
              <Input
                id="newPassword"
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le Nouveau Mot de Passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>
            <Button type="submit" variant="hero" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {saving ? "Enregistrement..." : "Enregistrer le Nouveau Mot de Passe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
