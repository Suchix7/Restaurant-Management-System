import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance.js";

const contactData = {
  address: "27 Albion St, Surry Hills, NSW 2010, Australia",
  email: "Fourdonkeysbar@gmail.com",
  phone: "+ 65 9621 1074",
  openingHours: [
    { days: "Sundays, Mondays & Tuesdays", hours: "6pm – 12am" },
    { days: "Wednesdays & Thursdays", hours: "6pm – 1am" },
    { days: "Fridays & Saturdays", hours: "6pm – 2am" },
  ],
  happyHour: "Daily: 6pm – 7:30pm",
  disclaimer:
    "Entry is strictly for guests above the age of 18 years.\nThank you for your cooperation!",
};

const instagramHandle = "@4donkeysbar";
const instagramUrl = `https://www.instagram.com/4donkeybar/`;

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

const handlePostRedirect = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const Footer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/admin/posts");
        const sorted = (data || [])
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setPosts(sorted.length ? sorted : fallbackPosts);
      } catch (e) {
        setError("Showing sample posts.");
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <footer className="bg-[#435644] text-white font-inter antialiased px-6 py-12 md:px-16 lg:px-24">
        <div className="container max-w-[1600px] mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-serif-alt font-bold mb-2 tracking-wide">
                  Visit Us
                </h3>
                <p className="text-base leading-relaxed text-maroon-light/90">
                  {contactData.address}
                </p>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-serif-alt font-bold mb-2 tracking-wide">
                  All Enquiries
                </h3>
                <a
                  href={`mailto:${contactData.email}`}
                  className="text-base text-maroon-light/90 hover:text-maroon-light transition duration-200"
                >
                  {contactData.email}
                </a>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-serif-alt font-bold mb-2 tracking-wide">
                  Phone
                </h3>
                <a
                  href={`tel:${contactData.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-base text-maroon-light/90 hover:text-maroon-light transition duration-200"
                >
                  {contactData.phone}
                </a>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-serif-alt font-bold mb-3 tracking-wide">
                  Opening Hours
                </h3>
                <div className="space-y-2">
                  {contactData.openingHours.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm md:text-base text-maroon-light/90"
                    >
                      <span className="font-medium">{item.days}</span>
                      <span>{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-base font-bold text-maroon-light/90">
                    Happy Hour:{" "}
                    <span className="font-normal">{contactData.happyHour}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Instagram Feed */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-serif-alt font-bold tracking-wide">
                  Follow Us
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

              {/* Posts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading && (
                  <div className="col-span-full text-maroon-light/70 text-lg p-4">
                    Loading latest posts...
                  </div>
                )}

                {!loading &&
                  posts.map((post) => {
                    const key = post._id || post.id;
                    const imageUrl = post.image?.imageUrl || post.url;
                    const linkUrl = post.linkUrl || post.postLink;

                    return (
                      <div
                        key={key}
                        className="relative w-full h-72 cursor-pointer rounded-xl shadow-lg overflow-hidden group 
                       transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        onClick={() => handlePostRedirect(linkUrl)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Post ${key}`}
                          className="w-full h-full object-cover group-hover:opacity-85 transition duration-500 bg-maroon-dark"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/400x600/4D0219/FADCD9?text=Image+Unavailable";
                          }}
                        />
                        {post.type === "video" && (
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-white/90"
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
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pt-6 border-t border-maroon-light/30">
            <p className="text-sm md:text-base italic leading-relaxed whitespace-pre-line text-maroon-light/90">
              {contactData.disclaimer}
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="flex justify-center bg-[#7e9e78] text-white">
        <div className="w-full max-w-[1600px] flex flex-col sm:flex-row sm:items-center justify-between p-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-5 text-2xl">
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

          <div className="text-center sm:text-right">
            <h2 className="text-lg md:text-xl font-bold">Four Donkeys Bar</h2>
            <p className="text-sm md:text-base font-medium">
              {contactData.address}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
