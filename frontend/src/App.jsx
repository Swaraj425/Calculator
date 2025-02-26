/* eslint-disable no-unused-vars */
import React from "react";
import Calculator from "./components/Calculator";

export const url = "https://calculator-backend-psi.vercel.app"

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Calculator />
    </div>
  );
}

export default App;
