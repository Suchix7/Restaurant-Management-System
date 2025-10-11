import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRef } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axiosInstance from "@/lib/axiosInstance.js";
import EventLogoButton from "@/components/EventLogoButton";
import Spinner from "@/components/Spinner";

const GalleryPage = () => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expandedSection, setExpandedSection] = useState(new Set());
  const [tagline, setTagline] = useState("");
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/gallery");
        const data = response.data.map((item, index) => ({
          id: item._id,
          title: item.category,
          description: item.description,
          align: index % 2 === 0 ? "left" : "right",
          images: [
            { src: item.mainImage.imageUrl, alt: "Main Image" },
            ...item.images.map((img) => ({
              src: img.url,
              alt: img.alt || "Gallery Image",
            })),
          ],
        }));
        setCategories(data);
        setExpandedSection(new Set(data.map((category) => category.id)));

        // create refs
        const refs = {};
        data.forEach((cat) => {
          refs[cat.id] = React.createRef();
        });
        sectionRefs.current = refs;
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    const fetchTagline = async () => {
      try {
        const res = await axiosInstance.get("/gallery-tagline");
        setTagline(res.data.tagline || "");
      } catch (error) {
        toast.error("Failed to load tagline.");
        setTagline("");
      }
    };

    fetchCategories();
    fetchTagline();
  }, []);

  const openLightbox = (category, index) => {
    setSelectedCategory(category);
    setCurrentImageIndex(index);
    setLightboxImage(category.images[index]);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedCategory) return;
    const newIndex = (currentImageIndex + 1) % selectedCategory.images.length;
    setCurrentImageIndex(newIndex);
    setLightboxImage(selectedCategory.images[newIndex]);
  };

  const prevImage = () => {
    if (!selectedCategory) return;
    const newIndex =
      (currentImageIndex - 1 + selectedCategory.images.length) %
      selectedCategory.images.length;
    setCurrentImageIndex(newIndex);
    setLightboxImage(selectedCategory.images[newIndex]);
  };

  const toggleSection = (id) => {
    setExpandedSection((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleKeyPress = (e) => {
    if (!lightboxImage) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <div
      className="min-h-screen bg-white"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <NavBar forceSolid={true} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h1>
            <p className="text-xl text-gray-600">
              {tagline || "A glimpse into our world"}
            </p>
          </motion.div>
          {categories.length > 0 ? (
            <div className="py-4 mb-6">
              <div className="container mx-auto px-4 flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setExpandedSection((prev) =>
                        new Set(prev).add(category.id)
                      );
                      setTimeout(() => {
                        const ref = sectionRefs.current[category.id]?.current;
                        if (ref) {
                          const offsetTop =
                            ref.getBoundingClientRect().top +
                            window.scrollY -
                            100;
                          window.scrollTo({
                            top: offsetTop,
                            behavior: "smooth",
                          });
                        }
                      }, 300);
                    }}
                    className="bg-[#788A78] text-white text-base px-6 py-2.5 rounded-lg hover:bg-green-800 transition-all shadow-sm hover:shadow-md font-medium tracking-wide border border-gray-300"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Spinner color="gray" />
            </div>
          )}

          <div className="space-y-8">
            {categories.map((category) => {
              const isExpanded = expandedSection.has(category.id);
              return (
                <div
                  key={category.id}
                  ref={sectionRefs.current[category.id]}
                  className="border-b pb-6"
                >
                  <div
                    onClick={() => toggleSection(category.id)}
                    className="flex items-center justify-between cursor-pointer py-4 px-6 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {category.title}
                    </h2>
                    <div className="text-gray-600">
                      {isExpanded ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expand"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden px-6 pt-6"
                      >
                        <p className="text-lg text-gray-600 mb-4">
                          {category.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {category.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="cursor-pointer rounded-lg overflow-hidden"
                              onClick={() => openLightbox(category, idx)}
                            >
                              <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <motion.img
              key={lightboxImage.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
