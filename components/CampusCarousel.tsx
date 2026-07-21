'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

interface CampusCarouselProps {
  images: string[];
  intervalSeconds?: number;
  aspectRatio?: string;
  altText?: string;
  isHeroBackground?: boolean;
}

export default function CampusCarousel({
  images,
  intervalSeconds = 5,
  aspectRatio = "aspect-video",
  altText = "Campus Slide",
  isHeroBackground = false
}: CampusCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [images, intervalSeconds]);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-full min-h-[250px] bg-navy-50 flex items-center justify-center text-gray-400 text-xs font-sans ${isHeroBackground ? '' : 'rounded-xl border'}`}>
        No images available
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${isHeroBackground ? '' : 'rounded-2xl shadow-premium'} ${aspectRatio} bg-navy-900`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[index]}
            alt={`${altText} - Slide ${index + 1}`}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized={images[index]?.startsWith('data:') || images[index]?.startsWith('blob:')}
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      {images.length > 1 && !isHeroBackground && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                idx === index ? 'bg-gold-500 w-4' : 'bg-white/50 hover:bg-white'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
