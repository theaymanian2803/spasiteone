import { useState } from "react";
import { Phone, MapPin, Clock, Instagram, Facebook, Mail, Send, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterContent, defaultSiteContent } from "@/hooks/useSiteContent";

interface Props {
  content?: FooterContent;
}

const Footer = ({ content }: Props) => {
  const [email, setEmail] = useState("");
  const c = content ?? defaultSiteContent.footer;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display italic mb-4">Lumière</h3>
            <p className="font-body text-sm opacity-70 leading-relaxed">{c.brand_description}</p>
            <div className="flex gap-4 mt-6">
              {c.instagram && (
                <a href={c.instagram} className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-primary transition-all">
                  <Instagram size={16} />
                </a>
              )}
              {c.facebook && (
                <a href={c.facebook} className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-primary transition-all">
                  <Facebook size={16} />
                </a>
              )}
              {c.twitter && (
                <a href={c.twitter} className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-primary transition-all">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-body uppercase tracking-[0.2em] text-sm mb-6">Hours</h4>
            <div className="space-y-3 text-sm opacity-70">
              {c.hours.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-body uppercase tracking-[0.2em] text-sm mb-6">Location</h4>
            <div className="space-y-3 text-sm opacity-70">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0" />
                <span>{c.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <span>{c.email}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body uppercase tracking-[0.2em] text-sm mb-6">Newsletter</h4>
            <p className="font-body text-sm opacity-70 leading-relaxed mb-4">
              Subscribe for exclusive offers, beauty tips, and event invitations.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 bg-background/10 border border-background/20 rounded-sm px-3 py-2 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary transition-colors font-body"
              />
              <Button type="submit" variant="hero" size="icon" className="shrink-0 h-9 w-9">
                <Send size={14} />
              </Button>
            </form>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50 font-body">© 2026 Lumière Beauty Salon. All rights reserved.</p>
          <div className="flex gap-6 text-xs opacity-50 font-body">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
