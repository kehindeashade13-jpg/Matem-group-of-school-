'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Lock, LayoutDashboard, Newspaper, Calendar, 
  MessageSquare, Plus, Trash2, Edit2, Eye, CheckCircle, 
  X, RefreshCw, Loader2, Sparkles, UserCheck, AlertCircle,
  Search, Filter, ExternalLink, Database, AlertTriangle, FileText, MapPin, Clock, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

// TypeScript Interfaces matching the Supabase Schema
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  arm: 'private-school' | 'college';
  purpose: 'admission' | 'general' | 'complaint' | 'other';
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  date: string;
  created_at?: string;
}

interface Post {
  id: string;
  title: string;
  category: 'School News' | 'Academic Achievements' | 'Announcements' | 'Notices';
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
  created_at?: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'academic' | 'sports' | 'cultural' | 'other';
  created_at?: string;
}

// Initial/Mock Fallbacks for when Supabase is not yet configured
const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+234 803 123 4567",
    arm: "private-school",
    purpose: "admission",
    message: "I would like to inquire about the admissions process for the upcoming school session for my daughter entering Grade 4.",
    status: "pending",
    date: "2026-07-15"
  },
  {
    id: "inq-2",
    name: "Chinedu Okafor",
    email: "chinedu@example.com",
    phone: "+234 812 345 6789",
    arm: "college",
    purpose: "general",
    message: "Does Matem College offer boarding facilities for senior secondary students? What are the requirements?",
    status: "contacted",
    date: "2026-07-14"
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Matem College Emerges Victorious in National Science Bowl",
    category: "Academic Achievements",
    excerpt: "We are extremely proud to announce our team's outstanding victory at the National Inter-School Science Olympiad.",
    content: "Our senior science students showcased exceptional knowledge and critical thinking, securing first place in physics and mathematics categories. Congratulations to our hard-working scholars and their devoted instructors!",
    date: "2026-07-10",
    image: "https://picsum.photos/seed/science/800/600",
    author: "Principal's Office"
  },
  {
    id: "post-2",
    title: "Re-Opening Schedule & Guidelines for Autumn Term",
    category: "Announcements",
    excerpt: "All necessary details regarding resuming, boarding check-in, and administrative clearances are outlined here.",
    content: "We look forward to welcoming students back to both the private school and college campuses. Please verify that all tuition payments are settled and healthcare clearance forms are uploaded prior to the resume date.",
    date: "2026-07-08",
    image: "https://picsum.photos/seed/school/800/600",
    author: "Admissions Board"
  }
];

