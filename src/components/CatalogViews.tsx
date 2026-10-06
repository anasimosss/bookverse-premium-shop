import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  Heart,
  MagnifyingGlass,
  Minus,
  Package,
  Plus,
  SealCheck,
  ShoppingBag,
  Star,
  Trash,
  Truck,
  User,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import {
  BOOKS,
  ETHIOPIAN_CITIES,
  GENRES,
  SEED_REVIEWS,
  formatETB,
  formatYear,
  bookStock,
  MAX_CART_QTY,
  type Review,
  type SortKey,
} from "@/data/bookData";
import BookCard, { BookCover, RatingStars } from "@/components/BookCard";

const MAX_PRICE = Math.max(...BOOKS.map((book) => book.price));
const SORTS: { id: SortKey; label: string }[] = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Highest rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest releases" },
];

function PageHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/60">{subtitle}</p>
    </motion.div>
  );
}

export function CatalogView() {
  const { searchQuery, setSearchQuery, activeGenre, browseGenre } = useStore();
  const [sort, setSort] = useState<SortKey>("popular");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return BOOKS.filter((book) => {
      const inGenre = !activeGenre || book.genre === activeGenre;
      const inPrice = book.price <= maxPrice;
      const inQuery =
        !query || `${book.title} ${book.author} ${book.genre} ${book.synopsis}`.toLowerCase().includes(query);
      return inGenre && inPrice && inQuery;
    }).sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.year - a.year;
        default:
          return b.reviewsCount - a.reviewsCount;
      }
    });
  }, [searchQuery, activeGenre, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <PageHead
        eyebrow="The collection"
        title="Every shelf, every title in one place."
        subtitle="Filter by genre, price and mood. Prices are in Ethiopian Birr, and every order ships from Addis Ababa."
      />

      <div className="mt-10 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-white/12 bg-navy/50 px-5 py-3">
            <MagnifyingGlass className="h-5 w-5 text-gold" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search titles, authors or genres"
              className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/35"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="appearance-none rounded-full border border-white/12 bg-navy/60 py-3 pl-5 pr-11 text-sm text-ivory outline-none focus:border-gold/60"
              >
                {SORTS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-navy text-ivory">
                    {option.label}
                  </option>
                ))}
              </select>
              <CaretDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            </div>
            <span className="font-mono text-xs text-ivory/45">{filtered.length} titles</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => browseGenre("")}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition",
              !activeGenre ? "border-gold bg-gold text-navy" : "border-white/12 text-ivory/70 hover:border-gold/50 hover:text-gold",
            )}
          >
            All genres
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => browseGenre(genre)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition",
                activeGenre === genre
                  ? "border-gold bg-gold text-navy"
                  : "border-white/12 text-ivory/70 hover:border-gold/50 hover:text-gold",
              )}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/8 pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/40">Max price</span>
          <input
            type="range"
            min={300}
            max={MAX_PRICE}
            step={10}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="h-1 w-56 cursor-pointer accent-gold"
          />
          <span className="font-mono text-xs text-gold">{formatETB(maxPrice)}</span>
          {(activeGenre || searchQuery || maxPrice < MAX_PRICE) && (
            <button
              onClick={() => {
                browseGenre("");
                setSearchQuery("");
                setMaxPrice(MAX_PRICE);
              }}
              className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/50 underline-offset-4 hover:text-gold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-white/12 p-16 text-center">
          <Package className="mx-auto h-10 w-10 text-gold/70" />
          <h3 className="mt-5 font-serif text-2xl text-ivory">No titles match those filters</h3>
          <p className="mt-2 text-sm text-ivory/55">Try widening the price range or clearing the search.</p>
          <button
            onClick={() => {
              browseGenre("");
              setSearchQuery("");
              setMaxPrice(MAX_PRICE);
            }}
            className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Show the full collection
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewBlock({ bookId }: { bookId: string }) {
  const [reviews, setReviews] = useState<Review[]>(() => SEED_REVIEWS.filter((review) => review.bookId === bookId));
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Add your name and a short comment before posting.");
      return;
    }
    const review: Review = {
      id: `local-${Date.now()}`,
      bookId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [review, ...prev]);
    setName("");
    setComment("");
    setRating(5);
    toast.success("Thanks for sharing your review");
  };

  return (
    <section className="mt-20">
      <h2 className="font-serif text-2xl text-ivory">Reader reviews</h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/12 p-8 text-sm text-ivory/55">
              No reviews yet. Be the first to write one.
            </div>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-serif text-lg text-ivory">{review.name}</span>
                <span className="font-mono text-[11px] text-ivory/40">{review.date}</span>
              </div>
              <RatingStars rating={review.rating} className="mt-2" />
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{review.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="h-fit rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h3 className="font-serif text-lg text-ivory">Write a review</h3>
          <div className="mt-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Rate ${index + 1} out of 5`}
                onClick={() => setRating(index + 1)}
              >
                <Star
                  weight={index < rating ? "fill" : "regular"}
                  className={cn("h-6 w-6", index < rating ? "text-gold" : "text-ivory/25")}
                />
              </button>
            ))}
          </div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="mt-4 w-full rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
          />
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="What did you think of this book?"
            className="mt-3 w-full resize-none rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Post review
          </button>
        </form>
      </div>
    </section>
  );
}

