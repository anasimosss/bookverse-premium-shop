// BookVerse domain models and curated catalog data.
export type Genre =
  | "Fiction"
  | "Business"
  | "Technology"
  | "Children's"
  | "History"
  | "Philosophy"
  | "Science"
  | "Art & Design"
  | "Poetry"
  | "Self-Improvement"
  | "Ethiopian & African Literature";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  pages: number;
  isbn: string;
  publisher: string;
  year: number;
  language: string;
  synopsis: string;
  coverFrom: string;
  coverTo: string;
  bestseller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Review {
  id: string;
  bookId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  coverFrom: string;
  coverTo: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  reference: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: "Demo Simulated" | "Processing" | "Confirmed" | "Shipped" | "Delivered";
  city: string;
  address: string;
  customerName: string;
  phone: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

export type PaymentMethod = "Telebirr" | "Chapa" | "CBE Birr / Bank Transfer";
export type ViewMode = "home" | "catalog" | "book" | "account";
export type SortKey = "popular" | "price-asc" | "price-desc" | "rating" | "newest";

export const IMG = {
  hero: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/812e274e-6299-452e-976f-0dff9cd9b0e9/hero-library-feb9cef4-1791273254102.webp",
  stack:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/812e274e-6299-452e-976f-0dff9cd9b0e9/spotlight-stack-d34b57c2-1791273254305.webp",
  ethiopian:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/812e274e-6299-452e-976f-0dff9cd9b0e9/ethiopian-literature-262dc279-1791273254587.webp",
  nook:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/812e274e-6299-452e-976f-0dff9cd9b0e9/reading-nook-fc7dd54c-1791273255301.webp",
  promo:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/812e274e-6299-452e-976f-0dff9cd9b0e9/promo-texture-260a9eed-1791273255225.webp",
  shelf:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/812e274e-6299-452e-976f-0dff9cd9b0e9/genre-shelf-a8af7298-1791273257735.webp",
};

export const BOOKS: Book[] = [
  {
    id: "oromay",
    title: "Oromay",
    author: "Bealu Girma",
    genre: "Ethiopian & African Literature",
    price: 450,
    rating: 4.8,
    reviewsCount: 412,
    pages: 384,
    isbn: "978-99944-0-112-3",
    publisher: "Addis Ababa University Press",
    year: 1982,
    language: "Amharic",
    synopsis:
      "A landmark Ethiopian novel set during the upheaval of the Derg years, following a journalist whose ambition collides with a regime that rewrites every truth. Bealu Girma's prose is spare, urgent and quietly devastating.",
    coverFrom: "#7a1f1f",
    coverTo: "#3d0f0f",
    bestseller: true,
  },
  {
    id: "shadow-king",
    title: "The Shadow King",
    author: "Maaza Mengiste",
    genre: "Ethiopian & African Literature",
    price: 780,
    rating: 4.7,
    reviewsCount: 1240,
    pages: 448,
    isbn: "978-1-78689-356-2",
    publisher: "Canongate Books",
    year: 2019,
    language: "English",
    synopsis:
      "As Mussolini's army advances on Ethiopia in 1935, a young woman takes up arms and a nation of women answers the call. A lyrical, cinematic reclamation of a history that was written without them.",
    coverFrom: "#172033",
    coverTo: "#070b14",
    featured: true,
    bestseller: true,
  },
  {
    id: "lion-gaze",
    title: "Beneath the Lion's Gaze",
    author: "Maaza Mengiste",
    genre: "Ethiopian & African Literature",
    price: 720,
    rating: 4.6,
    reviewsCount: 356,
    pages: 320,
    isbn: "978-0-393-33834-2",
    publisher: "W. W. Norton & Company",
    year: 2010,
    language: "English",
    synopsis:
      "An Addis Ababa family is torn apart by revolution as a father's hospital becomes a refuge and a son disappears into the resistance. An intimate portrait of loyalty under fire.",
    coverFrom: "#6b3410",
    coverTo: "#2e1607",
  },
  {
    id: "things-fall-apart",
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    genre: "Ethiopian & African Literature",
    price: 590,
    rating: 4.8,
    reviewsCount: 2100,
    pages: 209,
    isbn: "978-0-385-47454-2",
    publisher: "Heinemann",
    year: 1958,
    language: "English",
    synopsis:
      "Okonkwo builds a life on strength and reputation in the Igbo village of Umuofia, until colonial missionaries and a changing world unravel everything. The novel that redefined African literature.",
    coverFrom: "#7c4a1e",
    coverTo: "#33200c",
    bestseller: true,
  },
  {
    id: "cutting-stone",
    title: "Cutting for Stone",
    author: "Abraham Verghese",
    genre: "Fiction",
    price: 850,
    rating: 4.7,
    reviewsCount: 980,
    pages: 688,
    isbn: "978-0-375-71236-8",
    publisher: "Alfred A. Knopf",
    year: 2009,
    language: "English",
    synopsis:
      "Twin brothers are born in a mission hospital in Addis Ababa and bound together by medicine, betrayal and a mother they never knew. A sweeping, tender epic of Ethiopia and beyond.",
    coverFrom: "#1f4a44",
    coverTo: "#0b1f1c",
    bestseller: true,
  },
  {
    id: "educated",
    title: "Educated",
    author: "Tara Westover",
    genre: "Fiction",
    price: 720,
    rating: 4.7,
    reviewsCount: 1560,
    pages: 352,
    isbn: "978-0-09-951150-4",
    publisher: "Random House",
    year: 2018,
    language: "English",
    synopsis:
      "Raised in an isolated mountain household, a young woman teaches herself enough to reach Cambridge, then has to decide what family means. A memoir of self-invention at any cost.",
    coverFrom: "#3a3a5a",
    coverTo: "#14141f",
    bestseller: true,
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Improvement",
    price: 640,
    originalPrice: 780,
    rating: 4.9,
    reviewsCount: 3200,
    pages: 320,
    isbn: "978-0-7352-1129-2",
    publisher: "Avery",
    year: 2018,
    language: "English",
    synopsis:
      "A practical framework for building good habits and dismantling bad ones through tiny, compounding changes. Clear turns behaviour science into daily, repeatable systems.",
    coverFrom: "#8a6a1f",
    coverTo: "#3a2c0a",
    bestseller: true,
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Business",
    price: 680,
    rating: 4.6,
    reviewsCount: 890,
    pages: 296,
    isbn: "978-1-4555-8669-1",
    publisher: "Grand Central Publishing",
    year: 2016,
    language: "English",
    synopsis:
      "The ability to focus without distraction is becoming rare and therefore valuable. Newport argues it is a skill to be trained, not a talent to be wished for.",
    coverFrom: "#24324a",
    coverTo: "#0d1420",
    bestseller: true,
  },
  {
    id: "zero-one",
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Business",
    price: 620,
    rating: 4.5,
    reviewsCount: 720,
    pages: 224,
    isbn: "978-0-8041-3929-8",
    publisher: "Crown Business",
    year: 2014,
    language: "English",
    synopsis:
      "Notes on startups, or how to build the future. Thiel argues that competition destroys profit and that the best companies create a category of one.",
    coverFrom: "#2b2b2b",
    coverTo: "#0a0a0a",
  },
  {
    id: "lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    genre: "Business",
    price: 700,
    rating: 4.5,
    reviewsCount: 640,
    pages: 336,
    isbn: "978-0-307-88789-4",
    publisher: "Crown Business",
    year: 2011,
    language: "English",
    synopsis:
      "How today's entrepreneurs build continuous innovation. A method of validated learning, rapid experiment and course correction before the money runs out.",
    coverFrom: "#1d4e6b",
    coverTo: "#08212e",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Technology",
    price: 950,
    rating: 4.6,
    reviewsCount: 1100,
    pages: 464,
    isbn: "978-0-13-235088-4",
    publisher: "Prentice Hall",
    year: 2008,
    language: "English",
    synopsis:
      "A handbook of agile software craftsmanship, packed with case studies on naming, functions, tests and refactoring. Writing code that other humans can read is the real work.",
    coverFrom: "#2f4a2f",
    coverTo: "#11200f",
  },
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    genre: "Technology",
    price: 1180,
    rating: 4.9,
    reviewsCount: 860,
    pages: 616,
    isbn: "978-1-4493-7332-0",
    publisher: "O'Reilly Media",
    year: 2017,
    language: "English",
    synopsis:
      "The definitive guide to the trade-offs behind reliable, scalable and maintainable systems. Storage engines, replication, partitioning and distributed consensus, explained with clarity.",
    coverFrom: "#3b2a52",
    coverTo: "#150f22",
    newArrival: true,
  },
  {
    id: "pragmatic",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    genre: "Technology",
    price: 890,
    rating: 4.8,
    reviewsCount: 940,
    pages: 352,
    isbn: "978-0-13-595705-9",
    publisher: "Addison-Wesley",
    year: 1999,
    language: "English",
    synopsis:
      "From journeyman to master, a distillation of timeless advice on craft, career and design. Still the most quoted book on any engineering team's shelf.",
    coverFrom: "#5a2f2f",
    coverTo: "#210f0f",
  },
  {
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "History",
    price: 860,
    rating: 4.7,
    reviewsCount: 2400,
    pages: 498,
    isbn: "978-0-06-231609-7",
    publisher: "Harper",
    year: 2011,
    language: "English",
    synopsis:
      "A brief history of humankind, from foraging bands to shared myths of money, nations and gods. Harari asks how one species came to rule the planet.",
    coverFrom: "#6b5433",
    coverTo: "#2a2013",
    bestseller: true,
  },
  {
    id: "silk-roads",
    title: "The Silk Roads",
    author: "Peter Frankopan",
    genre: "History",
    price: 820,
    rating: 4.5,
    reviewsCount: 540,
    pages: 656,
    isbn: "978-1-101-91297-6",
    publisher: "Bloomsbury",
    year: 2015,
    language: "English",
    synopsis:
      "A new history of the world told from the East, where the great trading routes carried silk, silver and ideas. A corrective to centuries of Eurocentric storytelling.",
    coverFrom: "#4a3b22",
    coverTo: "#1c1508",
    newArrival: true,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    genre: "Philosophy",
    price: 540,
    rating: 4.8,
    reviewsCount: 1700,
    pages: 254,
    isbn: "978-0-14-044933-4",
    publisher: "Penguin Classics",
    year: 180,
    language: "English",
    synopsis:
      "The private notebook of a Roman emperor written to himself in the field. Stoic discipline, quiet duty and the practice of keeping perspective when power is loud.",
    coverFrom: "#2a323a",
    coverTo: "#0d1116",
    bestseller: true,
  },
  {
    id: "republic",
    title: "The Republic",
    author: "Plato",
    genre: "Philosophy",
    price: 560,
    rating: 4.6,
    reviewsCount: 980,
    pages: 416,
    isbn: "978-0-14-045511-3",
    publisher: "Penguin Classics",
    year: -380,
    language: "English",
    synopsis:
      "Justice, the ideal city and the allegory of the cave. Plato's dialogue remains the founding text of Western political thought, and the first great argument about education.",
    coverFrom: "#3d3a5c",
    coverTo: "#151327",
  },
  {
    id: "cosmos",
    title: "Cosmos",
    author: "Carl Sagan",
    genre: "Science",
    price: 780,
    rating: 4.8,
    reviewsCount: 1300,
    pages: 396,
    isbn: "978-0-345-53943-2",
    publisher: "Random House",
    year: 1980,
    language: "English",
    synopsis:
      "A journey across fourteen billion years of cosmic evolution, told with wonder and rigour. Sagan's masterpiece on where we came from and how to keep asking.",
    coverFrom: "#14263f",
    coverTo: "#050b16",
  },
  {
    id: "thinking-fast",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Science",
    price: 740,
    rating: 4.6,
    reviewsCount: 1650,
    pages: 499,
    isbn: "978-0-374-53355-7",
    publisher: "Farrar, Straus and Giroux",
    year: 2011,
    language: "English",
    synopsis:
      "Two systems drive how we judge, decide and regret. A Nobel laureate maps the biases baked into intuition and the discipline required to outsmart them.",
    coverFrom: "#35354a",
    coverTo: "#101018",
  },
  {
    id: "design-everyday",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    genre: "Art & Design",
    price: 760,
    rating: 4.7,
    reviewsCount: 1120,
    pages: 368,
    isbn: "978-0-465-05065-9",
    publisher: "Basic Books",
    year: 1988,
    language: "English",
    synopsis:
      "The classic on why good design feels invisible and bad design feels like your fault. Affordances, signifiers and the psychology of the objects we live with.",
    coverFrom: "#7a3520",
    coverTo: "#2c1208",
  },
  {
    id: "ways-seeing",
    title: "Ways of Seeing",
    author: "John Berger",
    genre: "Art & Design",
    price: 520,
    rating: 4.6,
    reviewsCount: 700,
    pages: 176,
    isbn: "978-0-14-013515-2",
    publisher: "Penguin",
    year: 1972,
    language: "English",
    synopsis:
      "Seven essays on how images carry meaning, power and desire. Berger changes the way you look at paintings, advertising and everything in between.",
    coverFrom: "#1f3f52",
    coverTo: "#081824",
    newArrival: true,
  },
  {
    id: "leaves-grass",
    title: "Leaves of Grass",
    author: "Walt Whitman",
    genre: "Poetry",
    price: 480,
    rating: 4.5,
    reviewsCount: 430,
    pages: 145,
    isbn: "978-0-14-042359-4",
    publisher: "Penguin Classics",
    year: 1855,
    language: "English",
    synopsis:
      "Whitman celebrates the body, the republic and the self in free verse that still sounds like a declaration. A book he revised for the rest of his life.",
    coverFrom: "#2f4a33",
    coverTo: "#0f1c12",
  },
  {
    id: "the-prophet",
    title: "The Prophet",
    author: "Kahlil Gibran",
    genre: "Poetry",
    price: 460,
    rating: 4.8,
    reviewsCount: 1500,
    pages: 107,
    isbn: "978-0-394-40428-8",
    publisher: "Alfred A. Knopf",
    year: 1923,
    language: "English",
    synopsis:
      "A prophet departing a city answers questions on love, work, freedom and death in luminous parables. Twenty-six poetic essays that have never stopped selling.",
    coverFrom: "#5c3270",
    coverTo: "#1f1028",
  },
  {
    id: "wild-things",
    title: "Where the Wild Things Are",
    author: "Maurice Sendak",
    genre: "Children's",
    price: 380,
    rating: 4.9,
    reviewsCount: 2600,
    pages: 48,
    isbn: "978-0-06-025492-6",
    publisher: "Harper & Row",
    year: 1963,
    language: "English",
    synopsis:
      "Max sails off to a land of wild things and is crowned their king, before the smell of supper calls him home. A picture book about big feelings and small beds.",
    coverFrom: "#2f5c58",
    coverTo: "#0f2422",
    newArrival: true,
  },
  {
    id: "matilda",
    title: "Matilda",
    author: "Roald Dahl",
    genre: "Children's",
    price: 420,
    rating: 4.8,
    reviewsCount: 1900,
    pages: 240,
    isbn: "978-0-14-241037-0",
    publisher: "Puffin Books",
    year: 1988,
    language: "English",
    synopsis:
      "A brilliant girl with terrible parents and a fearsome headmistress discovers she has more than books on her side. Dahl at his most playful and defiant.",
    coverFrom: "#7a2f4a",
    coverTo: "#2c0f1c",
  },
];

