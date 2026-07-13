import { BookingData, totalPrice, totalDuration } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, Scissors, CheckCircle2 } from "lucide-react";

interface Props {
  data: BookingData;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const StepReview = ({ data, onBack, onSubmit, submitting }: Props) => {
  const total = totalPrice(data.services);
  const duration = totalDuration(data.services);

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Vérification & Confirmation</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Veuillez vérifier les détails de votre réservation avant de confirmer.
      </p>

      <div className="max-w-xl border border-border rounded-sm p-6 space-y-5">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3 flex items-center gap-2">
            <Scissors size={14} /> Services ({data.services.length})
          </p>
          <div className="space-y-3">
            {data.services.map((s) => (
              <div key={s.id} className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-display text-base">{s.name}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {s.duration_minutes} min • {s.category}
                  </p>
                </div>
                <p className="font-display text-sm shrink-0">{s.price} DH</p>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-3">
            Durée totale : {duration} min
          </p>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-start gap-4">
          <CalendarDays size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Date & Heure
            </p>
            <p className="font-display text-lg">
              {data.date?.toLocaleDateString("fr-FR", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="font-body text-sm text-muted-foreground">à {data.time}</p>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-start gap-4">
          <User size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Client
            </p>
            <p className="font-display text-lg">
              {data.clientFirstName} {data.clientLastName}
            </p>
            <p className="font-body text-sm text-muted-foreground">
              {data.clientEmail} • {data.clientPhone}
            </p>
            {data.specialRequests && (
              <p className="font-body text-sm text-muted-foreground mt-1 italic">
                "{data.specialRequests}"
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-start gap-4">
          <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Total à régler sur place
            </p>
            <p className="font-display text-2xl text-gradient-gold">{total} DH</p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              Paiement sur place, le jour du rendez-vous. La confirmation se fait via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="elegant" size="lg" onClick={onBack}>
          Retour
        </Button>
        <Button variant="hero" size="lg" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Confirmation..." : "Confirmer sur WhatsApp"}
        </Button>
      </div>
    </div>
  );
};

export default StepReview;