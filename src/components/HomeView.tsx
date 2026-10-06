import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, EnvelopeSimple, Quotes, SealCheck, Truck } from "@phosphor-icons/react";
import { useStore } from "@/context/StoreContext";
import { BOOKS, GENRES, GENRE_ART, IMG } from "@/data/bookData";
import BookCard, { BookCover } from "@/components/BookCard";
import ThreeBookHero from "@/components/ThreeBookHero";

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
        <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ivory sm:text-4xl">{title}</h2>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="group inline-flex items-center gap-2 text-sm font-medium text-gold transition hover:text-gold-soft"
        >
          {action.label}
          <ArrowRight className="transition group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
}

function GenreBento() {
  const { browseGenre } = useStore();
  const tiles = GENRES.slice(0, 8);
  return (
    <div className="grid auto-rows-[168px] grid-cols-2 gap-4 md:grid-cols-4">
      {tiles.map((genre, index) => {
        const art = GENRE_ART[genre];
        const large = index === 0;
        return (
          <motion.button
            key={genre}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            onClick={() => browseGenre(genre)}
            className={`group relative overflow-hidden rounded-2xl border border-white/8 text-left ${
              large ? "col-span-2 row-span-2 md:col-span-2" : ""
            }`}
          >
            {art ? (
              <img src={art} alt={genre} className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-60" />
            ) : (
              <span className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-gold/10" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/40 to-transparent" />
            <span className="absolute inset-0 flex flex-col justify-end p-5">
              <span className="font-serif text-lg text-ivory transition group-hover:text-gold">{genre}</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/45">
                {BOOKS.filter((book) => book.genre === genre).length} titles
              </span>
            </span>
            <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-navy/60 text-gold opacity-0 transition group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function Spotlight() {
  const { openBook, goTo } = useStore();
  const feature = BOOKS.find((book) => book.featured) ?? BOOKS[0];
  return (
    <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] lg:grid-cols-2">
      <div className="relative h-72 lg:h-full lg:min-h-[26rem]">
        <img src={IMG.nook} alt="A quiet reading nook" className="h-full w-full object-cover" />
        <span className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-navy/40 lg:bg-gradient-to-l" />
      </div>
      <div className="p-8 lg:p-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Your next favourite read</span>
        <h2 className="mt-4 font-serif text-3xl leading-tight text-ivory sm:text-4xl">{feature.title}</h2>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ivory/50">{feature.author}</p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/70">{feature.synopsis}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => openBook(feature.id)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Read the details
            <ArrowRight weight="bold" />
          </button>
          <button onClick={() => goTo("catalog")} className="text-sm text-ivory/70 underline-offset-4 hover:text-gold hover:underline">
            Browse the whole shelf
          </button>
        </div>
      </div>
    </div>
  );
}

function PromoBanner() {
  const { goTo } = useStore();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/25">
      <img src={IMG.promo} alt="Gold leaf texture on navy paper" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <span className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/80 to-navy/70" />
      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3 text-gold">
            <Truck weight="fill" className="h-5 w-5" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em]">Delivery across Ethiopia</span>
          </div>
          <h3 className="mt-4 font-serif text-3xl leading-tight text-ivory sm:text-4xl">
            Free delivery in Addis Ababa on orders over 1,500 ETB
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/70">
            Pay with telebirr, Chapa or CBE Birr, and use code <span className="font-mono text-gold">BOOKVERSE10</span> for
            10 percent off your first order.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-navy/60 p-6 backdrop-blur-sm lg:ml-auto lg:w-full lg:max-w-xs">
          {["Curated by real readers", "Sealed and gift-ready packaging", "Tracked orders in your account"].map((line) => (
            <div key={line} className="flex items-start gap-3 text-sm text-ivory/80">
              <SealCheck weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              {line}
            </div>
          ))}
          <button
            onClick={() => goTo("catalog")}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Start reading
            <ArrowRight weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const quotes = [
    {
      quote: "BookVerse put Oromay and The Shadow King in the same cart as my favourite tech reads. The curation feels personal.",
      name: "Selam Bekele",
      city: "Addis Ababa",
    },
    {
      quote: "Paid with telebirr, and my books arrived in Bahir Dar in two days. The packaging alone made it feel like a gift.",
      name: "Yohannes Tadesse",
      city: "Bahir Dar",
    },
    {
      quote: "The writing on each cover page makes browsing a joy. This is how a bookstore should feel online.",
      name: "Marta Girma",
      city: "Hawassa",
    },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {quotes.map((item, index) => (
        <motion.figure
          key={item.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          className="flex h-full flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-7"
        >
          <Quotes weight="fill" className="h-7 w-7 text-gold/70" />
          <blockquote className="mt-5 text-sm leading-relaxed text-ivory/75">{item.quote}</blockquote>
          <figcaption className="mt-6 border-t border-white/8 pt-4">
            <span className="block font-serif text-base text-ivory">{item.name}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/70">{item.city}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="grid gap-8 rounded-3xl border border-white/8 bg-white/[0.03] p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">The reading list</span>
        <h3 className="mt-4 font-serif text-3xl leading-tight text-ivory">One thoughtful recommendation every Friday.</h3>
        <p className="mt-3 text-sm text-ivory/60">No noise, no spam. Just a book we think you will love.</p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!email.includes("@")) return;
          setSent(true);
          setEmail("");
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 rounded-full border border-white/12 bg-navy/50 px-5 py-3.5">
          <EnvelopeSimple className="h-5 w-5 text-gold" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/35"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
        >
          {sent ? "Subscribed" : "Subscribe"}
        </button>
      </form>
    </div>
  );
}

export default function HomeView() {
  const { goTo, browseGenre } = useStore();
  const bestsellers = BOOKS.filter((book) => book.bestseller).slice(0, 8);
  const arrivals = BOOKS.filter((book) => book.newArrival);

  return (
    <div>
      <ThreeBookHero />

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-24 lg:px-10">
        <section>
          <SectionHeading
            eyebrow="Browse by genre"
            title="Eleven shelves, one careful curators eye."
            action={{ label: "See all titles", onClick: () => goTo("catalog") }}
          />
          <GenreBento />
        </section>

        <section>
          <SectionHeading
            eyebrow="Curated bestsellers"
            title="The books readers keep coming back for."
            action={{ label: "View the collection", onClick: () => goTo("catalog") }}
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {bestsellers.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>

        <section>
          <Spotlight />
        </section>

        <section>
          <PromoBanner />
        </section>

        {arrivals.length > 0 && (
          <section>
            <SectionHeading eyebrow="Just arrived" title="New this season on the shelf." />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {arrivals.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeading eyebrow="From our readers" title="What people say after the last page." />
          <Testimonials />
        </section>

        <section>
          <Newsletter />
        </section>
      </div>
    </div>
  );
}