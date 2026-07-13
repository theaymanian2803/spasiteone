import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { turso, isTursoConfigured } from "@/lib/db";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  image_url: string;
}

interface CategoryWithServices extends Category {
  services: Service[];
}

const SpaPacksSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!isTursoConfigured()) return;

    turso.execute("SELECT * FROM categories WHERE active = 1 ORDER BY display_order, name")
      .then((result) => setCategories(result.rows as Category[]))
      .catch(() => {});

    turso.execute("SELECT * FROM services WHERE active = 1 ORDER BY category, name")
      .then((result) => setServices(result.rows as Service[]))
      .catch(() => {});
  }, []);

  const allByCategory: CategoryWithServices[] = categories
    .map((cat) => ({
      ...cat,
      services: services.filter((s) => s.category === cat.name),
    }))
    .filter((c) => c.services.length > 0);

  if (categories.length === 0 || services.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="font-body text-muted-foreground">Le menu apparaîtra ici une fois les catégories et services ajoutés depuis le panneau d'administration.</p>
        </div>
      </section>
    );
  }

  const totalServices = services.length;

  return (
    <section className="section-padding bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Nos Forfaits</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Menu Spa &<span className="italic"> Tarifs</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Découvrez nos {totalServices} soins spa sélectionnés pour votre relaxation et régénération ultimes.
          </p>
        </motion.div>

        <div className="space-y-16">
          {allByCategory.map((cat, catIdx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-primary" />
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">{cat.name}</h3>
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {cat.services.map((service, i) => (
                  <motion.div
                    key={service.id}
                    className="group relative bg-background rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <h4 className="font-display text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </h4>

                      {service.description && (
                        <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock size={14} />
                          <span className="font-body text-sm">{service.duration_minutes} min</span>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-xl text-primary font-semibold">
                            {service.price}
                          </span>
                          <span className="font-body text-xs text-muted-foreground ml-1">DH</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaPacksSection;
