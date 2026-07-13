import { useState, useEffect, useCallback } from "react";
import { BookingData, totalDuration } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { turso } from "@/lib/db";
import { Lock, ArrowRight } from "lucide-react";

interface Props {
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
];

interface ExistingAppointment {
  start_time: string;
  end_time: string;
  status: string;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function isSlotConflicting(
  slotStart: string,
  slotDurationMin: number,
  existing: ExistingAppointment[]
): boolean {
  const slotStartMin = timeToMinutes(slotStart);
  const slotEndMin = slotStartMin + slotDurationMin;

  for (const appt of existing) {
    if (appt.status === "cancelled") continue;
    const apptStart = timeToMinutes(appt.start_time);
    const apptEnd = timeToMinutes(appt.end_time);
    if (slotStartMin < apptEnd && slotEndMin > apptStart) {
      return true;
    }
  }
  return false;
}

function findNextAvailable(
  durationMin: number,
  existing: ExistingAppointment[]
): string | null {
  for (const slot of timeSlots) {
    if (!isSlotConflicting(slot, durationMin, existing)) {
      return slot;
    }
  }
  return null;
}

const StepDateTime = ({ data, update, onNext, onBack }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.date ?? undefined);
  const [existingAppts, setExistingAppts] = useState<ExistingAppointment[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const durationMin = totalDuration(data.services) || 60;

  const fetchAppointmentsForDate = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    const dateStr = date.toISOString().split("T")[0];
    try {
      const result = await turso.execute(
        "SELECT start_time, end_time, status FROM appointments WHERE appointment_date = ?",
        [dateStr]
      );
      setExistingAppts(result.rows as unknown as ExistingAppointment[]);
    } catch {
      setExistingAppts([]);
    }
    setLoadingSlots(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAppointmentsForDate(selectedDate);
    } else {
      setExistingAppts([]);
    }
  }, [selectedDate, fetchAppointmentsForDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    update({ date: date ?? null, time: null });
  };

  const handleSlotClick = (slot: string) => {
    if (isSlotConflicting(slot, durationMin, existingAppts)) return;
    update({ time: slot });
  };

  const nextAvailable = findNextAvailable(durationMin, existingAppts);
  const takenCount = timeSlots.filter((s) => isSlotConflicting(s, durationMin, existingAppts)).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Choisissez une Date & Heure</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">Sélectionnez votre date et créneau horaire préférés.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < today || date.getDay() === 0}
            className={cn("p-3 pointer-events-auto border rounded-sm")}
          />
        </div>

        {/* Time slots */}
        <div>
          <h3 className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
            {selectedDate ? `Créneaux disponibles pour le ${selectedDate.toLocaleDateString("fr-FR", { weekday: "long", month: "long", day: "numeric" })}` : "Sélectionnez d'abord une date"}
          </h3>
          {selectedDate ? (
            <>
              {loadingSlots ? (
                <p className="font-body text-sm text-muted-foreground italic">Chargement des créneaux...</p>
              ) : (
                <>
                  {takenCount > 0 && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-sm">
                      <p className="font-body text-sm text-foreground">
                        <Lock size={12} className="inline mr-1 text-primary" />
                        {takenCount} créneau{takenCount > 1 ? "x" : ""} déjà réservé{takenCount > 1 ? "s" : ""} pour cette date.
                      </p>
                      {nextAvailable && (
                        <button
                          onClick={() => update({ time: nextAvailable })}
                          className="mt-2 font-body text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                          Prochain créneau disponible : {nextAvailable}
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const taken = isSlotConflicting(slot, durationMin, existingAppts);
                      const isSelected = data.time === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => handleSlotClick(slot)}
                          disabled={taken}
                          className={cn(
                            "py-2 px-3 rounded-full text-sm font-body border transition-all",
                            taken
                              ? "border-border/50 text-muted-foreground/40 bg-muted/30 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          )}
                          title={taken ? "Ce créneau est déjà réservé" : undefined}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {data.time && (
                    <p className="mt-3 font-body text-xs text-primary">
                      Durée du service : {durationMin} min — votre séance se terminera à{" "}
                      {(() => {
                        const [h, m] = data.time.split(":").map(Number);
                        return minutesToTime(h * 60 + m + durationMin);
                      })()}
                    </p>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="font-body text-sm text-muted-foreground italic">Veuillez sélectionner une date pour voir les créneaux disponibles.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="elegant" size="lg" onClick={onBack}>Retour</Button>
        <Button variant="hero" size="lg" onClick={onNext} disabled={!data.date || !data.time}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default StepDateTime;
