import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance.js";

const MoreGallery = () => {
  const { section } = useParams();
  const [lightboxImage, setLightboxImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/gallery");
        const data = response.data.map((item, index) => ({
          id: item._id,
          title: item.category,
          description: item.description,
          mainImage: item.mainImage.imageUrl,
          align: index % 2 === 0 ? "left" : "right",
          images: item.images.map((img) => ({
            src: img.url,
            alt: img.alt || "Gallery Image",
          })),
        }));
        setCategories(data);
      } catch (error) {
        console.error("Error fetching gallery categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const matched = categories.find(
      (cat) => cat.id.toLowerCase() === section?.toLowerCase()
    );
    setCategory(matched || {});
  }, [categories, section]);

  const isCategoryValid = category && Object.keys(category).length > 0;

  if (!isCategoryValid) {
    return (
      <div className="text-center py-24">Loading or section not found...</div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar forceSolid={true} />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          {category.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {category.images.map((img, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setLightboxImage(img)}
            >
              <img
                src={img.src}
                alt={img.alt || `Image ${idx + 1}`}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Lightbox Viewer */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              key={lightboxImage.src}
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoreGallery;
