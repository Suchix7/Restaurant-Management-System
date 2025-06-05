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
    mainImage: "/images/gallery/events-main.jpg",
    align: "right",
    images: [
      { src: "/images/gallery/events/1.jpg", alt: "Corporate event setup" },
      { src: "/images/gallery/events/2.jpg", alt: "Birthday celebration" },
      { src: "/images/gallery/events/3.jpg", alt: "Wedding reception" },
      { src: "/images/gallery/events/4.jpg", alt: "Live music night" },
      { src: "/images/gallery/events/5.jpg", alt: "Private party" },
      { src: "/images/gallery/events/6.jpg", alt: "Holiday celebration" },
    ],
  },
  {
    id: "drinks",
    title: "Signature Cocktails",
    description:
      "Discover our artisanal cocktails, crafted with precision and passion by our expert mixologists using the finest ingredients.",
    mainImage: "/images/gallery/drinks-main.jpg",
    align: "left",
    images: [
      { src: "/images/gallery/drinks/1.jpg", alt: "Classic Mojito" },
      { src: "/images/gallery/drinks/2.jpg", alt: "Espresso Martini" },
      { src: "/images/gallery/drinks/3.jpg", alt: "Craft Beer Selection" },
      { src: "/images/gallery/drinks/4.jpg", alt: "Wine Collection" },
      { src: "/images/gallery/drinks/5.jpg", alt: "Signature Cocktail" },
      { src: "/images/gallery/drinks/6.jpg", alt: "Seasonal Specials" },
    ],
  },
  {
    id: "venue",
    title: "Our Space",
    description:
      "Step into our carefully designed space, where modern aesthetics meet comfortable sophistication.",
    mainImage: "/images/gallery/venue-main.jpg",
    align: "right",
    images: [
      { src: "/images/gallery/venue/1.jpg", alt: "Main Bar Area" },
      { src: "/images/gallery/venue/2.jpg", alt: "Lounge Seating" },
      { src: "/images/gallery/venue/3.jpg", alt: "Private Booths" },
      { src: "/images/gallery/venue/4.jpg", alt: "Outdoor Patio" },
      { src: "/images/gallery/venue/5.jpg", alt: "VIP Section" },
      { src: "/images/gallery/venue/6.jpg", alt: "Dance Floor" },
    ],
  },
  {
    id: "crowd",
    title: "Vibrant Atmosphere",
    description:
      "Join our diverse community of patrons and experience the energetic atmosphere that makes us unique.",
    mainImage: "/images/gallery/crowd-main.jpg",
    align: "left",
    images: [
      { src: "/images/gallery/crowd/1.jpg", alt: "Weekend Crowd" },
      { src: "/images/gallery/crowd/2.jpg", alt: "Happy Hour" },
      { src: "/images/gallery/crowd/3.jpg", alt: "Dance Night" },
      { src: "/images/gallery/crowd/4.jpg", alt: "Social Gathering" },
      { src: "/images/gallery/crowd/5.jpg", alt: "Bar Atmosphere" },
      { src: "/images/gallery/crowd/6.jpg", alt: "Event Crowd" },
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
