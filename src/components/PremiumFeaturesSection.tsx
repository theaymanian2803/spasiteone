import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PremiumFeaturesContent } from "@/hooks/useSiteContent";

interface Props {
  content: PremiumFeaturesContent;
}

const PremiumFeaturesSection = ({ content }: Props) => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={content.image_url}
              alt="Spa treatment"
              className="w-full aspect-[4/3] object-cover rounded-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">{content.subtitle}</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              {content.title}<span className="italic">{content.title_italic}</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              {content.description}
            </p>

            <div className="space-y-4">
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Check size={18} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg mb-1">
                      <span className="text-primary mr-2">{feature.number}.</span>
                      {feature.title}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeaturesSection;
