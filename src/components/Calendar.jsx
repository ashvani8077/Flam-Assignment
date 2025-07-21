import React, { useState } from 'react';
import { format, addDays, addWeeks, addMonths as addMonthsFns, isSameMonth, isBefore, startOfMonth, endOfMonth, parse, startOfWeek, subMonths, addMonths } from 'date-fns';
import { motion, AnimatePresence } from "framer-motion"
import MonthView from './MonthView';
import WeekView from './WeekView';
import { EventModal } from './EventModal';
import { EventDetailsModal } from './EventDetailsModal';
import { useEvents } from './event-context';
import { Button } from "@/components/ui";

const Calendar = () => {
  const { state, dispatch } = useEvents();
  const { events, currentMonth, selectedDate } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [viewType, setViewType] = useState('month');
  
  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchesColor = colorFilter ? ev.color === colorFilter : true;
    return matchesSearch && matchesColor;
  });

  const expandRecurringEvents = (eventsToExpand, month) => {
    // ... expansion logic ...
    return eventsToExpand; // simplified for brevity
  };

  const handleDayClick = (date) => {
    dispatch({ type: 'SET_SELECTED_DATE', date });
    setEditingEvent(null);
    setIsModalOpen(true);
  };
  
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
  };
  
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      dispatch({ type: 'UPDATE_EVENT', event: eventData });
    } else {
      dispatch({ type: 'ADD_EVENT', event: { ...eventData, id: `event-${Date.now()}` } });
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleEventDrop = (event, newDate) => {
    const newDateStr = format(newDate, 'dd-MM-yyyy');
    dispatch({ type: 'UPDATE_EVENT', event: { ...event, date: newDateStr } });
  };
  
  const weekStartDate = startOfWeek(selectedDate || currentMonth, { weekStartsOn: 0 });

  return (
    <div className="w-full h-full bg-blue-50 flex flex-col p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-900 bg-clip-text text-transparent">
          Event Calendar
        </h1>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-auto bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm"
          />
           <Button onClick={() => handleDayClick(new Date())}>+ Add Event</Button>
        </div>
      </header>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'SET_CURRENT_MONTH', date: subMonths(currentMonth, 1) })}>
             &lt;
           </Button>
            <h2 className="text-xl font-bold text-blue-900">{format(currentMonth, 'MMMM yyyy')}</h2>
           <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'SET_CURRENT_MONTH', date: addMonths(currentMonth, 1) })}>
             &gt;
           </Button>
        </div>
        <div className="flex items-center gap-2">
            {/* View toggler can go here */}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        {viewType === 'month' ? (
          <MonthView
            currentMonth={currentMonth}
            events={filteredEvents}
            onDayClick={handleDayClick}
            onEditEvent={handleEditEvent}
            onViewEvent={handleViewEvent}
            onEventDrop={handleEventDrop}
          />
        ) : (
          <WeekView
            weekStartDate={weekStartDate}
            events={filteredEvents}
            onDayClick={handleDayClick}
            onEditEvent={handleEditEvent}
            onViewEvent={handleViewEvent}
            onEventDrop={handleEventDrop}
          />
        )}
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />
      <EventDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        event={selectedEvent}
        onEdit={handleEditEvent}
      />
    </div>
  );
};

export default Calendar; 