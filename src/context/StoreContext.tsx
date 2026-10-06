import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Book, CartItem, Order, UserProfile, ViewMode } from "@/data/bookData";
import { MAX_CART_QTY } from "@/data/bookData";

interface PlaceOrderInput {
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  city: string;
  address: string;
  customerName: string;
  phone: string;
}

interface OrderItemInput {
  book: Book;
  quantity: number;
}

interface StoreValue {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  user: UserProfile | null;
  view: ViewMode;
  activeBookId: string | null;
  activeGenre: string | null;
  searchQuery: string;
  cartOpen: boolean;
  searchOpen: boolean;
  accountOpen: boolean;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearDemoData: () => void;
  toggleWishlist: (book: Book) => void;
  isWishlisted: (id: string) => boolean;
  placeOrder: (input: PlaceOrderInput) => Order;
  signIn: (profile: UserProfile) => void;
  signOut: () => void;
  goTo: (view: ViewMode) => void;
  openBook: (id: string) => void;
  closeBook: () => void;
  browseGenre: (genre: string) => void;
  setSearchQuery: (query: string) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setAccountOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable, keep in memory */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

const reference = () =>
  `BV-ET-${Date.now().toString(36).slice(-2).toUpperCase()}${Math.floor(Math.random() * 9000 + 1000)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistent<CartItem[]>("bookverse.cart", []);
  const [wishlist, setWishlist] = usePersistent<string[]>("bookverse.wishlist", []);
  const [orders, setOrders] = usePersistent<Order[]>("bookverse.orders", []);
  const [user, setUser] = usePersistent<UserProfile | null>("bookverse.user", null);
  const [view, setView] = useState<ViewMode>("home");
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const addToCart = (book: Book, quantity = 1) => {
    const existing = cart.find((item) => item.book.id === book.id);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty >= MAX_CART_QTY) {
      toast.error(`You already have ${MAX_CART_QTY} copies of ${book.title} in your bag.`);
      return;
    }
    const addQty = Math.min(quantity, MAX_CART_QTY - currentQty);
    setCart((prev) => {
      const ex = prev.find((item) => item.book.id === book.id);
      if (ex) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: Math.min(ex.quantity + addQty, MAX_CART_QTY) } : item,
        );
      }
      return [...prev, { book, quantity: addQty }];
    });
    if (addQty < quantity) toast.info(`Capped at ${MAX_CART_QTY} copies of ${book.title}.`);
    toast.success(`${book.title} added to your bag`);
  };

  const removeFromCart = (id: string) => {
    const item = cart.find((i) => i.book.id === id);
    setCart((prev) => prev.filter((i) => i.book.id !== id));
    if (item) toast.success(`${item.book.title} removed from your bag`);
  };

  const setQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    const clamped = Math.min(quantity, MAX_CART_QTY);
    if (quantity > MAX_CART_QTY) toast.info(`Maximum ${MAX_CART_QTY} copies per title.`);
    setCart((prev) => prev.map((item) => (item.book.id === id ? { ...item, quantity: clamped } : item)));
  };

  const clearCart = () => setCart([]);

  const clearDemoData = () => {
    setCart([]);
    setWishlist([]);
    setOrders([]);
    toast.success("Demo data cleared. Your bag, wishlist and orders are reset.");
  };

  const toggleWishlist = (book: Book) => {
    setWishlist((prev) => {
      const saved = prev.includes(book.id);
      toast.success(saved ? `${book.title} removed from wishlist` : `${book.title} saved to your wishlist`);
      return saved ? prev.filter((id) => id !== book.id) : [...prev, book.id];
    });
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const placeOrder = (input: PlaceOrderInput): Order => {
    const order: Order = {
      id: `${Date.now()}`,
      reference: reference(),
      items: input.items.map((item) => ({
        bookId: item.book.id,
        title: item.book.title,
        author: item.book.author,
        coverFrom: item.book.coverFrom,
        coverTo: item.book.coverTo,
        price: item.book.price,
        quantity: item.quantity,
      })),
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      paymentMethod: input.paymentMethod,
      status: "Demo Simulated",
      city: input.city,
      address: input.address,
      customerName: input.customerName,
      phone: input.phone,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    if (!user) {
      setUser({
        name: input.customerName,
        email: `${input.customerName.split(" ")[0].toLowerCase()}@bookverse.et`,
        phone: input.phone,
        city: input.city,
        address: input.address,
      });
    }
    setCart([]);
    return order;
  };

  const signIn = (profile: UserProfile) => {
    setUser(profile);
    toast.success(`Welcome back, ${profile.name.split(" ")[0]}`);
  };

  const signOut = () => {
    setUser(null);
    toast.success("You have been signed out");
  };

  const goTo = (next: ViewMode) => {
    setView(next);
    if (next !== "book") setActiveBookId(null);
  };

  const openBook = (id: string) => {
    setActiveBookId(id);
    setView("book");
  };

  const closeBook = () => {
    setActiveBookId(null);
    setView("catalog");
  };

  const browseGenre = (genre: string) => {
    setActiveGenre(genre);
    setActiveBookId(null);
    setView("catalog");
  };

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    return {
      cart,
      wishlist,
      orders,
      user,
      view,
      activeBookId,
      activeGenre,
      searchQuery,
      cartOpen,
      searchOpen,
      accountOpen,
      cartCount,
      cartSubtotal,
      wishlistCount: wishlist.length,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      clearDemoData,
      toggleWishlist,
      isWishlisted,
      placeOrder,
      signIn,
      signOut,
      goTo,
      openBook,
      closeBook,
      browseGenre,
      setSearchQuery,
      setCartOpen,
      setSearchOpen,
      setAccountOpen,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, wishlist, orders, user, view, activeBookId, activeGenre, searchQuery, cartOpen, searchOpen, accountOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}