'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CampusCarousel from '@/components/CampusCarousel';
import { Image as ImageIcon, Calendar, Clock, MapPin } from 'lucide-react';
import { EventItem } from '@/lib/db';

const PAST_HIGHLIGHTS = [
  {
    title: "Matem Interhouse Sport Gala",
    desc: "An incredible termly inter-house athletic event featuring competitive track and field games, marching parades, physical wellness challenges, and trophy awards for the champion house.",
    images: [
      "https://picsum.photos/seed/sports_gala1/600/400",
      "https://picsum.photos/seed/sports_gala2/600/400",
      "https://picsum.photos/seed/sports_gala3/600/400",
      "https://picsum.photos/seed/sports_gala4/600/400"
    ]
  },
  {
    title: "Matem Graduation Gala",
    desc: "Celebrating our graduating primary and college classes with 100% credit pass achievements, administrative honor rolls, traditional dance parades, and formal valedictory speeches.",
    images: [
      "https://picsum.photos/seed/grad_gala1/600/400",
      "https://picsum.photos/seed/grad_gala2/600/400",
      "https://picsum.photos/seed/grad_gala3/600/400",
      "https://picsum.photos/seed/grad_gala4/600/400"
    ]
  }
];

export default function GalleryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [eventInterval, setEventInterval] = useState(5);
  const [sportsGalaImages, setSportsGalaImages] = useState<string[]>([]);
  const [sportsGalaInterval, setSportsGalaInterval] = useState(5);
  const [gradGalaImages, setGradGalaImages] = useState<string[]>([]);
  const [gradGalaInterval, setGradGalaInterval] = useState(5);

  useEffect(() => {
    const fetchEventsAndCarousels = async () => {
      try {
        const response = await fetch(`/api/db?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          setEvents(data.events || []);
          
          if (data.carouselEvent && data.carouselEvent.images?.length > 0) {
            setEventImages(data.carouselEvent.images);
            setEventInterval(data.carouselEvent.intervalSeconds || 5);
          }
          if (data.carouselSportsGala && data.carouselSportsGala.images?.length > 0) {
            setSportsGalaImages(data.carouselSportsGala.images);
            setSportsGalaInterval(data.carouselSportsGala.intervalSeconds || 5);
          }
          if (data.carouselGraduationGala && data.carouselGraduationGala.images?.length > 0) {
            setGradGalaImages(data.carouselGraduationGala.images);
            setGradGalaInterval(data.carouselGraduationGala.intervalSeconds || 5);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery events and carousels:', error);
      }
    };
    fetchEventsAndCarousels();

    const handleFocus = () => fetchEventsAndCarousels();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
            Events & Past Highlights
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            A visual window into the vibrant physical activities, parent-teacher collaboration events, athletic sports meets, and graduation triumphs of Matem Schools.
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

      {/* Past Event Highlights (Cards) */}
      <section id="past-events" className="py-20 bg-white border-t border-gray-100">
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
              <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-premium group flex flex-col justify-between">
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <CampusCarousel
                      images={idx === 0 ? (sportsGalaImages.length > 0 ? sportsGalaImages : high.images) : (gradGalaImages.length > 0 ? gradGalaImages : high.images)}
                      intervalSeconds={idx === 0 ? sportsGalaInterval : gradGalaInterval}
                      altText={high.title}
                      aspectRatio="h-full w-full"
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

      <Footer />
      <WhatsAppButton />
    </>
  );
}
