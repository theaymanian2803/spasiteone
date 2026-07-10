import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
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

const SpaPacksSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isTursoConfigured()) return;

    turso.execute("SELECT * FROM categories WHERE active = 1 ORDER BY display_order, name")
      .then((result) => setCategories(result.rows as Category[]))
      .catch(() => {});

    turso.execute("SELECT * FROM services WHERE active = 1 ORDER BY category, name")
      .then((result) => setServices(result.rows as Service[]))
      .catch(() => {});
  }, []);

  const getServicesForCategory = (categoryName: string) => {
    return services.filter((s) => s.category === categoryName);
  };

  // Pick one featured service from each category (the first one)
  const featuredByCategory = categories.map((cat) => ({
    ...cat,
    featured: getServicesForCategory(cat.name)[0] || null,
  })).filter((c) => c.featured);

  // All services grouped by category
  const allByCategory = categories.map((cat) => ({
    ...cat,
    services: getServicesForCategory(cat.name),
  })).filter((c) => c.services.length > 0);

  const displayData = showAll ? allByCategory : featuredByCategory;

  if (categories.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="font-body text-muted-foreground">Menu will appear here once categories and services are added from the admin panel.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Our Packages</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Spa Menu &<span className="italic"> Pricing</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our curated spa packages designed for your ultimate relaxation and rejuvenation.
          </p>
        </motion.div>

        {displayData.map((cat, catIdx) => (
          <div key={cat.id} className={catIdx < displayData.length - 1 ? "mb-16" : ""}>
            <motion.h3
              className="font-display text-2xl text-foreground mb-6 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-8 h-0.5 bg-primary" />
              {cat.name}
            </motion.h3>

            {showAll ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(cat as any).services.map((service: Service, i: number) => (
                  <motion.div
                    key={service.id}
                    className="bg-secondary/30 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <h4 className="font-display text-lg mb-2">{service.name}</h4>
                    {service.description && (
                      <p className="font-body text-xs text-muted-foreground mb-3">{service.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-muted-foreground">{service.duration_minutes} min</span>
                      <span className="font-display text-primary font-semibold">{service.price} DH</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredByCategory.slice(catIdx * 1, catIdx * 1 + 1).map((item) => {
                  const service = item.featured!;
                  return (
                    <motion.div
                      key={service.id}
                      className="bg-secondary/30 rounded-xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <h4 className="font-display text-lg mb-2">{service.name}</h4>
                      {service.description && (
                        <p className="font-body text-xs text-muted-foreground mb-3">{service.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-body text-muted-foreground">{service.duration_minutes} min</span>
                        <span className="font-display text-primary font-semibold">{service.price} DH</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {!showAll && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="px-8"
            >
              See More Services
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SpaPacksSection;