export const GENRES: Genre[] = [
  "Fiction",
  "Ethiopian & African Literature",
  "Business",
  "Technology",
  "History",
  "Philosophy",
  "Science",
  "Art & Design",
  "Poetry",
  "Self-Improvement",
  "Children's",
];

export const GENRE_ART: Partial<Record<Genre, string>> = {
  "Ethiopian & African Literature": IMG.ethiopian,
  History: IMG.shelf,
  Science: IMG.nook,
  Technology: IMG.stack,
};

export const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Adama",
  "Bahir Dar",
  "Dire Dawa",
  "Gondar",
  "Hawassa",
  "Jimma",
  "Mekelle",
  "Dessie",
  "Shashemene",
];

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  note: string;
  instructions: string;
  verifyLabel: string;
}

export const PAYMENT_METHODS: PaymentOption[] = [
  {
    id: "Telebirr",
    label: "telebirr",
    note: "Mobile money with instant confirmation",
    instructions: "Approve the push request sent to your telebirr number. No real charge is made in this demo.",
    verifyLabel: "telebirr PIN",
  },
  {
    id: "Chapa",
    label: "Chapa",
    note: "Card, wallet and bank via a secure gateway",
    instructions: "You would be redirected to Chapa's secure gateway. This checkout is simulated end to end.",
    verifyLabel: "Chapa secure code",
  },
  {
    id: "CBE Birr / Bank Transfer",
    label: "CBE Birr / Bank Transfer",
    note: "Commercial Bank of Ethiopia",
    instructions: "Transfer to the BookVerse CBE account and upload your slip. Demo mode skips the transfer.",
    verifyLabel: "CBE transaction ID",
  },
];

