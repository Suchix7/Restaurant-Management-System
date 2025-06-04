import React from "react";

const BrandSection = () => {
  return (
    <div>
      {" "}
      {/* Brand Logos */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <img
              src="/placeholder.svg?height=60&width=200"
              alt="Jigger & Pony Group"
              className="mx-auto mb-8"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Humpback"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Sugar Hall"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Gibson"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Fernet"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Colmo"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Rosehead"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Live Turtle"
              className="mx-auto opacity-60 hover:opacity-100"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Pony"
              className="mx-auto opacity-60 hover:opacity-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandSection;
