import { BookingData } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useState } from "react";

interface Props {
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const schema = z.object({
  clientFirstName: z.string().trim().min(1, "First name is required").max(50),
  clientLastName: z.string().trim().min(1, "Last name is required").max(50),
  clientEmail: z.string().trim().email("Invalid email address").max(255),
  clientPhone: z.string().trim().min(1, "Phone number is required").max(20),
});

const StepDetails = ({ data, update, onNext, onBack }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = schema.safeParse({
      clientFirstName: data.clientFirstName,
      clientLastName: data.clientLastName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext();
  };

  const inputClass = (field: string) =>
    `w-full bg-background border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Your Details</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">Please provide your contact information.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">First Name *</label>
          <input
            className={inputClass("clientFirstName")}
            placeholder="Jane"
            value={data.clientFirstName}
            onChange={(e) => update({ clientFirstName: e.target.value })}
          />
          {errors.clientFirstName && <p className="text-xs text-destructive mt-1 font-body">{errors.clientFirstName}</p>}
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Last Name *</label>
          <input
            className={inputClass("clientLastName")}
            placeholder="Doe"
            value={data.clientLastName}
            onChange={(e) => update({ clientLastName: e.target.value })}
          />
          {errors.clientLastName && <p className="text-xs text-destructive mt-1 font-body">{errors.clientLastName}</p>}
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Email *</label>
          <input
            type="email"
            className={inputClass("clientEmail")}
            placeholder="jane@email.com"
            value={data.clientEmail}
            onChange={(e) => update({ clientEmail: e.target.value })}
          />
          {errors.clientEmail && <p className="text-xs text-destructive mt-1 font-body">{errors.clientEmail}</p>}
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Phone *</label>
          <input
            type="tel"
            className={inputClass("clientPhone")}
            placeholder="+33 6 12 34 56 78"
            value={data.clientPhone}
            onChange={(e) => update({ clientPhone: e.target.value })}
          />
          {errors.clientPhone && <p className="text-xs text-destructive mt-1 font-body">{errors.clientPhone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5 block">Special Requests</label>
          <textarea
            className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
            placeholder="Any allergies, preferences, or special requests..."
            value={data.specialRequests}
            onChange={(e) => update({ specialRequests: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="elegant" size="lg" onClick={onBack}>Back</Button>
        <Button variant="hero" size="lg" onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
};

export default StepDetails;
