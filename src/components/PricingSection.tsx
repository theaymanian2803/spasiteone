import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingContent } from "@/hooks/useSiteContent";

interface Props {
  content: PricingContent;
}

const PricingSection = ({ content }: Props) => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`relative bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full font-body text-xs uppercase tracking-wider">
                  Le Plus Populaire
                </div>
              )}

              <h3 className="font-display text-2xl mb-2">{plan.name}</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">Parfait pour une expérience spa rapide et relaxante</p>

              <div className="mb-8">
                <span className="font-display text-5xl text-primary">{plan.price}</span>
                <span className="font-body text-sm text-muted-foreground">/{plan.period}</span>
              </div>

              <div className="mb-8">
                <h4 className="font-body text-sm font-medium mb-4">Ce Qui Est Inclus :</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant={plan.popular ? "hero" : "elegant"} size="lg" className="w-full">
                Commencer Avec Ce Forfait
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
