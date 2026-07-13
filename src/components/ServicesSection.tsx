import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ServicesContent } from "@/hooks/useSiteContent";
import { turso, isTursoConfigured } from "@/lib/db";

interface Props {
  content: ServicesContent;
}

interface DisplayService {
  number: string;
  title: string;
  description: string;
  image_url: string;
}

const ServiceCard = ({ service, index }: { service: DisplayService; index: number }) => {
  const [imgSrc, setImgSrc] = useState(service.image_url);

  useEffect(() => {
    setImgSrc(service.image_url);
  }, [service.image_url]);

  return (
    <motion.div
      className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative h-48 overflow-hidden bg-secondary/30">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgSrc("")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-primary/40 text-sm font-body">Pas d'image</span>
          </div>
        )}
        <div className="absolute top-4 left-4 w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
          <span className="font-body text-sm font-bold text-white">{service.number}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl mb-2 text-foreground">{service.title}</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.description}</p>
      </div>
    </motion.div>
  );
};

const ServicesSection = ({ content }: Props) => {
  const [dbServices, setDbServices] = useState<DisplayService[]>([]);

  useEffect(() => {
    if (!isTursoConfigured()) return;
    turso
        .execute("SELECT name, description, category, image_url FROM services WHERE active = 1 ORDER BY category, name LIMIT 3")
      .then((result) => {
        const rows = result.rows as any[];
        const mapped: DisplayService[] = rows.map((r, i) => ({
          number: String(i + 1).padStart(2, "0"),
          title: r.name,
          description: r.description || "",
          image_url: r.image_url || "",
        }));
        setDbServices(mapped);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="section-padding bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">{content.subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            {content.title}<span className="italic">{content.title_italic}</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        {dbServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {dbServices.map((service, i) => (
              <ServiceCard key={service.number} service={service} index={i} />
            ))}
          </div>
        )}

        {dbServices.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">Les services apparaîtront ici une fois ajoutés depuis le panneau d'administration.</p>
          </div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 bg-background rounded-full px-6 py-3 shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                  <span className="text-xs">😊</span>
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-body text-sm font-medium text-foreground">La confiance de {content.users} Utilisateurs</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="font-body text-xs text-muted-foreground ml-1">{content.rating}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
