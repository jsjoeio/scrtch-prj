import "./styles.scss"

import { EditorContent, FloatingMenu, useEditor } from "@tiptap/react"
import { BubbleMenu } from "./BubbleMenu"
import StarterKit from "@tiptap/starter-kit"
import { getStoredContent, storeContent } from "../utils/localStorage"
import { useEffect } from "react"
import { BottomNavigation } from "./BottomNavigation"
import Link from "@tiptap/extension-link"
import { ActiveDay } from "../App"

type Props = {
  activeDay: ActiveDay
}

export const TipTap = ({ activeDay }: Props) => {
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
    content: JSON.parse(getStoredContent(activeDay)),
    // triggered on every change
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      storeContent(activeDay, JSON.stringify(json))
      // send the content to an API here
    },
  })

  useEffect(() => {
    if (editor) {
      // maybe focus on ios devices
      // https://github.com/ueberdosis/tiptap/issues/389#issuecomment-512991733
      // randomly found that 5 is the first bullet point
      editor.commands.focus(5)
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(JSON.parse(getStoredContent(activeDay)))
    }
  }, [activeDay, editor])

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
  )
}
