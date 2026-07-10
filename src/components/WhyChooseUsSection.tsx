import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, Clock } from "lucide-react";
import { WhyChooseUsContent } from "@/hooks/useSiteContent";

interface Props {
  content: WhyChooseUsContent;
}

const WhyChooseUsSection = ({ content }: Props) => {
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
              alt="Spa relaxation"
              className="w-full aspect-[4/5] object-cover rounded-2xl"
            />
            <div className="absolute top-8 left-8 bg-primary text-white rounded-2xl p-4 shadow-xl">
              <p className="font-body text-xs uppercase tracking-wider opacity-80">Proudly Serving Since</p>
              <p className="font-display text-3xl">{content.since_year}</p>
            </div>
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

            <div className="space-y-4 mb-8">
              <motion.div
                className="flex items-start gap-4 bg-secondary/50 rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">{content.certified_title}</h4>
                  <p className="font-body text-sm text-muted-foreground">{content.certified_description}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4 bg-primary text-white rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">{content.experience_years} Years of Experience</h4>
                  <p className="font-body text-sm opacity-80">{content.experience_description}</p>
                </div>
              </motion.div>
            </div>

            <Button variant="hero" size="lg">
              Book Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
