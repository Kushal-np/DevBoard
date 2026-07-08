// Navbar.tsx — fully theme-aware, consistent with the landing page tokens
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Code,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  ChevronDown,
  Command,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../theme/useTheme";

const easeOut = [0.16, 1, 0.3, 1] as const;

const Navbar: React.FC = () => {
  const { themeName, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navItems = ["Explore", "Projects", "Discussions", "Events"];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: easeOut }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative w-9 h-9 border border-border rounded-xl flex items-center justify-center group-hover:border-primary/25 transition-colors duration-300">
                <Code className="w-4.5 h-4.5 text-text" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-light text-text text-sm tracking-tight">dev</span>
              <span className="text-secondary text-sm font-light">/</span>
              <span className="text-[11px] text-secondary font-mono tracking-wider">community</span>
              <span className="ml-2 px-1.5 py-0.5 text-[8px] font-mono tracking-widest text-secondary border border-border rounded-full">
                v2
              </span>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-0.5 bg-primary/[0.03] border border-border rounded-full px-1 py-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative px-4 py-1.5 text-sm transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
                  activeTab === item
                    ? "text-text"
                    : "text-secondary hover:text-text"
                }`}
              >
                <span className="relative z-10">{item}</span>
                {activeTab === item && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-primary/10 border border-primary/10 rounded-full"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all duration-300 ${
                  isSearchFocused
                    ? "border-primary/25 bg-primary/[0.05]"
                    : "border-border bg-transparent"
                }`}
              >
                <Search
                  className={`w-3.5 h-3.5 transition-colors ${
                    isSearchFocused ? "text-text" : "text-secondary"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search…"
                  className="bg-transparent border-none outline-none text-sm text-text w-32 focus:w-48 transition-all duration-300 placeholder:text-secondary"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <kbd className="text-[10px] text-secondary font-mono flex items-center gap-1 border border-border rounded px-1 py-0.5">
                  <Command className="w-2.5 h-2.5" />
                  K
                </kbd>
              </div>
            </div>

            {/* Notification */}
            <button className="hidden md:flex p-2 text-secondary hover:text-text transition-colors duration-300 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 rounded-lg">
              <Bell className="w-4 h-4" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-success" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={themeName === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="p-2 text-secondary hover:text-text transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 rounded-lg"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={themeName}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {themeName === "dark" ? (
                    <Sun className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Moon className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* User */}
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/[0.05] transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25">
                <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-text font-medium bg-primary/[0.05] group-hover:bg-primary/10 transition-colors">
                  JD
                </div>
                <ChevronDown
                  className="w-3 h-3 text-secondary group-hover:text-text transition-colors"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-secondary hover:text-text transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-full pl-11 pr-4 py-3 bg-primary/[0.03] border border-border rounded-xl focus:outline-none focus-visible:border-primary/25 text-text placeholder:text-secondary text-sm transition-all"
                />
              </div>

              {/* Navigation */}
              <div className="grid grid-cols-2 gap-1">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveTab(item);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                      activeTab === item
                        ? "text-text bg-primary/10"
                        : "text-secondary hover:text-text hover:bg-primary/[0.05]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-1">
                <button className="w-full px-4 py-2.5 text-sm text-secondary hover:text-text hover:bg-primary/[0.05] rounded-xl transition-all duration-200 flex items-center gap-3">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full px-4 py-2.5 text-sm text-secondary hover:text-text hover:bg-primary/[0.05] rounded-xl transition-all duration-200 flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;