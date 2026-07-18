'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Lock, LayoutDashboard, Newspaper, Calendar, 
  MessageSquare, Plus, Trash2, Eye, CheckCircle, 
  X, RefreshCw, Loader2, Sparkles, UserCheck, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, EventItem, Inquiry } from '@/lib/db';

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeSubTab, setActiveSubTab] = useState<'inquiries' | 'posts' | 'events'>('inquiries');
  const [dbData, setDbData] = useState<{ posts: BlogPost[]; events: EventItem[]; inquiries: Inquiry[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // New Post form state
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'School News' as BlogPost['category'],
    excerpt: '',
    content: '',
    image: '',
    author: 'Principal\'s Desk'
  });

  // New Event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'academic' as EventItem['category']
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/db');
      if (response.ok) {
        const data = await response.json();
        setDbData(data);
      }
    } catch (err) {
      console.error('Error fetching database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchData();
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

  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_inquiry_status',
          payload: { id, status }
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parent inquiry?")) return;
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_inquiry',
          payload: { id }
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_post',
          payload: { id }
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this upcoming event?")) return;
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_event',
          payload: { id }
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_post',
          payload: newPost
        })
      });
      if (res.ok) {
        setShowPostModal(false);
        setNewPost({
          title: '',
          category: 'School News',
          excerpt: '',
          content: '',
          image: '',
          author: 'Principal\'s Desk'
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_event',
          payload: newEvent
        })
      });
      if (res.ok) {
        setShowEventModal(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: 'academic'
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Staff Login Overlays */}
      {!isAuthenticated ? (
        <section id="admin-login" className="py-24 bg-gray-50 flex items-center justify-center min-h-[70vh]">
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
                />
                <span className="block text-[10px] text-gray-400 mt-1.5 text-center">
                  * Note: Use passcode <strong className="font-bold text-navy-800 font-mono text-xs select-all bg-gray-100 px-1 rounded">admin123</strong> to review this demo dashboard.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-navy-800 hover:bg-navy-950 text-white font-bold py-3.5 rounded-xl shadow transition-colors text-xs"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* Authenticated Dashboard */
        <section id="admin-dashboard" className="py-12 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Dashboard Header */}
            <div className="bg-navy-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-gold-500/30">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block font-mono">
                  Governance Panel
                </span>
                <h1 className="font-serif text-3xl font-black text-white">Matem Staff Dashboard</h1>
                <p className="text-xs text-gray-300 font-light font-sans">
                  Manage Admissions, Publish Blog Bulletins, and Schedule Upcoming School Events.
                </p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={fetchData}
                  className="bg-navy-700/60 hover:bg-navy-700 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Database
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Logout Staff
                </button>
              </div>
            </div>

            {/* Main Tabs switcher */}
            <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl shadow-premium border border-gray-100">
              <button
                onClick={() => setActiveSubTab('inquiries')}
                className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-lg text-xs font-bold transition-all ${
                  activeSubTab === 'inquiries'
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-4.5 w-4.5 mr-2" /> Inquiries & Admissions ({dbData?.inquiries?.length || 0})
              </button>
              <button
                onClick={() => setActiveSubTab('posts')}
                className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-lg text-xs font-bold transition-all ${
                  activeSubTab === 'posts'
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Newspaper className="h-4.5 w-4.5 mr-2" /> Manage School Blog ({dbData?.posts?.length || 0})
              </button>
              <button
                onClick={() => setActiveSubTab('events')}
                className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-lg text-xs font-bold transition-all ${
                  activeSubTab === 'events'
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4.5 w-4.5 mr-2" /> Manage Campus Events ({dbData?.events?.length || 0})
              </button>
            </div>

            {/* Sub Tab Panes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-premium p-6 sm:p-8 min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
                  <p className="text-xs text-gray-400">Loading current records...</p>
                </div>
              ) : (
                <>
                  {/* INQUIRIES PANELS */}
                  {activeSubTab === 'inquiries' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl font-bold text-navy-800">Direct Inquiries Inbox</h2>
                        <span className="text-[10px] font-mono uppercase bg-navy-50 text-navy-600 font-bold px-3 py-1 rounded">
                          Live submissions
                        </span>
                      </div>
                      <div className="overflow-x-auto border border-gray-100 rounded-xl">
                        <table className="w-full text-left text-xs text-gray-600">
                          <thead className="bg-navy-50 text-navy-800 font-serif text-xs font-bold">
                            <tr>
                              <th className="px-6 py-4">Sender Info</th>
                              <th className="px-6 py-4">Arm / Purpose</th>
                              <th className="px-6 py-4">Message / Query Details</th>
                              <th className="px-6 py-4">Current Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {dbData?.inquiries && dbData.inquiries.length > 0 ? (
                              dbData.inquiries.map((inq) => (
                                <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4 space-y-1">
                                    <div className="font-bold text-navy-800 text-sm">{inq.name}</div>
                                    <div className="text-gray-400 font-mono text-[10px]">{inq.email}</div>
                                    <div className="text-gray-500 font-sans font-medium">{inq.phone}</div>
                                  </td>
                                  <td className="px-6 py-4 space-y-1 font-mono uppercase text-[10px]">
                                    <div className="font-bold text-gold-600">{inq.arm.replace('-', ' ')}</div>
                                    <div className="text-gray-500 font-bold">{inq.purpose}</div>
                                    <div className="text-[9px] text-gray-400">{inq.date}</div>
                                  </td>
                                  <td className="px-6 py-4 max-w-xs">
                                    <p className="text-gray-600 line-clamp-3 font-sans leading-relaxed">{inq.message}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-block text-[9px] font-bold font-mono px-2.5 py-1 rounded uppercase tracking-wider ${
                                      inq.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : inq.status === 'contacted'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {inq.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right space-y-2">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1.5 rounded text-[10px] font-bold transition-all"
                                        title="Mark as Contacted"
                                      >
                                        Contacted
                                      </button>
                                      <button
                                        onClick={() => handleUpdateInquiryStatus(inq.id, 'resolved')}
                                        className="bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1.5 rounded text-[10px] font-bold transition-all"
                                        title="Mark as Resolved"
                                      >
                                        Resolved
                                      </button>
                                      <button
                                        onClick={() => handleDeleteInquiry(inq.id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded transition-all"
                                        title="Delete Inquiry"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-400 font-sans">
                                  No parent inquiries received yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* MANAGE POSTS PANELS */}
                  {activeSubTab === 'posts' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl font-bold text-navy-800">School News & Blog List</h2>
                        <button
                          onClick={() => setShowPostModal(true)}
                          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center shadow-sm"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Write Blog Post
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dbData?.posts && dbData.posts.length > 0 ? (
                          dbData.posts.map((post) => (
                            <div key={post.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-gold-100 text-gold-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                                    {post.category}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">{post.date}</span>
                                </div>
                                <h3 className="font-serif font-bold text-base text-navy-800 leading-tight line-clamp-1">{post.title}</h3>
                                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{post.excerpt}</p>
                              </div>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors shrink-0"
                                title="Delete Post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-12 text-gray-400 font-sans">
                            No articles written yet. Publish your first post above.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MANAGE EVENTS PANELS */}
                  {activeSubTab === 'events' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif text-xl font-bold text-navy-800">Scheduled Campus Events</h2>
                        <button
                          onClick={() => setShowEventModal(true)}
                          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center shadow-sm"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Calendar Event
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dbData?.events && dbData.events.length > 0 ? (
                          dbData.events.map((evt) => (
                            <div key={evt.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-gold-100 text-gold-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                                    {evt.category}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">{evt.date} • {evt.time}</span>
                                </div>
                                <h3 className="font-serif font-bold text-base text-navy-800 leading-tight line-clamp-1">{evt.title}</h3>
                                <p className="text-gray-400 text-[10px] font-mono">Location: {evt.location}</p>
                                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{evt.description}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors shrink-0"
                                title="Delete Event"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-12 text-gray-400 font-sans">
                            No events added yet. Schedule your first campus activity.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </>
              )}
            </div>

          </div>
        </section>
      )}

      {/* CREATE BLOG POST MODAL OVERLAY */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-premium border border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-serif font-bold text-xl text-navy-800 flex items-center">
                  <Newspaper className="h-5.5 w-5.5 text-gold-500 mr-2 shrink-0" /> Write School Bulletin Post
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePostSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Article Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="e.g. Matem College Wins Inter-school Debate Cup"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value as BlogPost['category'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    >
                      <option value="School News">School News</option>
                      <option value="Academic Achievements">Academic Achievements</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Notices">Notices</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Author Desk</label>
                    <input
                      type="text"
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    value={newPost.image}
                    onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                    placeholder="Leave empty for beautiful automatic placeholder"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Excerpt / Short Summary <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                    placeholder="Short scannable description shown in lists (max 150 chars)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Article Body Content <span className="text-red-500">*</span></label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={8}
                    placeholder="Type the full body of the article. Use empty lines to structure paragraphs properly."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 resize-none text-xs"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="bg-navy-800 hover:bg-navy-950 text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow flex items-center"
                  >
                    {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin text-gold-400" />}
                    Publish Bulletin Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE EVENT MODAL OVERLAY */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-premium border border-gray-100 max-w-2xl w-full p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-serif font-bold text-xl text-navy-800 flex items-center">
                  <Calendar className="h-5.5 w-5.5 text-gold-500 mr-2 shrink-0" /> Schedule Campus Activity / Event
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Event Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g. 2026 Inter-house Sports Competition"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Event Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as EventItem['category'] })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    >
                      <option value="academic">Academic / PTA</option>
                      <option value="sports">Sports</option>
                      <option value="cultural">Cultural / Arts</option>
                      <option value="other">Other Activity</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Scheduled Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Scheduled Time <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="e.g. 10:00 AM - 02:00 PM"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Location Venue <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="e.g. School Assembly Field / Multi-Purpose Auditorium"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Event Description / Guidelines <span className="text-red-500">*</span></label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={4}
                    placeholder="Short description detailing event purposes, visitor rules, or registration guides."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gold-500 text-gray-800 resize-none text-xs"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="bg-navy-800 hover:bg-navy-950 text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow flex items-center"
                  >
                    {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin text-gold-400" />}
                    Register Campus Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
