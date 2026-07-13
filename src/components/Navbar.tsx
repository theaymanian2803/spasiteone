import { useState, useRef, useEffect } from "react";
import { Menu, X, LogIn, LogOut, User, CalendarDays, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ServicesMegaMenu from "./navbar/ServicesMegaMenu";

const sectionLinks = [
  { label: "Accueil", href: "/" },
  { label: "Galerie", href: "/#gallery" },
  { label: "À Propos", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 flex items-center justify-between h-16 sm:h-20">
        {/* Brand */}
        <Link to="/" className="flex items-center group">
          <img
            src="/mainlogo.png"
            alt="Lumière"
            className="h-16 w-auto drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_4px_16px_rgba(255,255,255,0.4)]"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/"
            className="px-4 py-2.5 font-body text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-all duration-300 rounded-md hover:bg-muted/30"
          >
            Home
          </a>
          <ServicesMegaMenu />
          {sectionLinks.slice(1).map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2.5 font-body text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-all duration-300 rounded-md hover:bg-muted/30"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="hero" size="sm" asChild className="shadow-[0_2px_12px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.5)] text-black">
            <Link to="/book">Réserver</Link>
          </Button>

          {user ? (
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={() => setMegaOpen(!megaOpen)}
                className="flex items-center gap-2 px-3.5 py-2 font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all duration-300 rounded-md border border-border/40 hover:border-border/70 hover:bg-muted/20"
              >
                <User size={14} strokeWidth={1.5} />
                <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    ref={megaRef}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-background border border-border/60 rounded-lg shadow-2xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
                      <p className="font-body text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        to="/my-appointments"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-body text-sm text-foreground hover:bg-muted/40 transition-colors duration-200"
                      >
                        <CalendarDays size={16} strokeWidth={1.5} className="text-primary" />
                        Mes Réservations
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 font-body text-sm text-foreground hover:bg-muted/40 transition-colors duration-200"
                        >
                          <LayoutDashboard size={16} strokeWidth={1.5} className="text-primary" />
                          Tableau de Bord
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-border/40 py-1.5">
                      <button
                        onClick={() => { signOut(); setMegaOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left font-body text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors duration-200"
                      >
                        <LogOut size={16} strokeWidth={1.5} />
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button variant="elegant" size="sm" asChild className="shadow-[0_2px_8px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
              <Link to="/login"><LogIn size={14} strokeWidth={1.5} className="mr-1.5" /> Connexion</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2 rounded-md hover:bg-muted/30 transition-colors duration-200"
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-background border-b border-border/40 overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 pt-3">
              {sectionLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3.5 font-body text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}

              <Button variant="hero" size="sm" className="w-full mt-4" asChild>
                <Link to="/book" onClick={() => setMobileOpen(false)}>Réserver</Link>
              </Button>

              {user ? (
                <div className="mt-5 pt-5 border-t border-border/40 space-y-1">
                  <div className="flex items-center gap-2 py-2.5 font-body text-xs text-muted-foreground">
                    <User size={14} strokeWidth={1.5} />
                    {user.email}
                  </div>
                  <Link
                    to="/my-appointments"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 py-3 font-body text-sm text-foreground hover:text-primary transition-colors duration-200"
                  >
                    <CalendarDays size={14} strokeWidth={1.5} /> Mes Réservations
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 py-3 font-body text-sm text-foreground hover:text-primary transition-colors duration-200"
                    >
                      <LayoutDashboard size={14} strokeWidth={1.5} /> Tableau de Bord
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2.5 py-3 w-full text-left font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <LogOut size={14} strokeWidth={1.5} /> Déconnexion
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <Button variant="elegant" size="sm" className="w-full" asChild>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>Connexion / Inscription</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
