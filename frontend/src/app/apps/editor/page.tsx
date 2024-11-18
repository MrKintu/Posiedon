/*
 * Created Date: Tuesday, October 8th 2024, 3:20:21 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from 'react';
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { RichTextEditor } from "@/components/RichTextEditor";

const EditorPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [content, setContent] = useState('<h2>Welcome to Mazu Marketing!</h2><p>Start editing your content here...</p>');
  const [isClient, setIsClient] = useState(false); // State to check if running on the client side

  useEffect(() => {
    setIsClient(true); // Set isClient to true once the component is mounted on the client
  }, []);

  if (!isClient) {
    return null; // Prevent rendering during SSR
  }

  const handleChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"App"} title={"Editor"} />
        <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
          <RichTextEditor
            content={content}
            onChange={handleChange}
            placeholder="Start typing..."
          />
        </div>
        
        {/* Preview section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Preview
          </h3>
          <div 
            className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
