'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
      ${isActive ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-300'}`}
  >
    {children}
  </button>
);

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
}: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!isClient || !editor) {
    return null;
  }

  return (
    <div className="border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          <Quote size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={18} />
        </MenuButton>
      </div>

      <EditorContent 
        editor={editor} 
        className="p-4 prose dark:prose-invert max-w-none"
      />
    </div>
  );
}
