"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  Tag,
  UtensilsCrossed,
  Percent,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  CircleOff,
  Search,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  is_veg: boolean;
  image: string;
  is_top: boolean;
  is_available: boolean;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount_percent: number;
  valid_until: string;
  is_active: boolean;
  min_order_value: number;
}

const categories = [
  "pizza",
  "momo",
  "burger",
  "chicken",
  "dessert",
  "drinks",
];

const initialNewItem = {
  category: "pizza",
  name: "",
  description: "",
  price: 0,
  original_price: 0,
  is_veg: true,
  image: "",
  is_top: false,
  is_available: true,
};

export default function ManageAdmin() {
  const [tab, setTab] = useState<"menu" | "offers">("menu");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  const [activeCategory, setActiveCategory] = useState("pizza");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState(initialNewItem);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMenu();
    fetchOffers();
  }, []);

  async function fetchMenu() {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("category");

    if (data) setMenuItems(data);
  }

  async function fetchOffers() {
    const { data } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setOffers(data);
  }

  // --------------------------------------------------
  // MENU HANDLERS
  // --------------------------------------------------

  function updateLocalItem(id: string, field: string, value: any) {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function saveItem(item: MenuItem) {
    setSavingId(item.id);

    const { error } = await supabase
      .from("menu_items")
      .update({
        name: item.name,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        is_veg: item.is_veg,
        image: item.image,
        is_top: item.is_top,
        is_available: item.is_available,
      })
      .eq("id", item.id);

    if (error) {
      console.error(error);
    }

    setSavingId(null);
  }

  async function handleCreateItem(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        {
          ...newItem,
          category: newItem.category,
        },
      ])
      .select();

    if (data) {
      setMenuItems((prev) => [...prev, ...data]);
      setIsModalOpen(false);

      setActiveCategory(newItem.category);

      setNewItem({
        ...initialNewItem,
        category: newItem.category,
      });
    }

    if (error) {
      console.error(error);
    }
  }

  async function deleteItem(id: string) {
    await supabase.from("menu_items").delete().eq("id", id);

    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function toggleAvailability(item: MenuItem) {
    const newVal = !item.is_available;

    updateLocalItem(item.id, "is_available", newVal);

    await supabase
      .from("menu_items")
      .update({ is_available: newVal })
      .eq("id", item.id);
  }

  // --------------------------------------------------
  // OFFER HANDLERS
  // --------------------------------------------------

  function updateLocalOffer(id: string, field: string, value: any) {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer
      )
    );
  }

  async function saveOffer(offer: Offer) {
    setSavingId(offer.id);

    await supabase
      .from("offers")
      .update({
        title: offer.title,
        description: offer.description,
        code: offer.code,
        discount_percent: offer.discount_percent,
        valid_until: offer.valid_until,
        is_active: offer.is_active,
        min_order_value: offer.min_order_value,
      })
      .eq("id", offer.id);

    setSavingId(null);
  }

  async function addOffer() {
    const { data } = await supabase
      .from("offers")
      .insert([
        {
          title: "New Offer",
          description: "",
          code: `CODE${Math.floor(Math.random() * 1000)}`,
          discount_percent: 10,
          valid_until: "",
          is_active: true,
          min_order_value: 0,
        },
      ])
      .select();

    if (data) {
      setOffers((prev) => [...prev, ...data]);
    }
  }

  async function deleteOffer(id: string) {
    await supabase.from("offers").delete().eq("id", id);

    setOffers((prev) => prev.filter((offer) => offer.id !== id));
  }

  async function toggleOfferActive(offer: Offer) {
    const newVal = !offer.is_active;

    updateLocalOffer(offer.id, "is_active", newVal);

    await supabase
      .from("offers")
      .update({ is_active: newVal })
      .eq("id", offer.id);
  }

  // --------------------------------------------------
  // FILTERS / STATS
  // --------------------------------------------------

  const categoryItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  const filteredItems = categoryItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  const totalItems = menuItems.length;

  const availableItems = menuItems.filter(
    (item) => item.is_available
  ).length;

  const hiddenItems = menuItems.filter(
    (item) => !item.is_available
  ).length;

  const topItems = menuItems.filter(
    (item) => item.is_top
  ).length;

  // --------------------------------------------------
  // OPEN ADD ITEM MODAL
  // --------------------------------------------------

  function openAddItemModal() {
    setNewItem({
      ...initialNewItem,
      category: activeCategory,
    });

    setIsModalOpen(true);
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-red-900/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* HEADER */}

        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10 ring-1 ring-red-500/20">
                  <ShoppingBag size={15} className="text-red-500" />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Admin Dashboard
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Manage Store
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                Manage your menu, pricing, availability, featured items,
                offers and promotional campaigns from one place.
              </p>
            </div>

            {tab === "menu" && (
              <button
                onClick={openAddItemModal}
                className="group flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500 hover:shadow-red-600/30 active:scale-[0.98]"
              >
                <Plus
                  size={18}
                  className="transition-transform group-hover:rotate-90"
                />

                Add Item
              </button>
            )}

            {tab === "offers" && (
              <button
                onClick={addOffer}
                className="group flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500 hover:shadow-red-600/30 active:scale-[0.98]"
              >
                <Plus
                  size={18}
                  className="transition-transform group-hover:rotate-90"
                />

                Add Offer
              </button>
            )}
          </div>
        </header>

        {/* STATS */}

        {tab === "menu" && (
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

            <StatCard
              icon={<UtensilsCrossed size={16} />}
              label="Total Items"
              value={totalItems}
            />

            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Live Items"
              value={availableItems}
              accent="green"
            />

            <StatCard
              icon={<CircleOff size={16} />}
              label="Hidden"
              value={hiddenItems}
              accent="orange"
            />

            <StatCard
              icon={<Sparkles size={16} />}
              label="Bestsellers"
              value={topItems}
              accent="red"
            />

          </div>
        )}

        {/* TABS */}

        <div className="mb-7 flex items-center justify-between gap-4">

          <div className="inline-flex rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1.5">

            <button
              onClick={() => setTab("menu")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === "menu"
                  ? "bg-white text-black shadow-lg"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              <UtensilsCrossed size={15} />
              Menu
            </button>

            <button
              onClick={() => setTab("offers")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === "offers"
                  ? "bg-white text-black shadow-lg"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              <Tag size={15} />
              Offers
              {offers.length > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    tab === "offers"
                      ? "bg-black/10 text-black"
                      : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {offers.length}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* MENU TAB */}

        {tab === "menu" && (
          <section>

            <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                  {categories.map((cat) => {
                    const count = menuItems.filter(
                      (item) => item.category === cat
                    ).length;

                    const active = activeCategory === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);

                          setNewItem((prev) => ({
                            ...prev,
                            category: cat,
                          }));

                          setSearchQuery("");
                        }}
                        className={`group flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold capitalize transition-all ${
                          active
                            ? "bg-white text-black shadow-md"
                            : "text-neutral-500 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        {cat}

                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                            active
                              ? "bg-black/10 text-black"
                              : "bg-white/[0.06] text-neutral-600 group-hover:text-neutral-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full lg:w-64">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
                  />

                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="w-full rounded-xl border border-white/[0.07] bg-black/50 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-red-500/40"
                  />
                </div>

              </div>
            </div>

            <div className="mb-5 flex items-end justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold capitalize">
                    {activeCategory}
                  </h2>

                  <ChevronRight
                    size={18}
                    className="text-neutral-700"
                  />

                  <span className="text-sm text-neutral-600">
                    {filteredItems.length} items
                  </span>
                </div>

                <p className="mt-1 text-xs text-neutral-600">
                  Manage pricing, images, availability and item details.
                </p>
              </div>

              <button
                onClick={openAddItemModal}
                className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-neutral-400 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-white sm:flex"
              >
                <Plus size={14} />
                Add to {activeCategory}
              </button>

            </div>

            <div className="space-y-3">

              <AnimatePresence mode="popLayout">

                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className={`group relative overflow-hidden rounded-2xl border transition-all ${
                      item.is_available
                        ? "border-white/[0.07] bg-[#0c0c0c] hover:border-white/[0.12]"
                        : "border-white/[0.04] bg-[#090909] opacity-60"
                    }`}
                  >

                    {item.is_top && (
                      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-500">
                        <Sparkles size={11} />
                        Bestseller
                      </div>
                    )}

                    <div className="p-4 sm:p-5">

                      <div className="flex flex-col gap-5 md:flex-row">

                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-black sm:h-28 sm:w-28">

                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (
                                  e.target as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-neutral-700">
                              <ImageIcon size={22} />
                              <span className="text-[9px] uppercase tracking-wider">
                                No Image
                              </span>
                            </div>
                          )}

                          <div
                            className={`absolute bottom-2 left-2 h-4 w-4 rounded border-2 bg-black ${
                              item.is_veg
                                ? "border-green-500"
                                : "border-red-500"
                            }`}
                          >
                            <div
                              className={`m-[3px] h-1.5 w-1.5 rounded-full ${
                                item.is_veg
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                            <div className="min-w-0 flex-1">

                              <input
                                value={item.name}
                                onChange={(e) =>
                                  updateLocalItem(
                                    item.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="Item name"
                                className="w-full border-b border-transparent bg-transparent py-1 text-lg font-bold text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-red-500/40"
                              />

                              <div className="mt-2 flex items-center gap-2">

                                <span className="text-sm font-bold text-red-500">
                                  ₹{item.price}
                                </span>

                                {item.original_price > item.price && (
                                  <>
                                    <span className="text-xs text-neutral-600 line-through">
                                      ₹{item.original_price}
                                    </span>

                                    <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-500">
                                      {Math.round(
                                        ((item.original_price -
                                          item.price) /
                                          item.original_price) *
                                          100
                                      )}
                                      % OFF
                                    </span>
                                  </>
                                )}

                              </div>

                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                              <button
                                onClick={() =>
                                  toggleAvailability(item)
                                }
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                  item.is_available
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/15"
                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/15"
                                }`}
                              >
                                {item.is_available ? (
                                  <Eye size={13} />
                                ) : (
                                  <EyeOff size={13} />
                                )}

                                {item.is_available
                                  ? "Live"
                                  : "Hidden"}
                              </button>

                              <button
                                onClick={() => saveItem(item)}
                                disabled={
                                  savingId === item.id
                                }
                                className="flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-3 py-2 text-xs font-semibold text-neutral-300 transition-all hover:bg-white/[0.12] hover:text-white disabled:opacity-50"
                              >
                                <Save size={13} />

                                {savingId === item.id
                                  ? "Saving..."
                                  : "Save"}
                              </button>

                              <button
                                onClick={() =>
                                  deleteItem(item.id)
                                }
                                className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-red-500/10 hover:text-red-500"
                                title="Delete item"
                              >
                                <Trash2 size={15} />
                              </button>

                            </div>

                          </div>

                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updateLocalItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Add a short description..."
                            rows={2}
                            className="mt-3 w-full resize-none rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5 text-sm leading-5 text-neutral-400 outline-none transition-colors placeholder:text-neutral-700 focus:border-white/[0.12] focus:text-neutral-300"
                          />

                          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">

                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2">
                              <ImageIcon
                                size={13}
                                className="shrink-0 text-neutral-600"
                              />

                              <input
                                type="text"
                                value={item.image || ""}
                                onChange={(e) =>
                                  updateLocalItem(
                                    item.id,
                                    "image",
                                    e.target.value
                                  )
                                }
                                placeholder="Image URL..."
                                className="min-w-0 flex-1 bg-transparent text-xs text-neutral-400 outline-none placeholder:text-neutral-700"
                              />
                            </div>

                            <div className="flex items-center rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2">
                              <span className="mr-1 text-xs text-neutral-700">
                                ₹
                              </span>

                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) =>
                                  updateLocalItem(
                                    item.id,
                                    "price",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 bg-transparent text-xs text-white outline-none"
                              />
                            </div>

                            <div className="flex items-center rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2">
                              <span className="mr-1 text-xs text-neutral-700">
                                MRP
                              </span>

                              <input
                                type="number"
                                value={item.original_price}
                                onChange={(e) =>
                                  updateLocalItem(
                                    item.id,
                                    "original_price",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 bg-transparent text-xs text-white outline-none"
                              />
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                ))}

              </AnimatePresence>

            </div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <UtensilsCrossed
                    size={22}
                    className="text-neutral-600"
                  />
                </div>

                <h3 className="text-base font-semibold">
                  {searchQuery
                    ? "No items found"
                    : `No ${activeCategory} items yet`}
                </h3>

                <p className="mt-1 max-w-sm text-sm text-neutral-600">
                  {searchQuery
                    ? "Try searching with a different item name."
                    : `Add your first ${activeCategory} item using the Add Item button above.`}
                </p>

                {!searchQuery && (
                  <button
                    onClick={openAddItemModal}
                    className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                )}
              </motion.div>
            )}

          </section>
        )}

        {/* OFFERS TAB */}

        {tab === "offers" && (
          <section>

            <div className="mb-6 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-red-600/[0.08] to-transparent p-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10">
                      <Tag
                        size={15}
                        className="text-red-500"
                      />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                      Promotions
                    </span>
                  </div>

                  <h2 className="text-xl font-bold">
                    Offers & Coupons
                  </h2>

                  <p className="mt-1 text-sm text-neutral-600">
                    Create and manage discounts for your customers.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {offers.filter((o) => o.is_active).length} active
                </div>

              </div>

            </div>

            <div className="space-y-3">

              <AnimatePresence mode="popLayout">

                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      offer.is_active
                        ? "border-red-500/15 bg-[#0d0a0a]"
                        : "border-white/[0.05] bg-[#090909] opacity-60"
                    }`}
                  >

                    <div className="p-5">

                      <div className="flex flex-col gap-4">

                        {/* Title + discount row */}

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                          <input
                            value={offer.title}
                            onChange={(e) =>
                              updateLocalOffer(
                                offer.id,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Offer title"
                            className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5 text-base font-bold text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-red-500/30"
                          />

                          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5">
                            <Percent
                              size={14}
                              className="text-red-500"
                            />

                            <input
                              type="number"
                              value={offer.discount_percent}
                              onChange={(e) =>
                                updateLocalOffer(
                                  offer.id,
                                  "discount_percent",
                                  Number(e.target.value)
                                )
                              }
                              className="w-14 bg-transparent text-sm font-bold text-white outline-none"
                            />

                            <span className="text-xs text-neutral-600">
                              OFF
                            </span>
                          </div>

                        </div>

                        {/* NEW: Minimum order value row */}

                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5 w-fit">
                          <Wallet
                            size={14}
                            className="text-neutral-500 shrink-0"
                          />

                          <span className="text-xs text-neutral-500 whitespace-nowrap">
                            Min. order ₹
                          </span>

                          <input
                            type="number"
                            value={offer.min_order_value}
                            onChange={(e) =>
                              updateLocalOffer(
                                offer.id,
                                "min_order_value",
                                Number(e.target.value)
                              )
                            }
                            placeholder="0"
                            className="w-20 bg-transparent text-sm font-bold text-white outline-none"
                          />

                          <span className="text-[10px] text-neutral-600">
                            (0 = no minimum)
                          </span>
                        </div>

                        {/* Description */}

                        <textarea
                          value={offer.description}
                          onChange={(e) =>
                            updateLocalOffer(
                              offer.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe this offer..."
                          rows={2}
                          className="w-full resize-none rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5 text-sm text-neutral-400 outline-none placeholder:text-neutral-700 focus:border-white/[0.12]"
                        />

                        {/* Bottom controls */}

                        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto_auto]">

                          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5">
                            <Tag
                              size={14}
                              className="text-neutral-600"
                            />

                            <input
                              value={offer.code}
                              onChange={(e) =>
                                updateLocalOffer(
                                  offer.id,
                                  "code",
                                  e.target.value.toUpperCase()
                                )
                              }
                              placeholder="COUPON CODE"
                              className="min-w-0 flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder:text-neutral-700"
                            />
                          </div>

                          <input
                            value={offer.valid_until}
                            onChange={(e) =>
                              updateLocalOffer(
                                offer.id,
                                "valid_until",
                                e.target.value
                              )
                            }
                            placeholder="Valid until"
                            className="rounded-xl border border-white/[0.06] bg-black/50 px-3 py-2.5 text-xs text-white outline-none placeholder:text-neutral-700 focus:border-white/[0.12]"
                          />

                          <button
                            onClick={() =>
                              toggleOfferActive(offer)
                            }
                            className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                              offer.is_active
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/15"
                                : "bg-white/[0.05] text-neutral-500 hover:text-white"
                            }`}
                          >
                            {offer.is_active ? (
                              <Eye size={13} />
                            ) : (
                              <EyeOff size={13} />
                            )}

                            {offer.is_active
                              ? "Active"
                              : "Paused"}
                          </button>

                          <button
                            onClick={() =>
                              saveOffer(offer)
                            }
                            disabled={
                              savingId === offer.id
                            }
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.07] px-4 py-2.5 text-xs font-semibold text-neutral-300 transition-all hover:bg-white/[0.12] hover:text-white disabled:opacity-50"
                          >
                            <Save size={13} />

                            {savingId === offer.id
                              ? "Saving..."
                              : "Save"}
                          </button>

                          <button
                            onClick={() =>
                              deleteOffer(offer.id)
                            }
                            className="flex items-center justify-center rounded-xl px-3 py-2.5 text-neutral-600 transition-all hover:bg-red-500/10 hover:text-red-500"
                            title="Delete offer"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                ))}

              </AnimatePresence>

            </div>

            {offers.length === 0 && (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/[0.06]">
                  <Tag
                    size={22}
                    className="text-red-500/60"
                  />
                </div>

                <h3 className="font-semibold">
                  No offers yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-neutral-600">
                  Create your first coupon or promotional offer.
                </p>

                <button
                  onClick={addOffer}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500"
                >
                  <Plus size={16} />
                  Create Offer
                </button>

              </div>
            )}

          </section>
        )}

      </div>

      {/* ADD ITEM MODAL */}

      <AnimatePresence>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              transition={{
                duration: 0.2,
              }}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0d0d0d] shadow-2xl shadow-black"
            >

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0d0d0d]/95 px-5 py-4 backdrop-blur-xl sm:px-6">

                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10">
                      <Plus
                        size={15}
                        className="text-red-500"
                      />
                    </div>

                    <h2 className="text-lg font-bold">
                      Add New Item
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-neutral-600">
                    Add a new item to your menu.
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-2 text-neutral-500 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

              <form
                onSubmit={handleCreateItem}
                className="space-y-5 p-5 sm:p-6"
              >

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Category
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {categories.map((cat) => {
                      const active =
                        newItem.category === cat;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setNewItem({
                              ...newItem,
                              category: cat,
                            })
                          }
                          className={`rounded-xl border px-3 py-2.5 text-xs font-semibold capitalize transition-all ${
                            active
                              ? "border-red-500/30 bg-red-500/10 text-red-500"
                              : "border-white/[0.06] bg-black/40 text-neutral-500 hover:border-white/[0.12] hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Item Name
                  </label>

                  <input
                    required
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Cheese Burst Pizza"
                    className="w-full rounded-xl border border-white/[0.07] bg-black/50 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-red-500/40"
                  />

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Selling Price
                    </label>

                    <div className="flex items-center rounded-xl border border-white/[0.07] bg-black/50 px-3.5">
                      <span className="mr-2 text-sm text-neutral-600">
                        ₹
                      </span>

                      <input
                        required
                        type="number"
                        value={newItem.price || ""}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            price: Number(
                              e.target.value
                            ),
                          })
                        }
                        placeholder="299"
                        className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-700"
                      />
                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Original Price
                    </label>

                    <div className="flex items-center rounded-xl border border-white/[0.07] bg-black/50 px-3.5">
                      <span className="mr-2 text-sm text-neutral-600">
                        ₹
                      </span>

                      <input
                        type="number"
                        value={
                          newItem.original_price || ""
                        }
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            original_price: Number(
                              e.target.value
                            ),
                          })
                        }
                        placeholder="399"
                        className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-700"
                      />
                    </div>

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Image URL
                  </label>

                  <div className="flex gap-2">

                    <div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/[0.07] bg-black/50 px-3.5">

                      <ImageIcon
                        size={15}
                        className="mr-2 shrink-0 text-neutral-600"
                      />

                      <input
                        type="text"
                        value={newItem.image}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            image: e.target.value,
                          })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-transparent py-3 text-xs text-white outline-none placeholder:text-neutral-700"
                      />

                    </div>

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-black">

                      {newItem.image ? (
                        <img
                          src={newItem.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon
                            size={16}
                            className="text-neutral-700"
                          />
                        </div>
                      )}

                    </div>

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        description: e.target.value,
                      })
                    }
                    placeholder="Fresh mozzarella, tomato sauce & basil..."
                    className="w-full resize-none rounded-xl border border-white/[0.07] bg-black/50 px-3.5 py-3 text-sm text-white outline-none placeholder:text-neutral-700 focus:border-red-500/40"
                  />

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                      newItem.is_veg
                        ? "border-green-500/20 bg-green-500/[0.06]"
                        : "border-white/[0.06] bg-black/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={newItem.is_veg}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          is_veg: e.target.checked,
                        })
                      }
                      className="accent-green-600"
                    />

                    <div>
                      <div className="text-xs font-semibold text-white">
                        Veg Item
                      </div>

                      <div className="mt-0.5 text-[10px] text-neutral-600">
                        Vegetarian
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                      newItem.is_top
                        ? "border-yellow-500/20 bg-yellow-500/[0.06]"
                        : "border-white/[0.06] bg-black/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={newItem.is_top}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          is_top: e.target.checked,
                        })
                      }
                      className="accent-yellow-500"
                    />

                    <div>
                      <div className="text-xs font-semibold text-white">
                        Bestseller
                      </div>

                      <div className="mt-0.5 text-[10px] text-neutral-600">
                        Feature this item
                      </div>
                    </div>
                  </label>

                </div>

                <div className="flex gap-3 border-t border-white/[0.07] pt-5">

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl bg-white/[0.05] py-3 text-sm font-semibold text-neutral-400 transition-all hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500"
                  >
                    <Plus size={16} />
                    Create Item
                  </button>

                </div>

              </form>

            </motion.div>

          </div>
        )}

      </AnimatePresence>
    </main>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  label,
  value,
  accent = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: "neutral" | "green" | "orange" | "red";
}) {
  const accentClasses = {
    neutral: "bg-white/[0.04] text-neutral-400",
    green: "bg-green-500/[0.07] text-green-500",
    orange: "bg-orange-500/[0.07] text-orange-500",
    red: "bg-red-500/[0.07] text-red-500",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors hover:border-white/[0.1]"
    >
      <div className="flex items-center justify-between">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentClasses[accent]}`}
        >
          {icon}
        </div>

        <span className="text-2xl font-bold tracking-tight">
          {value}
        </span>

      </div>

      <div className="mt-3 text-xs font-medium text-neutral-600">
        {label}
      </div>
    </motion.div>
  );
}