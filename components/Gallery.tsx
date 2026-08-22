"use client";

import { motion } from "framer-motion";

const galleryImages = [
  { image: "/images/gallery-1.jpg", alt: "Fresh Pizza" },
  { image: "/images/gallery-2.jpg", alt: "Gourmet Burger" },
  { image: "/images/gallery-3.jpg", alt: "Drink Selection" },
  { image: "/images/gallery-4.jpg", alt: "Combo Meal" },
  { image: "/images/gallery-5.jpg", alt: "Pizza Making" },
  { image: "/images/gallery-6.jpg", alt: "Happy Customers" },
  { image: "/images/gallery-7.jpg", alt: "Chef Special" },
  { image: "/images/gallery-8.jpg", alt: "Special Offers" }
];

export default function Gallery() {
  return (
    <section className="
      px-6
      py-20
      bg-neutral-900
      text-white
    ">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="
            text-red-600
            uppercase
            tracking-[5px]
            font-semibold
            mb-3
          ">
            Photo Gallery
          </p>

          <h2 className="
            text-6xl
            font-(--font-bebas)
            leading-none

<arg_key>old_string>
          ">
            MOMENTS TO
            <br />
            <span className="text-red-600">
              REMEMBER
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, z: 20 }}
              className="relative h-64 rounded-xl overflow-hidden group"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="
                absolute
                inset-0
                bg-linear-to-t
                from-black/60
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition-opacity
                flex items-end p-4
              "
              >
                <p className="text-white font-semibold">{item.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}