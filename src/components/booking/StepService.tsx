import { useEffect, useState } from "react";
import { turso } from "@/lib/db";
import { BookingData, Service } from "@/types/booking";
import { placeholderServices } from "@/lib/placeholderData";
import { Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  data: BookingData;
  update: (d: Partial<BookingData>) => void;
  onNext: () => void;
  preselectServiceId?: string | null;
}

const fallbackCategories = ["Massages", "Hammams", "Packs"];

const StepService = ({ data, update, onNext, preselectServiceId }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [activeCategory, setActiveCategory] = useState("Massages");

  useEffect(() => {
    turso.execute("SELECT * FROM services WHERE active = 1").then((result) => {
      const rows = result.rows as unknown as Service[];
      if (rows.length === 0) {
        setServices(placeholderServices);
      } else {
        setServices(rows);
        const cats = Array.from(new Set(rows.map((s) => s.category)));
        if (cats.length > 0) {
          setCategories(cats);
          setActiveCategory(cats[0]);
        }
        if (preselectServiceId) {
          const found = rows.find((s) => String(s.id) === String(preselectServiceId));
          if (found) {
            update({ service: found });
            setActiveCategory(found.category);
          }
        }
      }
      setLoading(false);
    }).catch(() => {
      setServices(placeholderServices);
      setLoading(false);
    });
  }, []);

  const filtered = services.filter((s) => s.category === activeCategory);

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Choisissez un Service</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">Sélectionnez le soin que vous souhaitez réserver.</p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-body text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-sm border transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((service) => (
            <div
              key={service.id}
              onClick={() => update({ service })}
              className={`p-5 rounded-sm border cursor-pointer transition-all ${
                data.service?.id === service.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-lg">{service.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{service.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-display text-lg">{service.price} DH</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Clock size={12} /> {service.duration_minutes} min</span>
                <span className="flex items-center gap-1"><DollarSign size={12} /> {service.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button variant="hero" size="lg" onClick={onNext} disabled={!data.service}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default StepService;
