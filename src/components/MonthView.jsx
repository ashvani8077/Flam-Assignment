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

const MonthView = ({ currentMonth, events, onDayClick, onEventClick, onEventDrop }) => {
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
          className={`h-20 sm:h-24 flex flex-col items-center justify-start border border-blue-100 rounded-xl bg-white/70 shadow-sm cursor-pointer select-none transition-all duration-200 mt-1 pt-2
            text-xs sm:text-base
            ${isCurrentMonth ? 'text-blue-700' : 'bg-blue-50/80 text-blue-300'}
            ${isToday ? 'border-2 border-blue-400 ring-2 ring-blue-300' : ''}
            ${isOver && canDrop ? 'ring-2 ring-blue-300' : ''}
            hover:scale-105 hover:ring-2 hover:ring-blue-200
          `}
          onClick={() => dayEvents.length > 0 ? onEventClick(day, dayEvents) : onDayClick(day)}
        >
          <span className="font-bold mb-1 drop-shadow-sm">{formattedDate}</span>
          {dayEvents.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap justify-center items-center">
              {dayEvents.slice(0, 3).map((ev, idx) => (
                <span key={ev.id} className="w-3 h-3 rounded-full border-2 border-white/80 shadow-sm" style={{ background: ev.color, opacity: 0.7 }}></span>
              ))}
              {dayEvents.length > 3 && (
                <span className="text-xs text-blue-400 ml-1">+{dayEvents.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2 sm:mb-3" key={day}>
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