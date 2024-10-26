/*
 * Created Date: Saturday, October 26th 2024, 3:37:36 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
}

interface ContactSidebarProps {
  onSelectUser: (user: Contact) => void;
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({ onSelectUser }) => {
  // Sample contact list; replace with dynamic data if needed
  const [contacts] = useState<Contact[]>([
    { id: 1, name: "Faithful Black Mer", lastMessage: "All love brother 👊🏾" },
    { id: 2, name: "Sizzy", lastMessage: "You shared a post" },
    { id: 3, name: "Big Quando", lastMessage: "Tonnes of peace of mind" },
    { id: 4, name: "Absa Bank Uganda", lastMessage: "Okay. Thank you" },
  ]);

  // State to manage the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contacts based on the search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} /> {/* Use the SearchBar component */}
      </div>

      {/* Contact List */}
      <div className="space-y-2">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectUser(contact)}
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
          >
            <p className="font-bold">{contact.name}</p>
            <p className="text-sm text-gray-500">{contact.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactSidebar;

