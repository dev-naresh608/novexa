import React, { useMemo, useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";

// ---- Sample data (swap with real posts / CMS / API response) ----
const DEFAULT_POSTS = [
  {
    id: 1,
    category: "Seller Stories",
    title: "How a home baker in Pune grew into a 200-order-a-day store",
    excerpt:
      "From a single WhatsApp group to a top-rated storefront — a look at what changed once she joined the marketplace.",
    author: "Meera Joshi",
    date: "Jul 8, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    category: "Delivery Tips",
    title: "Packing produce so it survives the last mile",
    author: "Arjun Rao",
    date: "Jul 5, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "Platform Updates",
    title: "Faster payouts: sellers now get paid in 24 hours",
    author: "Novexa Team",
    date: "Jul 2, 2026",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    category: "Fresh Picks",
    title: "What's actually in season this month, and why it's cheaper",
    author: "Divya Nair",
    date: "Jun 29, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    category: "Seller Stories",
    title: "Three drivers on what makes a five-star delivery",
    author: "Karan Singh",
    date: "Jun 24, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=800&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  "All",
  "Seller Stories",
  "Delivery Tips",
  "Fresh Picks",
  "Platform Updates",
];

function CategoryTag({ children }) {
  return (
    <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}

function PostMeta({ author, date, readTime }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600">
        {author.charAt(0)}
      </span>
      <span className="font-medium text-gray-700">{author}</span>
      <span className="text-gray-300">•</span>
      <span>{date}</span>
      <span className="text-gray-300">•</span>
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {readTime}
      </span>
    </div>
  );
}

function FeaturedCard({ post }) {
  return (
    <a
      href={`/blog/${post.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 transition-shadow duration-300"
    >
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <CategoryTag>{post.category}</CategoryTag>
        </div>
      </div>

      <div className="flex flex-col p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <PostMeta author={post.author} date={post.date} readTime={post.readTime} />
      </div>
    </a>
  );
}

function PostCard({ post, compact = false }) {
  return (
    <a
      href={`/blog/${post.id}`}
      className={`group flex ${
        compact ? "flex-row items-center gap-4" : "flex-col"
      } rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 transition-shadow duration-300 overflow-hidden`}
    >
      <div
        className={`relative overflow-hidden shrink-0 ${
          compact ? "h-20 w-24 rounded-xl m-3" : "h-40 w-full"
        }`}
      >
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className={`flex flex-col ${compact ? "py-3 pr-4" : "p-5"}`}>
        <CategoryTag>{post.category}</CategoryTag>
        <h4
          className={`mt-2 font-semibold text-gray-900 leading-snug group-hover:text-green-700 transition-colors ${
            compact ? "text-sm line-clamp-2" : "text-base line-clamp-2"
          }`}
        >
          {post.title}
        </h4>
        {!compact && (
          <PostMeta author={post.author} date={post.date} readTime={post.readTime} />
        )}
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-white">
      <p className="font-semibold text-gray-700">No posts in this category yet</p>
      <p className="text-sm text-gray-500 mt-1">Check back soon, or browse another category.</p>
    </div>
  );
}

export default function BlogSection({ posts = DEFAULT_POSTS }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  const [featured, ...rest] = filteredPosts;
  const sideRail = rest.slice(0, 2);
  const gridPosts = rest.slice(2, 5);

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-green-700">
              From the Marketplace
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
              Stories, tips, and updates
            </h2>
          </div>
          <a
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 rounded transition-colors"
          >
            View all posts
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 ${
                activeCategory === cat
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Top: featured + side rail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {featured && <FeaturedCard post={featured} />}
              </div>

              {sideRail.length > 0 && (
                <div className="flex flex-col gap-4">
                  {sideRail.map((post) => (
                    <PostCard key={post.id} post={post} compact />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom row */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {gridPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Mobile view-all */}
        <div className="flex sm:hidden justify-center mt-8">
          <a
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 border border-gray-200 rounded-2xl px-5 py-2.5 hover:border-green-400 hover:text-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 transition-colors"
          >
            View all posts
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}