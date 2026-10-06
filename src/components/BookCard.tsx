import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Heart, ShoppingBag, Star, StarHalf } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { formatETB, type Book } from "@/data/bookData";

export function BookCover({ book, className }: { book: Book; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-l-sm rounded-r-md",
        "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)] ring-1 ring-inset ring-white/10",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(152deg, ${book.coverFrom}, ${book.coverTo})` }}
    >
      <span className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20" />
      <span className="absolute left-[7%] inset-y-0 w-px bg-gold/25" />
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/55">{book.genre}</span>
        <div>
          <h3 className="font-serif text-base leading-tight text-white sm:text-lg">{book.title}</h3>
          <span className="my-2 block h-px w-9 bg-gold/80" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">{book.author}</p>
        </div>
      </div>
    </div>
  );
}

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < full) return <Star key={index} weight="fill" className="h-3.5 w-3.5" />;
        if (index === full && half) return <StarHalf key={index} weight="fill" className="h-3.5 w-3.5" />;
        return <Star key={index} weight="regular" className="h-3.5 w-3.5 text-gold/35" />;
      })}
    </span>
  );
}

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, openBook } = useStore();
  const cardRef = useRef<HTMLButtonElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const saved = isWishlisted(book.id);

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 12);
    rotateX.set(-py * 12);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="[perspective:1100px]"
    >
      <motion.button
        ref={cardRef}
        type="button"
        onClick={() => openBook(book.id)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative block w-full rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left transition-colors duration-300 hover:border-gold/40 hover:bg-white/[0.06]"
      >
        <div className="relative">
          <BookCover book={book} className="transition-transform duration-500 group-hover:-translate-y-1" />
          {book.originalPrice && (
            <span className="absolute -left-2 -top-2 rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-navy">
              Save {Math.round((1 - book.price / book.originalPrice) * 100)}%
            </span>
          )}
          <button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(event) => {
              event.stopPropagation();
              toggleWishlist(book);
            }}
            className={cn(
              "absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition active:scale-90",
              saved
                ? "border-gold/60 bg-gold/90 text-navy"
                : "border-white/20 bg-navy/50 text-ivory hover:border-gold/60 hover:text-gold",
            )}
          >
            <Heart weight={saved ? "fill" : "regular"} className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold/80">{book.genre}</p>
          <h3 className="font-serif text-lg leading-snug text-ivory transition-colors group-hover:text-gold">
            {book.title}
          </h3>
          <p className="text-xs text-ivory/55">{book.author}</p>
          <div className="flex items-center gap-2">
            <RatingStars rating={book.rating} />
            <span className="font-mono text-[11px] text-ivory/45">
              {book.rating.toFixed(1)} ({book.reviewsCount.toLocaleString("en-US")})
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-mono text-sm font-semibold text-ivory">{formatETB(book.price)}</span>
            {book.originalPrice && (
              <span className="font-mono text-[11px] text-ivory/40 line-through">
                {formatETB(book.originalPrice)}
              </span>
            )}
          </div>
          <span
            onClick={(event) => {
              event.stopPropagation();
              addToCart(book);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-4 py-2 text-xs font-semibold text-gold transition active:scale-[0.97] hover:bg-gold hover:text-navy"
          >
            <ShoppingBag weight="bold" className="h-3.5 w-3.5" />
            Add
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}