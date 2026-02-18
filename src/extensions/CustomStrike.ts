import Strike from '@tiptap/extension-strike'
import type { JSONContent } from '@tiptap/core'

/**
 * Checks if a list item has strikethrough applied to any of its text
 */
function hasStrikethrough(listItem: JSONContent): boolean {
  if (!listItem.content) return false
  
  return listItem.content.some((node: JSONContent) => {
    if (node.type === 'paragraph' && node.content) {
      return node.content.some((textNode: JSONContent) => {
        return textNode.marks?.some((mark) => mark.type === 'strike')
      })
    }
    return false
  })
}

/**
 * Reorders list items in ordered lists so that strikethrough items
 * appear at the top, maintaining their relative order
 */
function reorderOrderedLists(doc: JSONContent): boolean {
  if (!doc.content) return false
  
  let hasChanges = false
  
  doc.content.forEach((node: JSONContent) => {
    if (node.type === 'orderedList' && node.content) {
      const items = node.content
      const strikethroughItems: JSONContent[] = []
      const normalItems: JSONContent[] = []
      
      items.forEach((item: JSONContent) => {
        if (hasStrikethrough(item)) {
          strikethroughItems.push(item)
        } else {
          normalItems.push(item)
        }
      })
      
      // Only reorder if there are strikethrough items and they're not already at the top
      if (strikethroughItems.length > 0) {
        const newContent = [...strikethroughItems, ...normalItems]
        // Check if order actually changed
        const orderChanged = !items.every((item, index) => item === newContent[index])
        if (orderChanged) {
          node.content = newContent
          hasChanges = true
        }
      }
    }
    
    // Recursively process nested content
    if (node.content) {
      const nestedChanges = reorderOrderedLists(node)
      hasChanges = hasChanges || nestedChanges
    }
  })
  
  return hasChanges
}

/**
 * Custom Strike extension that:
 * 1. Overrides the default keyboard shortcut from Mod-Shift-s to Mod-. (Cmd+. on macOS, Ctrl+. on other platforms)
 * 2. Automatically reorders numbered list items when strikethrough is toggled,
 *    moving strikethrough items to the top of the list
 */
export const CustomStrike = Strike.extend({
  addStorage() {
    return {
      isReordering: false,
    }
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-.': () => this.editor.commands.toggleStrike(),
    }
  },
  
  onUpdate() {
    // Prevent re-entrant calls
    if (this.storage.isReordering) {
      return
    }
    
    // Use queueMicrotask to run after the current update is complete
    queueMicrotask(() => {
      if (!this.editor.isDestroyed && !this.storage.isReordering) {
        const json = this.editor.getJSON()
        const hasChanges = reorderOrderedLists(json)
        
        if (hasChanges) {
          // Set flag to prevent re-entrant calls
          this.storage.isReordering = true
          
          // Update content without adding to undo history
          this.editor.commands.setContent(json, false)
          
          // Reset flag after update completes
          queueMicrotask(() => {
            this.storage.isReordering = false
          })
        }
      }
    })
  },
})
