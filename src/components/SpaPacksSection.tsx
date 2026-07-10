import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

type PricingOption = {
  duration: string;
  price: number;
};

type SpaMenuItem = {
  id: string;
  name: string;
  description?: string;
  pricing: PricingOption[];
};

type SpaCategory = {
  id: string;
  name: string;
  items: SpaMenuItem[];
};

const spaMenuData: SpaCategory[] = [
  {
    id: "massages",
    name: "Massages",
    items: [
      {
        id: "massage-relaxant",
        name: "Massage Relaxant",
        pricing: [
          { duration: "1h", price: 400 },
          { duration: "30min", price: 300 },
        ],
      },
      {
        id: "massage-tonique",
        name: "Massage Tonique",
        pricing: [
          { duration: "1h", price: 500 },
          { duration: "30min", price: 400 },
        ],
      },
      {
        id: "foot-massage",
        name: "Foot Massage",
        pricing: [
          { duration: "1h", price: 500 },
          { duration: "30min", price: 400 },
        ],
      },
    ],
  },
  {
    id: "hammams",
    name: "Hammams",
    items: [
      {
        id: "hammam-traditionnel",
        name: "Hammam Traditionnel",
        description: "Hammam Gommage Au Savon Noir + Savonage",
        pricing: [
          { duration: "1h", price: 400 },
          { duration: "30min", price: 300 },
        ],
      },
      {
        id: "hammam-royal",
        name: "Hammam Royal",
        description: "Hammam Gommage Au Savon Noir + Savonage",
        pricing: [
          { duration: "1h", price: 500 },
          { duration: "30min", price: 400 },
        ],
      },
    ],
  },
  {
    id: "packs",
    name: "Packs",
    items: [
      {
        id: "pack-prince",
        name: "Prince",
        description: "Hammam Traditionnel + Massage Relaxant",
        pricing: [{ duration: "45min", price: 500 }],
      },
      {
        id: "pack-royal",
        name: "Royal",
        description: "Hammam Royal + Massage Relaxant",
        pricing: [{ duration: "45min", price: 600 }],
      },
      {
        id: "pack-parfait",
        name: "Parfait",
        description: "Hammam Royal + Massage Tonique",
        pricing: [{ duration: "60min", price: 700 }],
      },
    ],
  },
];

const SpaPacksSection = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Our Services</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Spa Menu &<span className="italic"> Pricing</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our range of premium spa treatments and curated packages designed for your ultimate relaxation.
          </p>
        </motion.div>

        {spaMenuData.map((category, catIdx) => (
          <div key={category.id} className={catIdx < spaMenuData.length - 1 ? "mb-16" : ""}>
            <motion.h3
              className="font-display text-2xl text-foreground mb-6 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-8 h-0.5 bg-primary" />
              {category.name}
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="bg-background rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <h4 className="font-display text-xl mb-2">{item.name}</h4>
                  {item.description && (
                    <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  )}
                  {!item.description && <div className="mb-4" />}

                  <div className="space-y-2 mb-6">
                    {item.pricing.map((option, j) => (
                      <div key={j} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-primary" />
                          <span className="font-body text-sm text-muted-foreground">{option.duration}</span>
                        </div>
                        <span className="font-display text-lg text-primary font-semibold">{option.price} DH</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="elegant" size="sm" className="w-full" asChild>
                    <Link to="/book">Book Now</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpaPacksSection;
