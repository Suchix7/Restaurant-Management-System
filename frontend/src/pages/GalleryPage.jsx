import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const categories = [
  {
    id: "events",
    title: "Special Events",
    description:
      "From intimate gatherings to grand celebrations, experience the magic of our venue through the lens of unforgettable moments.",
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
      "Discover our artisanal cocktails, crafted with precision and passion by our expert mixologists using the finest ingredients.",
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
      "Step into our carefully designed space, where modern aesthetics meet comfortable sophistication.",
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
      "Join our diverse community of patrons and experience the energetic atmosphere that makes us unique.",
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

  const handleKeyPress = (e) => {
    if (lightboxImage) {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    }
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

          <div className="space-y-32">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${
                  category.align === "left"
                    ? "lg:flex-row"
                    : "lg:flex-row-reverse"
                } items-center gap-8 lg:gap-16`}
              >
                {/* Main Category Image */}
                <div className="w-full lg:w-1/2">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => openLightbox(category, 0)}
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={category.mainImage}
                        alt={category.title}
                        className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    </div>
                  </div>
                </div>

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
                    {category.images.slice(1, 7).map((image, index) => (
                      <motion.div
                        key={image.src}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative group cursor-pointer aspect-square"
                        onClick={() => openLightbox(category, index + 1)}
                      >
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
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