const MOCK_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Autumn Term Resumption & Orientation Day",
    description: "Welcome assembly, syllabus distributions, and school rules briefing for all new and returning students.",
    date: "2026-09-07",
    time: "08:00 AM - 02:00 PM",
    location: "Main Auditorium, Matem College",
    category: "academic"
  },
  {
    id: "event-2",
    title: "Inter-House Sports Festival 2026",
    description: "Our highly anticipated annual sports track and field tournament. Parents are cordially invited to cheer our students.",
    date: "2026-10-24",
    time: "09:00 AM - 04:30 PM",
    location: "Matem Sports Complex & Field",
    category: "sports"
  }
];

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<'inquiries' | 'posts' | 'events'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Connection info
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Modals state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Edit item tracking
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Forms state
  const [inquiryForm, setInquiryForm] = useState<Omit<Inquiry, 'id' | 'created_at'>>({
    name: '',
    email: '',
    phone: '',
    arm: 'private-school',
    purpose: 'admission',
    message: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  });

  const [postForm, setPostForm] = useState<Omit<Post, 'id' | 'created_at'>>({
    title: '',
    category: 'School News',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: 'https://picsum.photos/seed/matem/800/600',
    author: 'Principal\'s Desk'
  });

  const [eventForm, setEventForm] = useState<Omit<EventItem, 'id' | 'created_at'>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 AM',
    location: '',
    category: 'academic'
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  // Determine if credentials are real or placeholder
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const timer = setTimeout(() => {
      if (url && key && !url.includes("placeholder-project") && !key.includes("placeholder-anon")) {
        setIsSupabaseConfigured(true);
        setConnectionMessage("Connected to Live Supabase Database");
      } else {
        setIsSupabaseConfigured(false);
        setConnectionMessage("Demo Sandbox Mode (Fallback Local Data Active)");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync data from database or load mock fallbacks
  const fetchAllData = async () => {
    setLoading(true);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isMock = !url || url.includes("placeholder-project");

    if (isMock) {
      // Simulate local database latency
      setTimeout(() => {
        // Read from local storage if saved there, otherwise set mock fallbacks
        const localInquiries = localStorage.getItem('matem_inquiries');
        const localPosts = localStorage.getItem('matem_posts');
        const localEvents = localStorage.getItem('matem_events');

        if (localInquiries) setInquiries(JSON.parse(localInquiries));
        else {
          setInquiries(MOCK_INQUIRIES);
          localStorage.setItem('matem_inquiries', JSON.stringify(MOCK_INQUIRIES));
        }

        if (localPosts) setPosts(JSON.parse(localPosts));
        else {
          setPosts(MOCK_POSTS);
          localStorage.setItem('matem_posts', JSON.stringify(MOCK_POSTS));
        }

        if (localEvents) setEvents(JSON.parse(localEvents));
        else {
          setEvents(MOCK_EVENTS);
          localStorage.setItem('matem_events', JSON.stringify(MOCK_EVENTS));
        }

        setLoading(false);
      }, 500);
      return;
    }

    try {
      // 1. Fetch inquiries
      const { data: inqData, error: inqError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (inqError) console.error("Error fetching inquiries:", inqError);
      else if (inqData) setInquiries(inqData);

      // 2. Fetch posts
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postError) console.error("Error fetching posts:", postError);
      else if (postData) setPosts(postData);

      // 3. Fetch events
      const { data: evData, error: evError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (evError) console.error("Error fetching events:", evError);
      else if (evData) setEvents(evData);

    } catch (err) {
      console.error("General connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchAllData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "admin123") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect staff passcode. Use 'admin123' to unlock.");
    }
  };

  // ==========================================
  // INQUIRIES CRUD OPERATIONS
  // ==========================================
  const handleOpenInquiryModal = (inq: Inquiry | null = null) => {
    if (inq) {
      setEditingInquiry(inq);
      setInquiryForm({
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        arm: inq.arm,
        purpose: inq.purpose,
        message: inq.message,
        status: inq.status,
        date: inq.date
      });
    } else {
      setEditingInquiry(null);
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        arm: 'private-school',
        purpose: 'admission',
        message: '',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowInquiryModal(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    if (!isSupabaseConfigured) {
      // Mock update local storage
      let updatedInquiries = [...inquiries];
      if (editingInquiry) {
        updatedInquiries = inquiries.map(i => i.id === editingInquiry.id ? { ...i, ...inquiryForm } : i);
      } else {
        const newRecord: Inquiry = {
          id: `inq-${Date.now()}`,
          ...inquiryForm
        };
        updatedInquiries.unshift(newRecord);
      }
      setInquiries(updatedInquiries);
      localStorage.setItem('matem_inquiries', JSON.stringify(updatedInquiries));
      setShowInquiryModal(false);
      setFormSubmitting(false);
      return;
    }

    try {
      if (editingInquiry) {
        const { error } = await supabase
          .from('inquiries')
          .update(inquiryForm)
          .eq('id', editingInquiry.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('inquiries')
          .insert([inquiryForm]);
        if (error) throw error;
      }
      await fetchAllData();
      setShowInquiryModal(false);
    } catch (err: any) {
      alert(`Supabase Error: ${err.message || 'Unable to save record'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleQuickInquiryStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    if (!isSupabaseConfigured) {
      const updatedInquiries = inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
      setInquiries(updatedInquiries);
      localStorage.setItem('matem_inquiries', JSON.stringify(updatedInquiries));
      return;
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parent inquiry record?")) return;

    if (!isSupabaseConfigured) {
      const updatedInquiries = inquiries.filter(i => i.id !== id);
      setInquiries(updatedInquiries);
      localStorage.setItem('matem_inquiries', JSON.stringify(updatedInquiries));
      return;
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };


  // ==========================================
  // BLOG POSTS CRUD OPERATIONS
  // ==========================================
  const handleOpenPostModal = (post: Post | null = null) => {
    if (post) {
      setEditingPost(post);
      setPostForm({
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        date: post.date,
        image: post.image,
        author: post.author
      });
    } else {
      setEditingPost(null);
      setPostForm({
        title: '',
        category: 'School News',
        excerpt: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        image: 'https://picsum.photos/seed/matem/800/600',
        author: 'Principal\'s Desk'
      });
    }
    setShowPostModal(true);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    if (!isSupabaseConfigured) {
      let updatedPosts = [...posts];
      if (editingPost) {
        updatedPosts = posts.map(p => p.id === editingPost.id ? { ...p, ...postForm } : p);
      } else {
        const newRecord: Post = {
          id: `post-${Date.now()}`,
          ...postForm
        };
        updatedPosts.unshift(newRecord);
      }
      setPosts(updatedPosts);
      localStorage.setItem('matem_posts', JSON.stringify(updatedPosts));
      setShowPostModal(false);
      setFormSubmitting(false);
      return;
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('posts')
          .update(postForm)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postForm]);
        if (error) throw error;
      }
      await fetchAllData();
      setShowPostModal(false);
    } catch (err: any) {
      alert(`Supabase Error: ${err.message || 'Unable to save post'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?")) return;

    if (!isSupabaseConfigured) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem('matem_posts', JSON.stringify(updatedPosts));
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };


  // ==========================================
  // EVENTS CRUD OPERATIONS
  // ==========================================
  const handleOpenEventModal = (ev: EventItem | null = null) => {
    if (ev) {
      setEditingEvent(ev);
      setEventForm({
        title: ev.title,
        description: ev.description,
        date: ev.date,
        time: ev.time,
        location: ev.location,
        category: ev.category
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '08:00 AM',
        location: '',
        category: 'academic'
      });
    }
    setShowEventModal(true);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    if (!isSupabaseConfigured) {
      let updatedEvents = [...events];
      if (editingEvent) {
        updatedEvents = events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventForm } : ev);
      } else {
        const newRecord: EventItem = {
          id: `ev-${Date.now()}`,
          ...eventForm
        };
        updatedEvents.unshift(newRecord);
      }
      setEvents(updatedEvents);
      localStorage.setItem('matem_events', JSON.stringify(updatedEvents));
      setShowEventModal(false);
      setFormSubmitting(false);
      return;
    }

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventForm)
          .eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventForm]);
        if (error) throw error;
      }
      await fetchAllData();
      setShowEventModal(false);
    } catch (err: any) {
      alert(`Supabase Error: ${err.message || 'Unable to save event'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this school event?")) return;

    if (!isSupabaseConfigured) {
      const updatedEvents = events.filter(ev => ev.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('matem_events', JSON.stringify(updatedEvents));
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inq.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      {/* Staff Login Overlay */}
      {!isAuthenticated ? (
        <section id="admin-login" className="py-24 bg-gray-50 flex items-center justify-center min-h-[75vh]">
          <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-premium border border-gray-100 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gold-100 text-gold-800 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6 text-navy-800" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-navy-800">Staff Portal Access</h1>
              <p className="text-xs text-gray-400">
                Authorized Matem Private School & Matem College staff only.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 shrink-0" /> {authError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-gray-700 font-bold">Staff Passcode</label>
                <input
                  type="password"
                  placeholder="Enter staff password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 font-mono text-center tracking-widest text-sm"
                  required
                  autoFocus
                />
                <span className="block text-[10px] text-gray-400 mt-1.5 text-center">
                  * Note: Use passcode <strong className="font-bold text-navy-800 font-mono text-xs select-all bg-gray-100 px-1 rounded">admin123</strong> to review this dashboard.
                </span>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full bg-navy-800 hover:bg-navy-950 text-white font-bold py-3.5 rounded-xl shadow transition-colors text-xs cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* Authenticated Dashboard */
        <section id="admin-dashboard" className="py-12 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            {/* Supabase Status Banner */}
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium ${
              isSupabaseConfigured 
                ? 'bg-emerald-50/80 border-emerald-100 text-emerald-800' 
                : 'bg-amber-50/80 border-amber-100 text-amber-800'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isSupabaseConfigured ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-sm flex items-center">
                    {connectionMessage}
                  </p>
                  <p className="opacity-90 text-[11px] mt-0.5">
                    {isSupabaseConfigured 
                      ? "Your tables are connected. Any inserts, updates, and deletes are saved directly to your remote Supabase instance."
                      : "We've enabled client-side local persistence so you can fully test editing, creating, and deleting records in real time!"
                    }
                  </p>
                </div>
              </div>
              {!isSupabaseConfigured && (
                <div className="flex items-center space-x-2 shrink-0 bg-white/70 px-3 py-1.5 rounded-lg border border-amber-100 self-start md:self-auto">
                  <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Configure <strong className="font-mono">NEXT_PUBLIC_SUPABASE_URL</strong> to go live.</span>
                </div>
              )}
            </div>

            {/* Dashboard Header */}
            <div className="bg-navy-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-gold-500/30 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block font-mono">
                  Governance Admin Portal
                </span>
                <h1 className="font-serif text-3xl font-black text-white">Matem Staff Dashboard</h1>
                <p className="text-xs text-gray-300 font-light font-sans">
                  Comprehensive CRUD operations for admissions, news blog articles, and upcoming events.
                </p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={fetchAllData}
                  id="sync-db-btn"
                  className="bg-navy-700 hover:bg-navy-600 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Live
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  id="logout-btn"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Logout Staff
                </button>
              </div>
            </div>

            {/* Layout Main Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sidebar Navigation */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-premium border border-gray-100 space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-2.5 mb-2 font-mono">
                    System Entities
                  </p>
                  <button
                    onClick={() => { setActiveTab('inquiries'); setSearchQuery(''); }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'inquiries'
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2.5" />
                      <span>Inquiries & Admissions</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === 'inquiries' ? 'bg-navy-700 text-gold-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {inquiries.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('posts'); setSearchQuery(''); }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'posts'
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Newspaper className="h-4 w-4 mr-2.5" />
                      <span>Manage School Blog</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === 'posts' ? 'bg-navy-700 text-gold-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {posts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('events'); setSearchQuery(''); }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'events'
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2.5" />
                      <span>Manage Campus Events</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === 'events' ? 'bg-navy-700 text-gold-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {events.length}
                    </span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-premium border border-gray-100 space-y-3">
                  <h3 className="text-xs font-bold text-navy-800">Need Help?</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    This administrative suite is designed to synchronize cleanly with the PostgreSQL database. Creating posts or events here will immediately display them on the corresponding visitor pages.
                  </p>
                  <div className="text-[10px] font-mono bg-gray-50 border rounded-lg p-2.5 text-gray-500 space-y-1">
                    <p className="font-bold text-navy-800">Schema Constraints Checked:</p>
                    <p>• Inquiries Arm: private-school | college</p>
                    <p>• Posts Category: School News | Announcements | Academic Achievements | Notices</p>
                    <p>• Events Category: academic | sports | cultural | other</p>
                  </div>
                </div>
              </div>

              {/* Data & Table Panel Area */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Global Search and Tab Filter Tools */}
                <div className="bg-white p-4 rounded-xl shadow-premium border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-gold-500"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {/* Secondary Filters for Specific Tabs */}
                    {activeTab === 'inquiries' && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Filter className="h-3.5 w-3.5 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-600 focus:outline-none focus:border-gold-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    )}

                    {(activeTab === 'posts' || activeTab === 'events') && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Filter className="h-3.5 w-3.5 text-gray-400" />
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-600 focus:outline-none focus:border-gold-500"
                        >
                          <option value="all">All Categories</option>
                          {activeTab === 'posts' ? (
                            <>
                              <option value="School News">School News</option>
                              <option value="Academic Achievements">Academic Achievements</option>
                              <option value="Announcements">Announcements</option>
                              <option value="Notices">Notices</option>
                            </>
                          ) : (
                            <>
                              <option value="academic">Academic</option>
                              <option value="sports">Sports</option>
                              <option value="cultural">Cultural</option>
                              <option value="other">Other</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}

                    {/* Action buttons to trigger modals */}
                    <button
                      onClick={() => {
                        if (activeTab === 'inquiries') handleOpenInquiryModal();
                        else if (activeTab === 'posts') handleOpenPostModal();
                        else if (activeTab === 'events') handleOpenEventModal();
                      }}
                      id="add-new-btn"
                      className="bg-navy-800 hover:bg-navy-950 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center shadow transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> 
                      Add New {activeTab === 'inquiries' ? 'Inquiry' : activeTab === 'posts' ? 'Post' : 'Event'}
                    </button>
                  </div>
                </div>

                {/* Sub Tab View Renderers */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                      <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
                      <p className="text-xs text-gray-400 font-medium">Loading synced records...</p>
                    </div>
                  ) : (
                    <>
                      {/* ==================================== */}
                      {/* INQUIRIES VIEW */}
                      {/* ==================================== */}
                      {activeTab === 'inquiries' && (
                        <div className="divide-y divide-gray-100">
                          {filteredInquiries.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 text-xs">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              No inquiries found matching the search criteria.
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-mono font-bold border-b border-gray-100">
                                  <tr>
                                    <th className="p-4 pl-6">Contact info</th>
                                    <th className="p-4">Details</th>
                                    <th className="p-4">Message</th>
                                    <th className="p-4">Status Workflow</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                  {filteredInquiries.map((inq) => (
                                    <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="p-4 pl-6 space-y-1">
                                        <p className="font-bold text-navy-800 text-sm">{inq.name}</p>
                                        <p className="text-[11px] text-gray-400">{inq.email}</p>
                                        <p className="text-[11px] text-gray-400 font-mono">{inq.phone}</p>
                                      </td>
                                      <td className="p-4 space-y-1 shrink-0 whitespace-nowrap">
                                        <div className="flex items-center space-x-1.5">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                                            inq.arm === 'private-school' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                                          }`}>
                                            {inq.arm === 'private-school' ? 'Private School' : 'College'}
                                          </span>
                                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono">
                                            {inq.purpose}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-mono">{inq.date}</p>
                                      </td>
                                      <td className="p-4 max-w-xs">
                                        <p className="line-clamp-2 text-gray-500 leading-relaxed text-[11px]" title={inq.message}>
                                          {inq.message}
                                        </p>
                                      </td>
                                      <td className="p-4">
                                        <select
                                          value={inq.status}
                                          onChange={(e) => handleQuickInquiryStatusChange(inq.id, e.target.value as Inquiry['status'])}
                                          className={`px-2.5 py-1.5 rounded-lg font-bold font-mono text-[10px] uppercase border focus:outline-none cursor-pointer ${
                                            inq.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            inq.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          }`}
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="contacted">Contacted</option>
                                          <option value="resolved">Resolved</option>
                                        </select>
                                      </td>
                                      <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                          <button
                                            onClick={() => handleOpenInquiryModal(inq)}
                                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-navy-800 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Inquiry Details"
                                          >
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteInquiry(inq.id)}
                                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                            title="Delete Inquiry"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ==================================== */}
                      {/* POSTS VIEW */}
                      {/* ==================================== */}
                      {activeTab === 'posts' && (
                        <div className="divide-y divide-gray-100">
                          {filteredPosts.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 text-xs">
                              <Newspaper className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              No blog posts found matching the search criteria.
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-mono font-bold border-b border-gray-100">
                                  <tr>
                                    <th className="p-4 pl-6">Post Cover</th>
                                    <th className="p-4">Title & Excerpt</th>
                                    <th className="p-4">Author & Date</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                  {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="p-4 pl-6 shrink-0">
                                        <div className="relative w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                          <img
                                            src={post.image || 'https://picsum.photos/seed/default/100/100'}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/default/100/100';
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td className="p-4 max-w-sm space-y-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-navy-50 text-navy-700 uppercase font-mono">
                                            {post.category}
                                          </span>
                                        </div>
                                        <p className="font-bold text-navy-800 text-sm leading-snug line-clamp-1">{post.title}</p>
                                        <p className="text-[11px] text-gray-400 line-clamp-1 leading-relaxed">{post.excerpt}</p>
                                      </td>
                                      <td className="p-4 space-y-1">
                                        <p className="font-medium text-gray-800">{post.author}</p>
                                        <p className="text-[10px] text-gray-400 font-mono flex items-center">
                                          <Clock className="h-3 w-3 mr-1" /> {post.date}
                                        </p>
                                      </td>
                                      <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                          <button
                                            onClick={() => handleOpenPostModal(post)}
                                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-navy-800 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Post"
                                          >
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                            title="Delete Post"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ==================================== */}
                      {/* EVENTS VIEW */}
                      {/* ==================================== */}
                      {activeTab === 'events' && (
                        <div className="divide-y divide-gray-100">
                          {filteredEvents.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 text-xs">
                              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              No events found matching the search criteria.
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-mono font-bold border-b border-gray-100">
                                  <tr>
                                    <th className="p-4 pl-6">Title & Description</th>
                                    <th className="p-4">Schedule</th>
                                    <th className="p-4">Venue/Location</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                  {filteredEvents.map((ev) => (
                                    <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="p-4 pl-6 max-w-sm space-y-1">
                                        <div className="flex items-center space-x-2">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                                            ev.category === 'academic' ? 'bg-purple-50 text-purple-700' :
                                            ev.category === 'sports' ? 'bg-orange-50 text-orange-700' :
                                            ev.category === 'cultural' ? 'bg-teal-50 text-teal-700' :
                                            'bg-gray-50 text-gray-700'
                                          }`}>
                                            {ev.category}
                                          </span>
                                        </div>
                                        <p className="font-bold text-navy-800 text-sm leading-snug">{ev.title}</p>
                                        <p className="text-[11px] text-gray-400 line-clamp-1 leading-relaxed">{ev.description}</p>
                                      </td>
                                      <td className="p-4 space-y-1 whitespace-nowrap">
                                        <p className="font-bold text-gray-800 font-mono text-[11px]">{ev.date}</p>
                                        <p className="text-[10px] text-gray-400 flex items-center">
                                          <Clock className="h-3 w-3 mr-1" /> {ev.time}
                                        </p>
                                      </td>
                                      <td className="p-4 max-w-[180px]">
                                        <p className="text-[11px] text-gray-600 font-medium flex items-start leading-tight">
                                          <MapPin className="h-3 w-3 mr-1 mt-0.5 text-gray-400 shrink-0" />
                                          <span>{ev.location}</span>
                                        </p>
                                      </td>
                                      <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                          <button
                                            onClick={() => handleOpenEventModal(ev)}
                                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-navy-800 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Event"
                                          >
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteEvent(ev.id)}
                                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                            title="Delete Event"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* ======================================================= */}
      {/* INQUIRY MODAL (CREATE / EDIT) */}
      {/* ======================================================= */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
            >
              <div className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">
                  {editingInquiry ? 'Edit Inquiry Record' : 'Record New Parent Inquiry'}
                </h3>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="p-1 rounded-lg hover:bg-navy-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleInquirySubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Parent Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kola Adesina"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. parent@example.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +234 80 1234 5678"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Submission Date</label>
                    <input
                      type="date"
                      required
                      value={inquiryForm.date}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">School Arm</label>
                    <select
                      value={inquiryForm.arm}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, arm: e.target.value as Inquiry['arm'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-medium"
                    >
                      <option value="private-school">Private School</option>
                      <option value="college">College</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Purpose Of Inquiry</label>
                    <select
                      value={inquiryForm.purpose}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, purpose: e.target.value as Inquiry['purpose'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-medium"
                    >
                      <option value="admission">Admissions</option>
                      <option value="general">General Inquiry</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Initial Status</label>
                    <select
                      value={inquiryForm.status}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, status: e.target.value as Inquiry['status'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Inquiry Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter details submitted by the parent..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2.5 bg-navy-800 hover:bg-navy-950 text-white font-bold rounded-xl shadow transition-colors flex items-center cursor-pointer disabled:opacity-50"
                  >
                    {formSubmitting && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                    {editingInquiry ? 'Save Changes' : 'Record Inquiry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================= */}
      {/* BLOG POST MODAL (CREATE / EDIT) */}
      {/* ======================================================= */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
            >
              <div className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">
                  {editingPost ? 'Edit Blog Article' : 'Publish New Blog Article'}
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-1 rounded-lg hover:bg-navy-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePostSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Matem College Academic Clearances Update"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 text-sm font-medium text-navy-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Category</label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({ ...postForm, category: e.target.value as Post['category'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-semibold"
                    >
                      <option value="School News">School News</option>
                      <option value="Academic Achievements">Academic Achievements</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Notices">Notices</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Publication Date</label>
                    <input
                      type="date"
                      required
                      value={postForm.date}
                      onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Author Identity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ayo"
                      value={postForm.author}
                      onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    placeholder="Enter absolute image URL or direct link..."
                    value={postForm.image}
                    onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-mono"
                  />
                  <div className="flex space-x-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPostForm({ ...postForm, image: 'https://picsum.photos/seed/science/800/600' })}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded"
                    >
                      Sample Science Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostForm({ ...postForm, image: 'https://picsum.photos/seed/school/800/600' })}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded"
                    >
                      Sample Campus Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostForm({ ...postForm, image: 'https://picsum.photos/seed/sports/800/600' })}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded"
                    >
                      Sample Sports Cover
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Short Excerpt (Summary)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter a 1-sentence quick summary for list previews..."
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 text-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Full Article Content</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Write detailed announcements or bulletins..."
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2.5 bg-navy-800 hover:bg-navy-950 text-white font-bold rounded-xl shadow transition-colors flex items-center cursor-pointer disabled:opacity-50"
                  >
                    {formSubmitting && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                    {editingPost ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================= */}
      {/* EVENTS MODAL (CREATE / EDIT) */}
      {/* ======================================================= */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
            >
              <div className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">
                  {editingEvent ? 'Edit School Event' : 'Schedule New School Event'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-1 rounded-lg hover:bg-navy-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEventSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Matem Sports Championship Finals"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 text-sm font-medium text-navy-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Event Date</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Event Time/Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10:00 AM - 01:00 PM"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Event Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventItem['category'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 font-semibold"
                    >
                      <option value="academic">Academic</option>
                      <option value="sports">Sports</option>
                      <option value="cultural">Cultural</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-gray-700 font-bold">Venue/Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Main Auditorium, Matem College"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 font-bold">Detailed Event Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter detailed description regarding the scheduled event..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-gold-500 leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2.5 bg-navy-800 hover:bg-navy-950 text-white font-bold rounded-xl shadow transition-colors flex items-center cursor-pointer disabled:opacity-50"
                  >
                    {formSubmitting && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                    {editingEvent ? 'Update Event' : 'Schedule Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
