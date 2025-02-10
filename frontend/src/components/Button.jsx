/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Button = ({ label, onClick }) => {
  return (
    <button
      className="w-1/4 p-4 text-xl bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export default Button;
