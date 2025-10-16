import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance.js";

// Define the core data for the component
const contactData = {
  address: "27 Albion St, Surry Hills, NSW 2010, Australia",
  email: "Fourdonkeysbar@gmail.com",
  phone: "+ 65 9621 1074",
  openingHours: [
    { days: "Sundays, Mondays & Tuesdays", hours: "6pm – 12am" },
    { days: "Wednesdays & Thursdays", hours: "6pm – 1am" },
    { days: "Fidays & Saturdays", hours: "6pm – 2am" },
  ],
  happyHour: "daily: 6pm – 7:30pm",
  disclaimer:
    "Entry is strictly for guests above the age of 18 years.\nThank you for your cooperation!",
};

// --- INSTAGRAM CONFIG ---
const instagramHandle = "@4donkeysbar";
const instagramUrl = `https://www.instagram.com/4donkeybar/`;

// Fallback Mock Data (Used if real data fetching fails or is blocked)
const fallbackPosts = [
  {
    id: 1,
    type: "video",
    url: "https://placehold.co/300x300/6A082D/FADCD9?text=LATEST+Video+Post",
    postLink: `${instagramUrl}/p/CkO6L4Fv3S3/`,
  },
  {
    id: 2,
    type: "image",
    url: "https://placehold.co/300x300/900C3F/FADCD9?text=LATEST+Image+Post",
    postLink: `${instagramUrl}/p/Cz9qNq0u2O2/`,
  },
  {
    id: 3,
    type: "video",
    url: "https://placehold.co/300x300/6A082D/FADCD9?text=LATEST+Bar+Clip",
    postLink: `${instagramUrl}/p/Cy0XQ78p1C1/`,
  },
];

// Utility function to handle redirection to specific post links
const handlePostRedirect = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const Footer = () => {
  const [posts, setPosts] = useState([]); // unified array (either admin-managed or fallback)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch admin-managed posts
        const { data } = await axiosInstance.get("/admin/posts");
        const sorted = (data || [])
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // cap to 3, newest first
        if (sorted.length) {
          setPosts(sorted);
        } else {
          // no posts in db -> show fallback
          setPosts(fallbackPosts);
        }
      } catch (e) {
        // fallback on error
        setError("Showing sample posts.");
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className=" bg-[#435644] text-white font-inter antialiased p-8 md:p-16 flex items-start justify-center">
        {/* Main Content Grid */}
        <div className="container max-w-[1600px] w-full ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {/* 1. Left Column: Contact Information */}
            <div className="space-y-8 pb-10">
              {/* Visit Us / Address */}
              <div>
                <h3 className="text-xl font-serif-alt font-bold mb-2 tracking-wide">
                  Visit Us
                </h3>
                <p className="text-base leading-relaxed whitespace-pre-line text-maroon-light/90">
                  {contactData.address}
                </p>
              </div>

              {/* All Enquiries / Email */}
              <div>
                <h3 className="text-xl font-serif-alt font-bold mb-2 tracking-wide">
                  All Enquiries
                </h3>
                <a
                  href={`mailto:${contactData.email}`}
                  className="text-base text-maroon-light/90 hover:text-maroon-light transition duration-200"
                >
                  {contactData.email}
                </a>
              </div>

              {/* Phone */}
              <div>
                <h3 className="text-xl font-serif-alt font-bold mb-2 tracking-wide">
                  Phone
                </h3>
                <a
                  href={`tel:${contactData.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-base text-maroon-light/90 hover:text-maroon-light transition duration-200"
                >
                  {contactData.phone}
                </a>
              </div>

              {/* Opening Hours */}
              <div>
                <h3 className="text-xl font-serif-alt font-bold mb-3 tracking-wide">
                  Opening Hours
                </h3>
                <div className="space-y-1">
                  {contactData.openingHours.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-base text-maroon-light/90"
                    >
                      <span className="font-medium">{item.days}</span>
                      <span>{item.hours}</span>
                    </div>
                  ))}
                </div>
                {/* Happy Hour */}
                <div className="mt-4">
                  <p className="text-base font-bold text-maroon-light/90">
                    Happy Hour:{" "}
                    <span className="font-normal">{contactData.happyHour}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Right Column: Instagram Feed and Link */}
            <div className="space-y-4 md:pl-8 pt-8 md:pt-0">
              {/* Follow Us Link - Matches the top-right text alignment */}
              <div className="flex flex-col mb-6">
                <h3 className="text-xl font-serif-alt font-bold tracking-wide">
                  Follow us
                </h3>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-maroon-light hover:text-maroon-light/70 transition duration-200 underline underline-offset-4 decoration-1 decoration-maroon-light/50"
                >
                  {instagramHandle}
                </a>
              </div>

              {/* Latest 3 Posts Gallery (newest first) */}
              <div className="flex space-x-3 md:space-x-4 overflow-x-auto p-1 -m-1 justify-start">
                {loading && (
                  <div className="text-maroon-light/70 text-lg p-4">
                    Loading latest posts...
                  </div>
                )}

                {!loading &&
                  posts.map((post) => {
                    // Normalize fields for both DB-backed and fallback items
                    const key = post._id || post.id;
                    const imageUrl = post.image?.imageUrl || post.url;
                    const linkUrl = post.linkUrl || post.postLink;

                    return (
                      <div
                        key={key}
                        className="relative flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 cursor-pointer rounded-sm shadow-xl overflow-hidden group transition duration-300 transform hover:scale-[1.02] hover:shadow-2xl ring-2 ring-maroon-light/20"
                        onClick={() => handlePostRedirect(linkUrl)}
                        aria-label={`Open post ${key}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handlePostRedirect(linkUrl);
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`Post ${key}`}
                          className="w-full h-full object-cover transition duration-500 group-hover:opacity-80 bg-maroon-dark"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/300x300/4D0219/FADCD9?text=Image+Unavailable";
                          }}
                        />

                        {/* Optional overlay if you carry `type` for fallback */}
                        {post.type === "video" && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-white/90"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Error/Status Message */}
              <p
                className={`text-sm pt-2 italic ${
                  error ? "text-red-300" : "text-maroon-light/60"
                }`}
              >
                {error ||
                  "Showing the 3 most recent posts. Click an image to open its link."}
              </p>
            </div>
          </div>

          {/* Disclaimer at the bottom */}
          <div className="mt-16 pt-8 border-t border-maroon-light/30 text-left">
            <p className="text-base italic leading-relaxed whitespace-pre-line text-maroon-light/90">
              {contactData.disclaimer}
            </p>
          </div>
        </div>
      </div>{" "}
      <div className="flex justify-center bg-[#7e9e78] text-white">
        <div className=" w-full max-w-[1600px] flex flex-col items-start p-8 space-y-4">
          {/* Social Media */}
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://www.facebook.com/people/4Donkey-Bar/61570263453541/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/4donkeybar/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              <FaInstagram />
            </a>
          </div>

          {/* Title */}
          <h2 className="text-xl  font-bold ">Four Donkeys Bar</h2>

          {/* Address */}
          <p className="text-sm font-semibold max-w-lg">
            27 Albion St, Surry Hills, NSW 2010, Australia
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
