import React from "react";

const Gallery = () => {
  return (
    <div>
      {" "}
      {/* Cocktail Gallery */}
      <section className="bg-pink-200 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cocktail 1 */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-lg overflow-hidden h-80">
              <img
                src="/placeholder.svg?height=320&width=300"
                alt="White Cocktail"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cocktail 2 */}
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg overflow-hidden h-80">
              <img
                src="/placeholder.svg?height=320&width=300"
                alt="Red Cocktail"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bar Scene */}
            <div className="bg-amber-800 rounded-lg overflow-hidden h-80 md:col-span-2 lg:col-span-1">
              <img
                src="/placeholder.svg?height=320&width=300"
                alt="Bartenders at work"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Martini */}
            <div className="bg-gradient-to-br from-gray-400 to-teal-400 rounded-lg overflow-hidden h-80 md:col-span-1 lg:col-span-2">
              <img
                src="/placeholder.svg?height=320&width=600"
                alt="Martini Glass"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
