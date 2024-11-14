/*
 * Created Date: Saturday, October 26th 2024, 3:24:13 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";

const ContactList = ({ setSelectedContact }: { setSelectedContact: (contact: any) => void }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts on the client side
  }, []);

  const contacts = [
    { name: "Faithful Black Mer", lastMessage: "All love brother 👊🏿", date: "Oct 7, 2021" },
    { name: "sizzy", lastMessage: "You shared a post", date: "Oct 6, 2021" },
    { name: "Big Quando", lastMessage: "Tonnes of peace of mind", date: "Oct 5, 2021" },
    { name: "Absa Bank Ug", lastMessage: "Okay. Thank you", date: "Sep 16, 2020" },
  ];

  if (!isClient) {
    return null; // Prevent rendering before the client-side hydration
  }

  return (
    <div>
      {contacts.map((contact, index) => (
        <div
          key={index}
          onClick={() => setSelectedContact(contact)}
          className="cursor-pointer p-4 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <p className="font-bold">{contact.name}</p>
          <p className="text-sm text-gray-500">{contact.lastMessage}</p>
          <p className="text-xs text-gray-400">{contact.date}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
