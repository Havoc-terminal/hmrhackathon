import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalIcon, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  AlignLeft, 
  Check 
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import { toISODateString, formatHourLabel } from '../../services/calendarUtils';

export default function AddEventModal() {
  const { 
    isAddEventModalOpen, 
    setIsAddEventModalOpen, 
    newEventInitialData,
    addNewCalendarEvent,
    currentUser
  } = useKaarya();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => toISODateString(new Date()));
  const [startHour, setStartHour] = useState(10);
  const [endHour, setEndHour] = useState(11);
  const [color, setColor] = useState('#039be5');
  const [location, setLocation] = useState('Google Meet');
  const [attendeesInput, setAttendeesInput] = useState('sarah.j@vertexcloud.io');
  const [description, setDescription] = useState('');
  const [hasMeet, setHasMeet] = useState(true);

  // Sync initial data when opened by clicking a grid slot or navigation
  useEffect(() => {
    if (newEventInitialData) {
      if (newEventInitialData.date) {
        setDate(newEventInitialData.date);
      } else if (newEventInitialData.dateString) {
        setDate(newEventInitialData.dateString);
      }
      if (newEventInitialData.startHour !== undefined) {
        setStartHour(Number(newEventInitialData.startHour));
        setEndHour(Number(newEventInitialData.startHour) + 1);
      }
      if (newEventInitialData.title) {
        setTitle(newEventInitialData.title);
      }
    }
  }, [newEventInitialData]);

  if (!isAddEventModalOpen) return null;

  const colorPalette = [
    { label: 'Peacock Blue', value: '#039be5' },
    { label: 'Teal Green', value: '#0d9488' },
    { label: 'Flamingo Orange', value: '#f4511e' },
    { label: 'Sage Green', value: '#0f9d58' },
    { label: 'Banana Gold', value: '#e5ad06' },
    { label: 'Grape Purple', value: '#7b1fa2' },
    { label: 'Tomato Red', value: '#d50000' },
    { label: 'Graphite Brown', value: '#8d6e63' }
  ];

  // Half-hour time slots from 6:00 AM to 11:00 PM
  const timeSlots = [];
  for (let h = 6; h <= 23; h += 0.5) {
    timeSlots.push(h);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const attendees = attendeesInput
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    addNewCalendarEvent({
      title,
      date,
      startHour: Number(startHour),
      endHour: Number(endHour),
      color,
      location: hasMeet ? 'Google Meet video call' : (location || 'In-Person / Remote'),
      attendees: attendees.length > 0 ? attendees : [currentUser?.email || 'me@dailyecho.ai'],
      description,
      hasMeet,
      category: 'Work',
      isAiGenerated: false
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setIsAddEventModalOpen(false);
  };

  return (
    <div className="modal-backdrop-custom" onClick={() => setIsAddEventModalOpen(false)}>
      <div className="modal-card-custom add-event-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top bar with color header */}
        <div className="add-event-topbar" style={{ backgroundColor: color }}>
          <div className="flex items-center gap-2 text-white">
            <CalIcon size={18} />
            <span className="font-semibold text-sm">Add Google Calendar Event</span>
          </div>
          <button 
            type="button" 
            className="popover-close-btn"
            onClick={() => setIsAddEventModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="add-event-form-body">
          {/* Title */}
          <div className="form-group-custom">
            <input
              type="text"
              placeholder="Add title and event details"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="event-title-input"
              autoFocus
              required
            />
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="form-group-custom">
              <label className="form-label-custom">Event Date</label>
              <div className="input-with-icon">
                <CalIcon size={16} className="input-icon text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input-custom"
                  required
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Start Time</label>
              <div className="input-with-icon">
                <Clock size={16} className="input-icon text-gray-400" />
                <select
                  value={startHour}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setStartHour(s);
                    if (endHour <= s) setEndHour(s + 1);
                  }}
                  className="form-select-custom"
                >
                  {timeSlots.map(h => (
                    <option key={h} value={h}>
                      {formatHourLabel(h)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">End Time</label>
              <div className="input-with-icon">
                <Clock size={16} className="input-icon text-gray-400" />
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                  className="form-select-custom"
                >
                  {timeSlots.filter(h => h > startHour).map(h => (
                    <option key={h} value={h}>
                      {formatHourLabel(h)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div className="form-group-custom">
            <label className="form-label-custom">Calendar Category & Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorPalette.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-dot-btn ${color === c.value ? 'selected' : ''}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.label}
                >
                  {color === c.value && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Google Meet Toggle */}
          <div className="add-meet-toggle-card">
            <div className="flex items-center gap-2">
              <Video size={18} className="text-blue-600" />
              <div>
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">Google Meet Video Conferencing</div>
                <div className="text-[11px] text-gray-500">Auto-generate a secure video conference link</div>
              </div>
            </div>
            <label className="custom-switch">
              <input
                type="checkbox"
                checked={hasMeet}
                onChange={(e) => setHasMeet(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Custom Location if not only Meet */}
          {!hasMeet && (
            <div className="form-group-custom">
              <label className="form-label-custom">Location</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Conference Room A, 120 Congress Ave"
                  className="form-input-custom"
                />
              </div>
            </div>
          )}

          {/* Guests */}
          <div className="form-group-custom">
            <label className="form-label-custom">Add Guests (comma separated)</label>
            <div className="input-with-icon">
              <Users size={16} className="input-icon text-gray-400" />
              <input
                type="text"
                value={attendeesInput}
                onChange={(e) => setAttendeesInput(e.target.value)}
                placeholder="e.g. sarah.j@vertexcloud.io, alex.rivera@techcorp.com"
                className="form-input-custom"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group-custom">
            <label className="form-label-custom">Description or Notes</label>
            <div className="input-with-icon">
              <AlignLeft size={16} className="input-icon text-gray-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add meeting agenda, notes, or sprint objectives..."
                rows={2}
                className="form-textarea-custom"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer-custom">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddEventModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
