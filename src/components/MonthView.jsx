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
          className={`h-14 sm:h-16 md:h-20 flex flex-col items-center justify-center border rounded cursor-pointer select-none transition-colors
            text-xs sm:text-base
            ${isCurrentMonth ? 'bg-white' : 'bg-gray-100 text-gray-400'}
            ${isToday ? 'border-blue-500 border-2' : ''}
            ${isOver && canDrop ? 'ring-2 ring-blue-400' : ''}
          `}
          onClick={() => dayEvents.length > 0 ? onEventClick(day, dayEvents) : onDayClick(day)}
        >
          <span>{formattedDate}</span>
          {dayEvents.length > 0 && (
            <div className="flex gap-0.5 mt-1 flex-wrap justify-center items-center">
              {dayEvents.slice(0, 3).map((ev, idx) => (
                <DraggableEventDot key={ev.id} event={ev} onEventClick={() => onEventClick(day, dayEvents)} />
              ))}
              {dayEvents.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">+{dayEvents.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-0.5 sm:mb-1" key={day}>
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