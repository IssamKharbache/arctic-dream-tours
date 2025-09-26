"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList, OrderedList } from "@tiptap/extension-list";
type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

const RichTextEditor = ({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md  py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent
        className="tiptap"
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
