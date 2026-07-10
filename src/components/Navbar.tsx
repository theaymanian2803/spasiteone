import { useState, useRef, useEffect } from "react";
import { Menu, X, LogIn, LogOut, User, CalendarDays, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ServicesMegaMenu from "./navbar/ServicesMegaMenu";

const sectionLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="font-display text-xl italic text-foreground">
          Lumière
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="/"
            className="px-3 py-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors rounded-sm"
          >
            Home
          </a>
          <ServicesMegaMenu />
          {sectionLinks.slice(1).map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="hero" size="sm" asChild>
            <Link to="/book">Book Now</Link>
          </Button>

          {user ? (
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={() => setMegaOpen(!megaOpen)}
                className="flex items-center gap-1.5 px-3 py-2 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors rounded-sm border border-border/50 hover:border-border"
              >
                <User size={14} />
                <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                <ChevronDown size={12} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    ref={megaRef}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-sm shadow-xl overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="font-body text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to="/my-appointments"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <CalendarDays size={16} className="text-primary" />
                        My Bookings
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-primary" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => { signOut(); setMegaOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left font-body text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button variant="elegant" size="sm" asChild>
              <Link to="/login"><LogIn size={14} className="mr-1" /> Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              {sectionLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <Button variant="hero" size="sm" className="w-full mt-4" asChild>
                <Link to="/book" onClick={() => setMobileOpen(false)}>Book Now</Link>
              </Button>

              {user ? (
                <div className="mt-4 pt-4 border-t border-border space-y-1">
                  <div className="flex items-center gap-2 py-2 font-body text-xs text-muted-foreground">
                    <User size={14} />
                    {user.email}
                  </div>
                  <Link
                    to="/my-appointments"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 font-body text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <CalendarDays size={14} /> My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-2.5 font-body text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 py-2.5 w-full text-left font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <Button variant="elegant" size="sm" className="w-full" asChild>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In / Sign Up</Link>
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
