import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { turso } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, isPast, parseISO } from "date-fns";
import { Calendar, Clock, XCircle, CalendarClock, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
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
  service_name: string;
}

const MyAppointments = () => {
  const navigate = useNavigate();
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

  const fetchAppointments = async (emailToLookup: string) => {
    setLoading(true);
    setSearched(true);
    const result = await turso.execute(
      `SELECT a.id, a.appointment_date, a.start_time, a.end_time, a.status,
              a.total_price, a.special_requests, a.client_name,
              COALESCE(s.name, '') as service_name
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.client_email = ?
       ORDER BY a.appointment_date DESC`,
      [emailToLookup]
    );
    setAppointments(result.rows as unknown as AppointmentRow[]);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    fetchAppointments(email.trim());
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    await turso.execute("UPDATE appointments SET status = ? WHERE id = ?", ["cancelled", cancelId]);
    setCancelling(false);
    setCancelId(null);
    toast.success("Appointment cancelled");
    fetchAppointments(email);
  };

  const handleReschedule = async () => {
    if (!rescheduleId || !newDate || !newTime) return;
    setRescheduling(true);

    const appt = appointments.find((a) => a.id === rescheduleId);
    const duration = 60;
    const [h, m] = newTime.split(":").map(Number);
    const endH = h + Math.floor((m + duration) / 60);
    const endM = (m + duration) % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    await turso.execute(
      "UPDATE appointments SET appointment_date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?",
      [newDate, newTime, endTime, "pending", rescheduleId]
    );

    setRescheduling(false);
    setRescheduleId(null);
    setNewDate("");
    setNewTime("");
    toast.success("Appointment rescheduled");
    fetchAppointments(email);
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
    "w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="bg-foreground text-background py-8">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-3xl">My <span className="italic">Appointments</span></h1>
          <p className="font-body text-sm text-background/60 mt-1">Look up your bookings by email</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <Button variant="elegant" size="sm" asChild>
            <Link to="/"><ArrowLeft size={14} className="mr-2" />Back to Home</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/book">New Booking</Link>
          </Button>
        </div>

        {/* Email lookup */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              className={`${inputClass} pl-9`}
              placeholder="Enter your email to find bookings..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button variant="hero" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {loading ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">Loading...</p>
          </div>
        ) : searched && appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={40} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl mb-2">No appointments found</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              No bookings found for this email. Check the email or book a new appointment.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">Book Now</Link>
            </Button>
          </div>
        ) : appointments.length > 0 ? (
          <>
            {upcoming.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-lg mb-4">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((appt) => (
                    <div key={appt.id} className="border border-border rounded-sm p-5 bg-background hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-body text-sm font-medium">{appt.service_name || "Service"}</h3>
                            <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusColor(appt.status)}`}>
                              {appt.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} />{format(parseISO(appt.appointment_date), "MMM d, yyyy")}</span>
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
                              <CalendarClock size={14} className="mr-1" />Reschedule
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setCancelId(appt.id)}
                            >
                              <XCircle size={14} className="mr-1" />Cancel
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
                <h2 className="font-display text-lg mb-4 text-muted-foreground">Past & Cancelled</h2>
                <div className="space-y-3">
                  {past.map((appt) => (
                    <div key={appt.id} className="border border-border/50 rounded-sm p-5 bg-muted/20 opacity-70">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-body text-sm font-medium">{appt.service_name || "Service"}</h3>
                            <span className={`text-[10px] font-body uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusColor(appt.status)}`}>
                              {appt.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} />{format(parseISO(appt.appointment_date), "MMM d, yyyy")}</span>
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
            <DialogTitle className="font-display">Cancel Appointment</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="elegant" onClick={() => setCancelId(null)}>Keep It</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleId} onOpenChange={(open) => !open && setRescheduleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Reschedule Appointment</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Pick a new date and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">New Date</label>
              <input
                type="date"
                value={newDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">New Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="elegant" onClick={() => setRescheduleId(null)}>Cancel</Button>
            <Button variant="hero" onClick={handleReschedule} disabled={rescheduling || !newDate || !newTime}>
              {rescheduling ? "Saving..." : "Confirm Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAppointments;
