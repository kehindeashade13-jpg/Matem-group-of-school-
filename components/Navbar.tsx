'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, ChevronDown, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Gallery & Events', href: '/gallery' },
    { name: 'News & Blog', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-800/95 text-white shadow-premium backdrop-blur-md py-3'
          : 'bg-navy-800 text-white py-4 border-b border-navy-700/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gold-500 shadow-md group-hover:scale-105 transition-transform duration-300">
              {/* Crest Placeholder Icon */}
              <GraduationCap className="h-7 w-7 text-navy-800" />
            </div>
            <div>
              <span className="block font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-gold-300 transition-colors">
                MATEM SCHOOLS
              </span>
              <span className="block text-[10px] text-gold-400 font-medium tracking-widest uppercase">
                Private School & College
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-gold-400 ${
                  isActive(link.href) ? 'text-gold-500 font-semibold' : 'text-gray-100'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/admin"
              className="text-xs text-gray-300 hover:text-gold-400 font-medium transition-colors mr-1"
            >
              Staff Portal
            </Link>
            <Link
              href="/admissions"
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              href="/admissions"
              className="bg-gold-500 text-navy-950 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-gold-400 transition-colors"
            >
              Apply
            </Link>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-navy-900 border-t border-navy-700 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-navy-800 text-gold-400 border-l-4 border-gold-500 font-semibold'
                      : 'text-gray-200 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-navy-800 flex flex-col space-y-3 px-4">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm text-gray-400 hover:text-gold-400 py-2 transition-colors"
                >
                  Staff Portal
                </Link>
                <Link
                  href="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-full text-sm shadow-md transition-all"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
