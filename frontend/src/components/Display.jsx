/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Display = ({ value }) => {
    return (
        <div className="bg-gray-900 text-white text-right p-4 text-2xl rounded-t-md">
            {value}
        </div>
    );
};

export default Display;
