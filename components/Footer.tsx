'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, GraduationCap, ArrowUp, Facebook, Twitter, Instagram, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-navy-950 text-gray-300 pt-16 pb-8 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & School Motto */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gold-500 shadow-md">
                <GraduationCap className="h-7 w-7 text-navy-800" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold tracking-tight text-white">
                  MATEM SCHOOLS
                </span>
                <span className="block text-[9px] text-gold-400 font-medium tracking-widest uppercase">
                  Private School & College
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Nurturing Excellence from Nursery to Secondary. Offering world-class education for critical thinkers, innovators, and leaders of tomorrow.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all duration-300" aria-label="Facebook">
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6 border-b border-gold-500/30 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold-400 hover:underline transition-colors flex items-center">
                  <span className="text-gold-500 mr-2">›</span> School History
                </Link>
              </li>
              <li>
                <Link href="/about#leadership" className="hover:text-gold-400 hover:underline transition-colors flex items-center">
                  <span className="text-gold-500 mr-2">›</span> Board & Leadership
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-gold-400 hover:underline transition-colors flex items-center">
                  <span className="text-gold-500 mr-2">›</span> Academics & Curriculum
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-gold-400 hover:underline transition-colors flex items-center">
                  <span className="text-gold-500 mr-2">›</span> Admission Guidelines
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-400 hover:underline transition-colors flex items-center">
                  <span className="text-gold-500 mr-2">›</span> Campus Gallery & Events
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-gold-400 hover:underline transition-colors flex items-center">
                  <span className="text-gold-500 mr-2">›</span> News & Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6 border-b border-gold-500/30 pb-2 inline-block">
              Contact Details
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gold-500 mr-3 shrink-0 mt-0.5" />
                <span>
                  34, Alabi Abimbola Street, <br />
                  Osi Ota, Off Ten Bus Stop, <br />
                  Ogun State
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gold-500 mr-3 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+2348089664009" className="hover:text-gold-400 transition-colors">08089664009</a>
                  <a href="tel:+2347016905766" className="hover:text-gold-400 transition-colors">07016905766</a>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gold-500 mr-3 shrink-0" />
                <div className="flex flex-col">
                  <a href="mailto:matemschools126@gmail.com" className="hover:text-gold-400 transition-colors">matemschools126@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Map Mini Panel */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-6 border-b border-gold-500/30 pb-2 inline-block">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get term updates, newsletters, and announcements directly to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex mb-4">
              <input
                type="email"
                placeholder="Enter parent email"
                className="bg-navy-900 border border-navy-800 text-sm rounded-l-md px-4 py-2.5 w-full focus:outline-none focus:border-gold-500 text-white"
                required
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-4 rounded-r-md transition-colors flex items-center justify-center"
                aria-label="Subscribe"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
            <div className="text-[11px] text-gray-500">
              *Your privacy is secured. We never share emails.
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div>
            &copy; {currentYear} Matem Private School & Matem College. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link>
            <Link href="/admissions" className="hover:text-gold-400 transition-colors">Admissions Portal</Link>
            <Link href="/admin" className="hover:text-gold-400 transition-colors">Admin Desk</Link>
            <button
              onClick={scrollToTop}
              className="bg-navy-900 hover:bg-gold-500 hover:text-navy-950 p-2 rounded-full transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
