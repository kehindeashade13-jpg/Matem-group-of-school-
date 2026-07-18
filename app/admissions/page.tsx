'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'motion/react';
import { 
  ClipboardList, HelpCircle, FileText, CheckCircle2, 
  ArrowRight, Phone, Mail, FileCheck2, Loader2, Sparkles 
} from 'lucide-react';

const REQUIREMENTS = [
  { class: "Creche", age: "3 Months – 1.5 Years", focus: "Sensory & Emotional Development" },
  { class: "Nursery 1", age: "1.5 – 3 Years", focus: "Phonics & Sensory motor skills" },
  { class: "Nursery 2", age: "3 – 5 Years", focus: "Pre-reading, Numbers & Social interaction" },
  { class: "Primary 1 – 3", age: "5 – 8 Years", focus: "Elementary subjects & Block Coding" },
  { class: "Primary 4 – 6", age: "8 – 11 Years", focus: "STEM Science, Math, Socials & Scratch" },
  { class: "JSS 1 – 3", age: "11 – 14 Years", focus: "Basic sciences, French, Business & BECE" },
  { class: "SSS 1 – 3", age: "14 – 17 Years", focus: "Specialized Science/Art/Commercial & WAEC" }
];

const DOCUMENTS = [
  "Photocopy of Child's Birth Certificate or Passport data page.",
  "2 recent passport-size photographs of the candidate.",
  "Most recent academic report cards from previous school (Primary 2 and above).",
  "Transfer certificate or reference letter from previous headmaster/principal.",
  "Proof of immunization record (for Nursery & Creche applicants)."
];

