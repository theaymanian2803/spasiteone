import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

interface Props {
  content: ContactContent;
}

const ContactSection = ({ content }: Props) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé ! Nous vous répondrons bientôt.");
    setFormData({ fullName: "", phone: "", email: "", date: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">{content.subtitle}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            {content.title}<span className="italic">{content.title_italic}</span>
          </h2>
          <p className="font-body text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info Cards */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-secondary/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">Appelez-nous</h4>
                  <p className="font-body text-sm text-muted-foreground mb-1">Lun–Ven: 9h00 – 20h00</p>
                  <p className="font-body text-sm text-primary font-medium">{content.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">Envoyez-nous un Email</h4>
                  <p className="font-body text-sm text-muted-foreground mb-1">Nous vous répondrons sous 24h</p>
                  <p className="font-body text-sm text-primary font-medium">{content.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">Rendez-nous Visite</h4>
                  <p className="font-body text-sm text-muted-foreground mb-1">Venez vous détendre avec nous</p>
                  <p className="font-body text-sm text-primary font-medium">128 Rue de la Beauté, Paris</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">Horaires</h4>
                  <p className="font-body text-sm text-muted-foreground mb-1">Réservez votre rendez-vous</p>
                  <p className="font-body text-sm text-primary font-medium">Lun–Ven: 9h00 – 20h00</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-secondary/30 rounded-3xl p-8 md:p-10">
              <h3 className="font-display text-2xl mb-2">Envoyez-nous un Message</h3>
              <p className="font-body text-sm text-muted-foreground mb-8">Remplissez le formulaire ci-dessous et nous vous répondrons sous peu.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Nom Complet</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="Entrez votre nom"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Numéro de Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="Entrez le numéro de téléphone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Adresse Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Entrez votre email"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Choisir une Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    placeholder="Parlez-nous de vos besoins..."
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full group">
                  <Send size={16} className="mr-2 group-hover:translate-x-1 transition-transform" />
                  Envoyer le Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
