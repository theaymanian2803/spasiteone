import { useEffect, useState } from "react";
import { turso } from "@/lib/db";
import { BookingData, Service } from "@/types/booking";
import { placeholderServices } from "@/lib/placeholderData";
import { Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  category: string;
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
  onNext: () => void;
  preselectServiceId?: string | null;
}

const StepCategorySelect = ({ category, data, update, onNext, preselectServiceId }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    turso
      .execute("SELECT * FROM services WHERE active = 1")
      .then((result) => {
        if (cancelled) return;
        const rows = result.rows as unknown as Service[];
        const all = rows.length === 0 ? placeholderServices : rows;
        const filtered = all.filter((s) => s.category === category);
        setServices(filtered);

        if (preselectServiceId) {
          const found = filtered.find((s) => String(s.id) === String(preselectServiceId));
          if (found) {
            update({ services: replaceInCategory(data.services, found) });
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        const filtered = placeholderServices.filter((s) => s.category === category);
        setServices(filtered);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const selectedInCategory = data.services.find((s) => s.category === category) || null;

  const handleSelect = (service: Service) => {
    update({ services: replaceInCategory(data.services, service) });
  };

  const handleSkip = () => {
    update({ services: data.services.filter((s) => s.category !== category) });
    onNext();
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Choisissez un {category}</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Sélectionnez un soin dans cette catégorie, ou passez-la si vous le souhaitez.
      </p>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground italic">
          Aucun service disponible dans cette catégorie.
        </p>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleSelect(service)}
              className={`p-5 rounded-sm border cursor-pointer transition-all ${
                selectedInCategory?.id === service.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-lg">{service.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-display text-lg">{service.price} DH</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {service.duration_minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={12} /> {service.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between gap-3">
        <Button variant="elegant" size="lg" onClick={handleSkip}>
          Passer
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          disabled={!selectedInCategory && services.length > 0}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

function replaceInCategory(services: Service[], service: Service): Service[] {
  const others = services.filter((s) => s.category !== service.category);
  return [...others, service];
}

export default StepCategorySelect;