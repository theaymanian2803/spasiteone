import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ArrowUpRight } from "lucide-react";
import { AboutContent } from "@/hooks/useSiteContent";
import aboutFallback from "@/assets/about-salon.jpg";
import { useState } from "react";

interface Props {
  content: AboutContent;
}

const AboutSection = ({ content }: Props) => {
  const [mainImg, setMainImg] = useState(content.image_url || aboutFallback);

  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {content.subtitle}
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.2rem] text-foreground mb-6 leading-[1.15] font-bold tracking-tight">
              {content.title}<span className="italic">{content.title_italic}</span>
            </h2>

            <p className="font-body text-muted-foreground leading-relaxed mb-8 text-[15px]">
              {content.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <Star size={14} className="text-primary mt-0.5 shrink-0" fill="currentColor" />
                <p className="font-body text-sm text-foreground leading-relaxed">
                  {content.feature1}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Star size={14} className="text-primary mt-0.5 shrink-0" fill="currentColor" />
                <p className="font-body text-sm text-foreground leading-relaxed">
                  {content.feature2}
                </p>
              </div>
            </div>

            <div className="bg-[#f5f0eb] rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-display text-4xl font-bold text-foreground mb-1">
                    {content.stat1_number}
                  </p>
                  <p className="font-body text-[13px] text-muted-foreground leading-relaxed">
                    {content.stat1_label}
                  </p>
                </div>
                <div>
                  <p className="font-display text-4xl font-bold text-foreground mb-1">
                    {content.stat2_number}
                  </p>
                  <p className="font-body text-[13px] text-muted-foreground leading-relaxed">
                    {content.stat2_label}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="rounded-full px-8 bg-[#4a6741] hover:bg-[#3d5636]"
            >
              <ArrowUpRight size={18} className="mr-2" />
              More About Us
            </Button>
          </motion.div>

          {/* Right Images - Overlapping Layout */}
          <motion.div
            className="relative h-[520px] lg:h-[560px]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Main Large Circle Image */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[420px] rounded-full overflow-hidden shadow-lg z-10">
              <img
                src={mainImg}
                alt="Spa treatment"
                className="w-full h-full object-cover"
                onError={() => setMainImg(aboutFallback)}
              />
            </div>

            {/* Small Rectangular Image - overlaps top-right of main circle */}
            <div className="absolute top-12 right-0 w-[200px] h-[160px] rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-background">
              <img
                src={content.image2_url}
                alt="Spa treatment detail"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#4a6741] text-white text-center py-2 px-3">
                <p className="font-body text-[11px] font-medium">Call At: +(123) 456-789</p>
              </div>
            </div>

            {/* Small Circular Image - overlaps bottom-left of main circle */}
            <div className="absolute bottom-4 left-4 w-[160px] h-[160px] rounded-full overflow-hidden shadow-xl z-20 border-4 border-background">
              <img
                src={content.image3_url}
                alt="Relaxation"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative Leaf SVG - bottom right */}
            <svg
              className="absolute bottom-0 right-0 w-28 h-28 text-[#4a6741]/20 z-0"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M60 10 C30 40, 15 70, 20 100 C25 110, 40 115, 55 110" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M60 30 Q40 35, 30 50" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M55 50 Q70 50, 80 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M45 70 Q30 75, 25 85" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M50 85 Q65 85, 75 95" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <ellipse cx="28" cy="48" rx="8" ry="5" fill="currentColor" opacity="0.3" transform="rotate(-30 28 48)" />
              <ellipse cx="82" cy="58" rx="8" ry="5" fill="currentColor" opacity="0.3" transform="rotate(20 82 58)" />
              <ellipse cx="23" cy="83" rx="7" ry="4" fill="currentColor" opacity="0.3" transform="rotate(-20 23 83)" />
              <ellipse cx="77" cy="93" rx="7" ry="4" fill="currentColor" opacity="0.3" transform="rotate(25 77 93)" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
