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
      setForm(defaultForm(selectedDate));
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-xs sm:max-w-sm mx-2">
        <div className="mb-4 font-semibold">{selectedEvent ? 'Edit Event' : `Add Event for ${selectedDate ? format(selectedDate, 'PPP') : ''}`}</div>
        {error && <div className="mb-2 text-red-600 text-sm font-medium">{error}</div>}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Event Title"
            className="w-full border rounded px-2 py-1"
            required
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 flex-1"
              required
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 flex-1"
              required
            />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full border rounded px-2 py-1"
          />
          <div className="flex gap-2 items-center">
            <label className="text-sm">Recurrence:</label>
            <select
              name="recurrence"
              value={form.recurrence}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
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
              <label className="text-sm">Every</label>
              <input
                type="number"
                name="interval"
                min="1"
                value={customRecurrence.interval}
                onChange={handleCustomRecurrenceChange}
                className="border rounded px-2 py-1 w-16"
                required
              />
              <select
                name="unit"
                value={customRecurrence.unit}
                onChange={handleCustomRecurrenceChange}
                className="border rounded px-2 py-1"
              >
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
              </select>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <label className="text-sm">Color:</label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleInputChange}
              className="w-8 h-8 p-0 border-none bg-transparent"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 