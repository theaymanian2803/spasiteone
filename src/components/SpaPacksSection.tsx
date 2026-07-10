import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Crown, Gem, Star } from "lucide-react";

type PricingOption = {
  duration: string;
  price: number;
};

type PackItem = {
  id: string;
  name: string;
  description: string;
  pricing: PricingOption[];
  icon: React.ReactNode;
  features: string[];
};

const packsData: PackItem[] = [
  {
    id: "pack-prince",
    name: "Prince",
    description: "Perfect for those looking for a quick and refreshing spa experience.",
    pricing: [{ duration: "45min", price: 500 }],
    icon: <Star size={32} />,
    features: [
      "Hammam Traditionnel",
      "Massage Relaxant",
      "45 minutes of pure relaxation",
    ],
  },
  {
    id: "pack-royal",
    name: "Royal",
    description: "Perfect for those looking for a quick and refreshing spa experience.",
    pricing: [{ duration: "45min", price: 600 }],
    icon: <Crown size={32} />,
    features: [
      "Hammam Royal",
      "Massage Relaxant",
      "45 minutes of pure relaxation",
    ],
  },
  {
    id: "pack-parfait",
    name: "Parfait",
    description: "Perfect for those looking for a quick and refreshing spa experience.",
    pricing: [{ duration: "60min", price: 700 }],
    icon: <Gem size={32} />,
    features: [
      "Hammam Royal",
      "Massage Tonique",
      "60 minutes of pure relaxation",
    ],
  },
];

const SpaPacksSection = () => {
  const [showAll, setShowAll] = useState(false);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packsData.map((pack, i) => (
            <motion.div
              key={pack.id}
              className={`relative bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border ${
                i === 1 ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full font-body text-xs uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 text-primary">
                  {pack.icon}
                </div>
                <h3 className="font-display text-2xl mb-2">{pack.name} Package</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {pack.description}
                </p>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl text-primary font-bold">
                    {pack.pricing[0].price} DH
                  </span>
                  <span className="font-body text-sm text-muted-foreground">
                    /{pack.pricing[0].duration}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-body text-sm font-medium mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {pack.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={i === 1 ? "hero" : "elegant"}
                size="lg"
                className="w-full"
                asChild
              >
                <Link to="/book">Get Started With Plan</Link>
              </Button>
            </motion.div>
          ))}
        </div>

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

        {showAll && (
          <motion.div
            className="mt-16 pt-16 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-2xl text-foreground mb-8 text-center">
              Additional Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Massage Relaxant", prices: [{ duration: "1h", price: 400 }, { duration: "30min", price: 300 }] },
                { name: "Massage Tonique", prices: [{ duration: "1h", price: 500 }, { duration: "30min", price: 400 }] },
                { name: "Foot Massage", prices: [{ duration: "1h", price: 500 }, { duration: "30min", price: 400 }] },
                { name: "Hammam Traditionnel", desc: "Gommage Au Savon Noir + Savonage", prices: [{ duration: "1h", price: 400 }, { duration: "30min", price: 300 }] },
                { name: "Hammam Royal", desc: "Gommage Au Savon Noir + Savonage", prices: [{ duration: "1h", price: 500 }, { duration: "30min", price: 400 }] },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-secondary/30 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <h4 className="font-display text-lg mb-2">{item.name}</h4>
                  {"desc" in item && (
                    <p className="font-body text-xs text-muted-foreground mb-3">{item.desc}</p>
                  )}
                  <div className="space-y-2">
                    {item.prices.map((p, j) => (
                      <div key={j} className="flex items-center justify-between text-sm">
                        <span className="font-body text-muted-foreground">{p.duration}</span>
                        <span className="font-display text-primary font-semibold">{p.price} DH</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SpaPacksSection;
