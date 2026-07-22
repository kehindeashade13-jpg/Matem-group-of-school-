'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CampusCarousel from '@/components/CampusCarousel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, Calendar, User, ArrowRight, X, 
  ArrowLeft, Search, Bookmark, Tag, Share2 
} from 'lucide-react';
import { BlogPost } from '@/lib/db';
import Image from 'next/image';

export default function NewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [academicAchievementImages, setAcademicAchievementImages] = useState<string[]>([]);
  const [academicAchievementInterval, setAcademicAchievementInterval] = useState(5);

  useEffect(() => {
    const fetchPostsAndCarousels = async () => {
      try {
        const response = await fetch(`/api/db?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          setPosts(data.posts || []);

          if (data.carouselAcademicAchievement && data.carouselAcademicAchievement.images?.length > 0) {
            setAcademicAchievementImages(data.carouselAcademicAchievement.images);
            setAcademicAchievementInterval(data.carouselAcademicAchievement.intervalSeconds || 5);
          }

          // Check if there is an id in the URL to open directly
          const searchParams = new URLSearchParams(window.location.search);
          const postId = searchParams.get('id');
          if (postId && data.posts) {
            const found = data.posts.find((p: BlogPost) => p.id === postId);
            if (found) setSelectedPost(found);
          }
        }
      } catch (error) {
        console.error('Error fetching blog posts and carousels:', error);
      }
    };
    fetchPostsAndCarousels();
  }, []);

  const categories = ['All', 'School News', 'Academic Achievements', 'Announcements', 'Notices'];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0] || null;

  return (
    <>
      <Navbar />

      {/* Banner */}
      <section id="news-banner" className="bg-navy-800 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <Newspaper className="w-[400px] h-[400px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-widest font-mono">
            Latest Bulletins
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight">
            News, Blog & Announcements
          </h1>
          <p className="max-w-xl mx-auto text-sm text-gray-300 font-sans font-light">
            Stay updated with school projects, achievements, termly continuous assessment rules, and board announcements.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section id="news-container" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Search & Category Filter Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-gold-500 text-xs text-gray-800"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-navy-800 text-white border-navy-800 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200/50 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Category-Specific Dynamic Carousel Sliders */}
          {activeCategory === 'Academic Achievements' && academicAchievementImages.length > 0 && (
            <div className="space-y-3 animate-fadeIn">
              <h3 className="text-sm font-bold text-navy-800 font-serif flex items-center">
                <span className="w-2 h-2 rounded-full bg-gold-500 mr-2 inline-block animate-pulse" />
                Active Academic Achievements Spotlight
              </h3>
              <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-premium">
                <CampusCarousel
                  images={academicAchievementImages}
                  intervalSeconds={academicAchievementInterval}
                  altText="Academic Spotlight"
                  aspectRatio="h-full w-full"
                />
              </div>
            </div>
          )}

          {/* Featured Post (only shown when No search/filter active) */}
          {activeCategory === 'All' && searchQuery === '' && featuredPost && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-premium border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-0 group">
              <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[300px] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-101 transition-transform duration-500"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gold-100 text-gold-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{featuredPost.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-navy-800 group-hover:text-gold-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans font-light">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPost(featuredPost)}
                  className="inline-flex items-center text-xs font-bold text-navy-800 hover:text-gold-500 transition-colors w-max"
                >
                  Read Featured Article <ArrowRight className="ml-1.5 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Grid of articles */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-navy-800">
              {searchQuery || activeCategory !== 'All' ? 'Search Results' : 'Recent Bulletins'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-premium transition-all duration-300 group flex flex-col justify-between">
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
                        <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed font-sans">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="inline-flex items-center text-xs font-bold text-navy-800 hover:text-gold-500 transition-colors"
                      >
                        Read Article <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white border border-gray-100 rounded-2xl space-y-3">
                  <p className="text-gray-400 text-sm">No school bulletins found matching your query.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="text-xs font-bold text-navy-800 hover:text-gold-500 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Full Article Reader Template Overlay */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/80 z-50 flex justify-end"
          >
            {/* Backdrop close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedPost(null)} />

            {/* Slide-over Reader Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-3xl bg-white h-screen overflow-y-auto shadow-2xl z-10 flex flex-col justify-between"
            >
              <div>
                {/* Header controls */}
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-navy-800 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bulletins
                  </button>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close reader"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Cover Image */}
                <div className="relative h-64 sm:h-80 w-full">
                  <Image
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="bg-gold-500 text-navy-950 text-[10px] font-mono font-bold px-3 py-1 rounded uppercase tracking-wider">
                      {selectedPost.category}
                    </span>
                    <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>

                {/* Article Info & Body */}
                <div className="px-6 sm:px-10 py-8 space-y-6">
                  {/* Meta tags */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono border-b border-gray-100 pb-4">
                    <span className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-gold-500" /> {selectedPost.date}</span>
                    <span className="flex items-center"><User className="mr-2 h-4 w-4 text-gold-500" /> By {selectedPost.author}</span>
                  </div>

                  {/* Body Content */}
                  <div className="text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4 font-sans font-light whitespace-pre-line">
                    {selectedPost.content}
                  </div>
                </div>
              </div>

              {/* Reader Footer */}
              <div className="bg-gray-50 px-6 sm:px-10 py-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans font-medium">
                <span className="flex items-center"><Bookmark className="h-4 w-4 mr-1.5 text-gold-500" /> Matem School Bulletin Office</span>
                <span className="flex items-center"><Tag className="h-4 w-4 mr-1.5 text-gold-500" /> {selectedPost.category}</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
