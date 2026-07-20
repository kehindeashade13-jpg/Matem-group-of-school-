'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, BookOpen, UserCheck, Eye, Target } from 'lucide-react';

const TEAM = [
  {
    name: "Mr Ekunwe Martin Nosakhare",
    role: "Founder & Proprietor",
    bio: "With over 30 years in academic administration, Mr Ekunwe Martin Nosakhare founded Matem Schools with the singular vision of blending classic morals with modern technological competence.",
    img: "/images/founder_portrait.jpg"
  },
  {
    name: "Mrs. Olatunbosun Oluwayemisi",
    role: "Principal, Matem College",
    bio: "An outstanding educational leader and administrator, Mrs. Oluwayemisi oversees secondary administration, focusing on exam preparations (WAEC/NECO/JAMB), modern sciences, and academic discipline.",
    img: "https://picsum.photos/seed/principal/400/400"
  },
  {
    name: "Mrs. Gbemisola Komolafe",
    role: "Head Teacher, Matem Private School",
    bio: "A specialist in early childhood education. Mrs. Komolafe coordinates our nursery and primary curriculums, integrating critical thinking, moral development, and innovative learning methods.",
    img: "https://picsum.photos/seed/headmistress/400/400"
  }
];

const VALUES = [
  {
    title: "Academic Excellence",
    desc: "We pursue rigorous, standard cognitive development, equipping students to write standard, advanced national and international examinations successfully.",
    icon: Sparkles
  },
  {
    title: "High Discipline & Integrity",
    desc: "We instill moral responsibility, respect, punctuality, and self-discipline, guiding our pupils to lead with transparency and honesty.",
    icon: ShieldCheck
  },
  {
    title: "Scientific Curiosity",
    desc: "Through robotics, coding, practical laboratory experiments, and science projects, we stimulate children to ask deeper, productive questions.",
    icon: BookOpen
  },
  {
    title: "Character & Welfare",
    desc: "Every student's unique personality and mental well-being are supported within a safe, encouraging, and highly collaborative environment.",
    icon: Heart
  }
];

const FACILITIES = [
  {
    title: "ICT & Advanced Robotics Lab",
    desc: "Modular robotics, computer programming with Scratch and Python, and smart digital systems for practical coding classes.",
    img: "https://picsum.photos/seed/lab/500/350"
  },
  {
    title: "Classic Science Laboratories",
    desc: "Separate, fully stocked Physics, Chemistry, and Biology laboratories built for safe and practical learning experiments.",
    img: "https://picsum.photos/seed/chemistry/500/350"
  },
  {
    title: "Physical & Digital Library",
    desc: "A spacious reading hall with thousands of books, combined with high-speed digital research terminals for both arms.",
    img: "https://picsum.photos/seed/library/500/350"
  },
  {
    title: "Standard Turf Sports Complex",
    desc: "Excellent outdoor physical education facilities including a football pitch, racing tracks, and basketball courts.",
    img: "https://picsum.photos/seed/sports/500/350"
  },
  {
    title: "Creche & Nursery Playground",
    desc: "Safe, cushioned outdoor playground equipped with modern swings, slides, and educational sensory play tools.",
    img: "https://picsum.photos/seed/play/500/350"
  },
  {
    title: "Modern Clinical Office",
    desc: "A fully staffed and stocked on-campus medical center managed by a registered nurse for direct welfare and emergency first aid.",
    img: "https://picsum.photos/seed/clinic/500/350"
  }
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Banner / Header */}
      <section id="about-banner" className="bg-navy-800 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <BookOpen className="w-[400px] h-[400px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest font-mono">
            Get To Know Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight">
            Our History, Mission & Values
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            Founded on the legacy of deep discipline and premium academic standards, Matem Schools is a beacon of educational excellence in Lagos.
          </p>
        </div>
      </section>

      {/* History Story */}
      <section id="history-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
                Since August 2008
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-800">
                Our Founding Story & Educational Journey
              </h2>
              <div className="w-16 h-1 bg-gold-500 rounded" />
              <p className="text-gray-600 text-sm leading-relaxed">
                Matem Schools commenced its educational services in August 2008. Founded by Mr Ekunwe Martin Nosakhare, the institution was built to fill a vital void: the need for an educational center that delivers top-tier scientific and analytical learning while uncompromisingly upholding classic moral discipline.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Starting as a premium nursery and primary nursery school, our high standards led parents to demand a continuation into the secondary level. Thus, Matem College was established. Today, both arms run in tandem as a unified, highly efficient school system, preparing kids to confidently lead in science, engineering, business, and humanities.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our facilities have grown from a single school hall to a premium multi-facility complex with separate computer labs, specialized physics/chemistry labs, and high-performance robotic teaching models. However, our core dedication remains unchanged: we treat every child as an individual genius.
              </p>
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-premium border-4 border-white">
              <Image
                src="https://picsum.photos/seed/founding/800/600"
                alt="Matem School building"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section id="mission-vision" className="py-16 bg-navy-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-navy-800 border border-navy-700 rounded-2xl p-8 space-y-4 shadow-lg hover:border-gold-500/40 transition-colors">
            <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center text-navy-950 font-bold mb-4">
              <Target className="h-6 w-6 text-navy-900" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-sans font-light">
              To provide a comprehensive, balanced, and stimulating dual-curriculum academic system (Nigerian and British) that nurtures critical thinking, analytical coding proficiency, scientific experimentations, and unshakeable moral integrity from early infancy to secondary graduation.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-navy-800 border border-navy-700 rounded-2xl p-8 space-y-4 shadow-lg hover:border-gold-500/40 transition-colors">
            <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center text-navy-950 font-bold mb-4">
              <Eye className="h-6 w-6 text-navy-900" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-sans font-light">
              To remain the primary, most trusted institution of educational excellence and prestigious moral training in West Africa—producing outstanding scholars, creative coders, and ethical leaders who shape the global socio-economic landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="core-values" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Our Pillars
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Our Core Values</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              The foundational ethics that guide our administrative policies and daily classroom sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-premium border border-gray-100 p-6 space-y-4 hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 bg-gold-100 text-gold-800 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-navy-800">{val.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="leadership" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Academic Leaders
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Our Board & Management</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              Meet our distinguished founders and administrators committed to premium scholastic governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TEAM.map((member, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h4 className="font-serif font-bold text-lg text-navy-800">{member.name}</h4>
                    <p className="text-xs text-gold-600 font-semibold tracking-wide uppercase font-mono">{member.role}</p>
                    <p className="text-gray-600 text-xs leading-relaxed font-sans">{member.bio}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="border-t border-gray-200/50 pt-3 text-[10px] text-gray-400 font-sans tracking-wide">
                    Contact: matemschools126@gmail.com
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Overview */}
      <section id="facilities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Campus Tour
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Our Premium Facilities</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              We provide comfortable, air-conditioned environments integrated with the latest analytical and athletic learning machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.map((fac, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-premium transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={fac.img}
                    alt={fac.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="font-serif font-bold text-base text-navy-800">{fac.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans">{fac.desc}</p>
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
