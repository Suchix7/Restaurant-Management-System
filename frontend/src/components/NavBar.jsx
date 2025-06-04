import React from "react";

const NavBar = () => {
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                VISIT
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                DRINKS
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                PRIVATE DINING
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                EVENTS
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                GIFT VOUCHERS
              </a>
            </div>

            <div className="flex items-center">
              <img
                src="/placeholder.svg?height=40&width=120"
                alt="Jigger & Pony"
                className="h-10"
              />
            </div>

            <div className="flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                ABOUT
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                PRESS
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                CONTACT
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
