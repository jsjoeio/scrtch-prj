import React from "react";
import { TipTap } from "./components/TipTap";
import { FormattedDate } from "./components/FormattedDate";

const App: React.FC = () => {
  const today = new Date();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full">
        <div className="rounded-lg mx-2 my-2 h-[100vh] md:h-auto md:min-h-[800px] md:m-6 md:p-6">
          <FormattedDate date={today} />
          <TipTap />
        </div>
      </div>
    </div>
  );
};

export default App;
