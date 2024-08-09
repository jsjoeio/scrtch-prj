import React, { useState, useCallback } from "react";
import { getStoredContent, storeContent } from "../utils/localStorage";

export const ScratchPaper: React.FC = () => {
  const [content, setContent] = useState<string>(() => getStoredContent());

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setContent(newContent);
      storeContent(newContent);
    },
    []
  );

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <textarea
        className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={content}
        onChange={handleChange}
      />
    </div>
  );
};
