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
      
      // Only reorder if there are strikethrough items
      if (strikethroughItems.length > 0) {
        const newContent = [...strikethroughItems, ...normalItems]
        
        // Check if order actually changed by comparing items at each index
        const orderChanged = items.some((item, index) => {
          // Compare by checking if the item at this index is different
          return newContent[index] !== item
        })
        
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
        
        // Early exit if no ordered lists in the document
        if (!json.content || !json.content.some((node: JSONContent) => node.type === 'orderedList')) {
          return
        }
        
        const hasChanges = reorderOrderedLists(json)
        
        if (hasChanges) {
          // Set flag to prevent re-entrant calls
          this.storage.isReordering = true
          
          // Update content without adding to undo history
          this.editor.commands.setContent(json, false)
          
          // Move cursor to the first non-strikethrough item after reordering
          queueMicrotask(() => {
            // Find the ordered list node and position cursor at first non-strikethrough item
            const { state } = this.editor
            const { doc } = state
            
            let targetPos: number | null = null
            
            doc.descendants((node, pos) => {
              if (node.type.name === 'orderedList' && targetPos === null) {
                // Count strikethrough items to find where normal items start
                let strikethroughCount = 0
                node.content.forEach((listItem) => {
                  let hasStrike = false
                  listItem.descendants((child) => {
                    if (child.marks?.some(mark => mark.type.name === 'strike')) {
                      hasStrike = true
                    }
                  })
                  if (hasStrike) {
                    strikethroughCount++
                  }
                })
                
                // If there are normal items, position cursor at the first one
                if (strikethroughCount < node.content.childCount) {
                  // Calculate position of the first non-strikethrough item
                  let currentPos = pos + 1 // Start of list content
                  for (let i = 0; i < strikethroughCount; i++) {
                    currentPos += node.content.child(i).nodeSize
                  }
                  // Position inside the paragraph of the list item
                  // currentPos points to start of listItem, +1 to enter listItem, +1 to enter paragraph
                  targetPos = currentPos + 2
                }
                
                return false // Stop traversing
              }
              return true
            })
            
            // Set cursor position if we found a target
            if (targetPos !== null) {
              this.editor.commands.setTextSelection(targetPos)
              this.editor.commands.focus()
            }
            
            this.storage.isReordering = false
          })
          
          return
        }
        
        // Reset flag if no changes were made
        this.storage.isReordering = false
      }
    })
  },
})
