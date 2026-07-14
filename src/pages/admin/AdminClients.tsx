import { useEffect, useState, useCallback } from "react";
import { turso } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface ClientInfo {
  client_name: string;
  client_email: string;
  client_phone: string | null;
  total_bookings: number;
  last_visit: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const result = await turso.execute(
      "SELECT client_name, client_email, client_phone, appointment_date FROM appointments ORDER BY appointment_date DESC"
    );
    const data = result.rows as any[];

    if (data) {
      const map = new Map<string, ClientInfo>();
      data.forEach((a) => {
        const existing = map.get(a.client_email);
        if (existing) {
          existing.total_bookings++;
        } else {
          map.set(a.client_email, {
            client_name: a.client_name,
            client_email: a.client_email,
            client_phone: a.client_phone,
            total_bookings: 1,
            last_visit: a.appointment_date,
          });
        }
      });
      setClients(Array.from(map.values()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDelete = async () => {
    if (!deleteEmail) return;
    setDeleting(true);
    try {
      await turso.execute("DELETE FROM appointments WHERE client_email = ?", [deleteEmail]);
      toast.success("Client et historique supprimés");
      setDeleteEmail(null);
      await fetchClients();
    } catch (e) {
      toast.error("Échec de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const clientToDelete = clients.find((c) => c.client_email === deleteEmail);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>;

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Répertoire des <span className="italic">Clients</span></h1>
      <div className="border border-border rounded-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Nom", "Email", "Téléphone", "Réservations", "Dernière Visite", "Actions"].map((h) => (
                <th key={h} className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.client_email} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-3 px-3 font-body text-sm">{c.client_name}</td>
                <td className="py-3 px-3 font-body text-sm text-muted-foreground">{c.client_email}</td>
                <td className="py-3 px-3 font-body text-sm text-muted-foreground">{c.client_phone || "—"}</td>
                <td className="py-3 px-3 font-body text-sm">{c.total_bookings}</td>
                <td className="py-3 px-3 font-body text-sm">{c.last_visit}</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => setDeleteEmail(c.client_email)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Supprimer ${c.client_name}`}
                    title="Supprimer le client"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center font-body text-sm text-muted-foreground italic">Aucun client pour le moment. Les clients apparaissent ici après leur première réservation.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteEmail} onOpenChange={() => setDeleteEmail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Supprimer le Client</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {clientToDelete && (
                <>Supprimer définitivement <strong className="text-foreground">{clientToDelete.client_name}</strong> ({clientToDelete.client_email}) et l'ensemble de son historique de {clientToDelete.total_bookings} réservation(s) ? Cette action est irréversible.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="elegant" onClick={() => setDeleteEmail(null)} disabled={deleting}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClients;
