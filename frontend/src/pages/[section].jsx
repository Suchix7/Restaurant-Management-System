import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

const MoreGallery = () => {
  const { section } = useParams();
  const [lightboxImage, setLightboxImage] = useState(null);

  const category = categories.find(
    (cat) => cat.id.toLowerCase() === section?.toLowerCase()
  );

  if (!category) {
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
