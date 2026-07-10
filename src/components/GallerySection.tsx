import { motion } from "framer-motion";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { GalleryContent } from "@/hooks/useSiteContent";

const fallbackImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

interface GallerySectionProps {
  content: GalleryContent;
}

const GallerySection = ({ content }: GallerySectionProps) => {
  const items = content.items.length > 0 ? content.items : [];

  return (
    <section id="gallery" className="section-padding bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Our Work</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">The <span className="italic">Gallery</span></h2>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((item, i) => {
            const imgSrc = item.image_url || fallbackImages[i % fallbackImages.length];
            return (
              <motion.div
                key={i}
                className="group relative break-inside-avoid overflow-hidden rounded-sm cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img src={imgSrc} alt={item.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-500 flex items-end p-6">
                  <span className="font-body text-xs uppercase tracking-[0.2em] text-background opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
