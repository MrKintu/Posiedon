/*
 * Created Date: Tuesday, October 8th 2024, 3:17:57 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

'use client';

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { Calendar } from "@/components/Calendar";
import { useState, useEffect } from "react";

const initialEvents = [
  {
    id: 1,
    title: 'Marketing Campaign Launch',
    start: new Date(2024, 2, 15, 10, 0),
    end: new Date(2024, 2, 15, 12, 0),
  },
  {
    id: 2,
    title: 'Team Meeting',
    start: new Date(2024, 2, 16, 14, 0),
    end: new Date(2024, 2, 16, 15, 30),
  },
  {
    id: 3,
    title: 'Content Review',
    start: new Date(2024, 2, 17),
    end: new Date(2024, 2, 18),
    allDay: true,
  },
];

const CalenderAppPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
  const [events, setEvents] = useState(initialEvents);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component is mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering until the component is mounted on the client
  if (!isClient) {
    return null;
  }

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const title = window.prompt('New Event Title:');
    if (title) {
      setEvents([
        ...events,
        {
          id: events.length + 1,
          title,
          start: slotInfo.start,
          end: slotInfo.end,
          allDay: slotInfo.slots.length === 1,
        },
      ]);
    }
  };

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white dark:bg-gray-800 rounded-3xl">
        <Header category="App" title="Calendar" />
        <Calendar
          events={events}
          onEventClick={handleEventClick}
          onSelectSlot={handleSelectSlot}
        />
      </div>
    </div>
  );
};

export default CalenderAppPage;
