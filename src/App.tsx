import React from "react";
import { TipTap } from "./components/TipTap";

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full px-4 sm:px-0">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Digital Scratch Paper
          </h1>
          <TipTap />
        </div>
      </div>
    </div>
  );
};

export default App;
