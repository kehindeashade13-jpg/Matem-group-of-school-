import fs from 'fs';
import path from 'path';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  arm: 'private-school' | 'college';
  purpose: 'admission' | 'general' | 'complaint' | 'other';
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'School News' | 'Academic Achievements' | 'Announcements' | 'Notices';
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: 'academic' | 'sports' | 'cultural' | 'other';
}

export interface SchoolDatabase {
  inquiries: Inquiry[];
  posts: BlogPost[];
  events: EventItem[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Matem Private School Tops Regional Science Fair',
    category: 'Academic Achievements',
    excerpt: 'Our Primary 5 pupils emerged overall winners in the regional STEM exhibition with their solar energy prototype project.',
    content: `We are thrilled to announce that Matem Private School has clinched the first position at the annual Lagos Regional Primary Science and STEM Exhibition!

Our brilliant Primary 5 representatives—Chidi, Amina, and Tunde—presented an innovative, working prototype of a "Solar-Powered Clean Water Purifier for Rural Communities." The judges praised their deep understanding of renewable energy and their practical problem-solving skills.

At Matem, we believe in hands-on learning. This victory is a testament to the dedication of our excellent teaching staff and the curious minds of our pupils. 

"We wanted to build something that could help villages get clean water using just the sun," said Chidi during his presentation.

Congratulations to the pupils, their parents, and our science coordinator, Mrs. Sarah Alabi! We are incredibly proud of this milestone.`,
    date: '2026-07-10',
    image: 'https://picsum.photos/seed/science/800/600',
    author: 'Admin Office'
  },
  {
    id: '2',
    title: 'Matem College Academic Calendar & Term 3 Resumption Info',
    category: 'Announcements',
    excerpt: 'Welcome back information, uniform standards, and scheduled examinations for the upcoming academic term.',
    content: `As we prepare to welcome back our students to Matem College for the third term of the 2026 academic session, please take note of the following critical dates and information:

1. **Resumption Date:** All JSS and SSS students are expected back on campus on Monday, September 7, 2026, by 7:30 AM.
2. **Dress Code:** Uniform standards will be strictly enforced from day one. Please ensure your child's uniforms, including shoes and school blazers, are in excellent condition.
3. **Materials:** JSS3 and SSS3 students should check their specific preparatory timetables for the upcoming WAEC and NECO mock examinations.

We are excited to begin another term of academic rigor and outstanding extracurricular development. For queries regarding transportation or school meals, kindly contact the registrar's desk.`,
    date: '2026-07-15',
    image: 'https://picsum.photos/seed/school/800/600',
    author: 'Principal\'s Desk'
  },
  {
    id: '3',
    title: 'Introducing the Matem Modern ICT & Robotics Lab',
    category: 'School News',
    excerpt: 'A preview of our newly completed state-of-the-art computational laboratory for both primary and secondary arms.',
    content: `Technology is changing the world, and at Matem, we are making sure our students are leading that change. We are delighted to unveil the brand-new **Matem Modern ICT & Robotics Laboratory**, custom-built to serve both Matem Private School and Matem College.

Equipped with high-performance desktop computers, interactive projectors, and modular robotics kits, this facility will enable:
- Python and Scratch programming classes
- Hands-on robotics, sensor integrations, and drone coding
- Digital design and 3D modeling workshops
- Digital literacy programs for our nursery and primary pupils

Proprietor Mr Ekunwe Martin Nosakhare noted: "This lab is more than just computers. It is an incubator for critical thinking, creativity, and technological leadership."

Practical training classes will commence in the first week of the upcoming term. Stay tuned for photos from the official commissioning ceremony!`,
    date: '2026-07-17',
    image: 'https://picsum.photos/seed/lab/800/600',
    author: 'Proprietor Office'
  }
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: '2026 Matem Sports Day & Inter-House Athletics',
    description: 'An exciting day of track and field events, house marches, and healthy competition at our main sports field.',
    date: '2026-08-22',
    time: '09:00 AM - 03:00 PM',
    location: 'School Main Sports Complex',
    category: 'sports'
  },
  {
    id: 'e2',
    title: 'Matem Schools Annual Cultural Day Celebration',
    description: 'Celebrating the diverse cultural heritage of Nigeria with traditional wear, culinary exhibitions, dance, and music.',
    date: '2026-09-18',
    time: '10:00 AM - 04:00 PM',
    location: 'Auditorium Hall',
    category: 'cultural'
  },
  {
    id: 'e3',
    title: 'Parent-Teacher Association (PTA) General Meeting',
    description: 'A vital collaborative session to discuss curriculum updates, welfare, security, and school expansion projects.',
    date: '2026-10-03',
    time: '12:00 PM - 02:30 PM',
    location: 'Matem College Assembly Hall',
    category: 'academic'
  }
];

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Olumide Johnson',
    email: 'olujohnson@example.com',
    phone: '+234 803 123 4567',
    arm: 'college',
    purpose: 'admission',
    message: 'Hello, I would like to inquire about the JSS1 entrance exam dates and whether registration forms can be picked up physically from the school office or filled online. Thank you.',
    status: 'pending',
    date: '2026-07-16'
  },
  {
    id: 'inq-2',
    name: 'Chioma Obi',
    email: 'chioma.obi@example.com',
    phone: '+234 812 987 6543',
    arm: 'private-school',
    purpose: 'general',
    message: 'Good day, please do you offer school bus services for children residing around Lekki Phase 1? My daughter is entering Primary 2. Thank you!',
    status: 'contacted',
    date: '2026-07-18'
  }
];

export function getDatabase(): SchoolDatabase {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: SchoolDatabase = {
        inquiries: INITIAL_INQUIRIES,
        posts: INITIAL_POSTS,
        events: INITIAL_EVENTS,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }

    const dataStr = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(dataStr) as SchoolDatabase;
  } catch (error) {
    console.error('Error reading school database:', error);
    return {
      inquiries: INITIAL_INQUIRIES,
      posts: INITIAL_POSTS,
      events: INITIAL_EVENTS,
    };
  }
}

export function saveDatabase(db: SchoolDatabase): boolean {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing school database:', error);
    return false;
  }
}
