import { motion } from "framer-motion";
import { Sparkles, Heart, Clock, type LucideIcon } from "lucide-react";
import { WellnessContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Heart,
  Clock,
};

interface Props {
  content: WellnessContent;
}

const WellnessBenefitsSection = ({ content }: Props) => {
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
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">{content.subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            {content.title}<span className="italic">{content.title_italic}</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {content.items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <motion.div
                key={i}
                className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-xl mb-3">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li key={j} className="font-body text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}

          <motion.div
            className="rounded-2xl overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={content.working_hours_image}
              alt="Working hours"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {content.categories.map((cat, i) => (
            <button
              key={i}
              className={`px-5 py-2 rounded-full font-body text-sm transition-all ${
                i === 0
                  ? "bg-primary text-white"
                  : "bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WellnessBenefitsSection;
