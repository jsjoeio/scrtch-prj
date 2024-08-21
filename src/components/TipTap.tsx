import "./styles.scss";

import { EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import { BubbleMenu } from "./BubbleMenu";
import StarterKit from "@tiptap/starter-kit";
import { getStoredContent, storeContent } from "../utils/localStorage";
import { useEffect } from "react";
import { BottomNavigation } from "./BottomNavigation";
import Link from "@tiptap/extension-link";

export const TipTap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    content: JSON.parse(getStoredContent()),
    // triggered on every change
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      storeContent(JSON.stringify(json));
      // send the content to an API here
    },
  });

  useEffect(() => {
    if (editor) {
      // maybe focus on ios devices
      // https://github.com/ueberdosis/tiptap/issues/389#issuecomment-512991733
      editor.commands.focus("end");
    }
  }, [editor]);

  return (
    <>
      {editor && <BubbleMenu editor={editor} />}

      {editor && (
        <FloatingMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            Bullet list
          </button>
        </FloatingMenu>
      )}

      <EditorContent
        editor={editor}
        style={{
          border: "black",
        }}
      />
      <BottomNavigation editor={editor} />
    </>
  );
};