export function BookDetailView() {
  const { activeBookId, addToCart, toggleWishlist, isWishlisted, openBook, goTo, closeBook, setCartOpen } = useStore();
  const book = BOOKS.find((item) => item.id === activeBookId);
  const [quantity, setQuantity] = useState(1);

  if (!book) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center lg:px-10">
        <h1 className="font-serif text-3xl text-ivory">That title has left the shelf</h1>
        <p className="mt-3 text-sm text-ivory/60">Pick another book from the collection and we will hold it for you.</p>
        <button
          onClick={() => goTo("catalog")}
          className="mt-8 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
        >
          Back to the collection
        </button>
      </div>
    );
  }

  const saved = isWishlisted(book.id);
  const related = BOOKS.filter((item) => item.genre === book.genre && item.id !== book.id).slice(0, 4);
  const alsoExplore = related.length > 0 ? related : BOOKS.filter((item) => item.bestseller).slice(0, 4);
  const meta = [
    { label: "Publisher", value: book.publisher },
    { label: "First published", value: formatYear(book.year) },
    { label: "Pages", value: `${book.pages}` },
    { label: "Language", value: book.language },
    { label: "ISBN", value: book.isbn },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <button
        onClick={closeBook}
        className="mb-8 inline-flex items-center gap-2 text-sm text-ivory/60 transition hover:text-gold"
      >
        <ArrowLeft />
        Back to the collection
      </button>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <BookCover book={book} className="max-w-sm" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { icon: Truck, text: "Ships in 24 hours" },
              { icon: SealCheck, text: "Sealed and gift-ready" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs text-ivory/70">
                <item.icon weight="fill" className="h-4 w-4 text-gold" />
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{book.genre}</span>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ivory sm:text-5xl">{book.title}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-ivory/55">{book.author}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <RatingStars rating={book.rating} />
            <span className="font-mono text-xs text-ivory/50">
              {book.rating.toFixed(1)} from {book.reviewsCount.toLocaleString("en-US")} readers
            </span>
            {book.bestseller && (
              <span className="rounded-full bg-gold/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-gold">
                Bestseller
              </span>
            )}
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/75">{book.synopsis}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-white/8 py-6 sm:grid-cols-2">
            {meta.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 sm:block">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">{row.label}</dt>
                <dd className="text-sm text-ivory/80">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex items-end gap-4">
              <span className="font-serif text-3xl text-ivory">{formatETB(book.price)}</span>
              {book.originalPrice && (
                <span className="font-mono text-sm text-ivory/40 line-through">{formatETB(book.originalPrice)}</span>
              )}
            </div>

            <p className="flex items-center gap-2 text-xs">
              <Package className="h-4 w-4 text-gold" />
              <span className={cn("font-medium", bookStock(book) > 8 ? "text-ivory/70" : "text-gold")}>
                {bookStock(book)} copies in stock
              </span>
              {bookStock(book) <= 8 && <span className="text-ivory/40">· only a few left</span>}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-full border border-white/12 bg-navy/50 px-4 py-2.5">
                <button aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-ivory/70 hover:text-gold">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-mono text-sm text-ivory">{quantity}</span>
                <button aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(MAX_CART_QTY, q + 1))} className="text-ivory/70 hover:text-gold">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => addToCart(book, quantity)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft sm:flex-none"
              >
                <ShoppingBag weight="bold" />
                Add to bag
              </button>
              <button
                onClick={() => {
                  addToCart(book, quantity);
                  setCartOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-6 py-3.5 text-sm font-semibold text-gold transition hover:bg-gold/10"
              >
                Buy now
                <ArrowRight weight="bold" />
              </button>
              <button
                onClick={() => toggleWishlist(book)}
                aria-label="Toggle wishlist"
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full border transition",
                  saved ? "border-gold/60 bg-gold/90 text-navy" : "border-white/15 text-ivory/70 hover:border-gold/60 hover:text-gold",
                )}
              >
                <Heart weight={saved ? "fill" : "regular"} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <ReviewBlock bookId={book.id} />

      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="font-serif text-2xl text-ivory">Customers also explore</h2>
          <button onClick={() => goTo("catalog")} className="group inline-flex items-center gap-2 text-sm text-gold">
            All titles
            <ArrowRight className="transition group-hover:translate-x-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {alsoExplore.map((item, index) => (
            <BookCard key={item.id} book={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function AccountView() {
  const { wishlist, orders, user, signIn, signOut, goTo, setAccountOpen } = useStore();
  const [tab, setTab] = useState<"wishlist" | "orders" | "profile">(wishlist.length > 0 ? "wishlist" : "orders");
  const saved = BOOKS.filter((book) => wishlist.includes(book.id));
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? ETHIOPIAN_CITIES[0],
    address: user?.address ?? "",
  });

  const tabs = [
    { id: "wishlist" as const, label: "Wishlist", count: saved.length },
    { id: "orders" as const, label: "Orders", count: orders.length },
    { id: "profile" as const, label: "Profile", count: 0 },
  ];

  const submitProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.phone.trim()) {
      toast.error("Enter your name, a valid email and a phone number.");
      return;
    }
    signIn(form);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-6 pb-5 pt-6 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">My account</span>
        <h2 className="mt-3 font-serif text-2xl text-ivory">
          {user ? `Hello, ${user.name.split(" ")[0]}` : "Sign in to BookVerse"}
        </h2>
        <div className="mt-5 flex gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition",
                tab === item.id ? "border-gold bg-gold text-navy" : "border-white/12 text-ivory/65 hover:border-gold/50 hover:text-gold",
              )}
            >
              {item.label}
              {item.count > 0 && <span className="ml-2 font-mono">{item.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        {tab === "wishlist" && (
          saved.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 p-12 text-center">
              <Heart className="mx-auto h-9 w-9 text-gold/70" />
              <h3 className="mt-4 font-serif text-xl text-ivory">Your wishlist is empty</h3>
              <p className="mt-2 text-sm text-ivory/55">Tap the heart on any cover to keep it here.</p>
              <button
                onClick={() => {
                  setAccountOpen(false);
                  goTo("catalog");
                }}
                className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
              >
                Browse the collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {saved.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          )
        )}

        {tab === "orders" && (
          orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 p-12 text-center">
              <Package className="mx-auto h-9 w-9 text-gold/70" />
              <h3 className="mt-4 font-serif text-xl text-ivory">No orders yet</h3>
              <p className="mt-2 text-sm text-ivory/55">Your BookVerse orders will appear here with live status.</p>
              <button
                onClick={() => {
                  setAccountOpen(false);
                  goTo("catalog");
                }}
                className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
              >
                Find your next read
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const steps = ["Demo Simulated", "Confirmed", "Shipped", "Delivered"];
                const stepIndex = steps.indexOf(order.status);
                return (
                  <div key={order.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gold">{order.reference}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
                            <SealCheck className="h-3 w-3" weight="bold" />
                            Demo
                          </span>
                        </span>
                        <p className="mt-1 text-xs text-ivory/45">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} - {order.city}
                        </p>
                      </div>
                      <span className="font-serif text-lg text-ivory">{formatETB(order.total)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {order.items.map((item) => (
                        <div key={item.bookId} className="flex items-center gap-3">
                          <span
                            className="h-12 w-8 rounded-sm ring-1 ring-inset ring-white/10"
                            style={{ backgroundImage: `linear-gradient(150deg, ${item.coverFrom}, ${item.coverTo})` }}
                          />
                          <span className="text-xs text-ivory/70">
                            {item.title}
                            <span className="block font-mono text-[10px] text-ivory/40">x{item.quantity}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      {steps.map((step, index) => (
                        <div key={step} className="flex flex-1 items-center gap-2">
                          <span className={cn("h-1.5 flex-1 rounded-full", index <= stepIndex ? "bg-gold" : "bg-white/10")} />
                          <span className={cn("font-mono text-[10px] uppercase tracking-wide", index <= stepIndex ? "text-gold" : "text-ivory/35")}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-ivory/45">
                      Paid with {order.paymentMethod} · demo charge, no real payment taken. Delivering to {order.address}, {order.city}.
                    </p>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === "profile" && (
          <div>
            {user && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold">
                    <User weight="fill" className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-serif text-lg text-ivory">{user.name}</p>
                    <p className="text-xs text-ivory/50">{user.email}</p>
                  </div>
                </div>
                <button onClick={signOut} className="rounded-full border border-white/15 px-5 py-2.5 text-xs text-ivory/70 transition hover:border-gold/50 hover:text-gold">
                  Sign out
                </button>
              </div>
            )}
            <form onSubmit={submitProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Full name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
                    placeholder="Aster Bekele"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Email</span>
                  <input
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
                    placeholder="+251 9__ __ ____"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">City</span>
                  <select
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60"
                  >
                    {ETHIOPIAN_CITIES.map((city) => (
                      <option key={city} value={city} className="bg-navy text-ivory">
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Delivery address</span>
                <textarea
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
                  placeholder="Sub-city, woreda, landmark"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
              >
                <SealCheck weight="fill" />
                {user ? "Update my details" : "Save and continue"}
              </button>
            </form>
            {orders.length > 0 && (
              <button
                onClick={() => setTab("orders")}
                className="mt-6 inline-flex items-center gap-2 text-xs text-gold hover:text-gold-soft"
              >
                <Trash className="h-4 w-4" />
                View my {orders.length} order{orders.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}