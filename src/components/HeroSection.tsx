import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Search, Clock, MapPin, Phone } from "lucide-react";
import { HeroContent } from "@/hooks/useSiteContent";
import { turso, isTursoConfigured } from "@/lib/db";

interface Props {
  content: HeroContent;
}

const HeroSection = ({ content }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      if (isTursoConfigured()) {
        const result = await turso.execute(
          "SELECT id, name, description, category, price FROM services WHERE active = 1 AND (name LIKE ? OR description LIKE ? OR category LIKE ?) LIMIT 5",
          [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
        );
        setSearchResults(result.rows as any[]);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const goToService = (serviceId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate("/book");
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src="https://images.unsplash.com/photo-1693578538512-fc66f318c833?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Spa background"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Decorative leaf elements */}
      <svg className="absolute top-16 right-12 w-20 h-20 text-white/10 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z" />
      </svg>
      <svg className="absolute bottom-24 left-8 w-16 h-16 text-white/10 animate-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z" />
      </svg>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20 w-full">
        <div className="max-w-3xl">
          {/* Brand Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles size={14} className="text-[#a8d5a2]" />
            <span className="font-body text-xs uppercase tracking-[0.25em] text-white/90 font-medium">
              {content.subtitle}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {content.title_line1}
            <span className="italic block text-[#a8d5a2]">{content.title_line2}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="font-body text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {content.description}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden focus-within:border-[#a8d5a2]/50 transition-colors">
                <Search size={20} className="text-white/50 ml-5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des services... (ex: massage, soin, manucure)"
                  className="flex-1 bg-transparent px-4 py-4 font-body text-white placeholder:text-white/40 text-base focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-[#4a6741] hover:bg-[#3d5636] text-white font-body text-sm font-medium px-6 py-4 transition-colors shrink-0"
                >
                  {searching ? "..." : "Rechercher"}
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50">
                  {searchResults.map((service: any) => (
                    <button
                      key={service.id}
                      onClick={() => goToService(service.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a6741]/10 transition-colors text-left border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-display text-base text-[#1a1a1a]">{service.name}</p>
                        <p className="font-body text-xs text-gray-500 mt-0.5">{service.category} · {service.description?.slice(0, 60)}...</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-display text-lg text-[#4a6741] font-bold">{service.price} DH</p>
                        <p className="font-body text-[10px] text-gray-400 uppercase tracking-wider">Réserver</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-[#4a6741] hover:bg-[#3d5636] text-white rounded-full px-8 group shadow-lg shadow-[#4a6741]/20"
            >
              <Link to="/book" className="flex items-center gap-2">
                {content.cta_text}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 backdrop-blur-sm"
              asChild
            >
              <Link to="/contact">
                <Phone size={16} className="mr-2" />
                Contactez-nous
              </Link>
            </Button>
          </motion.div>

          {/* Info Row */}
          <motion.div
            className="flex flex-wrap gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <div className="flex items-center gap-2 text-white/60">
              <MapPin size={14} className="text-[#a8d5a2]" />
              <span className="font-body text-sm">128 Rue de la Beauté, Paris</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Clock size={14} className="text-[#a8d5a2]" />
              <span className="font-body text-sm">Lun–Ven: 9h00 – 20h00</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Phone size={14} className="text-[#a8d5a2]" />
              <span className="font-body text-sm">+33 1 23 45 67 89</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-10 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div>
              <p className="font-display text-4xl text-white font-bold">100+</p>
              <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">Soins Spa</p>
            </div>
            <div>
              <p className="font-display text-4xl text-white font-bold">40+</p>
              <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">Thérapeutes Experts</p>
            </div>
            <div>
              <p className="font-display text-4xl text-white font-bold">25+</p>
              <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-1">Années d'Expérience</p>
            </div>
          </motion.div>
        </div>

        {/* Floating Rating Card - Right Side */}
        <motion.div
          className="hidden lg:block absolute right-12 top-1/3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#4a6741]/30 flex items-center justify-center">
              <Sparkles size={22} className="text-[#a8d5a2]" />
            </div>
            <div>
              <p className="font-body text-[10px] text-white/50 uppercase tracking-wider">Note Clients</p>
              <p className="font-display text-2xl text-white font-bold">4.9/5</p>
              <div className="flex gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-3 h-3 fill-[#a8d5a2]" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Clients Card - Right Side Lower */}
        <motion.div
          className="hidden lg:block absolute right-12 bottom-1/3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["😊", "😌", "🧖"].map((emoji, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/10 flex items-center justify-center text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <p className="font-body text-[10px] text-white/50 uppercase tracking-wider">Clients Satisfaits</p>
              <p className="font-display text-2xl text-white font-bold">10K+</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">Défiler</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-2 bg-white/40 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
