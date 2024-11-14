/*
 * Created Date: Saturday, October 26th 2024, 3:26:41 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
}

interface ConversationWindowProps {
  selectedContact: Contact | null;
}

const ConversationWindow: React.FC<ConversationWindowProps> = ({ selectedContact }) => {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering until client-side hydration is complete
  }

  if (!selectedContact) {
    return <div className="p-4">Select a contact to view the conversation</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{selectedContact.name}</h2>
      <div className="mt-4">
        {/* Example conversation - Replace with dynamic messages */}
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-sm my-2 text-gray-800 dark:text-gray-200">
          {selectedContact.lastMessage}
        </div>
        <div className="bg-blue-500 text-white p-3 rounded-sm my-2 self-end">
          Thanks! Got it.
        </div>
      </div>
    </div>
  );
};

export default ConversationWindow;
