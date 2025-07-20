import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, format, addDays, addWeeks, addMonths as addMonthsFns, isSameMonth, isAfter, isBefore, startOfMonth, endOfMonth, parseISO, startOfWeek } from 'date-fns';
import MonthView from './MonthView';
import WeekView from './WeekView';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalError, setModalError] = useState('');
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [viewType, setViewType] = useState('month');
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('schedulo_events');
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch {}
    }
  }, []);
  // Save events to localStorage on change
  useEffect(() => {
    localStorage.setItem('schedulo_events', JSON.stringify(events));
  }, [events]);

  // Unique colors for filter dropdown
  const eventColors = Array.from(new Set(events.map(ev => ev.color)));

  const filteredEvents = events.filter(ev => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(search.toLowerCase()));
    const matchesColor = colorFilter ? ev.color === colorFilter : true;
    return matchesSearch && matchesColor;
  });

  // Helper to expand recurring events for display
  const expandRecurringEvents = (events, currentMonth) => {
    const expanded = [];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    events.forEach(ev => {
      const baseDate = typeof ev.date === 'string' ? parseISO(ev.date) : ev.date;
      if (!ev.recurrence || ev.recurrence === 'none') {
        expanded.push(ev);
      } else if (ev.recurrence === 'daily') {
        let d = baseDate;
        while (d <= monthEnd) {
          if (isSameMonth(d, currentMonth) && !isBefore(d, monthStart)) {
            expanded.push({ ...ev, date: d.toISOString().slice(0, 10) });
          }
          d = addDays(d, 1);
        }
      } else if (ev.recurrence === 'weekly') {
        let d = baseDate;
        while (d <= monthEnd) {
          if (isSameMonth(d, currentMonth) && !isBefore(d, monthStart)) {
            expanded.push({ ...ev, date: d.toISOString().slice(0, 10) });
          }
          d = addWeeks(d, 1);
        }
      } else if (ev.recurrence === 'monthly') {
        let d = baseDate;
        while (d <= monthEnd) {
          if (isSameMonth(d, currentMonth) && !isBefore(d, monthStart)) {
            expanded.push({ ...ev, date: d.toISOString().slice(0, 10) });
          }
          d = addMonthsFns(d, 1);
        }
      } else if (ev.recurrence === 'custom' && ev.interval && ev.unit) {
        let d = baseDate;
        let addFn;
        if (ev.unit === 'days') addFn = addDays;
        else if (ev.unit === 'weeks') addFn = addWeeks;
        else if (ev.unit === 'months') addFn = addMonthsFns;
        else addFn = addDays;
        while (d <= monthEnd) {
          if (isSameMonth(d, currentMonth) && !isBefore(d, monthStart)) {
            expanded.push({ ...ev, date: d.toISOString().slice(0, 10) });
          }
          d = addFn(d, Number(ev.interval));
        }
      } else {
        expanded.push(ev);
      }
    });
    return expanded;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (date, dayEvents) => {
    if (dayEvents.length > 1) {
      setSelectedDayEvents(dayEvents);
      setSelectedEvent(null);
      setDetailsModalOpen(true);
    } else {
      setSelectedEvent(dayEvents[0]);
      setSelectedDayEvents(null);
      setDetailsModalOpen(true);
    }
  };

  const handleEditEvent = (ev) => {
    setEditMode(true);
    setIsModalOpen(true);
    setDetailsModalOpen(false);
    setSelectedEvent(ev);
    setSelectedDayEvents(null);
  };

  const handleDeleteEvent = (ev) => {
    setEvents((prev) => prev.filter(e => e.id !== ev.id));
    setDetailsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDayEvents(null);
  };

  const isConflict = (eventData, ignoreId = null) => {
    return events.some(ev =>
      ev.id !== ignoreId &&
      ev.date === eventData.date &&
      ev.time === eventData.time
    );
  };

  const handleAddEvent = (eventData) => {
    if (editMode && selectedEvent) {
      if (isConflict(eventData, selectedEvent.id)) {
        setModalError('Event conflict: Another event exists at this date and time.');
        return;
      }
      setEvents((prev) => prev.map(ev => ev.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : ev));
      setEditMode(false);
      setSelectedEvent(null);
      setIsModalOpen(false);
      setModalError('');
    } else {
      if (isConflict(eventData)) {
        setModalError('Event conflict: Another event exists at this date and time.');
        return;
      }
      setEvents((prev) => [...prev, eventData]);
      setIsModalOpen(false);
      setModalError('');
    }
  };

  const handleEventDrop = (event, newDate) => {
    const newDateStr = typeof newDate === 'string' ? newDate : newDate.toISOString().slice(0, 10);
    const eventData = { ...event, date: newDateStr };
    if (isConflict(eventData, event.id)) {
      alert('Event conflict: Another event exists at this date and time.');
      return;
    }
    setEvents((prev) => prev.map(ev =>
      ev.id === event.id ? { ...ev, date: newDateStr } : ev
    ));
  };

  const weekStartDate = startOfWeek(selectedDate || currentMonth, { weekStartsOn: 0 });

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        className="px-2 py-1 rounded hover:bg-gray-200"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
      >
        &#8592;
      </button>
      <div className="font-bold text-lg">
        {format(currentMonth, 'MMMM yyyy')}
      </div>
      <button
        className="px-2 py-1 rounded hover:bg-gray-200"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      >
        &#8594;
      </button>
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* Header with gradient title and subtitle */}
      <div className="flex flex-col items-center mb-8 w-full">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight mb-2">
          Event Calendar
        </h1>
        <p className="text-lg text-blue-700/80 font-medium mb-4">Manage your schedule with style</p>
        <div className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md bg-white/10 border border-blue-100 rounded-lg px-4 py-2 text-blue-700 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>
      </div>
      {/* Calendar container */}
      <div className="w-full bg-white/70 rounded-2xl shadow-xl border border-blue-100 p-4 sm:p-8">
        <div className="flex items-center justify-between mb-4 w-full">
          <button
            className="px-3 py-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow hover:scale-105 transition"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            &#8592;
          </button>
          <div className="font-extrabold text-2xl sm:text-3xl text-blue-700 tracking-wide drop-shadow">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <button
            className="px-3 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow hover:scale-105 transition"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            &#8594;
          </button>
          <button
            className="ml-4 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2"
            onClick={() => { setIsModalOpen(true); setSelectedDate(new Date()); setEditMode(false); setSelectedEvent(null); }}
          >
            <span className="text-xl font-bold">+</span> Add Event
          </button>
        </div>
        {/* Search and filter UI */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
          <select
            value={colorFilter}
            onChange={e => setColorFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Colors</option>
            {eventColors.map(color => (
              <option key={color} value={color} style={{ color }}>{color}</option>
            ))}
          </select>
          <button
            className={`px-3 py-1 rounded border ${viewType === 'month' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setViewType('month')}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 rounded border ${viewType === 'week' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setViewType('week')}
          >
            Weekly
          </button>
        </div>
        {renderHeader()}
        {viewType === 'month' ? (
          <MonthView
            currentMonth={currentMonth}
            events={expandRecurringEvents(filteredEvents, currentMonth)}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
          />
        ) : (
          <WeekView
            weekStartDate={weekStartDate}
            events={expandRecurringEvents(filteredEvents, currentMonth)}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
          />
        )}
        <EventModal
          open={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditMode(false); setModalError(''); }}
          onSave={handleAddEvent}
          selectedDate={editMode && selectedEvent ? new Date(selectedEvent.date) : selectedDate}
          {...(editMode && selectedEvent ? { key: selectedEvent.id } : {})}
          {...(editMode && selectedEvent ? { selectedEvent } : {})}
          error={modalError}
        />
        <EventDetailsModal
          open={detailsModalOpen}
          onClose={() => { setDetailsModalOpen(false); setSelectedEvent(null); setSelectedDayEvents(null); }}
          event={selectedDayEvents || selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
};

export default Calendar; 