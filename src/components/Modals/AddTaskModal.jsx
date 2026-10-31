import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar as CalendarIcon, Paperclip } from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import {
  formatTaskDisplayDate,
  formatMonthYear,
  getMonthMatrix,
  addDays,
  addMonths,
  isSameDay
} from '../../services/calendarUtils';

export default function AddTaskModal() {
  const { isAddTaskModalOpen, setIsAddTaskModalOpen, addNewTask, t } = useKaarya();

  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => formatTaskDisplayDate(new Date()));
  const [dueDate, setDueDate] = useState(() => formatTaskDisplayDate(new Date()));
  const [quickSelect, setQuickSelect] = useState('Today');
  const [priority, setPriority] = useState('High');
  const [category, setCategory] = useState('Work');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calMonthDate, setCalMonthDate] = useState(() => new Date());

  // Reset and sync with today's real date whenever the modal opens
  useEffect(() => {
    if (isAddTaskModalOpen) {
      const today = new Date();
      setStartDate(formatTaskDisplayDate(today));
      setDueDate(formatTaskDisplayDate(today));
      setSelectedDate(today);
      setCalMonthDate(today);
      setQuickSelect('Today');
      setTaskName('');
      setDescription('');
    }
  }, [isAddTaskModalOpen]);

  // Generate interactive 35-42 cell calendar matrix for current month view
  const monthDays = useMemo(() => {
    return getMonthMatrix(calMonthDate, 1); // 1 = Monday
  }, [calMonthDate]);

  if (!isAddTaskModalOpen) return null;

  const handleQuickSelect = (val) => {
    setQuickSelect(val);
    const today = new Date();

    if (val === 'Today' || val === t.qsToday) {
      setStartDate(formatTaskDisplayDate(today));
      setDueDate(formatTaskDisplayDate(today));
      setSelectedDate(today);
      setCalMonthDate(today);
    } else if (val === 'Tomorrow' || val === t.qsTomorrow) {
      const tomorrow = addDays(today, 1);
      setStartDate(formatTaskDisplayDate(today));
      setDueDate(formatTaskDisplayDate(tomorrow));
      setSelectedDate(tomorrow);
      setCalMonthDate(tomorrow);
    } else if (val === 'This week' || val === t.qsThisWeek) {
      const thisWeek = addDays(today, 7);
      setStartDate(formatTaskDisplayDate(today));
      setDueDate(formatTaskDisplayDate(thisWeek));
      setSelectedDate(thisWeek);
      setCalMonthDate(thisWeek);
    } else if (val === 'Daily' || val === t.qsDaily) {
      setStartDate(formatTaskDisplayDate(today));
      setDueDate('Daily Ongoing');
    }
  };

  const handleDayClick = (cell) => {
    setSelectedDate(cell.date);
    setDueDate(formatTaskDisplayDate(cell.date));
    setQuickSelect('Custom');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    addNewTask({
      title: taskName,
      description,
      startDate,
      dueDate,
      priority,
      category,
      status: 'To-do'
    });
    setTaskName('');
    setDescription('');
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddTaskModalOpen(false)}>
      <div
        className="modal-container task-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{t.addTaskTitle}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsAddTaskModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal-body">
          {/* Task Name */}
          <div className="form-group">
            <label className="form-label">{t.taskNameLabel}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t.taskNamePlaceholder}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">{t.taskDescLabel}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t.taskDescPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Dates & Mini Calendar Row */}
          <div className="dates-calendar-grid">
            <div className="dates-inputs-col">
              <div className="dates-row">
                <div className="form-group">
                  <label className="form-label">{t.startDateLabel}</label>
                  <div className="input-with-icon">
                    <CalendarIcon size={14} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.dueDateLabel}</label>
                  <div className="input-with-icon">
                    <CalendarIcon size={14} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Select pills */}
              <div className="form-group">
                <label className="form-label">{t.quickSelectLabel}</label>
                <div className="pill-group">
                  {[
                    { key: 'Today', label: t.qsToday },
                    { key: 'Tomorrow', label: t.qsTomorrow },
                    { key: 'This week', label: t.qsThisWeek },
                    { key: 'Daily', label: t.qsDaily }
                  ].map((q) => (
                    <button
                      key={q.key}
                      type="button"
                      className={`pill-btn ${quickSelect === q.key ? 'active' : ''}`}
                      onClick={() => handleQuickSelect(q.key)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div className="form-group">
                <label className="form-label">{t.attachmentsLabel}</label>
                <button type="button" className="attachment-btn">
                  <Paperclip size={14} />
                  <span>{t.addAttachmentBtn}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Mini Calendar widget */}
            <div className="mini-calendar-widget">
              <div className="mini-cal-header">
                <span className="cal-month-pill">{formatMonthYear(calMonthDate)}</span>
                <div className="cal-nav-arrows" style={{ display: 'flex', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                  <span onClick={() => setCalMonthDate(prev => addMonths(prev, -1))} title="Previous Month">‹</span>
                  <span onClick={() => setCalMonthDate(prev => addMonths(prev, 1))} title="Next Month">›</span>
                </div>
              </div>
              <div className="cal-days-grid">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                  <div key={d} className="cal-day-label">{d}</div>
                ))}
                {monthDays.map((cell) => {
                  const isSelected = selectedDate && isSameDay(selectedDate, cell.date);
                  const isNextOrPrev = !cell.isCurrentMonth;

                  return (
                    <button
                      key={cell.dateString}
                      type="button"
                      className={`cal-day-cell ${isSelected ? 'selected' : ''} ${isNextOrPrev ? 'next-month' : ''}`}
                      onClick={() => handleDayClick(cell)}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
              <div className="cal-reminder-row">
                <span>⏰ Remind</span>
                <span className="cal-tag">None ▾</span>
              </div>
              <div className="cal-actions">
                <button
                  type="button"
                  className="btn-pill cal-save-btn"
                  onClick={() => {
                    if (selectedDate) setDueDate(formatTaskDisplayDate(selectedDate));
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn-pill cal-clear-btn"
                  onClick={() => {
                    setSelectedDate(null);
                    setDueDate('');
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Priority pills */}
          <div className="form-group">
            <label className="form-label">{t.priorityLabel}</label>
            <div className="pill-group">
              {[
                { key: 'High', label: t.prioHigh, color: '#EA580C', bg: '#FFF7ED' },
                { key: 'Medium', label: t.prioMed, color: '#D97706', bg: '#FEF3C7' },
                { key: 'Low', label: t.prioLow, color: '#65A30D', bg: '#ECFCCB' }
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`priority-pill ${priority === p.key ? 'active' : ''}`}
                  style={{
                    backgroundColor: priority === p.key ? p.bg : 'var(--bg-card)',
                    borderColor: priority === p.key ? p.color : 'var(--border-card)',
                    color: priority === p.key ? p.color : 'inherit'
                  }}
                  onClick={() => setPriority(p.key)}
                >
                  <span className="priority-dot" style={{ backgroundColor: p.color }}></span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories pills */}
          <div className="form-group">
            <label className="form-label">{t.categoriesLabel}</label>
            <div className="pill-group">
              {[
                { key: 'Work', label: t.catWork },
                { key: 'Health', label: t.catHealth },
                { key: 'Finance', label: t.catFinance },
                { key: 'Personal', label: t.catPersonal }
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`pill-btn ${category === cat.key ? 'active' : ''}`}
                  onClick={() => setCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddTaskModalOpen(false)}
            >
              {t.btnCancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {t.btnSaveTask}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
