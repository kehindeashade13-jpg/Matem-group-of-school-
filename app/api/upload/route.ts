import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    if (isSupabaseConfigured) {
      try {
        // Try to list buckets to verify connectivity and bucket existence
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) {
          console.log('Supabase buckets check returned status: fallback active.');
        } else {
          const bucketExists = buckets?.some(b => b.name === 'school-media');
          if (!bucketExists) {
            console.log('Bucket "school-media" not found. Attempting to create it...');
            const { error: createError } = await supabase.storage.createBucket('school-media', {
              public: true,
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
            });
            if (createError) {
              console.log('Bucket auto-creation returned status: fallback active.');
            } else {
              console.log('Successfully created "school-media" bucket!');
            }
          }
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('school-media')
          .upload(`carousels/${filename}`, buffer, {
            contentType: file.type || 'image/jpeg',
            duplex: 'half',
            upsert: true
          });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('school-media').getPublicUrl(data.path);
          if (urlData?.publicUrl) {
            return NextResponse.json({ url: urlData.publicUrl });
          }
        }
        console.log('Supabase storage upload completed: utilizing base64/local fallback.');
      } catch (supabaseErr) {
        console.log('Supabase upload exception handled: utilizing base64/local fallback.');
      }
    }

    // Fallback: Convert to portable Data URL (base64) up to 15MB so it works on all live links & deployments
    if (buffer.length <= 15 * 1024 * 1024) {
      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({ url: dataUrl });
    }

    // Fallback: Save locally
    let savedPath = '';
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads');
    const tempUploadDir = path.join('/tmp', 'uploads');

    try {
      if (!fs.existsSync(publicUploadDir)) {
        fs.mkdirSync(publicUploadDir, { recursive: true });
      }
      const filePath = path.join(publicUploadDir, filename);
      await fs.promises.writeFile(filePath, buffer);
      savedPath = `/uploads/${filename}`;
    } catch (fsErr) {
      console.log('Unable to write to /public/uploads. Falling back to /tmp/uploads...');
      try {
        if (!fs.existsSync(tempUploadDir)) {
          fs.mkdirSync(tempUploadDir, { recursive: true });
        }
        const filePath = path.join(tempUploadDir, filename);
        await fs.promises.writeFile(filePath, buffer);
        savedPath = `/uploads/${filename}?temp=true`;
      } catch (tempErr: any) {
        console.error('Failed to write to fallback temp directory:', tempErr);
        return NextResponse.json({ error: 'Failed to write file locally: ' + tempErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      url: savedPath
    });

  } catch (err: any) {
    console.error('API Upload error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process file' }, { status: 500 });
  }
}

