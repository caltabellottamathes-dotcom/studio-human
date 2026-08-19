import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/Logo';
import BrandedButton from '@/components/BrandedButton';

const ease = [0.25, 0.1, 0.25, 1];
const navItem = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Aanpak', to: '/aanpak' },
  { label: 'Zorgvragen', to: '/zorgvragen' },
  { label: 'Over', to: '/over' },
  { label: 'Tarieven', to: '/tarieven' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    let lastScroll = window.scrollY;
    const handler = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      setHidden(current > lastScroll && current > 120);
      lastScroll = current;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden && !mobileOpen ? '-100%' : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${scrolled ? 'bg-neutral-50/90 backdrop-blur-md border-b border-neutral-100 shadow-sm' : 'bg-transparent'}`}
        role="banner"
      >
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 h-14 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/20 rounded-md" aria-label="amorvitae. — home">
            <Logo variant="light" />
          </Link>

          <motion.nav
            className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.12em]"
            aria-label="Hoofdnavigatie"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
          >
            {navLinks.map((link) => (
              <motion.div key={link.label} variants={navItem} className="relative">
                <Link
                  to={link.to}
                  className={`transition-colors duration-300 focus:outline-none ${isActive(link.to) ? 'text-red-600' : 'text-neutral-600 hover:text-red-600'}`}
                >
                  {link.label}
                </Link>
                {isActive(link.to) && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-600"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:block">
              <BrandedButton to="/contact" compact>Maak een afspraak</BrandedButton>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md"
              aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </motion.div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-0 z-[55] bg-neutral-50 md:hidden flex flex-col"
            role="navigation"
            aria-label="Mobiele navigatie"
          >
            <div className="flex items-center justify-between h-14 md:h-20 px-6 flex-shrink-0">
              <Logo variant="light" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2.5 text-neutral-800 focus:outline-none"
                aria-label="Menu sluiten"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-6">
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.label}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } }
                    }}
                  >
                    <Link
                      to={link.to}
                      className={`block font-display text-3xl py-2.5 transition-colors ${isActive(link.to) ? 'text-red-600' : 'text-neutral-700'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
            <div className="px-6 pb-12 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease }}
              >
                <BrandedButton to="/contact">Maak een afspraak</BrandedButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}