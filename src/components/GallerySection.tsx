import { motion } from "framer-motion";
import { GalleryContent } from "@/hooks/useSiteContent";

interface Props {
  content: GalleryContent;
}

const GallerySection = ({ content }: Props) => {
  if (!content.show_gallery || content.items.length === 0) return null;

  const images = content.items.filter((item) => item.image_url);
  if (images.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Notre Galerie</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
            Découvrez <span className="italic">nos réalisations</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((item, i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-2xl aspect-[4/3]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <img
                src={item.image_url}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
