import React from 'react';
import { format } from 'date-fns';

const EventDetailsModal = ({ open, onClose, event, onEdit, onDelete }) => {
  if (!open || !event) return null;

  // If event is an array, show all events for the day
  if (Array.isArray(event)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-sm mx-2">
          <div className="mb-4 font-semibold">Events for {event[0]?.date ? format(new Date(event[0].date), 'PPP') : ''}</div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {event.map(ev => (
              <div key={ev.id} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: ev.color }}></span>
                  {ev.title}
                </div>
                <div className="text-xs text-gray-600">
                  <div><b>Time:</b> {ev.time}</div>
                  {ev.description && <div><b>Description:</b> {ev.description}</div>}
                  <div><b>Recurrence:</b> {ev.recurrence}</div>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={() => onEdit(ev)}>Edit</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded text-xs" onClick={() => onDelete(ev)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Single event as before
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-sm mx-2">
        <div className="mb-4 font-semibold flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: event.color }}></span>
          {event.title}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <div><b>Date:</b> {event.date ? format(new Date(event.date), 'PPP') : ''}</div>
          <div><b>Time:</b> {event.time}</div>
          {event.description && <div className="mt-2"><b>Description:</b> {event.description}</div>}
          <div className="mt-2"><b>Recurrence:</b> {event.recurrence}</div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onEdit(event)}>Edit</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => onDelete(event)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal; 