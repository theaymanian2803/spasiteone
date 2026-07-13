import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { turso } from "@/lib/db";
import { buildBookingMessage, openWhatsAppBooking } from "@/lib/whatsapp";
import {
  BookingData,
  initialBookingData,
  totalDuration,
  totalPrice,
} from "@/types/booking";
import StepCategorySelect from "@/components/booking/StepCategorySelect";
import StepDateTime from "@/components/booking/StepDateTime";
import StepDetails from "@/components/booking/StepDetails";
import StepReview from "@/components/booking/StepReview";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, User, LogIn } from "lucide-react";

const fallbackCategories = ["Massages", "Hammams", "Packs"];

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

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
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectServiceId = searchParams.get("service");

  // Load the list of service categories from the DB once.
  useEffect(() => {
    let cancelled = false;
    turso
      .execute("SELECT DISTINCT category FROM services WHERE active = 1 ORDER BY category")
      .then((result) => {
        if (cancelled) return;
        const rows = result.rows as unknown as { category: string }[];
        const cats = rows.map((r) => r.category).filter(Boolean);
        if (cats.length > 0) setCategories(cats);
      })
      .catch(() => {
        // keep fallback categories
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Steps: one per category, then date, details, review.
  const steps = useMemo(
    () => [...categories, "Date & Heure", "Détails", "Récapitulatif"],
    [categories]
  );

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Index of the first non-category step.
  const dateStepIndex = categories.length;

  const handleNextFromCategory = (index: number) => {
    // When leaving the last category step, require at least one service selected.
    if (index === categories.length - 1 && bookingData.services.length === 0) {
      toast.error("Veuillez sélectionner au moins un service (ou utilisez « Passer » pour ignorer une catégorie).");
      return;
    }
    next();
  };

  const handleSubmit = async () => {
    if (bookingData.services.length === 0 || !bookingData.date || !bookingData.time) {
      toast.error("Veuillez sélectionner au moins un service, une date et une heure.");
      return;
    }
    setSubmitting(true);

    const dateStr = bookingData.date.toISOString().split("T")[0];

    const slotStartMin = (() => {
      const [h, m] = bookingData.time!.split(":").map(Number);
      return h * 60 + m;
    })();
    const duration = totalDuration(bookingData.services);
    const slotEndMin = slotStartMin + duration;

    // Re-check for conflicts even though slots were disabled in the date step,
    // since another client may have booked while the user was filling details.
    let conflict = false;
    try {
      const existing = await turso.execute(
        "SELECT start_time, end_time, status FROM appointments WHERE appointment_date = ?",
        [dateStr]
      );
      const existingAppts = (
        existing.rows as { start_time: string; end_time: string; status: string }[]
      ).filter((a) => a.status !== "cancelled");
      conflict = existingAppts.some((a) => {
        const aStart = (() => { const [h, m] = a.start_time.split(":").map(Number); return h * 60 + m; })();
        const aEnd = (() => { const [h, m] = a.end_time.split(":").map(Number); return h * 60 + m; })();
        return slotStartMin < aEnd && slotEndMin > aStart;
      });
    } catch {
      // DB unavailable (offline/test): proceed with WhatsApp confirmation only.
    }

    if (conflict) {
      setSubmitting(false);
      toast.error("Ce créneau vient d'être réservé. Veuillez choisir un autre horaire.");
      return;
    }

    const endTime = minutesToTime(slotEndMin);
    const clientId = user?.id && user.id !== "admin" ? user.id : null;

    // Persist one appointment row per selected service so the salon keeps a
    // record of every service in this combined booking. Sub-services are
    // scheduled back-to-back starting at the selected start time.
    try {
      let cursorMin = slotStartMin;
      for (const svc of bookingData.services) {
        const sStart = minutesToTime(cursorMin);
        const sEnd = minutesToTime(cursorMin + svc.duration_minutes);
        await turso.execute(
          `INSERT INTO appointments (client_id, service_id, appointment_date, start_time, end_time, client_name, client_email, client_phone, special_requests, total_price, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            clientId,
            svc.id,
            dateStr,
            sStart,
            sEnd,
            `${bookingData.clientFirstName} ${bookingData.clientLastName}`,
            bookingData.clientEmail,
            bookingData.clientPhone,
            bookingData.specialRequests,
            svc.price,
            "pending",
          ]
        );
        cursorMin += svc.duration_minutes;
      }
    } catch {
      // DB may be unavailable in test mode; we still forward to WhatsApp.
    }

    const dateLabel = bookingData.date.toLocaleDateString("fr-FR", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

    const message = buildBookingMessage({
      services: bookingData.services.map((s) => ({
        name: s.name,
        category: s.category,
        durationMinutes: s.duration_minutes,
        price: s.price,
      })),
      totalPrice: totalPrice(bookingData.services),
      totalDurationMinutes: duration,
      dateLabel,
      time: bookingData.time,
      endTime,
      clientFirstName: bookingData.clientFirstName,
      clientLastName: bookingData.clientLastName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      specialRequests: bookingData.specialRequests,
    });

    const opened = openWhatsAppBooking(message);

    setSubmitting(false);

    if (opened) {
      toast.success("WhatsApp ouvert — envoyez le message pour confirmer votre rendez-vous.");
    } else {
      toast.error("Impossible d'ouvrir WhatsApp. Vérifiez le numéro configuré.");
    }

    navigate("/");
  };

  const renderStep = () => {
    if (currentStep < categories.length) {
      const category = categories[currentStep];
      return (
        <StepCategorySelect
          key={category}
          category={category}
          data={bookingData}
          update={updateBooking}
          onNext={() => handleNextFromCategory(currentStep)}
          preselectServiceId={currentStep === 0 ? preselectServiceId : null}
        />
      );
    }
    switch (currentStep) {
      case dateStepIndex:
        return <StepDateTime data={bookingData} update={updateBooking} onNext={next} onBack={prev} />;
      case dateStepIndex + 1:
        return <StepDetails data={bookingData} update={updateBooking} onNext={next} onBack={prev} />;
      case dateStepIndex + 2:
        return <StepReview data={bookingData} onBack={prev} onSubmit={handleSubmit} submitting={submitting} />;
      default:
        return null;
    }
  };

  // Auth choice screen
  if (authChoice === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="bg-foreground text-background py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-2xl sm:text-3xl">Réservez Votre <span className="italic">Rendez-vous</span></h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-2xl sm:text-3xl">Réservez Votre <span className="italic">Rendez-vous</span></h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-10 overflow-x-auto">
          {steps.map((step, i) => (
            <div key={`${step}-${i}`} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-body transition-all ${
                    i < currentStep
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-[9px] sm:text-[10px] font-body uppercase tracking-wider mt-2 text-muted-foreground hidden sm:block whitespace-nowrap">
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 sm:w-12 h-px mx-1 sm:mx-2 ${i < currentStep ? "bg-primary" : "bg-border"}`} />
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