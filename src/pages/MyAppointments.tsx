import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { turso } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, isPast, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, XCircle, CalendarClock, ArrowLeft, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppointmentRow {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  special_requests: string | null;
  client_name: string;
  client_email: string;
  service_name: string;
  service_duration: number;
}

const MyAppointments = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const fetchAppointments = async (query: { clientId?: string; email?: string }) => {
    setLoading(true);
    setSearched(true);
    let result;
    if (query.clientId) {
      result = await turso.execute(
        `SELECT a.id, a.appointment_date, a.start_time, a.end_time, a.status,
                a.total_price, a.special_requests, a.client_name, a.client_email,
                COALESCE(s.name, '') as service_name,
                COALESCE(s.duration_minutes, 60) as service_duration
         FROM appointments a
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.client_id = ?
         ORDER BY a.appointment_date DESC`,
        [query.clientId]
      );
    } else if (query.email) {
      result = await turso.execute(
        `SELECT a.id, a.appointment_date, a.start_time, a.end_time, a.status,
                a.total_price, a.special_requests, a.client_name, a.client_email,
                COALESCE(s.name, '') as service_name,
                COALESCE(s.duration_minutes, 60) as service_duration
         FROM appointments a
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.client_email = ?
         ORDER BY a.appointment_date DESC`,
        [query.email]
      );
    }
    setAppointments((result?.rows as unknown as AppointmentRow[]) || []);
    setLoading(false);
  };

  // Auto-load appointments for logged-in users
  useEffect(() => {
    if (user && user.id !== "admin") {
      fetchAppointments({ clientId: user.id });
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    fetchAppointments({ email: email.trim() });
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    await turso.execute("UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?", [
      "cancelled",
      new Date().toISOString(),
      cancelId,
    ]);
    setCancelling(false);
    setCancelId(null);
    toast.success("Rendez-vous annulé");
    if (user && user.id !== "admin") {
      fetchAppointments({ clientId: user.id });
    } else {
      fetchAppointments({ email });
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleId || !newDate || !newTime) return;
    setRescheduling(true);

    const appt = appointments.find((a) => a.id === rescheduleId);
    const duration = appt?.service_duration || 60;
    const [h, m] = newTime.split(":").map(Number);
    const endH = h + Math.floor((m + duration) / 60);
    const endM = (m + duration) % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    await turso.execute(
      "UPDATE appointments SET appointment_date = ?, start_time = ?, end_time = ?, status = ?, updated_at = ? WHERE id = ?",
      [newDate, newTime, endTime, "pending", new Date().toISOString(), rescheduleId]
    );

    setRescheduling(false);
    setRescheduleId(null);
    setNewDate("");
    setNewTime("");
    toast.success("Rendez-vous reporté");
    if (user && user.id !== "admin") {
      fetchAppointments({ clientId: user.id });
    } else {
      fetchAppointments({ email });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-700 border-green-200";
      case "pending": return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "cancelled": return "bg-red-500/10 text-red-700 border-red-200";
      case "completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const isUpcoming = (date: string) => !isPast(parseISO(date + "T23:59:59"));
  const canModify = (appt: AppointmentRow) =>
    isUpcoming(appt.appointment_date) && !["cancelled", "completed"].includes(appt.status);

  const upcoming = appointments.filter((a) => isUpcoming(a.appointment_date) && a.status !== "cancelled");
  const past = appointments.filter((a) => !isUpcoming(a.appointment_date) || a.status === "cancelled");

  const inputClass =
    "w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  const isLoggedUser = !!(user && user.id !== "admin");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="bg-foreground text-background py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-2xl sm:text-3xl">Mes <span className="italic">Rendez-vous</span></h1>
          <p className="font-body text-sm text-background/60 mt-1">
            {isLoggedUser ? "Vos réservations sont chargées automatiquement" : "Recherchez vos réservations par email"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
          <Button variant="elegant" size="sm" asChild>
            <Link to="/"><ArrowLeft size={14} className="mr-2" />Retour à l'Accueil</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/book">Nouvelle Réservation</Link>
          </Button>
        </div>

        {/* Email lookup — only for guests */}
        {!isLoggedUser && (
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                className={`${inputClass} pl-9`}
                placeholder="Entrez votre email pour trouver vos réservations..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button variant="hero" type="submit" disabled={loading}>
              {loading ? "Recherche..." : "Rechercher"}
            </Button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">Chargement...</p>
          </div>
        ) : searched && appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={40} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl mb-2">Aucun rendez-vous trouvé</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {isLoggedUser
                ? "Vous n'avez pas encore de réservation. Réservez votre premier rendez-vous."
                : "Aucune réservation trouvée pour cet email. Vérifiez l'email ou réservez un nouveau rendez-vous."}
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">Réserver Maintenant</Link>
            </Button>
          </div>
        ) : appointments.length > 0 ? (
          <>
            {upcoming.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-lg mb-4">À Venir</h2>
                <div className="space-y-3">
                  {upcoming.map((appt) => (
                    <div key={appt.id} className="border border-border rounded-sm p-5 bg-background hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-body text-sm font-medium">{appt.service_name || "Service"}</h3>
                            <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusColor(appt.status)}`}>
                              {appt.status === "confirmed" ? "confirmé" : appt.status === "pending" ? "en attente" : appt.status === "cancelled" ? "annulé" : appt.status === "completed" ? "terminé" : appt.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} />{format(parseISO(appt.appointment_date), "d MMM yyyy", { locale: fr })}</span>
                            <span className="flex items-center gap-1"><Clock size={12} />{appt.start_time.slice(0, 5)} – {appt.end_time.slice(0, 5)}</span>
                          </div>
                        </div>

                        {canModify(appt) && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="elegant"
                              size="sm"
                              onClick={() => {
                                setRescheduleId(appt.id);
                                setNewDate(appt.appointment_date);
                                setNewTime(appt.start_time.slice(0, 5));
                              }}
                            >
                              <CalendarClock size={14} className="mr-1" />Reporter
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setCancelId(appt.id)}
                            >
                              <XCircle size={14} className="mr-1" />Annuler
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="font-display text-lg mb-4 text-muted-foreground">Passés & Annulés</h2>
                <div className="space-y-3">
                  {past.map((appt) => (
                    <div key={appt.id} className="border border-border/50 rounded-sm p-5 bg-muted/20 opacity-70">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-body text-sm font-medium">{appt.service_name || "Service"}</h3>
                            <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusColor(appt.status)}`}>
                              {appt.status === "confirmed" ? "confirmé" : appt.status === "pending" ? "en attente" : appt.status === "cancelled" ? "annulé" : appt.status === "completed" ? "terminé" : appt.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} />{format(parseISO(appt.appointment_date), "d MMM yyyy", { locale: fr })}</span>
                            <span className="flex items-center gap-1"><Clock size={12} />{appt.start_time.slice(0, 5)} – {appt.end_time.slice(0, 5)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <Footer />

      {/* Cancel Dialog */}
      <Dialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Annuler le Rendez-vous</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="elegant" onClick={() => setCancelId(null)}>Conserver</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? "Annulation en cours..." : "Oui, Annuler"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleId} onOpenChange={(open) => !open && setRescheduleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Reporter le Rendez-vous</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Choisissez une nouvelle date et heure pour votre rendez-vous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Nouvelle Date</label>
              <input
                type="date"
                value={newDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Nouvelle Heure</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="elegant" onClick={() => setRescheduleId(null)}>Annuler</Button>
            <Button variant="hero" onClick={handleReschedule} disabled={rescheduling || !newDate || !newTime}>
              {rescheduling ? "Enregistrement..." : "Confirmer le Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAppointments;