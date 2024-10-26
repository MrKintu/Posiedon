/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";
import React from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import ContactSidebar from "@/components/ContactSidebar";
import { useState } from "react";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
}

const ContactPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { themeColor } = useStateContext();

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, inputMessage]);
      setInputMessage("");
    }
  };

  return (
    <section className="flex h-full">
      <div className="flex h-full w-full" 
        style={{
          border: `2px solid ${themeColor}`,
          borderRadius: "8px",
          padding: "16px",
        }}>
        {/* Contact Sidebar */}
        <div className="w-1/3 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
          <ContactSidebar onSelectUser={setSelectedUser} />
        </div>

        {/* Conversation Area */}
        <div className="w-2/3 bg-white dark:bg-gray-900 flex flex-col p-4">
          {selectedUser ? (
            <>
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Chat with {selectedUser.name}
              </h2>
              <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {messages.map((message, index) => (
                  <div key={index} className="mb-2">
                    <p className="bg-blue-500 text-white p-2 rounded-md inline-block">
                      {message}
                    </p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex items-center border-t p-2 dark:border-gray-700">
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                  📎
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow mx-2 p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">
              Select a user to start a conversation.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
