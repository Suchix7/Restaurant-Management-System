// components/EventLogoButton.jsx
import React from "react";

function EventLogoButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-4 cursor-pointer md:left-20 md:-translate-y-1/2 z-50 transition-all hover:scale-105 active:scale-95"
      style={{
        width: "160px",
        background: "transparent",
        padding: 0,
        border: "none",
      }}
    >
      <img
        src="/images/cocktaillogo.png"
        alt="Cocktail Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))", // Glow effect
        }}
      />
    </button>
  );
}

export default EventLogoButton;
