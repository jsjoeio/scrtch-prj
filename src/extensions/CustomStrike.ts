import Strike from '@tiptap/extension-strike'

/**
 * Custom Strike extension that overrides the default keyboard shortcut
 * from Mod-Shift-s to Mod-. (Cmd+. on macOS, Ctrl+. on other platforms)
 */
export const CustomStrike = Strike.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-.': () => this.editor.commands.toggleStrike(),
    }
  },
})