export const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    bookId: "shadow-king",
    name: "Hanna Tesfaye",
    rating: 5,
    comment: "I read it in three sittings. The women of this book are unforgettable and the language sings.",
    date: "2024-11-02",
  },
  {
    id: "r2",
    bookId: "shadow-king",
    name: "Daniel Okoro",
    rating: 4,
    comment: "A powerful reimagining of a history I thought I knew. The shifting voices take a chapter to settle into.",
    date: "2025-01-18",
  },
  {
    id: "r3",
    bookId: "atomic-habits",
    name: "Selam Bekele",
    rating: 5,
    comment: "Practical from the first page. I built a morning routine in ten days using the two-minute rule.",
    date: "2025-02-09",
  },
  {
    id: "r4",
    bookId: "ddia",
    name: "Mikias Alemu",
    rating: 5,
    comment: "Essential for anyone touching distributed systems. Dense but worth every page.",
    date: "2025-03-21",
  },
  {
    id: "r5",
    bookId: "the-prophet",
    name: "Ruth Girma",
    rating: 5,
    comment: "A small book I return to every year. Gibran writes about love and work better than anyone.",
    date: "2024-12-30",
  },
];

export const formatETB = (value: number): string => `ETB ${value.toLocaleString("en-US")}`;

export const formatYear = (year: number): string => (year < 0 ? `${Math.abs(year)} BC` : `${year}`);

