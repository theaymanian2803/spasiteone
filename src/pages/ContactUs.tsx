import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    label: "Appelez-nous",
    value: "0728729792",
    href: "tel:0728729792",
  },
  {
    icon: Mail,
    label: "Envoyez-nous un Email",
    value: "contact@spapausemarrakech.com",
    href: "mailto:contact@spapausemarrakech.com",
  },
  {
    icon: MapPin,
    label: "Rendez-nous Visite",
    value: "31.6393154, -8.0220954\nMaroc",
    href: "https://www.google.com/maps?q=31.6393154,-8.0220954&z=17&hl=fr",
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Tous les jours : 11h00 - 23h00",
    href: null,
  },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast.success("Message envoyé ! Nous vous répondrons bientôt.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-2xl sm:text-3xl">
            Contactez-<span className="italic">Nous</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Contact Info Cards */}
        <section className="section-padding bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Contactez-nous</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
                Nous Serions Ravis de <span className="italic">Vous Entendre</span>
              </h2>
              <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                Une question sur nos services ? Prêt à réserver un rendez-vous ? Ou simplement envie de dire bonjour ?
                Nous sommes là pour vous aider.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="p-6 bg-card border border-border rounded-sm text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-body uppercase tracking-[0.15em] text-sm text-foreground mb-2">
                    {item.label}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-body text-sm text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-body text-sm text-muted-foreground whitespace-pre-line">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="section-padding bg-secondary/30">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-body uppercase tracking-[0.3em] text-sm text-primary mb-4">Envoyez un message</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
                Écrivez-<span className="italic">Nous</span>
              </h2>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="+33 1 42 00 00 00"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Objet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Sélectionnez un objet</option>
                    <option value="booking">Demande de réservation</option>
                    <option value="services">Question sur les services</option>
                    <option value="feedback">Avis</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Dites-nous comment nous pouvons vous aider..."
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="hero" size="lg" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Envoyer le Message
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </section>

        {/* Map & Video Section */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-80 bg-muted relative">
            <iframe
              title="Localisation du Salon Lumière"
              src="https://www.google.com/maps?q=31.6393154,-8.0220954&z=17&hl=fr&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
          <div className="h-80 bg-muted relative">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="https://pub-3fe2b2a234a04507951dc3d5646b7a33.r2.dev/Location.mp4"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
