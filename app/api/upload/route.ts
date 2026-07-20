import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or invalid file format' }, { status: 400 });
    }

    // Prepare clean unique file name
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedFileName}`;

    // Read arrayBuffer ONCE at the start to prevent stream-already-read errors on fallback
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = url && !url.includes("placeholder-project");

    if (isSupabaseConfigured) {
      try {
        // Try to list buckets to verify connectivity and bucket existence
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) {
          console.warn('Failed to list Supabase buckets:', bucketsError);
        } else {
          const bucketExists = buckets?.some(b => b.name === 'school-media');
          if (!bucketExists) {
            console.log('Bucket "school-media" not found. Attempting to create it...');
            const { error: createError } = await supabase.storage.createBucket('school-media', {
              public: true,
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
            });
            if (createError) {
              console.warn('Failed to auto-create "school-media" bucket:', createError);
            } else {
              console.log('Successfully created "school-media" bucket!');
            }
          }
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('school-media')
          .upload(`carousel/${filename}`, buffer, {
            contentType: file.type,
            duplex: 'half'
          });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('school-media').getPublicUrl(data.path);
          if (urlData?.publicUrl) {
            return NextResponse.json({ url: urlData.publicUrl });
          }
        }
        console.warn('Supabase storage upload failed or returned no public url. Falling back to local storage...', error);
      } catch (supabaseErr) {
        console.error('Supabase upload exception. Falling back to local storage...', supabaseErr);
      }
    }

    // Fallback: Save locally to /public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`
    });

  } catch (err: any) {
    console.error('API Upload error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process file' }, { status: 500 });
  }
}
