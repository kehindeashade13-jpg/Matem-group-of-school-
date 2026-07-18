import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase, Inquiry, BlogPost, EventItem } from '@/lib/db';

export async function GET() {
  const db = getDatabase();
  return NextResponse.json(db);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required.' }, { status: 400 });
    }

    switch (action) {
      case 'submit_inquiry': {
        const { name, email, phone, arm, purpose, message } = payload;
        if (!name || !email || !phone || !message) {
          return NextResponse.json({ error: 'Missing required inquiry fields.' }, { status: 400 });
        }
        const newInquiry: Inquiry = {
          id: `inq-${Date.now()}`,
          name,
          email,
          phone,
          arm: arm || 'private-school',
          purpose: purpose || 'general',
          message,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
        };
        db.inquiries.unshift(newInquiry);
        saveDatabase(db);
        return NextResponse.json({ success: true, inquiry: newInquiry });
      }

      case 'update_inquiry_status': {
        const { id, status } = payload;
        if (!id || !status) {
          return NextResponse.json({ error: 'Missing inquiry id or status.' }, { status: 400 });
        }
        const inq = db.inquiries.find(i => i.id === id);
        if (!inq) {
          return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
        }
        inq.status = status;
        saveDatabase(db);
        return NextResponse.json({ success: true, inquiry: inq });
      }

      case 'delete_inquiry': {
        const { id } = payload;
        if (!id) {
          return NextResponse.json({ error: 'Missing inquiry id.' }, { status: 400 });
        }
        db.inquiries = db.inquiries.filter(i => i.id !== id);
        saveDatabase(db);
        return NextResponse.json({ success: true });
      }

      case 'create_post': {
        const { title, category, excerpt, content, image, author } = payload;
        if (!title || !category || !excerpt || !content) {
          return NextResponse.json({ error: 'Missing required blog fields.' }, { status: 400 });
        }
        const newPost: BlogPost = {
          id: `post-${Date.now()}`,
          title,
          category,
          excerpt,
          content,
          date: new Date().toISOString().split('T')[0],
          image: image || `https://picsum.photos/seed/${Date.now()}/800/600`,
          author: author || 'Admin Office',
        };
        db.posts.unshift(newPost);
        saveDatabase(db);
        return NextResponse.json({ success: true, post: newPost });
      }

      case 'delete_post': {
        const { id } = payload;
        if (!id) {
          return NextResponse.json({ error: 'Missing post id.' }, { status: 400 });
        }
        db.posts = db.posts.filter(p => p.id !== id);
        saveDatabase(db);
        return NextResponse.json({ success: true });
      }

      case 'create_event': {
        const { title, description, date, time, location, category } = payload;
        if (!title || !description || !date || !time || !location) {
          return NextResponse.json({ error: 'Missing required event fields.' }, { status: 400 });
        }
        const newEvent: EventItem = {
          id: `evt-${Date.now()}`,
          title,
          description,
          date,
          time,
          location,
          category: category || 'academic',
        };
        db.events.unshift(newEvent);
        // Sort events by date ascending/descending
        db.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        saveDatabase(db);
        return NextResponse.json({ success: true, event: newEvent });
      }

      case 'delete_event': {
        const { id } = payload;
        if (!id) {
          return NextResponse.json({ error: 'Missing event id.' }, { status: 400 });
        }
        db.events = db.events.filter(e => e.id !== id);
        saveDatabase(db);
        return NextResponse.json({ success: true });
      }

      default: {
        return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
      }
    }
  } catch (error: any) {
    console.error('API database handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
