import { Editor } from "@tiptap/react";

export const BottomNavigation = ({ editor }: { editor: Editor | null }) => {
  const handleClearContent = () => {
    if (editor) {
      editor.commands.clearContent();
      editor.commands.focus("end");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-2">
      <a href="#" className="flex flex-col items-center">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Icon */}
        </svg>
        <span className="text-sm"></span>
      </a>
      <a href="#" className="flex flex-col items-center">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Icon */}
        </svg>
        <span className="text-sm"></span>
      </a>
      <button
        className="flex flex-col items-center"
        onClick={handleClearContent}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Icon */}
        </svg>
        <span className="text-sm">Clear</span>
      </button>
    </nav>
  );
};
