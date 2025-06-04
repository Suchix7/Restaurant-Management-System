import React from "react";

const Newletter = () => {
  return (
    <div>
      {" "}
      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-yellow-400 to-red-600 py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Subscribe</h2>
          <p className="text-white mb-8">
            Stay up to date with our latest news and updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Newletter;
