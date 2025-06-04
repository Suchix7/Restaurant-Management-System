import React from "react";

const ContentSection = () => {
  return (
    <div>
      {/* Contemporary Cocktails Section */}
      <section className="bg-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Contemporary Cocktails, Convivial Hospitality
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              Jigger & Pony embodies craft with a classic bent. Nowhere is great
              that we're good enough, so expect us all.
            </p>
            <p className="text-lg mb-8 leading-relaxed">
              Our bartenders are passionate about what they do. Our passion for
              change and the possibilities it holds, combined with our love of
              great cocktails and food, makes us who we are.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-yellow-400 font-semibold">
                  EMBRACE. Drink
                </h3>
                <p className="text-sm">Open: Mon - Sun | 5pm - 1am</p>
              </div>
              <div>
                <h3 className="text-yellow-400 font-semibold">
                  Find A New Drink
                </h3>
              </div>
              <div>
                <h3 className="text-yellow-400 font-semibold">Visit Us</h3>
                <p className="text-sm">Amara Singapore (the Octagon wing)</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/placeholder.svg?height=500&width=400"
              alt="Bar Scene"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute bottom-4 right-4 text-white text-4xl font-script">
              embrace
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentSection;
