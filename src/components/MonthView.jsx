import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = { EVENT: 'event' };

const DraggableEventDot = ({ event, onEventClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [event]);

  return (
    <span
      ref={drag}
      className="mt-1 w-2 h-2 rounded-full inline-block"
      style={{ background: event.color, opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
      onClick={e => { e.stopPropagation(); onEventClick(); }}
    ></span>
  );
};

const EventCard = ({ event, onEdit, onDelete }) => (
  <div
    className="w-full flex items-center justify-between bg-white/80 border rounded-lg px-2 py-1 mb-1 shadow-sm cursor-pointer hover:bg-white"
    style={{ borderColor: event.color, borderWidth: 2, minWidth: 0 }}
    onClick={onEdit}
    title={event.title}
  >
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-xs text-ellipsis overflow-hidden whitespace-nowrap" style={{ color: event.color }}>
        {event.title}
      </div>
      <div className="flex items-center gap-1 text-xs text-blue-500 mt-0.5">
        <span role="img" aria-label="clock">🕒</span>
        {event.time}
      </div>
    </div>
    <button
      className="ml-2 text-xs text-red-400 hover:text-red-600 px-1 py-0.5 rounded focus:outline-none"
      onClick={e => { e.stopPropagation(); onDelete(); }}
      title="Delete event"
    >
      ×
    </button>
  </div>
);

const MonthView = ({ currentMonth, events, onDayClick, onEventClick, onEventDrop, onEditEvent, onDeleteEvent }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const today = new Date();

  const getEventsForDay = (date) => {
    const d = format(date, 'yyyy-MM-dd');
    return events.filter(ev => ev.date === d);
  };

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, today);
      const dayEvents = getEventsForDay(day);

      // Drop target logic
      const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.EVENT,
        drop: (item) => {
          if (onEventDrop) onEventDrop(item.event, day);
        },
        canDrop: (item) => {
          // Prevent dropping on same date
          return format(day, 'yyyy-MM-dd') !== item.event.date;
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),
      }), [day, onEventDrop]);

      days.push(
        <div
          key={day}
          ref={drop}
          className={`h-12 sm:h-16 flex flex-col items-center justify-start border border-blue-100 rounded-xl bg-white/90 shadow-sm cursor-pointer select-none transition-all duration-200 pt-1
            text-xs sm:text-base
            ${isCurrentMonth ? 'text-blue-900' : 'bg-blue-50/80 text-blue-300'}
            ${isToday ? 'border-2 border-blue-400 ring-2 ring-blue-200' : ''}
            ${isOver && canDrop ? 'ring-2 ring-blue-300' : ''}
            hover:scale-105 hover:ring-2 hover:ring-blue-200
          `}
          onClick={() => onDayClick(day)}
        >
          <span className="font-bold mb-0 drop-shadow-sm">{formattedDate}</span>
          {dayEvents.length > 0 && (
            <div className="flex flex-col w-full mt-1 gap-1">
              {dayEvents.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onEdit={() => onEditEvent(ev)}
                  onDelete={() => onDeleteEvent(ev)}
                />
              ))}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-600 text-xs sm:text-base">
          {format(addDays(date, i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-1 sm:mb-2">{days}</div>;
  };

  return (
    <>
      {renderDays()}
      {rows}
    </>
  );
};

export default MonthView; 