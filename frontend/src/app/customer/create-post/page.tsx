/*
 * Created Date: Saturday, October 12th 2024, 4:08:54 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState } from 'react';
import { useStateContext } from '@/contexts/ContextProvider';

const ChatPage = () => {
  const { currentMode } = useStateContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<(string | File)[]>([]); // Allow messages to store either text or files
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // To store the selected file

  // Handle sending messages by clicking the button or pressing 'Enter'
  const handleSendClick = () => {
    if (input.trim() || selectedFile) {
      setMessages([...messages, selectedFile ? selectedFile : input]); // Add file or input to messages
      setInput(''); // Clear the input field
      setSelectedFile(null); // Clear selected file
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendClick(); // Trigger send on Enter key press
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    setSelectedFile(file || null); // Set the file or null if no file is selected
  };

  return (
    <div className={`chat-page ${currentMode === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="main-content">
        {/* ChatContainer to display the messages */}
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              {typeof msg === 'string' ? (
                msg // Display text message
              ) : (
                <a href={URL.createObjectURL(msg)} target="_blank" rel="noopener noreferrer">
                  {msg.name} {/* Display file name */}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input Section */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Add onKeyDown listener for 'Enter' key
            placeholder="Type your message..."
            className="text-black p-2 border border-gray-300 rounded"
          />
          
          {/* Attachment Button */}
          <label className="attachment-button">
            📎 {/* Icon for the attachment button */}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide default file input
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
          padding-top: 20px; /* Added padding to ensure it's spaced from navbar */
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
