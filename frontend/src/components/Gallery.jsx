import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance.js";
import { Loader } from "lucide-react";
import Spinner from "./Spinner";

// const galleryImages = [
//   { src: "/images/cocktail1.jpg", alt: "Cocktail1", rowSpan: 20 },
//   { src: "/images/cocktail2.jpg", alt: "Cocktail2", rowSpan: 30 },
//   { src: "/images/cocktail3.jpg", alt: "Cocktail3", rowSpan: 20 },
//   { src: "/images/cocktail4.jpg", alt: "Cocktail14", rowSpan: 40 },
//   { src: "/images/cocktail5.jpg", alt: "Cocktail15", rowSpan: 30 },
// ];

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const rowspans = [20, 30, 20, 40, 30];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGalleryImages = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/main-gallery");
        console.log(response.data);
        const data = response.data.images.map((item, index) => {
          return {
            src: item.imageUrl,
            alt: item.alt || "Gallery Image",
            rowSpan: rowspans[index % rowspans.length],
          };
        });
        setGalleryImages(data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);
  if (loading) return <Spinner />;
  return (
    <section className="bg-[#556D53] py-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">Signature Moments</h2>
          <p className="mt-2 text-gray-100 text-sm">
            Capturing the flavor, mood, and magic of 4 Donkeys Bar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [grid-auto-rows:10px]">
          {galleryImages.length > 0 ? (
            galleryImages.map((image, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative group overflow-hidden rounded-lg shadow-lg ${
                  image.colSpan ? "sm:col-span-2" : ""
                }`}
                style={{
                  gridRowEnd: `span ${image.rowSpan}`,
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300" />
                {/* <div className="absolute bottom-3 left-3 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                  {image.alt}
                </div> */}
              </motion.div>
            ))
          ) : (
            <p className="flex items-center justify-center text-gray-600 gap-3">
              <Loader className="animate-spin" />
              Loading gallery images...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
