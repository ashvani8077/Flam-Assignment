import React from 'react';
import { format, isSameMonth, isToday, isSameDay, startOfWeek, endOfMonth, startOfMonth, eachDayOfInterval, addDays, endOfWeek } from 'date-fns';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from "framer-motion";
import { EventCard } from "./EventCard";

const ItemTypes = { EVENT: 'event' };

const MonthView = ({ currentMonth, events, onDayClick, onEditEvent, onViewEvent, onEventDrop }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });
  
  const getEventsForDay = (date) => {
    const d = format(date, 'dd-MM-yyyy');
    return events.filter(ev => ev.date === d);
  };

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} className="text-center text-xs font-medium text-blue-700/80 pb-2">{day}</div>
      ))}
      {days.map((date) => {
        const dayEvents = getEventsForDay(date);
        const isCurrentMonth = isSameMonth(date, currentMonth);
        
        const [{ isOver, canDrop }, drop] = useDrop(() => ({
          accept: ItemTypes.EVENT,
          drop: (item) => onEventDrop(item.event, date),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
          }),
        }), [date, onEventDrop]);

        return (
          <div
            key={date.toString()}
            ref={drop}
            className={`relative min-h-[100px] p-1.5 flex flex-col items-start justify-start border border-blue-100/80 rounded-xl bg-white/80 shadow-sm cursor-pointer transition-all
              ${isCurrentMonth ? 'text-blue-900' : 'bg-blue-50/60 text-blue-400'}
              ${isToday(date) ? 'border-2 border-blue-400' : ''}
              ${isOver && canDrop ? 'bg-blue-100/50' : ''}
            `}
            onClick={() => onDayClick(date)}
          >
            <span className={`font-semibold text-xs mb-1 ${isToday(date) ? 'text-blue-500' : ''}`}>{format(date, "d")}</span>
            <div className="w-full space-y-1 overflow-y-auto">
              <AnimatePresence>
                {dayEvents.slice(0, 2).map((ev) => (
                  <motion.div
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <EventCard event={ev} onEdit={onEditEvent} onView={onViewEvent} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
              {dayEvents.length > 2 && (
                <div className="text-xs text-blue-600 text-center py-0.5">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default MonthView; 