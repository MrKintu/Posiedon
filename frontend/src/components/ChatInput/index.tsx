/*
 * Created Date: Saturday, October 12th 2024, 4:12:58 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSendClick = () => {
    onSend(input);
    setInput('');
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="text-black p-2 border border-gray-300 rounded"
      />
      <button onClick={handleSendClick}>Send</button>
      <style jsx>{`
        .chat-input {
          display: flex;
          align-items: center;
        }
        input {
          flex: 1;
          padding: 10px;
          margin-right: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
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

export default ChatInput;
