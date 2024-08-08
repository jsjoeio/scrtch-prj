import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'scratchPaper';

export const ScratchPaper: React.FC = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const storedContent = localStorage.getItem(STORAGE_KEY);
    if (storedContent) {
      setContent(storedContent);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <textarea
        className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};