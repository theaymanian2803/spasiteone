import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Droplets, Clock, Heart, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { turso } from "@/lib/db";

const iconMap: Record<string, React.ElementType> = {
  Massages: Heart,
  Hammams: Droplets,
  Packs: Sparkles,
};

interface Props {
  onNavigate?: () => void;
};

const MobileServicesMenu = ({ onNavigate }: Props) => {
  const [open, setOpen] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: ["services-nav-mobile"],
    queryFn: async () => {
      const result = await turso.execute("SELECT * FROM services WHERE active = 1 ORDER BY category LIMIT 12");
      return result.rows as any[];
    },
  });

  const grouped = services.reduce((acc, svc) => {
    const cat = svc.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {} as Record<string, typeof services>);

  const categories = Object.keys(grouped);

  const hasServices = categories.length > 0;
  const displayCategories = hasServices
    ? categories.slice(0, 3).map((cat) => ({
        name: cat,
        icon: iconMap[cat] || Sparkles,
        items: grouped[cat].slice(0, 4).map((s: any) => ({
          name: s.name,
          price: `${s.price} DH`,
          duration: `${s.duration_minutes} min`,
        })),
      }))
    : [
        { name: "Massages", icon: Heart, items: ["Thérapie Tête & Épaules", "Massage Corps 60 Min", "Massage Corps 90 Min", "Aromathérapie"].map((n) => ({ name: n })) },
        { name: "Hammams", icon: Droplets, items: ["Sauna & Hammam", "Soin Visage Essentiel", "Soin Visage Premium"].map((n) => ({ name: n })) },
        { name: "Packs", icon: Sparkles, items: ["Forfait Essentiel", "Forfait Premium"].map((n) => ({ name: n })) },
      ];

  return (
    <div className="border-t border-background/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3.5 font-body text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-200"
      >
        Services
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-4">
              {displayCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2 pl-2 pb-2">
                      <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center shrink-0">
                        <Icon size={12} className="text-primary-foreground" />
                      </div>
                      <span className="font-display text-sm text-white/90">{cat.name}</span>
                    </div>
                    <ul className="space-y-0.5 pl-9">
                      {cat.items.map((item: any, i: number) => (
                        <li key={i}>
                          <Link
                            to="/book"
                            onClick={onNavigate}
                            className="flex items-center justify-between py-2 pr-3 rounded-md hover:bg-white/10 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="font-body text-xs text-white/70 group-hover:text-white transition-colors">
                                {item.name}
                              </span>
                              {item.duration && (
                                <span className="flex items-center gap-1 mt-0.5">
                                  <Clock size={9} className="text-white/30" />
                                  <span className="font-body text-[9px] text-white/40">{item.duration}</span>
                                </span>
                              )}
                            </div>
                            {item.price && (
                              <span className="font-body text-[10px] text-primary font-medium shrink-0 ml-2">
                                {item.price}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              <Link
                to="/book"
                onClick={onNavigate}
                className="flex items-center justify-center gap-2 mt-3 py-2.5 px-4 rounded-md bg-white/10 hover:bg-white/15 transition-colors group"
              >
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/80">
                  Voir Tous les Services
                </span>
                <ArrowRight size={12} className="text-white/60 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileServicesMenu;