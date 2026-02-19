import { Editor, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { ActiveDay } from "../App";

type BubbleMenuProps = {
  editor: Editor;
  activeDay: ActiveDay;
  onMoveToNextDay: () => void;
};

export const BubbleMenu = ({ editor, activeDay, onMoveToNextDay }: BubbleMenuProps) => {
  const { t } = useTranslation();
  return (
    <TipTapBubbleMenu
      className="bubble-menu"
      tippyOptions={{ duration: 50 }}
      editor={editor}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        {t("editor.bold")}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        {t("editor.italic")}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        {t("editor.strike")}
      </button>
      {activeDay !== "apuntes" && (
        <button onClick={onMoveToNextDay} title="Mod+Shift+M">
          {t("editor.moveToNextDay")}
        </button>
      )}
    </TipTapBubbleMenu>
  );
};
