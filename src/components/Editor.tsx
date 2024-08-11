/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

interface EditorProps {
  isFancyMode: boolean;
  content: string;
  setContent: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ setContent }) => {
  const initialConfig = {
    namespace: "DigitalScratchPaper",
    onError: (error: Error) => console.error(error),
  };

  const onChange = useCallback(
    // @ts-ignore something soon
    (editorState) => {
      editorState.read(() => {
        const root = editorState.getRoot();
        const text = root.getTextContent();
        setContent(text);
      });
    },
    [setContent]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );

  function Placeholder() {
    return <div className="editor-placeholder">Enter some plain text...</div>;
  }
};

export default Editor;
