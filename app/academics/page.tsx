'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CampusCarousel from '@/components/CampusCarousel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Sparkles, GraduationCap, Laptop, Compass, 
  Award, Clock, Calendar, CheckCircle2, ChevronRight, Binary 
} from 'lucide-react';

const ACADEMIC_CALENDAR = [
  {
    term: "Term 3 (Current/Upcoming)",
    event: "Resumption Day",
    date: "Monday, Sept 7, 2026",
    desc: "All students and pupils return to campus. Uniform standards fully enforced."
  },
  {
    term: "Term 3",
    event: "Continuous Assessment (C.A. 1)",
    date: "Oct 12 - Oct 15, 2026",
    desc: "First cycle of mid-term examinations for primary and secondary classes."
  },
  {
    term: "Term 3",
    event: "Mid-Term Break",
    date: "Oct 22 - Oct 23, 2026",
    desc: "Short academic recess. Administration desk remains open for inquiry."
  },
  {
    term: "Term 3",
    event: "Term-End Examination",
    date: "Nov 30 - Dec 4, 2026",
    desc: "Final examinations for academic promotion."
  },
  {
    term: "Term 3",
    event: "Vacation Day & Report Cards",
    date: "Friday, Dec 11, 2026",
    desc: "Official closing ceremony. Report cards issued to parents."
  }
];

