import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axiosInstance from "@/lib/axiosInstance.js";

const categories = [
  {
    id: "events",
    title: "Special Events",
    description:
      "From intimate gatherings to grand celebrations, experience the magic of our venue through the lens of unforgettable moments. Enjoy curated themes, customized décor, and world-class service that makes every occasion memorable. Whether it’s a private party or a corporate gala, our dedicated team ensures a flawless execution from start to finish.",
    mainImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    align: "right",
    images: [
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
        alt: "Corporate event setup",
      },
      {
        src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
        alt: "Birthday celebration",
      },
      {
        src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
        alt: "Wedding reception",
      },
      {
        src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        alt: "Live music night",
      },
      {
        src: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&w=800&q=80",
        alt: "Private party",
      },
      {
        src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        alt: "Holiday celebration",
      },
    ],
  },
  {
    id: "drinks",
    title: "Signature Cocktails",
    description:
      "Discover our artisanal cocktails, crafted with precision and passion by our expert mixologists using the finest ingredients. Each drink tells a story—infused with exotic flavors, premium spirits, and stunning presentation. Whether you crave the classics or adventurous blends, our cocktail list will elevate your night out.",
    mainImage:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
    align: "left",
    images: [
      {
        src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        alt: "Classic Mojito",
      },
      {
        src: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80",
        alt: "Espresso Martini",
      },
      {
        src: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80",
        alt: "Craft Beer Selection",
      },
      {
        src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
        alt: "Wine Collection",
      },
      {
        src: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
        alt: "Signature Cocktail",
      },
      {
        src: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=800&q=80",
        alt: "Seasonal Specials",
      },
    ],
  },
  {
    id: "venue",
    title: "Our Space",
    description:
      "Step into our carefully designed space, where modern aesthetics meet comfortable sophistication. Every corner is curated for ambience, offering the perfect blend of style and intimacy. With dynamic lighting, cozy nooks, and open layouts, our venue adapts beautifully to any event—be it a casual meet-up or a lavish party.",
    mainImage:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
    align: "right",
    images: [
      {
        src: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80",
        alt: "Main Bar Area",
      },
      {
        src: "https://images.unsplash.com/photo-1508253730651-e5ace80a7025?auto=format&fit=crop&w=800&q=80",
        alt: "Lounge Seating",
      },
      {
        src: "https://images.unsplash.com/photo-1517940310602-26535839fe84?auto=format&fit=crop&w=800&q=80",
        alt: "Private Booths",
      },
      {
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        alt: "Outdoor Patio",
      },
      {
        src: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?auto=format&fit=crop&w=800&q=80",
        alt: "VIP Section",
      },
      {
        src: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80",
        alt: "Dance Floor",
      },
    ],
  },
  {
    id: "crowd",
    title: "Vibrant Atmosphere",
    description:
      "Join our diverse community of patrons and experience the energetic atmosphere that makes us unique. From upbeat music and live performances to friendly faces and shared laughter, every visit feels like a celebration. Whether you’re dancing with friends or meeting someone new, our space thrives on connection and joy.",
    mainImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    align: "left",
    images: [
      {
        src: "https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=800&q=80",
        alt: "Weekend Crowd",
      },
      {
        src: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=800&q=80",
        alt: "Happy Hour",
      },
      {
        src: "https://images.unsplash.com/photo-1438557068880-c5f474830377?auto=format&fit=crop&w=800&q=80",
        alt: "Dance Night",
      },
      {
        src: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
        alt: "Social Gathering",
      },
      {
        src: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80",
        alt: "Bar Atmosphere",
      },
      {
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
        alt: "Event Crowd",
      },
    ],
  },
];
const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
<<<<<<< HEAD
  const [expandedSection, setExpandedSection] = useState(() => {
    const allIds = categories.map((category) => category.id);
    return new Set(allIds);
  });
  const [mainImages, setMainImages] = useState(() => {
    return categories.map(() => 0);
  });
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMainImages((prev) => {
        return prev.map((index, i) => {
          const total = categories[i].images.length;
          return (index + 1) % total;
        });
      });
      setDirection(1);
    }, 5000);
    return () => clearInterval(interval);
=======
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/gallery");
        console.log("Fetched categories:", response.data);
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
>>>>>>> 65cf35de9a7434742852319d5a3c2ee4977bda90
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
    setDirection(1);
    setCurrentImageIndex(newIndex);
    setLightboxImage(selectedCategory.images[newIndex]);
  };

  const prevImage = () => {
    if (!selectedCategory) return;
    const newIndex =
      (currentImageIndex - 1 + selectedCategory.images.length) %
      selectedCategory.images.length;
    setDirection(-1);
    setCurrentImageIndex(newIndex);
    setLightboxImage(selectedCategory.images[newIndex]);
  };

  const handleKeyPress = (e) => {
    if (lightboxImage) {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    }
  };

  const toggleSection = (id) => {
    setExpandedSection((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div
      className="min-h-screen bg-white"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <NavBar forceSolid={true} />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h1>
            <p className="text-xl text-gray-600">
              Explore the essence of 4 Donkeys Bar through our curated
              collection
            </p>
          </motion.div>

          <div className="space-y-8">
            {categories.map((category, i) => {
              const isExpanded = expandedSection.has(category.id);
              return (
                <div key={category.id} className="border-b pb-6">
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

<<<<<<< HEAD
                  <AnimatePresence initial={false}>
                    {isExpanded && (
=======
                {/* Category Info */}
                <div className="w-full lg:w-1/2">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {category.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {category.description}
                  </p>

                  {/* Image Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {category.images.slice(0, 6).map((image, index) => (
>>>>>>> 65cf35de9a7434742852319d5a3c2ee4977bda90
                      <motion.div
                        key="expand"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden px-6 pt-6"
                      >
                        <div
                          className={`flex flex-col ${
                            category.align === "left"
                              ? "lg:flex-row"
                              : "lg:flex-row-reverse"
                          } items-start gap-8 lg:gap-16`}
                        >
                          <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-2xl relative h-[300px]">
                              <AnimatePresence custom={direction}>
                                <motion.img
                                  key={category.images[mainImages[i]].src}
                                  src={category.images[mainImages[i]].src}
                                  alt={category.images[mainImages[i]].alt}
                                  className="absolute w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
                                  initial={{
                                    x: direction > 0 ? 100 : -100,
                                    opacity: 0,
                                  }}
                                  animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: {
                                      duration: 0.25,
                                      ease: "easeInOut",
                                      type: "tween",
                                    },
                                  }}
                                  exit={{
                                    x: direction > 0 ? -100 : 100,
                                    opacity: 0,
                                    transition: {
                                      duration: 0.25,
                                      ease: "easeInOut",
                                      type: "tween",
                                    },
                                  }}
                                />
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <p className="text-lg text-gray-600 mb-4">
                              {category.description}
                            </p>
                            <button
                              className="mb-6 px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#569d7d] transition"
                              onClick={() =>
                                (window.location.href = `/gallery/${category.id}`)
                              }
                            >
                              View More
                            </button>
                          </div>
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
