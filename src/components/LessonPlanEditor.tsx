import React, { useRef, useEffect } from 'react';

interface LessonPlanEditorProps {
  html: string;
  onChange: (newHtml: string) => void;
}

export const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({ html, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // This effect ensures that if the html prop changes from outside
  // (e.g., by clicking "Cancel"), the editor's content is updated.
  // It avoids an infinite loop by comparing the current editor content
  // with the incoming html prop.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [html]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable={true}
      onInput={handleInput}
      className="prose prose-sm sm:prose-base max-w-none text-black h-full overflow-y-auto pr-2 outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-md p-2 -m-2"
      // Use dangerouslySetInnerHTML only for the initial render to prevent React from wiping it on re-renders.
      // The useEffect handles subsequent updates.
      dangerouslySetInnerHTML={{ __html: html }}
      suppressContentEditableWarning={true}
    />
  );
};
