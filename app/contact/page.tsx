'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'motion/react';
import { 
  Mail, Phone, MapPin, Clock, ArrowRight, Loader2, 
  MessageSquare, Facebook, Twitter, Instagram, Sparkles, CheckSquare 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    arm: 'private-school',
    purpose: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
          payload: {
            name: formData.name || '',
            phone: formData.phone || '',
            email: formData.email || '',
            arm: formData.arm || 'private-school',
            purpose: formData.purpose || 'general',
            message: formData.message || ''
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        
        // Construct pre-filled email details
        const subject = encodeURIComponent(`Matem Schools Website Inquiry - ${formData.name}`);
        const body = encodeURIComponent(
          `Hello Matem Schools Administrative Office,\n\n` +
          `I am writing to you regarding: ${formData.purpose.toUpperCase()} (${formData.arm === 'private-school' ? 'Matem Private School' : 'Matem College'}).\n\n` +
          `My message details:\n` +
          `--------------------------------------------------\n` +
          `${formData.message}\n` +
          `--------------------------------------------------\n\n` +
          `My Contact Information:\n` +
          `- Full Name: ${formData.name}\n` +
          `- Phone Number: ${formData.phone}\n` +
          `- Email Address: ${formData.email}\n\n` +
          `Thank you.`
        );

        // Open native email client to send directly to school's email address
        window.location.href = `mailto:matemschools126@gmail.com?subject=${subject}&body=${body}`;

        setFormData({
          name: '',
          phone: '',
          email: '',
          arm: 'private-school',
          purpose: 'general',
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
      <section id="contact-banner" className="bg-navy-800 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <Mail className="w-[400px] h-[400px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest font-mono">
            Connect With Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight">
            Contact Our Campus Office
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            We are always happy to hear from you. Reach out for direct bookings, visits, support, or complaints.
          </p>
        </div>
      </section>

      {/* Main Content columns */}
      <section id="contact-details-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info & Map */}
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block font-mono">
                  Get in Touch
                </span>
                <h2 className="text-3xl font-serif font-bold text-navy-800">
                  Campus Address & Direct Lines
                </h2>
                <div className="w-12 h-1 bg-gold-500 rounded" />
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-navy-800">Campus Location</h4>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      34, Alabi Abimbola Street, <br />
                      Osi Ota, Off Ten Bus Stop, <br />
                      Ogun State
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-navy-800">Office Hours</h4>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      Monday to Friday: <br />
                      7:30 AM – 4:30 PM <br />
                      (Closed Weekends & Holidays)
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-navy-800">Phone Support</h4>
                    <div className="text-gray-500 text-xs mt-1 flex flex-col space-y-0.5">
                      <a href="tel:+2348089664009" className="hover:text-gold-600">08089664009</a>
                      <a href="tel:+2347016905766" className="hover:text-gold-600">07016905766</a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-navy-800">Email Addresses</h4>
                    <div className="text-gray-500 text-xs mt-1 flex flex-col space-y-0.5">
                      <a href="mailto:matemschools126@gmail.com" className="hover:text-gold-600">matemschools126@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-green-900 text-sm">Need a Fast Response?</h4>
                    <p className="text-xs text-green-700">Chat with our Registrar directly on WhatsApp.</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/2348089664009?text=Hello%20Matem%20Schools%2C%20I%20have%20a%20general%20question%20regarding%20the%20upcoming%20academic%20term."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm text-center transition-colors shrink-0"
                >
                  Start WhatsApp Chat
                </a>
              </div>

              {/* Embedded Google Map (Placeholder Styled Map Area) */}
              <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-sm text-navy-800">Google Map Location</h4>
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                  {/* Styled Map Illustration */}
                  <div className="absolute inset-0 bg-[#E8F0F2] opacity-80" />
                  <div className="absolute top-1/2 left-1/2 w-8 h-8 -mt-6 -ml-4 flex items-center justify-center text-red-500 animate-float">
                    <MapPin className="h-8 w-8 fill-current text-red-600" />
                  </div>
                  {/* Simulated Map lines */}
                  <div className="absolute top-0 bottom-0 left-[35%] w-1.5 bg-white" />
                  <div className="absolute top-0 bottom-0 left-[70%] w-1 bg-white" />
                  <div className="absolute left-0 right-0 top-[40%] h-1 bg-white" />
                  <div className="absolute left-0 right-0 top-[75%] h-1.5 bg-white animate-pulse" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-center z-10 bg-gradient-to-t from-black/45 to-transparent">
                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                      34, Alabi Abimbola Street, Osi Ota, Off Ten Bus Stop, Ogun State
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl shadow-premium border border-gray-100 p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] bg-gold-100 text-gold-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                    Direct Inquiry
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-navy-800">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    Have a complaint, suggestion, or question? Complete the form, and we will route it to the appropriate supervisor.
                  </p>
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-100 p-6 rounded-xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                      <CheckSquare className="h-6 w-6" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-green-900">Message Delivered Successfully!</h4>
                    <p className="text-xs text-green-700 leading-normal">
                      Thank you for contacting us. Your message has been safely submitted, and our administrative office will look into it and reach out shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow"
                    >
                      Send Another Message
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
                          placeholder="08089664009"
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
                          <option value="general">General Question</option>
                          <option value="admission">Admission Inquiry</option>
                          <option value="complaint">Complaint</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-bold">Message <span className="text-red-500">*</span></label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Type your message here..."
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
                          <Loader2 className="h-4 w-4 mr-2 animate-spin text-gold-400" /> Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message <ArrowRight className="ml-2 h-4 w-4 text-gold-400" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center leading-normal mt-2">
                      💡 <strong>Note:</strong> Sending will automatically save your inquiry to our records and open your email application to send directly to <strong>matemschools126@gmail.com</strong>.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
