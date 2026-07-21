'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CarouselImage {
  id: string;
  image_url: string;
  storage_path: string;
}

export default function AdminCarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('carousel_images')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    else setImages(data || []);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `carousel-uploads/${fileName}`;

      // CHANGED: Pushing files to 'school-media' bucket instead of 'carousel'
      const { error: uploadError } = await supabase.storage
        .from('school-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('carousel_images')
        .insert([{ image_url: publicUrl, storage_path: filePath }]);

      if (dbError) throw dbError;

      fetchImages();
      alert('Success!');
    } catch (error) {
      console.error(error);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm('Delete image?')) return;
    try {
      // CHANGED: Removing from 'school-media' bucket
      await supabase.storage.from('school-media').remove([storagePath]);
      await supabase.from('carousel_images').delete().eq('id', id);
      setImages(images.filter((img) => img.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Storefront Carousel Manager</h1>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
            <img src={img.image_url} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <button onClick={() => handleDelete(img.id, img.storage_path)} style={{ backgroundColor: '#ff4d4d', color: '#fff', width: '100%', marginTop: '0.5rem', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
