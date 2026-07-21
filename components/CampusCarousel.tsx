'use client';

// Force Vercel to bypass static cache and query fresh data on every page reload
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CarouselImage {
  id: string;
  image_url: string;
}

export default function CampusCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStorefrontImages = async () => {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('id, image_url')
        .order('created_at', { ascending: true });

      if (!error && data) setImages(data);
      setLoading(false);
    };
    loadStorefrontImages();
  }, []);

  if (loading || images.length === 0) return null;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', height: '400px', overflow: 'hidden' }}>
      <img src={images[currentIndex].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} style={{ position: 'absolute', top: '50%', left: '10px' }}>❮</button>
      <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} style={{ position: 'absolute', top: '50%', right: '10px' }}>❯</button>
    </div>
  );
}
