import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { turso } from "@/lib/db";
import { BookingData, initialBookingData } from "@/types/booking";
import StepService from "@/components/booking/StepService";
import StepDateTime from "@/components/booking/StepDateTime";
import StepDetails from "@/components/booking/StepDetails";
import StepReview from "@/components/booking/StepReview";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, User, LogIn } from "lucide-react";

const steps = ["Service", "Date & Heure", "Détails", "Récapitulatif"];

const BookingPage = () => {
  const { user } = useAuth();
  const [authChoice, setAuthChoice] = useState<"signed_in" | "guest" | null>(() => {
    return user ? "signed_in" : null;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      return {
        ...initialBookingData,
        clientFirstName: nameParts[0] || "",
        clientLastName: nameParts.slice(1).join(" ") || "",
        clientEmail: user.email || "",
      };
    }
    return initialBookingData;
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!bookingData.service || !bookingData.date || !bookingData.time) return;
    setSubmitting(true);

    const dateStr = bookingData.date.toISOString().split("T")[0];

    const existing = await turso.execute(
      "SELECT start_time, end_time, status FROM appointments WHERE appointment_date = ?",
      [dateStr]
    );
    const existingAppts = (existing.rows as { start_time: string; end_time: string; status: string }[]).filter(
      (a) => a.status !== "cancelled"
    );

    const slotStartMin = (() => {
      const [h, m] = bookingData.time!.split(":").map(Number);
      return h * 60 + m;
    })();
    const slotEndMin = slotStartMin + bookingData.service.duration_minutes;

    const conflict = existingAppts.find((a) => {
      const aStart = (() => { const [h, m] = a.start_time.split(":").map(Number); return h * 60 + m; })();
      const aEnd = (() => { const [h, m] = a.end_time.split(":").map(Number); return h * 60 + m; })();
      return slotStartMin < aEnd && slotEndMin > aStart;
    });

    if (conflict) {
      setSubmitting(false);
      toast.error("Ce créneau vient d'être réservé. Veuillez choisir un autre horaire.");
      return;
    }

    const durationMinutes = bookingData.service.duration_minutes;
    const [hours, minutes] = bookingData.time.split(":").map(Number);
    const endHours = hours + Math.floor((minutes + durationMinutes) / 60);
    const endMinutes = (minutes + durationMinutes) % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;

    const clientId = user?.id && user.id !== "admin" ? user.id : null;

    await turso.execute(
      `INSERT INTO appointments (client_id, service_id, appointment_date, start_time, end_time, client_name, client_email, client_phone, special_requests, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientId,
        bookingData.service.id,
        dateStr,
        bookingData.time,
        endTime,
        `${bookingData.clientFirstName} ${bookingData.clientLastName}`,
        bookingData.clientEmail,
        bookingData.clientPhone,
        bookingData.specialRequests,
        bookingData.service.price,
        "pending",
      ]
    );

    setSubmitting(false);
    toast.success("Réservation confirmée ! À bientôt.");
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepService data={bookingData} update={updateBooking} onNext={next} />;
      case 1: return <StepDateTime data={bookingData} update={updateBooking} onNext={next} onBack={prev} />;
      case 2: return <StepDetails data={bookingData} update={updateBooking} onNext={next} onBack={prev} />;
      case 3: return <StepReview data={bookingData} onBack={prev} onSubmit={handleSubmit} submitting={submitting} />;
      default: return null;
    }
  };

  // Auth choice screen
  if (authChoice === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="bg-foreground text-background py-8">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-3xl">Réservez Votre <span className="italic">Rendez-vous</span></h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg text-center">
            <h2 className="font-display text-2xl mb-3">Comment souhaitez-vous continuer ?</h2>
            <p className="font-body text-sm text-muted-foreground mb-10">
              Connectez-vous pour retrouver vos réservations, ou continuez en tant qu'invité.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/login?redirect=/book")}
                className="group flex flex-col items-center gap-4 p-8 border border-border rounded-sm hover:border-primary transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <LogIn size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-display text-lg">Se Connecter</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">J'ai déjà un compte</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/register?redirect=/book")}
                className="group flex flex-col items-center gap-4 p-8 border border-border rounded-sm hover:border-primary transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <User size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-display text-lg">S'inscrire</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">Créer un nouveau compte</p>
                </div>
              </button>
            </div>

            <div className="mt-8">
              <Button
                variant="elegant"
                size="lg"
                onClick={() => setAuthChoice("guest")}
              >
                Continuer en tant qu'invité
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-3xl">Réservez Votre <span className="italic">Rendez-vous</span></h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body transition-all ${
                    i < currentStep
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-[10px] font-body uppercase tracking-wider mt-2 text-muted-foreground hidden sm:block">
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-px mx-1 sm:mx-2 ${i < currentStep ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
