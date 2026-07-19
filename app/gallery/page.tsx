'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CampusCarousel from '@/components/CampusCarousel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, Calendar, Clock, MapPin, 
  ChevronRight, X, Sparkles, RefreshCw, ZoomIn 
} from 'lucide-react';
import { EventItem } from '@/lib/db';
import Image from 'next/image';

const GALLERY_PHOTOS = [
  { id: 1, title: "Modern Robotics Lab", category: "Campus", url: "https://picsum.photos/seed/robotic_lab/800/600" },
  { id: 2, title: "Interactive Primary Classroom", category: "Classrooms", url: "https://picsum.photos/seed/primary_room/800/600" },
  { id: 3, title: "2025 SSS Graduation Parade", category: "Graduation", url: "https://picsum.photos/seed/grad_gala/800/600" },
  { id: 4, title: "Secondary chemistry experiment", category: "Classrooms", url: "https://picsum.photos/seed/chem_exper/800/600" },
  { id: 5, title: "Pupils march-past rehearsal", category: "Sports Day", url: "https://picsum.photos/seed/sports_march/800/600" },
  { id: 6, title: "Lagos cultural dance performance", category: "Cultural Day", url: "https://picsum.photos/seed/cultural_dance/800/600" },
  { id: 7, title: "Spacious Physical Reading Library", category: "Campus", url: "https://picsum.photos/seed/read_lib/800/600" },
  { id: 8, title: "Primary math exhibition boards", category: "Campus", url: "https://picsum.photos/seed/math_exhib/800/600" },
  { id: 9, title: "Prize giving Ceremony 2025", category: "Graduation", url: "https://picsum.photos/seed/prize_giving/800/600" }
];

const PAST_HIGHLIGHTS = [
  {
    title: "Annual Science & Tech Fair 2025",
    desc: "A massive, state-level primary/secondary exhibition where our robotics class showcased standard Python sensor codes and autonomous maze-solver models.",
    img: "https://picsum.photos/seed/tech_fair/600/400"
  },
  {
    title: "Matem College 2025 Graduation Gala",
    desc: "Celebrating our graduating SSS 3 class with 100% credit pass records, awarding medals for logical writing, robotic sciences, and athletic discipline.",
    img: "https://picsum.photos/seed/grad_gala2/600/400"
  }
];

