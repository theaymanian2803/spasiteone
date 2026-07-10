import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
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
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ fullName: "", phone: "", email: "", date: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body uppercase tracking-[0.3em] text-sm text-white/70 mb-4">{content.subtitle}</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              {content.title}<span className="italic">{content.title_italic}</span>
            </h2>
            <p className="font-body text-white/70 leading-relaxed mb-8">
              {content.description}
            </p>

            <div className="relative mb-8">
              <img
                src={content.image_url}
                alt="Spa treatment"
                className="w-full h-64 object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <p className="font-body text-xs text-white/70 mb-1">Call Us</p>
                  <p className="font-display text-lg">{content.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-xs text-white/70 mb-1">Email Us</p>
                  <p className="font-display text-lg">{content.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-white/70" />
                <span className="font-body text-sm">{content.phone2}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-white/70" />
                <span className="font-body text-sm">{content.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-white/70" />
                <span className="font-body text-sm">123 Spa Street, Wellness City</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-2xl mb-6">Get In Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-white/70 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-white/70 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-white/70 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-white/70 mb-2">Select Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-white/70 mb-2">Any Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <Button type="submit" variant="secondary" size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                Submit Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
