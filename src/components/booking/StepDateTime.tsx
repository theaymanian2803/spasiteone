import { useState } from "react";
import { BookingData } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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

const StepDateTime = ({ data, update, onNext, onBack }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.date ?? undefined);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    update({ date: date ?? null, time: null });
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Pick a Date & Time</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">Select your preferred appointment date and time slot.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < tomorrow || date.getDay() === 0}
            className={cn("p-3 pointer-events-auto border rounded-sm")}
          />
        </div>

        {/* Time slots */}
        <div>
          <h3 className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
            {selectedDate ? `Available times for ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}` : "Select a date first"}
          </h3>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => update({ time: slot })}
                  className={`py-2 px-3 rounded-full text-sm font-body border transition-all ${
                    data.time === slot
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-muted-foreground italic">Please select a date to see available times.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="elegant" size="lg" onClick={onBack}>Back</Button>
        <Button variant="hero" size="lg" onClick={onNext} disabled={!data.date || !data.time}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepDateTime;
