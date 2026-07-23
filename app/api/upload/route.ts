import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}-${sanitizedFileName}`;

    // Uploads file straight to your public bucket
    const { data, error } = await supabase.storage
      .from('school-media')
      .upload(filename, buffer, {
        contentType: file.type,
        duplex: 'half'
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Grabs the permanent web url for your live link
    const { data: { publicUrl } } = supabase.storage
      .from('school-media')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