export default function GalleryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInterval, setGalleryInterval] = useState(5);
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [eventInterval, setEventInterval] = useState(5);

  useEffect(() => {
    const fetchEventsAndCarousels = async () => {
      try {
        const response = await fetch('/api/db');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
          
          if (data.carouselGallery && data.carouselGallery.images?.length > 0) {
            setGalleryImages(data.carouselGallery.images);
            setGalleryInterval(data.carouselGallery.intervalSeconds || 5);
          }
          if (data.carouselEvent && data.carouselEvent.images?.length > 0) {
            setEventImages(data.carouselEvent.images);
            setEventInterval(data.carouselEvent.intervalSeconds || 5);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery events and carousels:', error);
      }
    };
    fetchEventsAndCarousels();
  }, []);

  const categories = ['All', 'Campus', 'Classrooms', 'Sports Day', 'Cultural Day', 'Graduation'];

  const filteredPhotos = activeCategory === 'All' 
    ? GALLERY_PHOTOS 
    : GALLERY_PHOTOS.filter(photo => photo.category === activeCategory);

  return (
    <>
      <Navbar />

      {/* Banner */}
      <section id="gallery-banner" className="bg-navy-800 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <ImageIcon className="w-[400px] h-[400px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest font-mono">
            Campus Life
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight">
            Events & Photo Gallery
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            A visual window into the vibrant physical activities, modern laboratories, athletic sports meets, and graduation triumphs of Matem Schools.
          </p>
        </div>
      </section>

      {/* Upcoming Events List */}
      <section id="events-calendar" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Get Involved
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Upcoming Campus Events</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              Keep track of parent general meets, termly sports schedules, and multi-cultural days.
            </p>
          </div>

          {/* Dynamic Event Highlight Carousel */}
          {eventImages.length > 0 && (
            <div className="max-w-5xl mx-auto space-y-3 animate-fadeIn">
              <h3 className="text-[10px] font-bold text-navy-800 font-serif flex items-center justify-center uppercase tracking-widest text-gold-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mr-2 inline-block animate-pulse" />
                Featured Event Highlights
              </h3>
              <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-premium border border-gray-100">
                <CampusCarousel
                  images={eventImages}
                  intervalSeconds={eventInterval}
                  altText="Featured Events Showcase"
                  aspectRatio="h-full w-full"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((evt) => (
                <div key={evt.id} className="bg-white rounded-xl shadow-premium border border-gray-100 p-6 space-y-4 hover:border-gold-500 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider font-mono">
                        {evt.category}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800 line-clamp-2">{evt.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 font-sans">{evt.description}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5 font-sans font-medium">
                    <div className="flex items-center"><Calendar className="h-4.5 w-4.5 text-gold-500 mr-2 shrink-0" /> {evt.date}</div>
                    <div className="flex items-center"><Clock className="h-4.5 w-4.5 text-gold-500 mr-2 shrink-0" /> {evt.time}</div>
                    <div className="flex items-center"><MapPin className="h-4.5 w-4.5 text-gold-500 mr-2 shrink-0" /> {evt.location}</div>
                  </div>
                </div>
              ))
            ) : (
              // Hardcoded Seeds
              <>
                <div className="bg-white rounded-xl shadow-premium border border-gray-100 p-6 space-y-4 hover:border-gold-500 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider font-mono">sports</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800 line-clamp-2">2026 Matem Sports Day & Inter-House Athletics</h3>
                    <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">An exciting day of track and field events, house marches, and healthy competition at our main sports field.</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                    <div className="flex items-center"><Calendar className="h-4 w-4 text-gold-500 mr-2" /> 2026-08-22</div>
                    <div className="flex items-center"><Clock className="h-4 w-4 text-gold-500 mr-2" /> 09:00 AM - 03:00 PM</div>
                    <div className="flex items-center"><MapPin className="h-4 w-4 text-gold-500 mr-2" /> School Main Sports Complex</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-premium border border-gray-100 p-6 space-y-4 hover:border-gold-500 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider font-mono">cultural</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800 line-clamp-2">Matem Schools Annual Cultural Day Celebration</h3>
                    <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">Celebrating the diverse cultural heritage of Nigeria with traditional wear, culinary exhibitions, dance, and music.</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                    <div className="flex items-center"><Calendar className="h-4 w-4 text-gold-500 mr-2" /> 2026-09-18</div>
                    <div className="flex items-center"><Clock className="h-4 w-4 text-gold-500 mr-2" /> 10:00 AM - 04:00 PM</div>
                    <div className="flex items-center"><MapPin className="h-4 w-4 text-gold-500 mr-2" /> Auditorium Hall</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-premium border border-gray-100 p-6 space-y-4 hover:border-gold-500 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider font-mono">academic</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800 line-clamp-2">Parent-Teacher Association (PTA) General Meeting</h3>
                    <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">A vital collaborative session to discuss curriculum updates, welfare, security, and school expansion projects.</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                    <div className="flex items-center"><Calendar className="h-4 w-4 text-gold-500 mr-2" /> 2026-10-03</div>
                    <div className="flex items-center"><Clock className="h-4 w-4 text-gold-500 mr-2" /> 12:00 PM - 02:30 PM</div>
                    <div className="flex items-center"><MapPin className="h-4 w-4 text-gold-500 mr-2" /> Matem College Assembly Hall</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery Grid with category filters */}
      <section id="photo-gallery" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              In Frame
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Campus Photo Gallery</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
          </div>

          {/* Dynamic Gallery Showcase Carousel */}
          {galleryImages.length > 0 && (
            <div className="max-w-5xl mx-auto mb-12 space-y-3 animate-fadeIn">
              <h3 className="text-[10px] font-bold text-navy-800 font-serif flex items-center justify-center uppercase tracking-widest text-gold-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mr-2 inline-block animate-pulse" />
                Featured Gallery Showcase
              </h3>
              <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-premium border border-gray-100">
                <CampusCarousel
                  images={galleryImages}
                  intervalSeconds={galleryInterval}
                  altText="Featured Gallery Showcase"
                  aspectRatio="h-full w-full"
                />
              </div>
            </div>
          )}

          {/* Categories Swiper/Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-navy-800 text-white border-navy-800 shadow'
                    : 'bg-gray-50 text-gray-600 border-gray-200/50 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer relative group h-64"
                >
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-navy-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                    <ZoomIn className="absolute top-4 right-4 h-5 w-5 text-gold-500" />
                    <span className="text-[9px] font-bold text-gold-400 font-mono tracking-widest uppercase">
                      {photo.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-white mt-1">
                      {photo.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Past Event Highlights (Cards) */}
      <section id="past-events" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Achievements
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Past Event Highlights</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              Flashbacks of outstanding celebrations and academic exhibitions in our campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {PAST_HIGHLIGHTS.map((high, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-premium group flex flex-col justify-between">
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={high.img}
                      alt={high.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="font-serif font-bold text-lg text-navy-800">{high.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">{high.desc}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0">
                  <div className="text-[10px] text-gray-400 font-mono font-medium">
                    Archive Report • September 2025
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-white hover:text-gold-500 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <img
                src={selectedPhoto}
                alt="Enlarged Campus Photo"
                className="max-w-full max-h-full object-contain rounded-lg border border-white/20 shadow-premium"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
