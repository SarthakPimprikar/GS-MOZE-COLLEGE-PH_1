import React from "react";
const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${
        hover ? "hover:shadow-lg transition-all duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
//sample
export default Card;