// --- Ethiopian delivery, payments & demo helpers -------------------------

export const MAX_CART_QTY = 10;

export interface DeliveryZone {
  eta: string;
  days: number;
  hub: string;
}

const REGIONAL: DeliveryZone = { eta: "2-3 days", days: 3, hub: "Regional relay point" };

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  "Addis Ababa": { eta: "Same day or next day", days: 1, hub: "Bole fulfilment hub" },
  Adama: { eta: "1-2 days", days: 2, hub: "Adama relay point" },
  Shashemene: { eta: "1-2 days", days: 2, hub: "Shashemene relay point" },
  "Bahir Dar": { eta: "2-3 days", days: 3, hub: "Bahir Dar relay point" },
  "Dire Dawa": { eta: "2-3 days", days: 3, hub: "Dire Dawa relay point" },
  Gondar: { eta: "2-3 days", days: 3, hub: "Gondar relay point" },
  Hawassa: { eta: "2-3 days", days: 3, hub: "Hawassa relay point" },
  Jimma: { eta: "2-3 days", days: 3, hub: "Jimma relay point" },
  Mekelle: { eta: "3-4 days", days: 4, hub: "Mekelle relay point" },
  Dessie: { eta: "3-4 days", days: 4, hub: "Dessie relay point" },
};

export const deliveryZoneFor = (city: string): DeliveryZone => DELIVERY_ZONES[city] ?? REGIONAL;

export const isValidEthiopianPhone = (raw: string): boolean => {
  const digits = raw.replace(/\D/g, "");
  return /^251[79]\d{8}$/.test(digits) || /^0[79]\d{8}$/.test(digits) || /^[79]\d{8}$/.test(digits);
};

export const bookStock = (book: Book): number => ((book.pages + Math.abs(book.year)) % 38) + 4;