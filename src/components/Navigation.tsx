import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Books,
  Heart,
  List,
  MagnifyingGlass,
  ShoppingBag,
  User,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { formatETB, type Genre } from "@/data/bookData";
import { BOOKS } from "@/data/bookData";

const NAV_LINKS: { label: string; mode: "home" | "catalog"; genre?: Genre }[] = [
  { label: "Home", mode: "home" },
  { label: "Collection", mode: "catalog" },
  { label: "Ethiopian Voices", mode: "catalog", genre: "Ethiopian & African Literature" },
  { label: "Poetry", mode: "catalog", genre: "Poetry" },
];

export function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/40 bg-gold/12 text-gold transition group-hover:bg-gold/20">
        <Books weight="fill" className="h-5 w-5" />
      </span>
      <span className="font-serif text-xl tracking-tight text-ivory">
        Book<span className="text-gold">Verse</span>
      </span>
    </button>
  );
}

function SearchModal() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery, openBook } = useStore();
  const query = searchQuery.trim().toLowerCase();
  const results = query
    ? BOOKS.filter((book) =>
        `${book.title} ${book.author} ${book.genre} ${book.synopsis}`.toLowerCase().includes(query),
      ).slice(0, 8)
    : BOOKS.filter((book) => book.bestseller).slice(0, 6);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-navy/85 px-4 pt-24 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-navy-deep/95 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
              <MagnifyingGlass className="h-5 w-5 text-gold" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search titles, authors or genres"
                className="w-full bg-transparent text-base text-ivory outline-none placeholder:text-ivory/35"
              />
              <button onClick={() => setSearchOpen(false)} className="text-ivory/50 hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-ivory/50">
                  No titles match "{searchQuery}". Try another author or genre.
                </p>
              )}
              {results.map((book) => (
                <button
                  key={book.id}
                  onClick={() => {
                    openBook(book.id);
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-white/6"
                >
                  <span
                    className="h-12 w-8 shrink-0 rounded-sm ring-1 ring-inset ring-white/10"
                    style={{ backgroundImage: `linear-gradient(150deg, ${book.coverFrom}, ${book.coverTo})` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-ivory">{book.title}</span>
                    <span className="block text-xs text-ivory/50">
                      {book.author} - {book.genre}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-gold">{formatETB(book.price)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const { goTo, browseGenre, setSearchOpen, setAccountOpen } = useStore();
  return (
    <footer className="border-t border-white/8 bg-navy-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Wordmark onClick={() => goTo("home")} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/55">
            An independent digital bookstore curating literature for readers across Ethiopia and beyond.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-gold/70">Addis Ababa, Ethiopia</p>
        </div>
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ivory/40">Shop</h4>
          <ul className="mt-5 space-y-3 text-sm text-ivory/65">
            <li><button onClick={() => goTo("catalog")} className="hover:text-gold">Full collection</button></li>
            <li><button onClick={() => browseGenre("Ethiopian & African Literature")} className="hover:text-gold">Ethiopian voices</button></li>
            <li><button onClick={() => browseGenre("Technology")} className="hover:text-gold">Technology</button></li>
            <li><button onClick={() => goTo("catalog")} className="hover:text-gold">New arrivals</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ivory/40">Support</h4>
          <ul className="mt-5 space-y-3 text-sm text-ivory/65">
            <li><button onClick={() => setAccountOpen(true)} className="hover:text-gold">Order history</button></li>
            <li><button onClick={() => setAccountOpen(true)} className="hover:text-gold">Delivery and returns</button></li>
            <li><button onClick={() => setSearchOpen(true)} className="hover:text-gold">Search help</button></li>
            <li><a href="mailto:hello@bookverse.et" className="hover:text-gold">hello@bookverse.et</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ivory/40">Payment</h4>
          <ul className="mt-5 space-y-3 text-sm text-ivory/65">
            <li>telebirr mobile money</li>
            <li>Chapa secure gateway</li>
            <li>CBE Birr and bank transfer</li>
            <li>Cash on delivery in Addis</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-xs text-ivory/40 sm:flex-row lg:px-10">
          <span>BookVerse - an editorial bookstore. Prices shown in Ethiopian Birr.</span>
          <span className="font-mono">Reading, delivered across {new Date().getFullYear()}.</span>
        </div>
      </div>
    </footer>
  );
}

export default function Navigation() {
  const {
    goTo,
    browseGenre,
    setCartOpen,
    setSearchOpen,
    setAccountOpen,
    cartCount,
    wishlistCount,
  } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 40));

  const navigate = (link: (typeof NAV_LINKS)[number]) => {
    if (link.genre) browseGenre(link.genre);
    else goTo(link.mode);
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          scrolled ? "border-b border-white/8 bg-navy-deep/90 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <Wordmark onClick={() => goTo("home")} />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link)}
                className="group relative text-sm font-medium text-ivory/70 transition hover:text-gold"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 text-sm text-ivory/70 transition hover:border-gold/50 hover:text-gold sm:inline-flex"
            >
              <MagnifyingGlass className="h-4 w-4" />
              <span className="font-mono text-[11px] tracking-wide">Search</span>
            </button>
            <button
              aria-label="Wishlist"
              onClick={() => setAccountOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ivory/70 transition hover:bg-white/8 hover:text-gold"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-mono text-[10px] font-bold text-navy">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              aria-label="Account"
              onClick={() => setAccountOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ivory/70 transition hover:bg-white/8 hover:text-gold"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-navy"
            >
              <ShoppingBag weight="bold" className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ivory px-1 font-mono text-[10px] font-bold text-navy">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full text-ivory transition hover:bg-white/8 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-[55] mx-4 overflow-hidden rounded-2xl border border-white/10 bg-navy-deep/97 p-4 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link)}
                  className="rounded-xl px-4 py-3.5 text-left text-base font-medium text-ivory/80 transition hover:bg-white/6 hover:text-gold"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setSearchOpen(true);
                setMenuOpen(false);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-navy"
            >
              <MagnifyingGlass weight="bold" className="h-4 w-4" />
              Search the catalog
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal />
    </>
  );
}