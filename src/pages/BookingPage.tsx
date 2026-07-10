import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { turso } from "@/lib/db";
import { BookingData, initialBookingData } from "@/types/booking";
import StepService from "@/components/booking/StepService";
import StepDateTime from "@/components/booking/StepDateTime";
import StepDetails from "@/components/booking/StepDetails";
import StepReview from "@/components/booking/StepReview";
import { Check } from "lucide-react";

const steps = ["Service", "Date & Time", "Details", "Review"];

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
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

    const durationMinutes = bookingData.service.duration_minutes;
    const [hours, minutes] = bookingData.time.split(":").map(Number);
    const endHours = hours + Math.floor((minutes + durationMinutes) / 60);
    const endMinutes = (minutes + durationMinutes) % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;

    await turso.execute(
      `INSERT INTO appointments (service_id, appointment_date, start_time, end_time, client_name, client_email, client_phone, special_requests, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.service.id,
        bookingData.date.toISOString().split("T")[0],
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
    toast.success("Booking confirmed! We'll see you soon.");
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-3xl">Book Your <span className="italic">Appointment</span></h1>
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
