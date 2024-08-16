import React from "react";
import { TipTap } from "./components/TipTap";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const App: React.FC = () => {
  const today = new Date();
  const formattedDate = format(today, "d 'de' MMMM", { locale: es });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full">
        <div className="rounded-lg mx-2 my-2 h-[100vh] md:h-auto md:min-h-[800px] md:m-6 md:p-6">
          <h1 className="text-sm font-light mt-6 mb-8 ml-5 text-gray-500">{`el ${formattedDate}`}</h1>
          <TipTap />
        </div>
      </div>
    </div>
  );
};

export default App;
