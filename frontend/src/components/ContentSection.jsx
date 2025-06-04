import React from "react";

const ContentSection = () => {
  return (
    <section className="bg-[#610633] text-white py-20">
      <div className="max-w-[1600px] mx-auto  md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-snug text-[#F4CE14]">
            Welcome to 4 Donkeys Bar
          </h2>
          <p className="text-lg mb-5 leading-relaxed text-gray-300">
            At 4 Donkeys Bar, we blend bold flavors, timeless vibes, and genuine
            hospitality to create an atmosphere where good times are always on
            tap. Whether it's a quiet drink or a lively celebration — this is
            where you belong.
          </p>
          <p className="text-lg mb-10 leading-relaxed text-gray-400">
            Our bartenders pour passion into every cocktail. From crafted
            classics to unique seasonal blends, every drink tells a story worth
            sipping.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-[#F4CE14] font-semibold text-base uppercase">
                Operating Hours
              </h3>
              <p className="text-sm text-gray-300">Open Daily: 5 PM – 1 AM</p>
            </div>
            <div>
              <h3 className="text-[#F4CE14] font-semibold text-base uppercase">
                Location
              </h3>
              <p className="text-sm text-gray-300">
                The Octagon Wing, Amara Singapore
              </p>
            </div>
            <div>
              <h3 className="text-[#F4CE14] font-semibold text-base uppercase">
                Featured Cocktail
              </h3>
              <p className="text-sm text-gray-300">
                "Golden Mule" – our signature tropical blend
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <img
            src="/images/section1.jpg"
            alt="4 Donkeys Bar Scene"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-4 right-4 text-white text-3xl font-serif italic drop-shadow-lg">
            4 Donkeys
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
