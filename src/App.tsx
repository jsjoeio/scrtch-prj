import React from "react"
import { TipTap } from "./components/TipTap"

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full px-4 sm:px-0">
        <div className="shadow-lg rounded-lg mx-2 my-2 h-[100vh] md:h-auto md:min-h-[800px] md:m-6 md:p-6">
          <h1 className="text-3xl font-extrabold mb-6">
            Digital Scratch Paper
          </h1>
          <TipTap />
        </div>
      </div>
    </div>
  )
}

export default App
