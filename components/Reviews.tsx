"use client";

import { motion } from "framer-motion";

const GOOGLE_REVIEWS_URL = "https://www.google.com/maps/place/PizzaFlix/@26.1608399,91.6857895,19z/data=!4m8!3m7!1s0x375a5b8ff66379b5:0xbff821b786c40048!8m2!3d26.1609145!4d91.6861516!9m1!1b1!16s%2Fg%2F11z73szrl2!5m1!1e2?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D";

const reviews = [
  {
    name: "Ananya Choudhury",
    rating: 5,
    comment:
      "A nice neighborhood cozy place to have tasty pizzas. Tried the Chicken Golden Delight Pizza and Chicken Popcorn, it was tasty one. Will explore the other things in the menu soon!",
    avatar: "/images/avatar1.jpg",
    url: GOOGLE_REVIEWS_URL,
  },
  {
    name: "diya saha",
    rating: 4,
    comment:
      "Loved the whole experience, me and my friend just came from office and were craving some chatpata food, office fatigue and stress really cleared all the way after having a bite of Pizzaflix's Chicken Golden Delight Pizza and Chicken popcorn really loved the taste of chicken popcorn and the sauce it had also talking about the pizza, the crust was so soft and the pizza was really upto my liking loved it💜 also took takeaway for my family even they loved it, would try other options on the menu as well, you guys are really doing great keep growing 🤗",
    avatar: "/images/avatar2.jpg",
    url: GOOGLE_REVIEWS_URL,
  },
  {
    name: "Ranadip Mondal",
    rating: 5,
    comment:
      "A great place for hangout with friends… The food was good specially the pizza is must try its better than domino’s…",
    avatar: "/images/avatar3.jpg",
    url: GOOGLE_REVIEWS_URL,
  },
  {
    name: "Bhumika Das",
    rating: 5,
    comment:
      "It was delicious ( chicken kurkure momo)😋 ❤️Definitely a 10/10 …",
    avatar: "/images/avatar4.jpg",
    url: GOOGLE_REVIEWS_URL,
  },
  {
    name: "Arijit Bhattacharjee",
    rating: 5,
    comment:
      "A hidden street-side gem pizza flix! Loved the fresh, cheesy pizza, momos, and much more and the friendly service. Great taste at an affordable price. Definitely worth a visit!",
    avatar: "/images/avatar5.jpg",
    url: GOOGLE_REVIEWS_URL,
  },
  {
    name: "Vishal Das",
    rating: 4,
    comment: "great!!! food! great service !",
    avatar: "/images/avatar6.jpg",
    url: GOOGLE_REVIEWS_URL,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xl ${i < rating ? "text-red-600" : "text-gray-600"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Official Google 'G' Logo SVG
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Reviews() {
  const infiniteReviews = [...reviews, ...reviews];

  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-red-600 uppercase tracking-[5px] font-semibold mb-3">
            Customer Reviews
          </p>

          <h2 className="text-5xl md:text-6xl font-(--font-bebas) leading-none">
            WHAT OUR CUSTOMERS
            <br />
            <span className="text-red-600">THINK ABOUT US</span>
          </h2>
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden flex">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div
          className="flex gap-6 shrink-0 py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 32,
              ease: "linear",
            },
          }}
        >
          {infiniteReviews.map((review, index) => (
            <a
              key={index}
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                w-[300px]
                sm:w-[360px]
                shrink-0
                bg-neutral-900
                rounded-2xl
                border
                border-white/10
                p-6
                hover:border-red-600/50
                hover:bg-neutral-900/90
                transition-all
                duration-300
                flex
                flex-col
                justify-between
                cursor-pointer
              "
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-2 text-xs text-neutral-300 group-hover:text-white transition-colors bg-neutral-800/90 px-3 py-1 rounded-full border border-white/10">
                    <GoogleIcon />
                    <span className="font-medium">Google</span>
                  </div>
                </div>

                <p className="text-gray-300 text-base italic leading-relaxed line-clamp-3 mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden shrink-0">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="truncate">
                  <h4 className="font-bold text-base truncate group-hover:text-red-500 transition-colors">
                    {review.name}
                  </h4>
                  <p className="text-gray-500 text-xs">Verified Google Reviewer ↗</p>
                </div>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}