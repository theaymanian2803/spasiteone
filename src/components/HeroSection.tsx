import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroContent } from "@/hooks/useSiteContent";

interface Props {
  content: HeroContent;
}

const HeroSection = ({ content }: Props) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#f5f0eb] via-[#faf7f2] to-[#f0ebe4]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large soft circle */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#4a6741]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#4a6741]/5 blur-3xl" />
        
        {/* Floating leaves */}
        <svg className="absolute top-20 right-1/4 w-16 h-16 text-[#4a6741]/20 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z" />
        </svg>
        <svg className="absolute bottom-32 left-1/3 w-12 h-12 text-[#4a6741]/15 animate-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z" />
        </svg>
        
        {/* Small dots pattern */}
        <div className="absolute top-1/4 right-1/3 grid grid-cols-3 gap-4 opacity-30">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#4a6741]" />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Brand Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-[#4a6741]/10 border border-[#4a6741]/20 rounded-full px-4 py-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles size={14} className="text-[#4a6741]" />
              <span className="font-body text-xs uppercase tracking-[0.2em] text-[#4a6741] font-medium">
                {content.subtitle}
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1a1a1a] leading-[1.1] mb-6 tracking-tight">
              {content.title_line1}
              <span className="italic block text-[#4a6741]">{content.title_line2}</span>
            </h1>

            {/* Description */}
            <motion.p
              className="font-body text-lg text-[#666] leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {content.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-[#4a6741] hover:bg-[#3d5636] text-white rounded-full px-8 group"
              >
                <Link to="/book" className="flex items-center gap-2">
                  {content.cta_text}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#4a6741]/30 text-[#4a6741] hover:bg-[#4a6741]/10 rounded-full px-8"
              >
                Explore Services
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 mt-12 pt-8 border-t border-[#4a6741]/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div>
                <p className="font-display text-3xl text-[#4a6741] font-bold">100+</p>
                <p className="font-body text-xs text-[#999] uppercase tracking-wider mt-1">Spa Treatments</p>
              </div>
              <div>
                <p className="font-display text-3xl text-[#4a6741] font-bold">40+</p>
                <p className="font-body text-xs text-[#999] uppercase tracking-wider mt-1">Expert Therapists</p>
              </div>
              <div>
                <p className="font-display text-3xl text-[#4a6741] font-bold">25+</p>
                <p className="font-body text-xs text-[#999] uppercase tracking-wider mt-1">Years Experience</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=900&fit=crop"
                  alt="Spa treatment"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Card - Top Right */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#4a6741]/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-[#4a6741]" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#999] uppercase tracking-wider">Rating</p>
                    <p className="font-display text-lg text-[#1a1a1a] font-bold">4.9/5</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Bottom Left */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-[#4a6741]/20 border-2 border-white flex items-center justify-center">
                        <span className="text-xs">😊</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#999] uppercase tracking-wider">Happy Clients</p>
                    <p className="font-display text-lg text-[#1a1a1a] font-bold">10K+</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Circle */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border-2 border-[#4a6741]/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
