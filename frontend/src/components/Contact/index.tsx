/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState } from "react";
import ContactList from "@/components/ContactList";
import ConversationWindow from "@/components/ConversationWindow";
import SearchBar from "@/components/SearchBar";

const Contact = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container mx-auto flex">
        {/* Contact List Section */}
        <div className="w-1/3 border-r border-gray-300 dark:border-gray-700">
          <SearchBar />
          <ContactList setSelectedContact={setSelectedContact} />
        </div>

        {/* Conversation Window Section */}
        <div className="w-2/3">
          <ConversationWindow selectedContact={selectedContact} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
