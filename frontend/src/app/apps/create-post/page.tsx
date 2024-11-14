/*
 * Created Date: Saturday, October 12th 2024, 4:08:54 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useStateContext } from '@/contexts/ContextProvider';

const ChatPage = () => {
  const { currentMode } = useStateContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<(string | File)[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false); // State to check if it's running on the client side

  useEffect(() => {
    setIsClient(true); // Set isClient to true once the component is mounted on the client
  }, []);

  const handleSendClick = () => {
    if (input.trim() || selectedFile) {
      setMessages((prevMessages) => [
        ...prevMessages,
        selectedFile ? selectedFile : input,
      ]);
      setInput('');
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  return (
    <div className={`chat-page ${currentMode === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="main-content">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              {typeof msg === 'string' ? (
                msg
              ) : (
                <a href={URL.createObjectURL(msg)} target="_blank" rel="noopener noreferrer">
                  {msg.name}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="text-black p-2 border border-gray-300 rounded"
          />
          <label className="attachment-button">
            📎
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>

          <button onClick={handleSendClick}>Send</button>
        </div>
      </div>

      <style jsx>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-top: 20px;
        }
        .main-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px;
          background-color: ${currentMode === 'dark' ? '#1f1f1f' : '#f3f3f3'};
          color: ${currentMode === 'dark' ? 'white' : 'black'};
        }
        .chat-box {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 10px;
          padding: 10px;
          background-color: ${currentMode === 'dark' ? '#333' : '#e0e0e0'};
          border-radius: 8px;
        }
        .chat-message {
          padding: 10px;
          background-color: ${currentMode === 'dark' ? '#555' : '#d4d4d4'};
          margin-bottom: 8px;
          border-radius: 8px;
          color: ${currentMode === 'dark' ? 'white' : 'black'};
        }
        .chat-message a {
          color: #0070f3;
          text-decoration: underline;
        }
        .chat-input {
          display: flex;
          align-items: center;
        }
        input[type="text"] {
          flex: 1;
          padding: 10px;
          margin-right: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .attachment-button {
          cursor: pointer;
          margin-right: 10px;
          font-size: 30px;
        }
        button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
