import "./styles.scss"

import { EditorContent, FloatingMenu, useEditor } from "@tiptap/react"
import type { JSONContent } from "@tiptap/core"
import { TextSelection } from "@tiptap/pm/state"
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

    // Find the parent listItem node containing the selection start
    const $from = state.doc.resolve(from)
    let listItemDepth = -1
    for (let depth = $from.depth; depth >= 0; depth--) {
      if ($from.node(depth).type.name === "listItem") {
        listItemDepth = depth
        break
      }
    }

    let newListItem: JSONContent
    let deleteFrom: number
    let deleteTo: number
    let sourceListType = "bulletList"

    if (listItemDepth !== -1) {
      // Move the entire listItem (including any nested sub-bullets)
      const listItemNode = $from.node(listItemDepth)
      const listItemPos = $from.before(listItemDepth)
      newListItem = listItemNode.toJSON()
      deleteFrom = listItemPos
      deleteTo = listItemPos + listItemNode.nodeSize
      // Detect the parent list type to preserve it when creating a new list
      if (listItemDepth > 0) {
        const parentNode = $from.node(listItemDepth - 1)
        if (parentNode.type.name === "orderedList" || parentNode.type.name === "bulletList") {
          sourceListType = parentNode.type.name
        }
      }
    } else {
      // Fallback: collect inline nodes from selection for non-list content
      const slice = state.doc.slice(from, to)
      const inlineNodes: JSONContent[] = []
      slice.content.forEach((node) => {
        if (node.isInline || node.type.name === "text") {
          inlineNodes.push(node.toJSON())
        } else if (node.type.name === "paragraph") {
          node.content?.forEach((child) => inlineNodes.push(child.toJSON()))
        }
      })
      if (inlineNodes.length === 0) return
      newListItem = {
        type: "listItem",
        content: [{ type: "paragraph", content: inlineNodes }],
      }
      deleteFrom = from
      deleteTo = to
    }

    // Find the first list in next day's content and append the item
    let foundList = false
    if (nextDayContent.content) {
      for (let i = 0; i < nextDayContent.content.length; i++) {
        const nodeType = nextDayContent.content[i].type
        if (nodeType === "orderedList" || nodeType === "bulletList") {
          const items: JSONContent[] = nextDayContent.content[i].content || []
          // Find index of first empty listItem (paragraph with no content or empty content)
          const emptyIdx = items.findIndex((item) => {
            const para = item.content?.[0]
            return para?.type === "paragraph" && (!para.content || para.content.length === 0)
          })
          const updatedItems =
            emptyIdx !== -1
              ? items.map((item, idx) => (idx === emptyIdx ? newListItem : item))
              : [...items, newListItem]
          nextDayContent.content[i] = {
            ...nextDayContent.content[i],
            content: updatedItems,
          }
          foundList = true
          break
        }
      }
    }

    // If no list found, create one matching the source list type
    if (!foundList) {
      const newListAttrs = sourceListType === "orderedList" ? { start: 1 } : {}
      nextDayContent.content = [
        ...(nextDayContent.content || []),
        { type: sourceListType, attrs: newListAttrs, content: [newListItem] },
      ]
    }

    storeContent(nextDay, JSON.stringify(nextDayContent))

    // Delete the moved content from the current day
    editor.chain().focus().command(({ tr }) => {
      tr.delete(deleteFrom, deleteTo)
      return true
    }).run()
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

  const handleMoveListItem = useCallback(
    (direction: "up" | "down"): boolean => {
      if (!editor) return false

      const { state, view } = editor
      const { $from } = state.selection

      // Find the nearest listItem ancestor containing the cursor
      let listItemDepth = -1
      for (let depth = $from.depth; depth >= 0; depth--) {
        if ($from.node(depth).type.name === "listItem") {
          listItemDepth = depth
          break
        }
      }
      if (listItemDepth <= 0) return false

      const listItem = $from.node(listItemDepth)
      const parentList = $from.node(listItemDepth - 1)
      const parentTypeName = parentList.type.name
      if (parentTypeName !== "orderedList" && parentTypeName !== "bulletList") {
        return false
      }

      const indexInParent = $from.index(listItemDepth - 1)
      const itemCount = parentList.childCount
      if (direction === "up" && indexInParent === 0) return false
      if (direction === "down" && indexInParent === itemCount - 1) return false

      const listItemPos = $from.before(listItemDepth)
      const cursorOffsetInItem = $from.pos - listItemPos

      const tr = state.tr
      let newListItemPos: number
      if (direction === "up") {
        const prevItem = parentList.child(indexInParent - 1)
        const prevItemPos = listItemPos - prevItem.nodeSize
        tr.delete(listItemPos, listItemPos + listItem.nodeSize)
        tr.insert(prevItemPos, listItem)
        newListItemPos = prevItemPos
      } else {
        const nextItem = parentList.child(indexInParent + 1)
        tr.delete(listItemPos, listItemPos + listItem.nodeSize)
        tr.insert(listItemPos + nextItem.nodeSize, listItem)
        newListItemPos = listItemPos + nextItem.nodeSize
      }

      // Restore selection near the cursor's original offset within the moved item
      const targetPos = newListItemPos + cursorOffsetInItem
      const mappedPos = Math.min(Math.max(targetPos, newListItemPos + 1), tr.doc.content.size)
      tr.setSelection(TextSelection.near(tr.doc.resolve(mappedPos)))
      tr.scrollIntoView()

      view.dispatch(tr)
      return true
    },
    [editor]
  )

  // Register Alt+ArrowUp / Alt+ArrowDown to reorder the current list item
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
      if (!editor.isFocused) return

      const direction = event.key === "ArrowUp" ? "up" : "down"
      if (handleMoveListItem(direction)) {
        event.preventDefault()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [editor, handleMoveListItem])

  const handleDuplicateListItem = useCallback((): boolean => {
    if (!editor) return false

    const { state, view } = editor
    const { $from } = state.selection

    // Find the nearest listItem ancestor containing the cursor
    let listItemDepth = -1
    for (let depth = $from.depth; depth >= 0; depth--) {
      if ($from.node(depth).type.name === "listItem") {
        listItemDepth = depth
        break
      }
    }
    if (listItemDepth <= 0) return false

    const parentList = $from.node(listItemDepth - 1)
    // Only duplicate in ordered lists
    if (parentList.type.name !== "orderedList") return false

    const listItem = $from.node(listItemDepth)
    const listItemPos = $from.before(listItemDepth)

    const tr = state.tr
    // Insert a copy of the current item right after it
    const insertPos = listItemPos + listItem.nodeSize
    tr.insert(insertPos, listItem.copy(listItem.content))

    // Move cursor to the start of the duplicated item's text
    const targetPos = insertPos + 2 // +1 to enter listItem, +1 to enter paragraph
    tr.setSelection(TextSelection.near(tr.doc.resolve(targetPos)))
    tr.scrollIntoView()

    view.dispatch(tr)
    return true
  }, [editor])

  // Register Alt+D to duplicate the current numbered list item
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.key.toLowerCase() !== "d") return
      if (!editor.isFocused) return

      if (handleDuplicateListItem()) {
        event.preventDefault()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [editor, handleDuplicateListItem])

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
