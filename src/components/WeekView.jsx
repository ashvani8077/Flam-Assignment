import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
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

const WeekView = ({ weekStartDate, events, onDayClick, onEventClick, onEventDrop }) => {
  const today = new Date();

  const getEventsForDay = (date) => {
    const d = format(date, 'yyyy-MM-dd');
    return events.filter(ev => ev.date === d);
  };

  const days = [];
  let day = weekStartDate;
  for (let i = 0; i < 7; i++) {
    const formattedDate = format(day, 'd');
    const isToday = isSameDay(day, today);
    const dayEvents = getEventsForDay(day);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ItemTypes.EVENT,
      drop: (item) => {
        if (onEventDrop) onEventDrop(item.event, day);
      },
      canDrop: (item) => format(day, 'yyyy-MM-dd') !== item.event.date,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }), [day, onEventDrop]);

    days.push(
      <div
        key={day}
        ref={drop}
        className={`h-16 flex flex-col items-center justify-center border rounded cursor-pointer select-none transition-colors
          text-xs sm:text-base
          bg-white
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

  // Render day names
  const renderDays = () => {
    const days = [];
    let date = weekStartDate;
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-600 text-xs sm:text-base">
          {format(date, 'EEE')}
        </div>
      );
      date = addDays(date, 1);
    }
    return <div className="grid grid-cols-7 mb-1 sm:mb-2">{days}</div>;
  };

  return (
    <>
      {renderDays()}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
        {days}
      </div>
    </>
  );
};

export default WeekView; 