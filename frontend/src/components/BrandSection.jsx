import React from "react";
import { motion } from "framer-motion";

const brandLogos = [
  { src: "/brands/johnnie-walker.png", alt: "Johnnie Walker" },
  { src: "/brands/jack-daniels.png", alt: "Jack Daniel's" },
  { src: "/brands/absolut.png", alt: "Absolut Vodka" },
  { src: "/brands/bacardi.png", alt: "Bacardi" },
  { src: "/brands/chivas.png", alt: "Chivas Regal" },
  { src: "/brands/tanqueray.png", alt: "Tanqueray" },
  { src: "/brands/jameson.png", alt: "Jameson" },
  { src: "/brands/bombay-sapphire.png", alt: "Bombay Sapphire" },
];

const BrandSection = () => {
  return (
    <section className="bg-gradient-to-br from-[#fefefe] to-[#f2f2f2] py-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2D6A4F] tracking-tight">
            Featured Spirit Partners
          </h2>
          <p className="text-gray-600 mt-3 text-base max-w-xl mx-auto">
            World-renowned liquor brands we proudly serve at 4 Donkeys Bar
          </p>
        </div>

        {/* Enhanced Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 items-center">
          {brandLogos.map((brand, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                delay: idx * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="flex justify-center items-center group transform transition duration-300 hover:scale-105"
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className="h-20 md:h-24 lg:h-28 object-contain opacity-60 group-hover:opacity-100 transition duration-300 mix-blend-multiply"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
