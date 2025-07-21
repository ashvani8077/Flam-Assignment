import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const defaultForm = (selectedDate) => ({
  title: '',
  date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
  time: '',
  description: '',
  recurrence: 'none',
  color: '#3b82f6',
});

function getCurrentTimeHHMM() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

const EventModal = ({ open, onClose, onSave, selectedDate, selectedEvent, error }) => {
  const [form, setForm] = useState(selectedEvent ? selectedEvent : defaultForm(selectedDate));
  const [customRecurrence, setCustomRecurrence] = useState({ interval: 1, unit: 'days' });

  useEffect(() => {
    if (selectedEvent) {
      setForm(selectedEvent);
      if (selectedEvent.recurrence === 'custom') {
        setCustomRecurrence({
          interval: selectedEvent.interval || 1,
          unit: selectedEvent.unit || 'days',
        });
      } else {
        setCustomRecurrence({ interval: 1, unit: 'days' });
      }
    } else {
      const f = defaultForm(selectedDate);
      // Set current time if time is blank
      f.time = getCurrentTimeHHMM();
      setForm(f);
      setCustomRecurrence({ interval: 1, unit: 'days' });
    }
  }, [selectedDate, open, selectedEvent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomRecurrenceChange = (e) => {
    const { name, value } = e.target;
    setCustomRecurrence((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let eventData = { ...form, id: selectedEvent ? selectedEvent.id : Date.now() };
    if (form.recurrence === 'custom') {
      eventData = { ...eventData, ...customRecurrence };
    }
    onSave(eventData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl border border-blue-100 w-full max-w-md mx-2 p-6">
        <div className="mb-4 font-semibold text-blue-900 text-lg">{selectedEvent ? 'Edit Event' : `Add Event for ${selectedDate ? format(selectedDate, 'PPP') : ''}`}</div>
        {error && <div className="mb-2 text-red-600 text-sm font-medium">{error}</div>}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Event Title"
            className="w-full bg-blue-50 border border-blue-200 rounded px-2 py-2 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="bg-blue-50 border border-blue-200 rounded px-2 py-2 flex-1 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleInputChange}
              className="bg-blue-50 border border-blue-200 rounded px-2 py-2 flex-1 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full bg-blue-50 border border-blue-200 rounded px-2 py-2 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex gap-2 items-center">
            <label className="text-sm text-blue-900">Recurrence:</label>
            <select
              name="recurrence"
              value={form.recurrence}
              onChange={handleInputChange}
              className="bg-blue-50 border border-blue-200 rounded px-2 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {form.recurrence === 'custom' && (
            <div className="flex gap-2 items-center">
              <label className="text-sm text-blue-900">Every</label>
              <input
                type="number"
                name="interval"
                min="1"
                value={customRecurrence.interval}
                onChange={handleCustomRecurrenceChange}
                className="bg-blue-50 border border-blue-200 rounded px-2 py-2 w-16 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <select
                name="unit"
                value={customRecurrence.unit}
                onChange={handleCustomRecurrenceChange}
                className="bg-blue-50 border border-blue-200 rounded px-2 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
              </select>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <label className="text-sm text-blue-900">Color:</label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleInputChange}
              className="w-8 h-8 p-0 border-none bg-transparent"
            />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="px-4 py-2 bg-blue-100 text-blue-900 rounded shadow hover:bg-blue-200" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-300 text-white rounded shadow hover:scale-105 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 