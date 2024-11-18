'use client';

import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: any) => void;
}

export function Calendar({ events, onEventClick, onSelectSlot }: CalendarProps) {
  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 rounded-lg p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onEventClick}
        onSelectSlot={onSelectSlot}
        selectable
        popup
        className="calendar-custom dark:text-white"
      />
      <style jsx global>{`
        .calendar-custom .rbc-toolbar {
          @apply mb-4 flex flex-wrap justify-center gap-2;
        }
        .calendar-custom .rbc-toolbar button {
          @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded;
        }
        .calendar-custom .rbc-toolbar button.rbc-active {
          @apply bg-primary text-white;
        }
        .calendar-custom .rbc-header {
          @apply bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2;
        }
        .calendar-custom .rbc-today {
          @apply bg-blue-50 dark:bg-blue-900/20;
        }
        .calendar-custom .rbc-event {
          @apply bg-primary border-transparent;
        }
        .calendar-custom .rbc-off-range-bg {
          @apply bg-gray-50 dark:bg-gray-700/50;
        }
        .calendar-custom .rbc-date-cell {
          @apply text-gray-700 dark:text-gray-200;
        }
        .calendar-custom .rbc-button-link {
          @apply text-gray-700 dark:text-gray-200;
        }
      `}</style>
    </div>
  );
}
