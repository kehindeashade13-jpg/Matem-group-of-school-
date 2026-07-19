import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase, Inquiry, BlogPost, EventItem } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = url && !url.includes("placeholder-project");

  if (isSupabaseConfigured) {
    try {
      // Fetch inquiries, posts, and events from Supabase in parallel
      const [inquiriesRes, postsRes, eventsRes] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('created_at', { ascending: false })
      ]);

      if (inquiriesRes.error) console.error("Error fetching inquiries from Supabase:", inquiriesRes.error);
      if (postsRes.error) console.error("Error fetching posts from Supabase:", postsRes.error);
      if (eventsRes.error) console.error("Error fetching events from Supabase:", eventsRes.error);

      // ONLY extract the raw .data array to prevent any cyclic structure references
      const inquiriesRaw = inquiriesRes.data || [];
      const postsRaw = postsRes.data || [];
      const eventsRaw = eventsRes.data || [];

      // Thoroughly sanitize down to primitive properties
      const sanitizedInquiries = inquiriesRaw.map((item: any) => ({
        id: String(item.id || ''),
        name: String(item.name || ''),
        email: String(item.email || ''),
        phone: String(item.phone || ''),
        arm: item.arm || 'private-school',
        purpose: item.purpose || 'admission',
        message: String(item.message || ''),
        status: item.status || 'pending',
        date: String(item.date || ''),
      }));

      const sanitizedPosts = postsRaw.map((item: any) => ({
        id: String(item.id || ''),
        title: String(item.title || ''),
        category: item.category || 'School News',
        excerpt: String(item.excerpt || ''),
        content: String(item.content || ''),
        date: String(item.date || ''),
        image: String(item.image || ''),
        author: String(item.author || ''),
      }));

      const sanitizedEvents = eventsRaw.map((item: any) => ({
        id: String(item.id || ''),
        title: String(item.title || ''),
        description: String(item.description || ''),
        date: String(item.date || ''),
        time: String(item.time || ''),
        location: String(item.location || ''),
        category: item.category || 'academic',
      }));

      const db = getDatabase();
      return NextResponse.json({
        inquiries: sanitizedInquiries,
        posts: sanitizedPosts,
        events: sanitizedEvents,
        carousel: db.carousel
      });
    } catch (err) {
      console.error("Supabase API error in GET /api/db:", err);
      // Fallback to local DB on failure
      const db = getDatabase();
      return NextResponse.json(db);
    }
  }

  const db = getDatabase();
  return NextResponse.json(db);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required.' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = url && !url.includes("placeholder-project");

    switch (action) {
      case 'submit_inquiry': {
        const { name, email, phone, arm, purpose, message } = payload;
        if (!name || !email || !phone || !message) {
          return NextResponse.json({ error: 'Missing required inquiry fields.' }, { status: 400 });
        }
        
        const newInquiry: Omit<Inquiry, 'id'> = {
          name,
          email,
          phone,
          arm: (arm === 'college' ? 'college' : 'private-school') as Inquiry['arm'],
          purpose: (purpose || 'admission') as Inquiry['purpose'],
          message,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
        };

        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('inquiries')
            .insert([newInquiry])
            .select();

          if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          // Return ONLY the serializable record, never the cyclic response metadata
          return NextResponse.json({ 
            success: true, 
            inquiry: data && data.length > 0 ? {
              id: String(data[0].id || ''),
              name: String(data[0].name || ''),
              email: String(data[0].email || ''),
              phone: String(data[0].phone || ''),
              arm: data[0].arm || 'private-school',
              purpose: data[0].purpose || 'admission',
              message: String(data[0].message || ''),
              status: data[0].status || 'pending',
              date: String(data[0].date || ''),
            } : newInquiry 
          });
        } else {
          const db = getDatabase();
          const localInquiry: Inquiry = {
            id: `inq-${Date.now()}`,
            ...newInquiry
          };
          db.inquiries.unshift(localInquiry);
          saveDatabase(db);
          return NextResponse.json({ success: true, inquiry: localInquiry });
        }
      }

      case 'update_inquiry_status': {
        const { id, status } = payload;
        if (!id || !status) {
          return NextResponse.json({ error: 'Missing inquiry id or status.' }, { status: 400 });
        }

        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', id)
            .select();

          if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ 
            success: true, 
            inquiry: data && data.length > 0 ? {
              id: String(data[0].id || ''),
              name: String(data[0].name || ''),
              email: String(data[0].email || ''),
              phone: String(data[0].phone || ''),
              arm: data[0].arm || 'private-school',
              purpose: data[0].purpose || 'admission',
              message: String(data[0].message || ''),
              status: data[0].status || 'pending',
              date: String(data[0].date || ''),
            } : null 
          });
        } else {
          const db = getDatabase();
          const inq = db.inquiries.find(i => i.id === id);
          if (!inq) {
            return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
          }
          inq.status = status;
          saveDatabase(db);
          return NextResponse.json({ success: true, inquiry: inq });
        }
      }

      case 'delete_inquiry': {
        const { id } = payload;
        if (!id) {
          return NextResponse.json({ error: 'Missing inquiry id.' }, { status: 400 });
        }

        if (isSupabaseConfigured) {
          const { error } = await supabase
            .from('inquiries')
            .delete()
            .eq('id', id);

          if (error) {
            console.error("Supabase delete error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ success: true });
        } else {
          const db = getDatabase();
          db.inquiries = db.inquiries.filter(i => i.id !== id);
          saveDatabase(db);
          return NextResponse.json({ success: true });
        }
      }

      case 'create_post': {
        const { title, category, excerpt, content, image, author } = payload;
        if (!title || !category || !excerpt || !content) {
          return NextResponse.json({ error: 'Missing required blog fields.' }, { status: 400 });
        }

        const newPost: Omit<BlogPost, 'id'> = {
          title,
          category: (category || 'School News') as BlogPost['category'],
          excerpt,
          content,
          date: new Date().toISOString().split('T')[0],
          image: image || `https://picsum.photos/seed/${Date.now()}/800/600`,
          author: author || 'Admin Office',
        };

        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('posts')
            .insert([newPost])
            .select();

          if (error) {
            console.error("Supabase post insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ 
            success: true, 
            post: data && data.length > 0 ? {
              id: String(data[0].id || ''),
              title: String(data[0].title || ''),
              category: data[0].category || 'School News',
              excerpt: String(data[0].excerpt || ''),
              content: String(data[0].content || ''),
              date: String(data[0].date || ''),
              image: String(data[0].image || ''),
              author: String(data[0].author || ''),
            } : newPost 
          });
        } else {
          const db = getDatabase();
          const localPost: BlogPost = {
            id: `post-${Date.now()}`,
            ...newPost
          };
          db.posts.unshift(localPost);
          saveDatabase(db);
          return NextResponse.json({ success: true, post: localPost });
        }
      }

      case 'delete_post': {
        const { id } = payload;
        if (!id) {
          return NextResponse.json({ error: 'Missing post id.' }, { status: 400 });
        }

        if (isSupabaseConfigured) {
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

          if (error) {
            console.error("Supabase post delete error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ success: true });
        } else {
          const db = getDatabase();
          db.posts = db.posts.filter(p => p.id !== id);
          saveDatabase(db);
          return NextResponse.json({ success: true });
        }
      }

      case 'create_event': {
        const { title, description, date, time, location, category } = payload;
        if (!title || !description || !date || !time || !location) {
          return NextResponse.json({ error: 'Missing required event fields.' }, { status: 400 });
        }

        const newEvent: Omit<EventItem, 'id'> = {
          title,
          description,
          date,
          time,
          location,
          category: (category || 'academic') as EventItem['category'],
        };

        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('events')
            .insert([newEvent])
            .select();

          if (error) {
            console.error("Supabase event insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ 
            success: true, 
            event: data && data.length > 0 ? {
              id: String(data[0].id || ''),
              title: String(data[0].title || ''),
              description: String(data[0].description || ''),
              date: String(data[0].date || ''),
              time: String(data[0].time || ''),
              location: String(data[0].location || ''),
              category: data[0].category || 'academic',
            } : newEvent 
          });
        } else {
          const db = getDatabase();
          const localEvent: EventItem = {
            id: `evt-${Date.now()}`,
            ...newEvent
          };
          db.events.unshift(localEvent);
          db.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          saveDatabase(db);
          return NextResponse.json({ success: true, event: localEvent });
        }
      }

      case 'delete_event': {
        const { id } = payload;
        if (!id) {
          return NextResponse.json({ error: 'Missing event id.' }, { status: 400 });
        }

        if (isSupabaseConfigured) {
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

          if (error) {
            console.error("Supabase event delete error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ success: true });
        } else {
          const db = getDatabase();
          db.events = db.events.filter(e => e.id !== id);
          saveDatabase(db);
          return NextResponse.json({ success: true });
        }
      }

      case 'update_carousel': {
        const { images, intervalSeconds } = payload;
        if (!images || !Array.isArray(images)) {
          return NextResponse.json({ error: 'Missing or invalid images array.' }, { status: 400 });
        }

        const db = getDatabase();
        db.carousel = {
          images,
          intervalSeconds: Number(intervalSeconds) || 5
        };
        saveDatabase(db);
        return NextResponse.json({ success: true, carousel: db.carousel });
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
