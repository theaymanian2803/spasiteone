import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Eye, Droplets, Clock, ArrowRight, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { turso } from "@/lib/db";

const iconMap: Record<string, React.ElementType> = {
  Massages: Heart,
  Hammams: Droplets,
  Packs: Sparkles,
};

const ServicesMegaMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { data: services = [] } = useQuery({
    queryKey: ["services-nav"],
    queryFn: async () => {
      const result = await turso.execute("SELECT * FROM services WHERE active = 1 ORDER BY category LIMIT 12");
      return result.rows as any[];
    },
  });

  // Group services by category
  const grouped = services.reduce((acc, svc) => {
    const cat = svc.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {} as Record<string, typeof services>);

  const categories = Object.keys(grouped);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 font-body text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors rounded-sm"
      >
        Services
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Invisible bridge to prevent menu closing when moving to it */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-screen h-4" onMouseEnter={() => setOpen(true)} />

            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseLeave={() => setOpen(false)}
              className="fixed left-0 right-0 top-20 z-50 bg-background border-b border-border shadow-2xl"
            >
              <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Service Categories */}
                  {categories.length > 0 ? (
                    categories.slice(0, 3).map((category) => {
                      const Icon = iconMap[category] || Sparkles;
                      return (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                              <Icon size={14} className="text-primary-foreground" />
                            </div>
                            <h3 className="font-display text-lg text-foreground">{category}</h3>
                          </div>
                          <ul className="space-y-2">
                            {grouped[category].slice(0, 4).map((svc) => (
                              <li key={svc.id}>
                                <Link
                                  to="/book"
                                  onClick={() => setOpen(false)}
                                  className="group flex items-center justify-between py-2 px-3 rounded-sm hover:bg-muted/50 transition-colors"
                                >
                                  <div>
                                    <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">
                                      {svc.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <Clock size={10} className="text-muted-foreground" />
                                      <span className="font-body text-[10px] text-muted-foreground">
                                        {svc.duration_minutes} min
                                      </span>
                                    </div>
                                  </div>
                                  <span className="font-body text-xs text-primary font-medium">
                                    {svc.price} DH
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback when no services in DB
                    <>
                      {[
                        { name: "Massages", icon: Heart, items: ["Thérapie Tête & Épaules", "Massage Corps 60 Min", "Massage Corps 90 Min", "Aromathérapie"] },
                        { name: "Hammams", icon: Droplets, items: ["Sauna & Hammam", "Toutes les Installations", "Soin Visage Essentiel", "Soin Visage Premium"] },
                        { name: "Packs", icon: Sparkles, items: ["Forfait Essentiel", "Forfait Premium"] },
                      ].map((cat) => (
                        <div key={cat.name} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                              <cat.icon size={14} className="text-primary-foreground" />
                            </div>
                            <h3 className="font-display text-lg text-foreground">{cat.name}</h3>
                          </div>
                          <ul className="space-y-2">
                            {cat.items.map((item) => (
                              <li key={item}>
                                <Link
                                  to="/book"
                                  onClick={() => setOpen(false)}
                                  className="block py-2 px-3 rounded-sm font-body text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-colors"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Promo Card */}
                  <div className="relative overflow-hidden rounded-sm bg-foreground text-background p-6 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
                    
                    <div className="relative z-10">
                      <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                        Offre Nouveau Client
                      </p>
                      <h4 className="font-display text-2xl mb-2">
                        -20% Sur Votre <span className="italic">Première Visite</span>
                      </h4>
                      <p className="font-body text-xs text-background/70 leading-relaxed">
                        Profitez de la beauté de luxe avec une remise de bienvenue exclusive.
                      </p>
                    </div>
                    
                    <Link
                      to="/book"
                      onClick={() => setOpen(false)}
                      className="relative z-10 mt-6 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-primary hover:text-accent transition-colors group"
                    >
                      Réserver
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <p className="font-body text-xs text-muted-foreground">
                    Vous ne trouvez pas ce que vous cherchez ?{" "}
                    <a href="/#contact" className="text-primary hover:underline">
                      Contactez-nous
                    </a>
                  </p>
                  <Link
                    to="/book"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors group"
                  >
                    Voir Tous les Services
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesMegaMenu;