const EXTRACURRICULAR = [
  {
    name: "ICT & Robotics Club",
    desc: "Python/Scratch coding classes, sensor integrations, and drone navigation tasks."
  },
  {
    name: "Debate & Public Speaking Society",
    desc: "Training in rhetoric, argument modeling, and state-wide championship entries."
  },
  {
    name: "Chess & Logical Games Club",
    desc: "Advanced strategy tutoring, spatial reasoning development, and termly school tournaments."
  },
  {
    name: "Young Farmers & Gardeners",
    desc: "Hands-on basic agricultural training, sustainable soil culture, and botany science."
  },
  {
    name: "Music, Choir & Instrumental Guild",
    desc: "Learning piano, violin, drums, and traditional voice training with annual recitals."
  },
  {
    name: "Drama & Cultural Day Alliance",
    desc: "Traditional dance choreography, theater production, and national costume exhibitions."
  }
];

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'primary' | 'college'>('primary');
  const [nurseryPrimaryImages, setNurseryPrimaryImages] = useState<string[]>([
    '/images/matem_pupils_uniform.jpg',
    'https://picsum.photos/seed/primary_class/600/500',
    'https://picsum.photos/seed/primary_play/600/500',
    'https://picsum.photos/seed/primary_draw/600/500'
  ]);
  const [nurseryPrimaryInterval, setNurseryPrimaryInterval] = useState(5);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([
    '/images/college_students.jpg',
    'https://picsum.photos/seed/college_student/600/500',
    'https://picsum.photos/seed/college_math/600/500',
    'https://picsum.photos/seed/college_lab/600/500'
  ]);
  const [secondaryInterval, setSecondaryInterval] = useState(5);

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await fetch(`/api/db?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          if (data.carouselNurseryPrimary && data.carouselNurseryPrimary.images?.length > 0) {
            setNurseryPrimaryImages(data.carouselNurseryPrimary.images);
            if (data.carouselNurseryPrimary.intervalSeconds) {
              setNurseryPrimaryInterval(data.carouselNurseryPrimary.intervalSeconds);
            }
          }
          if (data.carouselSecondary && data.carouselSecondary.images?.length > 0) {
            setSecondaryImages(data.carouselSecondary.images);
            if (data.carouselSecondary.intervalSeconds) {
              setSecondaryInterval(data.carouselSecondary.intervalSeconds);
            }
          }
        }
      } catch (error) {
        console.error('Error loading academic carousels:', error);
      }
    };
    fetchCarousels();
  }, []);

  return (
    <>
      <Navbar />

      {/* Banner */}
      <section id="academics-banner" className="bg-navy-800 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <GraduationCap className="w-[400px] h-[400px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest font-mono">
            Nurturing Minds
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight">
            Curriculum & Academic Calendar
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            We deliver a comprehensive cognitive path combining British logical inquiry standards with Nigerian national curricula.
          </p>
        </div>
      </section>

      {/* Switcher Tabs */}
      <section id="curriculum-tabs" className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gray-100 p-1.5 rounded-full flex items-center justify-between border border-gray-200">
            <button
              onClick={() => setActiveTab('primary')}
              className={`flex-1 text-center py-3 rounded-full text-xs font-bold transition-all ${
                activeTab === 'primary'
                  ? 'bg-navy-800 text-white shadow-md'
                  : 'text-gray-600 hover:text-navy-800'
              }`}
            >
              Matem Private School (Primary & Nursery)
            </button>
            <button
              onClick={() => setActiveTab('college')}
              className={`flex-1 text-center py-3 rounded-full text-xs font-bold transition-all ${
                activeTab === 'college'
                  ? 'bg-navy-800 text-white shadow-md'
                  : 'text-gray-600 hover:text-navy-800'
              }`}
            >
              Matem College (Secondary School)
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <section id="academic-content" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'primary' ? (
              <motion.div
                key="primary-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Header overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-xs font-bold text-gold-500 uppercase tracking-widest font-mono">
                      Early Education Philosophy
                    </span>
                    <h2 className="text-3xl font-serif font-bold text-navy-800">
                      Matem Private School: Foundation for Lifelong Excellence
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      At Matem Private School, we recognize that the first ten years of a child&apos;s life are the most critical for sensory, motor, and analytical wiring. We utilize a highly refined, playful, yet academically serious hybrid Nigerian-British curriculum designed to stir high cognitive alertness and early computational capability.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Classes are kept small (maximum of 20 pupils) to ensure our teachers can track every pupil&apos;s developmental progress. Under our custom ScratchJr and Scratch coding program, our pupils begin writing visual computer programs as early as Primary 2.
                    </p>
                  </div>
                  <div className="lg:col-span-5 relative min-h-[250px] sm:min-h-[320px] rounded-2xl overflow-hidden shadow-premium">
                    <CampusCarousel
                      images={nurseryPrimaryImages}
                      intervalSeconds={nurseryPrimaryInterval}
                      altText="Matem Private School"
                      aspectRatio="h-full w-full"
                    />
                  </div>
                </div>

                {/* Subsections: Nursery vs Primary */}
                <div id="private-school" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-800 font-bold">
                      01
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800">Creche (3m – 1.5 yrs)</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">
                      Our secure, comfortable creche is structured with hygienic sensory toys, color coordinates, and soft baby gyms. Under standard, certified nursing care, babies develop auditory, verbal, and cognitive security.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold font-mono uppercase">Sensory • Motor Development</div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-800 font-bold">
                      02
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800">Nursery School (1.5 – 5 yrs)</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">
                      Focusing on letter pronunciations, motor control, early handwriting, mathematical symbols, social values, and French speech. We use the Montessori sensory method paired with phonics.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold font-mono uppercase">Montessori • Early Literacy</div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-800 font-bold">
                      03
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800">Primary 1 – 6 (Ages 5 – 11)</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">
                      Comprehensive, standard modules covering: English (Comprehension/Spelling), Mathematics (Geometry/Algebra), Basic Science, Verbal and Quantitative Reasoning, Social Studies, French, Computer Coding, and Agricultural Science.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold font-mono uppercase">Hybrid Curriculum • Coding Labs</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="college-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Header overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-xs font-bold text-gold-500 uppercase tracking-widest font-mono">
                      Secondary Education
                    </span>
                    <h2 className="text-3xl font-serif font-bold text-navy-800">
                      Matem College: Inspiring Scholars & Global Innovators
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      At Matem College, our pedagogy transitions from foundational skills to deep specialized tracks. We prepare students for advanced secondary examinations like WAEC, NECO, JAMB, and the Cambridge IGCSE, maintaining a record of straight-A distinction averages.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We operate specialized, safe physics, chemistry, biology, and agricultural sciences fields, ensuring every theoretical subject is proven in practical research laboratories. In addition, students are introduced to Python coding, database basics, and public speech logic.
                    </p>
                  </div>
                  <div className="lg:col-span-5 relative min-h-[250px] sm:min-h-[320px] rounded-2xl overflow-hidden shadow-premium">
                    <CampusCarousel
                      images={secondaryImages}
                      intervalSeconds={secondaryInterval}
                      altText="Matem College"
                      aspectRatio="h-full w-full"
                    />
                  </div>
                </div>

                {/* Subsections: Junior vs Senior */}
                <div id="college" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-800 font-bold">
                      01
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800">Junior Secondary (JSS 1 – JSS 3)</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">
                      Subjects include Mathematics, English, Basic Science & Technology (robotics components), French, Business Studies, National Values, and Agricultural Science. Intensive prep for the national BECE examinations.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold font-mono uppercase">BECE Preparation • Robotics</div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-800 font-bold">
                      02
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800">Senior Secondary (SSS 1 – SSS 3)</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">
                      Advanced preparation for WAEC, NECO, and JAMB exams. Students transition into one of our three core disciplines: Science, Arts, or Commercial. Offers additional prep until 4:30 PM for final-year exam candidates.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold font-mono uppercase">WAEC • JAMB Success • 100% Focus</div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-800 font-bold">
                      03
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800">Specialized Secondary Tracks</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-sans">
                      - **Science:** Physics, Chemistry, Biology, Further Maths. <br />
                      - **Arts:** Literature, Government, Christian/Islamic Studies, History. <br />
                      - **Commercial:** Financial Accounting, Commerce, Economics.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold font-mono uppercase">Science • Arts • Commerce</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Extracurricular Activities */}
      <section id="extracurricular" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Beyond the Classroom
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Extracurricular Activities & Clubs</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              We encourage students to actively participate in clubs to develop team collaboration, mental strategic alertness, and leadership capacities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXTRACURRICULAR.map((club, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-navy-800">{club.name}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans">{club.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar Table / Schedule */}
      <section id="academic-calendar" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Term Schedules
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Current Academic Calendar</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              Key academic schedules and holiday calendars for the upcoming session of Matem Schools.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-navy-800 px-6 py-4 text-white flex items-center justify-between">
              <span className="font-serif font-bold text-sm">2026 Academic Term 3 Session</span>
              <span className="text-[10px] font-mono uppercase bg-gold-500 text-navy-950 font-bold px-3 py-1 rounded-full">
                Unified Dates
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {ACADEMIC_CALENDAR.map((cal, idx) => (
                <div key={idx} className="p-6 sm:grid sm:grid-cols-12 sm:gap-6 items-center hover:bg-gray-50/50 transition-colors">
                  <div className="sm:col-span-3 text-xs text-gold-600 font-mono font-bold tracking-wide uppercase mb-1 sm:mb-0">
                    {cal.date}
                  </div>
                  <div className="sm:col-span-4 text-navy-800 font-serif font-bold text-sm sm:text-base mb-1 sm:mb-0">
                    {cal.event}
                  </div>
                  <div className="sm:col-span-5 text-gray-500 text-xs leading-relaxed font-sans">
                    {cal.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
