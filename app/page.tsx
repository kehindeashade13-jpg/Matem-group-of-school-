'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'motion/react';
import { 
  ArrowRight, Award, Users, BookOpen, Clock, 
  Calendar, Newspaper, CheckCircle2, ChevronRight, Play, Quote, GraduationCap 
} from 'lucide-react';
import { BlogPost, EventItem } from '@/lib/db';

const HERO_IMAGES = [
  'https://picsum.photos/seed/learn/1920/1080',
  'https://picsum.photos/seed/playground/1920/1080',
  'https://picsum.photos/seed/chemistry/1920/1080'
];

export default function HomePage() {
  const [dbData, setDbData] = useState<{ posts: BlogPost[]; events: EventItem[] } | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>(HERO_IMAGES);
  const [carouselInterval, setCarouselInterval] = useState(5000);

  useEffect(() => {
    // Fetch latest news and events
    const fetchDb = async () => {
      try {
        const response = await fetch('/api/db');
        if (response.ok) {
          const data = await response.json();
          setDbData(data);
          if (data.carousel) {
            if (data.carousel.images && data.carousel.images.length > 0) {
              setCarouselImages(data.carousel.images);
            }
            if (data.carousel.intervalSeconds) {
              setCarouselInterval(data.carousel.intervalSeconds * 1000);
            }
          }
        }
      } catch (error) {
        console.error('Error loading homepage data:', error);
      }
    };
    fetchDb();
  }, []);

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % carouselImages.length);
    }, carouselInterval);
    return () => clearInterval(interval);
  }, [carouselImages, carouselInterval]);

  const latestPosts = dbData?.posts?.slice(0, 3) || [];
  const upcomingEvents = dbData?.events?.slice(0, 3) || [];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section id="hero-section" className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src={carouselImages[heroIndex] || HERO_IMAGES[0]}
            alt="School Banner"
            fill
            className="object-cover opacity-35 transition-all duration-1000 ease-in-out transform scale-105"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/30 tracking-wider uppercase font-mono">
              ★ Admitting for 2026/2027 Academic Session
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Nurturing Excellence <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-500">
                From Nursery to Secondary
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-sans font-light">
              Welcome to Matem Schools, where we empower tomorrow&apos;s innovators, scientists, and leaders under a single supportive and highly disciplined academic system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/admissions"
                className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 text-center"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Waves or geometric overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent z-10" />
      </section>

      {/* Stats Highlights Bar */}
      <section id="highlights-bar" className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-premium p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-gray-100">
          <div className="border-r last:border-0 border-gray-100 pr-2">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-navy-800">18+</div>
            <div className="text-xs text-gray-500 mt-1 font-sans font-medium uppercase tracking-wider">Years of Prestige</div>
          </div>
          <div className="border-r last:border-0 border-gray-100 pr-2">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-navy-800">850+</div>
            <div className="text-xs text-gray-500 mt-1 font-sans font-medium uppercase tracking-wider">Enrolled Pupils</div>
          </div>
          <div className="border-r last:border-0 border-gray-100 pr-2 col-span-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-navy-800">20</div>
            <div className="text-xs text-gray-500 mt-1 font-sans font-medium uppercase tracking-wider">Max Class Size</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-navy-800">98.6%</div>
            <div className="text-xs text-gray-500 mt-1 font-sans font-medium uppercase tracking-wider">WAEC Pass Rate</div>
          </div>
        </div>
      </section>

      {/* Message from the Proprietor */}
      <section id="welcome-message" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative h-[450px] rounded-2xl overflow-hidden shadow-premium border-4 border-white">
              <Image
                src="https://picsum.photos/seed/proprietor/600/800"
                alt="Proprietor Mr Ekunwe Martin Nosakhare"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent p-6 text-white">
                <h4 className="font-serif font-bold text-lg text-white">Mr Ekunwe Martin Nosakhare</h4>
                <p className="text-xs text-gold-400 font-sans uppercase tracking-widest">Founder & Proprietor</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
                Welcome to Matem Schools
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-800 leading-tight">
                Our Promise: Grounding Pupils in Integrity & Academic Distinction
              </h2>
              <div className="w-16 h-1 bg-gold-500 rounded" />
              <p className="text-gray-600 text-sm leading-relaxed">
                As the founder of this noble institution, it is my absolute pleasure to welcome you to our digital home. At Matem Schools, we provide a unified educational path starting from our nurturing Creche and Nursery, moving through the cognitive primary years, and culminating in the challenging academic tracks of Matem College.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                We believe that education must go beyond dry memorization. Our state-of-the-art computational and robotics laboratories, combined with experiment-oriented science labs, ensure our children can program, solve complex math, and articulate logic clearly. We pair high academic standards with deep moral values.
              </p>
              <div className="bg-navy-50/50 p-4 border-l-4 border-gold-500 rounded-r-xl italic text-gray-700 text-xs font-sans">
                &ldquo;Every child entering our gates represents a unique spark. Our task is to nurture that spark into a shining beacon of leadership and scholarly excellence.&rdquo;
              </div>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center text-sm font-bold text-navy-800 hover:text-gold-500 transition-colors"
                >
                  Read Our Full Story <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Snapshots of Both Arms */}
      <section id="school-arms" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-serif font-bold text-navy-800">
              One Institution, Two Specialized Educational Arms
            </h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              We cultivate age-appropriate developmental growth from primary foundations to secondary specialized learning tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Matem Private School (Primary) */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium-lg transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://picsum.photos/seed/primary_arm/800/600"
                    alt="Matem Private School Classroom"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-navy-800 text-white font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Nursery & Primary
                  </div>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-navy-800">Matem Private School</h3>
                  <p className="text-xs text-gold-600 font-medium tracking-wide uppercase font-mono">
                    Creche • Nursery • Primary 1 - 6
                  </p>
                  <p className="text-gray-600 text-sm">
                    Our primary foundation emphasizes sensory literacy, creative play, hybrid Nigerian-British elementary curriculums, and early computational thinking using visual block coding.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500">
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-gold-500 mr-2 shrink-0" /> Focus on early literacy, phonics & speaking</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-gold-500 mr-2 shrink-0" /> Hands-on arithmetic and early Science</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-gold-500 mr-2 shrink-0" /> Multi-activity outdoor playground and games</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 sm:p-8 pt-0">
                <Link
                  href="/academics#private-school"
                  className="inline-flex items-center justify-center w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors"
                >
                  Explore Primary Curriculum <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Matem College (Secondary) */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium-lg transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://picsum.photos/seed/college_arm/800/600"
                    alt="Matem College Laboratory"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-gold-500 text-navy-950 font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Secondary School
                  </div>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-navy-800">Matem College</h3>
                  <p className="text-xs text-gold-600 font-medium tracking-wide uppercase font-mono">
                    Junior JSS 1-3 • Senior SSS 1-3
                  </p>
                  <p className="text-gray-600 text-sm">
                    Offering intensive training across Science, Arts, and Commercial tracks. Our college prepares students to score outstanding results in WAEC, NECO, and JAMB exams.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500">
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-gold-500 mr-2 shrink-0" /> Dedicated Physics, Chemistry & Biology labs</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-gold-500 mr-2 shrink-0" /> Advanced Robotics and Python Programming</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-gold-500 mr-2 shrink-0" /> Debate, Drama, and Public Speaking academies</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 sm:p-8 pt-0">
                <Link
                  href="/academics#college"
                  className="inline-flex items-center justify-center w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors"
                >
                  Explore College Curriculum <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Parents/Alumni Testimonials */}
      <section id="testimonials-section" className="py-20 bg-navy-800 text-white relative overflow-hidden">
        {/* Background Crest Silhouette Accent */}
        <div className="absolute inset-0 opacity-5 flex items-center justify-center">
          <GraduationCap className="w-[500px] h-[500px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block font-mono">
              In Their Words
            </span>
            <h2 className="text-3xl font-serif font-bold text-white">What Our Parents Say</h2>
            <div className="w-12 h-1 bg-gold-400 mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-navy-900 border border-navy-700 p-6 rounded-2xl relative space-y-4 shadow-lg">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gold-500/20" />
              <p className="text-sm text-gray-300 leading-relaxed font-sans italic">
                &ldquo;Admitting our son into Matem College is one of the best decisions we have made. The scientific rigor is amazing, but it was his development in public speaking that surprised me. He is now confident, eloquent, and won his first debate!&rdquo;
              </p>
              <div className="pt-4 border-t border-navy-800 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-bold text-navy-950 text-sm">
                  DO
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Dr. Olumide Oyewole</h4>
                  <p className="text-[10px] text-gold-400">Parent of SSS 2 student</p>
                </div>
              </div>
            </div>

            <div className="bg-navy-900 border border-navy-700 p-6 rounded-2xl relative space-y-4 shadow-lg">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gold-500/20" />
              <p className="text-sm text-gray-300 leading-relaxed font-sans italic">
                &ldquo;The Scratch coding lessons at Matem Private School are exceptional! My daughter in Primary 4 built a simple mathematical game last term. The hybrid curriculum gave her a huge edge during our relocation review.&rdquo;
              </p>
              <div className="pt-4 border-t border-navy-800 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-bold text-navy-950 text-sm">
                  AE
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Mrs. Amara Eze</h4>
                  <p className="text-[10px] text-gold-400">Parent of Primary 4 pupil</p>
                </div>
              </div>
            </div>

            <div className="bg-navy-900 border border-navy-700 p-6 rounded-2xl relative space-y-4 shadow-lg md:col-span-2 lg:col-span-1">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gold-500/20" />
              <p className="text-sm text-gray-300 leading-relaxed font-sans italic">
                &ldquo;As an alumnus, the discipline and educational standard of Matem prepared me for medical school. The science teachers were always ready to break down chemistry practicals. I am proud to recommend my school.&rdquo;
              </p>
              <div className="pt-4 border-t border-navy-800 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-bold text-navy-950 text-sm">
                  JA
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Dr. Jide Adebayo</h4>
                  <p className="text-[10px] text-gold-400">Alumni (Class of 2018)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Blog Preview */}
      <section id="news-preview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
                Latest Updates
              </span>
              <h2 className="text-3xl font-serif font-bold text-navy-800">School News & Announcements</h2>
              <div className="w-12 h-1 bg-gold-500 rounded" />
            </div>
            <Link
              href="/news"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-navy-800 hover:text-gold-500 transition-colors"
            >
              See All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-navy-800 text-white font-mono text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-medium text-gray-400 font-mono block">
                        {post.date} • By {post.author}
                      </span>
                      <h3 className="font-serif font-bold text-base text-navy-800 group-hover:text-gold-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      href={`/news?id=${post.id}`}
                      className="inline-flex items-center text-xs font-bold text-navy-800 hover:text-gold-500 transition-colors"
                    >
                      Read Article <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Hardcoded Fallback Seed
              <>
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src="https://picsum.photos/seed/science/800/600"
                        alt="Science Project"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-navy-800 text-white font-mono text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        Academic Achievements
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-medium text-gray-400 font-mono block">2026-07-10 • By Admin Office</span>
                      <h3 className="font-serif font-bold text-base text-navy-800 group-hover:text-gold-500 transition-colors line-clamp-2">
                        Matem Private School Tops Regional Science Fair
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                        Our Primary 5 pupils emerged overall winners in the regional STEM exhibition with their solar energy prototype project.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href="/news" className="inline-flex items-center text-xs font-bold text-navy-800 hover:text-gold-500 transition-colors">
                      Read Article <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src="https://picsum.photos/seed/school/800/600"
                        alt="Classroom Board"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-navy-800 text-white font-mono text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        Announcements
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-medium text-gray-400 font-mono block">2026-07-15 • By Principal&apos;s Desk</span>
                      <h3 className="font-serif font-bold text-base text-navy-800 group-hover:text-gold-500 transition-colors line-clamp-2">
                        Matem College Academic Calendar & Term 3 Resumption Info
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                        Welcome back information, uniform standards, and scheduled examinations for the upcoming academic term.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href="/news" className="inline-flex items-center text-xs font-bold text-navy-800 hover:text-gold-500 transition-colors">
                      Read Article <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src="https://picsum.photos/seed/lab/800/600"
                        alt="Robotics Lab"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-navy-800 text-white font-mono text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        School News
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-medium text-gray-400 font-mono block">2026-07-17 • By Proprietor Office</span>
                      <h3 className="font-serif font-bold text-base text-navy-800 group-hover:text-gold-500 transition-colors line-clamp-2">
                        Introducing the Matem Modern ICT & Robotics Lab
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                        A preview of our newly completed state-of-the-art computational laboratory for both primary and secondary arms.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href="/news" className="inline-flex items-center text-xs font-bold text-navy-800 hover:text-gold-500 transition-colors">
                      Read Article <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section id="cta-enrollment" className="py-16 bg-navy-950 text-white border-t-2 border-gold-500">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Ready to Join the Matem Family?</h2>
          <p className="text-gray-300 text-sm max-w-2xl mx-auto font-sans font-light">
            Enroll your child in Matem Schools today and watch them develop absolute competence, high discipline, and stellar scientific and literary prowess. Contact our Admissions desk or begin the online registration steps immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              href="/admissions"
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all text-center"
            >
              Start Admission Process
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-transparent border border-gray-500 hover:border-white text-gray-300 hover:text-white px-8 py-3.5 rounded-full text-sm transition-all text-center"
            >
              Contact Administrative Office
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
