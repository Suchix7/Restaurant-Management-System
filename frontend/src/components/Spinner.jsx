import React from "react";

const colorMap = {
  blue: "border-blue-500",
  red: "border-red-500",
  green: "border-green-500",
  yellow: "border-yellow-400",
  gray: "border-gray-400",
};

const Spinner = ({ color = "blue" }) => {
  const borderClass = colorMap[color] || colorMap.blue;

  return (
    <div className="flex justify-center items-center py-10">
      <div
        className={`w-10 h-10 border-4 ${borderClass} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
