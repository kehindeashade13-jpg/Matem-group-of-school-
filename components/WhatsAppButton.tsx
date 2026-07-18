'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 5 seconds to grab attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = "https://wa.me/2348089664009?text=Hello%20Matem%20Schools%2C%20I%20would%20like%20to%20make%20an%20inquiry%20about%20admissions%20for%20my%20child.%20Thank%20you.";

  return (
    <div id="whatsapp-floating-widget" className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="mb-3 bg-white text-gray-800 shadow-premium p-3.5 rounded-2xl border border-gray-100 max-w-[250px] relative text-sm"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close message"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="font-semibold text-navy-800 text-xs mb-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-ping" />
              Admissions Assistant
            </div>
            <p className="text-xs text-gray-600 leading-normal">
              Good day! Click here to chat with our admissions officer directly on WhatsApp.
            </p>
            <div className="absolute bottom-[-6px] left-5 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
        onClick={() => setShowTooltip(false)}
      >
        {/* Blinking notification dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white">
          1
        </span>
        <svg
          className="h-6 w-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.528 1.971 14.076.945 11.45.945c-5.412 0-9.821 4.372-9.824 9.8.001 2.05.57 3.81 1.63 5.342l-.996 3.639 3.797-.972zm12.844-5.06c-.343-.167-2.03-1.002-2.343-1.117-.312-.114-.541-.167-.77.167-.23.333-.885 1.117-1.085 1.333-.2.217-.4.25-.743.083-.343-.167-1.449-.533-2.761-1.702-1.02-.91-1.709-2.033-1.91-2.366-.2-.333-.022-.513.149-.68.154-.15.343-.4.515-.6.171-.2.23-.333.343-.55.114-.217.057-.4-.029-.567-.086-.167-.77-1.854-1.055-2.535-.279-.672-.56-.58-.77-.59-.2-.011-.43-.011-.659-.011s-.6.088-.913.44c-.313.35-1.193 1.167-1.193 2.847 0 1.68 1.229 3.307 1.4 3.533.171.227 2.417 3.691 5.856 5.17 1.15.496 2.046.793 2.746 1.01.815.26 1.56.223 2.148.135.656-.098 2.03-.829 2.316-1.629.285-.8 1.117-.9 1.117-2.029 0-.114-.057-.217-.171-.383z" />
        </svg>
      </a>
    </div>
  );
}
