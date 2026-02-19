import "./styles.scss"

import { EditorContent, FloatingMenu, useEditor } from "@tiptap/react"
import type { JSONContent } from "@tiptap/core"
import { BubbleMenu } from "./BubbleMenu"
import StarterKit from "@tiptap/starter-kit"
import { getStoredContent, storeContent } from "../utils/localStorage"
import { useCallback, useEffect, useRef } from "react"
import { BottomNavigation } from "./BottomNavigation"
import Link from "@tiptap/extension-link"
import { ActiveDay } from "../App"
import { CustomStrike } from "../extensions/CustomStrike"

type Props = {
  activeDay: ActiveDay
}

const getNextDay = (day: ActiveDay): ActiveDay | null => {
  if (day === "dia1") return "dia2"
  if (day === "dia2") return "dia1"
  return null // apuntes has no next day
}

export const TipTap = ({ activeDay }: Props) => {
  // Use a ref to track the current activeDay so the onUpdate callback always has the latest value
  const activeDayRef = useRef<ActiveDay>(activeDay)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        strike: false, // Disable the default Strike extension
      }),
      CustomStrike, // Use our custom Strike extension with Cmd+. shortcut
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
      // Use the ref to get the current activeDay value
      storeContent(activeDayRef.current, JSON.stringify(json))
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
    // Update the ref whenever activeDay changes
    activeDayRef.current = activeDay
    
    if (editor) {
      editor.commands.setContent(JSON.parse(getStoredContent(activeDay)))
    }
  }, [activeDay, editor])

  const handleMoveToNextDay = useCallback(() => {
    if (!editor) return

    const { state } = editor
    const { from, to } = state.selection

    if (from === to) return // No selection

    const nextDay = getNextDay(activeDayRef.current)
    if (!nextDay) return // apuntes has no next day

    const nextDayContent = JSON.parse(getStoredContent(nextDay))

    // Get the selected slice
    const slice = state.doc.slice(from, to)

    // Collect inline nodes from the selection to build a single listItem
    const inlineNodes: JSONContent[] = []

    slice.content.forEach((node) => {
      if (node.isInline || node.type.name === "text") {
        inlineNodes.push(node.toJSON())
      } else if (node.type.name === "paragraph") {
        node.content?.forEach((child) => inlineNodes.push(child.toJSON()))
      } else if (node.type.name === "listItem") {
        node.content?.forEach((child) => {
          if (child.type.name === "paragraph") {
            child.content?.forEach((textNode) => inlineNodes.push(textNode.toJSON()))
          }
        })
      }
    })

    if (inlineNodes.length === 0) return

    const newListItem: JSONContent = {
      type: "listItem",
      content: [{ type: "paragraph", content: inlineNodes }],
    }

    // Find the first orderedList in next day's content and append the item to it
    let foundOrderedList = false
    if (nextDayContent.content) {
      for (let i = 0; i < nextDayContent.content.length; i++) {
        if (nextDayContent.content[i].type === "orderedList") {
          nextDayContent.content[i] = {
            ...nextDayContent.content[i],
            content: [...(nextDayContent.content[i].content || []), newListItem],
          }
          foundOrderedList = true
          break
        }
      }
    }

    // If no orderedList found, create one
    if (!foundOrderedList) {
      nextDayContent.content = [
        ...(nextDayContent.content || []),
        { type: "orderedList", attrs: { start: 1 }, content: [newListItem] },
      ]
    }

    storeContent(nextDay, JSON.stringify(nextDayContent))

    // Delete selection from current day
    editor.chain().focus().deleteSelection().run()
  }, [editor])

  // Register Mod+Shift+M keyboard shortcut to move selection to next day
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "m"
      ) {
        if (editor.isFocused) {
          event.preventDefault()
          handleMoveToNextDay()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [editor, handleMoveToNextDay])

  return (
    <>
      {editor && <BubbleMenu editor={editor} activeDay={activeDay} onMoveToNextDay={handleMoveToNextDay} />}

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