const FAQS = [
  {
    q: "What are the school hours for primary and secondary?",
    a: "Creche and Nursery operate from 8:00 AM to 12:30 PM. Primary 1–6 operate from 8:00 AM to 1:30 PM. Matem College runs from 7:45 AM to 3:30 PM. Examination year prep classes for SSS3 and JSS3 run until 4:30 PM."
  },
  {
    q: "Do you have school bus services? What routes do you cover?",
    a: "Yes, we operate a fleet of modern, air-conditioned, tracked school buses with adult chaperones. Our route circles cover Ikoyi, Victoria Island, Lekki Phase 1, the Lekki-Ajah corridor, Surulere, and Yaba."
  },
  {
    q: "How does the entrance examination work?",
    a: "Once you purchase and submit the registration pack, candidates for Primary 2 and above write an entrance assessment in English Language, Mathematics, and General Aptitude. Nursery/Primary 1 pupils sit for an interactive verbal/visual coordination assessment."
  },
  {
    q: "What is your uniform standard?",
    a: "Our standard uniform is white shirts, custom gold/navy ties, black shoes, white socks, grey trousers (boys) or pleated navy skirts (girls), and a navy blue school blazer with our crest. On Fridays, pupils wear their assigned house sports t-shirts (Ademola, Blue, Gold, Green) with white trainers."
  },
  {
    q: "Are hot school lunch services provided?",
    a: "Yes, we offer an optional, healthy, nutritious daily lunch service. Parents can subscribe to this service termly, or alternatively, provide home-packed healthy lunch boxes."
  }
];

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    arm: 'private-school',
    purpose: 'admission',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_inquiry',
          payload: formData
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          arm: 'private-school',
          purpose: 'admission',
          message: ''
        });
      } else {
        setError(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setError('A connection issue occurred. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Banner */}
      <section id="admissions-banner" className="bg-navy-800 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <ClipboardList className="w-[400px] h-[400px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest font-mono">
            Apply Today
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight">
            Admissions & Inquiry Portal
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            Secure your child&apos;s place in Lagos&apos;s most prestigious academic institution. Our application process is simple, digital, and supportive.
          </p>
        </div>
      </section>

      {/* Process & Form Columns */}
      <section id="admissions-process" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Step Process & Checklist */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
                  5 Simple Steps
                </span>
                <h2 className="text-3xl font-serif font-bold text-navy-800">
                  Our Step-by-Step Admissions Process
                </h2>
                <div className="w-12 h-1 bg-gold-500 rounded" />
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {[
                  { step: "01", title: "Submit Inquiry", desc: "Fill out the online Inquiry Form (on the right) or obtain an admission pack physically from the school office." },
                  { step: "02", title: "Obtain Application Pack", desc: "Purchase the registration form (N10,000 for Matem Private School / N15,000 for Matem College) and submit the required documents." },
                  { step: "03", title: "Schedules Entrance Exam", desc: "The candidate sits for an age-appropriate assessment evaluating standard Mathematics, English Language, and general aptitude." },
                  { step: "04", title: "Parent & Child Interview", desc: "A brief interactive chat with our Headmistress or Principal to understand expectations and student support details." },
                  { step: "05", title: "Official Offer & Payment", desc: "Successful candidates receive an admission offer letter. Payment of termly tuition fees completes enrollment." }
                ].map((st, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-navy-800 text-gold-400 font-bold rounded-lg flex items-center justify-center shrink-0 font-mono text-sm border border-gold-500/20">
                      {st.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-navy-800">{st.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed font-sans">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Checklist */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-premium space-y-5">
                <h3 className="font-serif font-bold text-xl text-navy-800 flex items-center">
                  <FileText className="h-6 w-6 text-gold-500 mr-2 shrink-0" /> Required Documents Checklist
                </h3>
                <div className="w-12 h-0.5 bg-gold-500 rounded" />
                <ul className="space-y-3">
                  {DOCUMENTS.map((doc, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-600">
                      <CheckCircle2 className="h-4.5 w-4.5 text-gold-500 mr-3 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Interactive Admission Inquiry Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-premium border border-gray-100 p-8 sticky top-24 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] bg-gold-100 text-gold-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                    Direct Inquiry
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-navy-800">
                    Online Admission & Inquiry Form
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    Submit this direct form. Our school registrar will contact you within 24 hours.
                  </p>
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-100 p-6 rounded-xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                      <FileCheck2 className="h-6 w-6" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-green-900">Inquiry Received Successfully!</h4>
                    <p className="text-xs text-green-700 leading-normal">
                      Thank you for your interest in Matem Schools. A confirmation copy has been registered, and our admissions team will contact you shortly via phone and email.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {error && (
                      <div className="p-3.5 bg-red-50 border border-red-100 rounded-lg text-red-600 font-medium">
                        {error}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-bold">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Olumide Johnson"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-700 font-bold">Phone Number <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234 803 555 1234"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-700 font-bold">Email Address <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="parent@example.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-700 font-bold">School Arm</label>
                        <select
                          name="arm"
                          value={formData.arm}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:border-gold-500 text-gray-800"
                        >
                          <option value="private-school">Matem Private School</option>
                          <option value="college">Matem College</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-700 font-bold">Purpose</label>
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:border-gold-500 text-gray-800"
                        >
                          <option value="admission">Admission Inquiry</option>
                          <option value="general">General Question</option>
                          <option value="complaint">Complaint</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-bold">Message / Inquiry Details <span className="text-red-500">*</span></label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Please tell us about your child (name, current school, desired class) or enter your questions here."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-navy-800 hover:bg-navy-950 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center text-xs"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin text-gold-400" /> Registering Inquiry...
                        </>
                      ) : (
                        <>
                          Submit Registration Inquiry <ArrowRight className="ml-2 h-4 w-4 text-gold-400" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Age/Class Requirements Table & Fee Note */}
      <section id="requirements-section" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Class Placement
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Age & Class Placement Guidelines</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              Please check our strict age and focus benchmarks before completing registrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Table */}
            <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-navy-800 text-white font-serif text-sm">
                    <tr>
                      <th className="px-6 py-4">Class Placement</th>
                      <th className="px-6 py-4">Required Age Range</th>
                      <th className="px-6 py-4">Core Focus & Curriculums</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {REQUIREMENTS.map((req, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-serif font-bold text-navy-800">{req.class}</td>
                        <td className="px-6 py-4 font-sans font-semibold text-gray-700">{req.age}</td>
                        <td className="px-6 py-4 text-gray-500 font-sans">{req.focus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fees Card */}
            <div className="lg:col-span-4 bg-navy-900 text-white rounded-2xl p-8 border border-navy-800 shadow-premium-lg space-y-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                <Sparkles className="w-[300px] h-[300px]" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] bg-gold-500 text-navy-950 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Tuition & Fees Note
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">Current Fee Structure</h3>
                <p className="text-gray-300 text-xs leading-relaxed font-sans font-light">
                  To maintain customized support, student ratios, and separate additional provisions (tracked transport, cafeteria lunch packages), Matem Schools does not publish a flat tuition fee schedule online.
                </p>
                <div className="bg-navy-800/80 p-4 border-l-4 border-gold-500 rounded-r-xl space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">Administration Desk</div>
                  <p className="text-xs text-gold-400">
                    Kindly complete the Inquiry Form on this page or email admissions@matemschools.com to receive our detailed termly fee prospectus.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2 font-mono text-[11px] text-gray-300">
                  <div className="flex items-center"><Phone className="h-4 w-4 text-gold-500 mr-2" /> +234 803 555 1234</div>
                  <div className="flex items-center"><Mail className="h-4 w-4 text-gold-500 mr-2" /> admissions@matemschools.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
              Got Questions?
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-800">Frequently Asked Questions</h2>
            <div className="w-12 h-1 bg-gold-500 mx-auto rounded" />
            <p className="text-gray-500 text-sm">
              Explore common details about school routines, logistics, meals, and academic assessments.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-navy-800 flex items-start">
                    <span className="text-gold-500 font-bold mr-2 font-mono">Q.</span> {faq.q}
                  </span>
                  <span className="text-navy-500 font-bold text-lg leading-none shrink-0 ml-4 font-mono select-none">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                
                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-0 text-xs text-gray-600 leading-relaxed font-sans border-t border-gray-50/50">
                    {faq.a}
                  </div>
                )}
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
