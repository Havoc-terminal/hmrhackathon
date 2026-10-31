import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  HelpCircle, 
  Settings, 
  Grid, 
  Menu, 
  Plus, 
  ChevronDown, 
  Users, 
  Check, 
  X,
  Video, 
  Clock, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Trash2,
  Calendar as CalIcon,
  CheckSquare
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import SideDrawer from '../Modals/SideDrawer';
import {
  toISODateString,
  addDays,
  addMonths,
  getWeekDays,
  getMonthMatrix,
  formatMonthYear,
  formatWeekTitle,
  formatFullDate,
  formatHourLabel,
  formatTimeRange,
  getLocalTimezoneInfo
} from '../../services/calendarUtils';

export default function CalendarView() {
  const { 
    calendarEvents, 
    setCurrentView, 
    startAgentExecution,
    currentUser,
    setIsSettingsModalOpen,
    setIsHelpModalOpen,
    setIsSearchModalOpen,
    setIsAppsGridOpen,
    setIsUserAccountOpen,
    setIsAddEventModalOpen,
    setIsAddTaskModalOpen,
    setNewEventInitialData,
    activeSideDrawer,
    setActiveSideDrawer,
    deleteCalendarEvent
  } = useKaarya();

  // Anchor and Selection Dates (Real-time dynamic)
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(() => new Date());
  const [viewMode, setViewMode] = useState('Week');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchPeopleQuery, setSearchPeopleQuery] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  // Live real-time clock to keep the current-time red indicator line accurate
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = useMemo(() => toISODateString(new Date()), [currentTime]);
  const timezoneInfo = useMemo(() => getLocalTimezoneInfo(), []);

  // Active calendar filters
  const [calendars, setCalendars] = useState([
    { id: 'user_cal', name: currentUser?.name ? `${currentUser.name}'s Calendar` : 'My Calendar', color: '#1a73e8', checked: true },
    { id: 'work', name: 'Work & Projects', color: '#0d9488', checked: true },
    { id: 'health', name: 'Health & Fitness', color: '#0f9d58', checked: true },
    { id: 'reminders', name: 'Reminders', color: '#3f51b5', checked: true },
    { id: 'tasks', name: 'Tasks', color: '#039be5', checked: true },
    { id: 'kaarya', name: '⚡ DailyEcho Synced', color: '#7b1fa2', checked: true }
  ]);

  const toggleCalendar = (id) => {
    setCalendars(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  // Synchronize calendar name when currentUser changes
  useEffect(() => {
    if (currentUser?.name) {
      setCalendars(prev => prev.map(c => c.id === 'user_cal' ? { ...c, name: `${currentUser.name}'s Calendar` } : c));
    }
  }, [currentUser]);

  // Derived date collections
  const weekDays = useMemo(() => getWeekDays(anchorDate, 0), [anchorDate]);
  const miniCalendarDays = useMemo(() => getMonthMatrix(miniCalendarMonth, 0), [miniCalendarMonth]);
  const monthViewCells = useMemo(() => getMonthMatrix(anchorDate, 0), [anchorDate]);
  
  const fourDays = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const d = addDays(anchorDate, i);
      const dateStr = toISODateString(d);
      const labels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      return {
        date: d,
        dateString: dateStr,
        dayNumber: d.getDate(),
        dayOfWeek: d.getDay(),
        label: labels[d.getDay()],
        isToday: dateStr === todayStr
      };
    });
  }, [anchorDate, todayStr]);

  // Working day hours range (6 AM to 10 PM)
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  // Navigation handlers
  const handleTodayClick = () => {
    const now = new Date();
    setAnchorDate(now);
    setSelectedDate(now);
    setMiniCalendarMonth(now);
  };

  const handlePrev = () => {
    if (viewMode === 'Week') setAnchorDate(prev => addDays(prev, -7));
    else if (viewMode === 'Day') setAnchorDate(prev => addDays(prev, -1));
    else if (viewMode === 'Month') setAnchorDate(prev => addMonths(prev, -1));
    else if (viewMode === '4 days') setAnchorDate(prev => addDays(prev, -4));
    else if (viewMode === 'Schedule') setAnchorDate(prev => addDays(prev, -7));
  };

  const handleNext = () => {
    if (viewMode === 'Week') setAnchorDate(prev => addDays(prev, 7));
    else if (viewMode === 'Day') setAnchorDate(prev => addDays(prev, 1));
    else if (viewMode === 'Month') setAnchorDate(prev => addMonths(prev, 1));
    else if (viewMode === '4 days') setAnchorDate(prev => addDays(prev, 4));
    else if (viewMode === 'Schedule') setAnchorDate(prev => addDays(prev, 7));
  };

  // Header Title based on active view mode
  const currentViewTitle = useMemo(() => {
    if (viewMode === 'Week') return formatWeekTitle(weekDays);
    if (viewMode === 'Month') return formatMonthYear(anchorDate);
    if (viewMode === 'Day') return formatFullDate(anchorDate);
    if (viewMode === '4 days') return formatWeekTitle(fourDays);
    if (viewMode === 'Schedule') return formatMonthYear(anchorDate);
    return formatMonthYear(anchorDate);
  }, [viewMode, anchorDate, weekDays, fourDays]);

  // Filter events by search query and active calendar toggles
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(e => {
      // Search query filter
      if (searchPeopleQuery.trim()) {
        const q = searchPeopleQuery.toLowerCase();
        const matchesAttendee = e.attendees && e.attendees.some(a => a.toLowerCase().includes(q));
        const matchesTitle = e.title && e.title.toLowerCase().includes(q);
        const matchesLoc = e.location && e.location.toLowerCase().includes(q);
        if (!matchesAttendee && !matchesTitle && !matchesLoc) return false;
      }
      return true;
    });
  }, [calendarEvents, searchPeopleQuery]);

  // All-day events that overlap the active viewing week
  const allDayEventsForWeek = useMemo(() => {
    const weekStartStr = weekDays[0].dateString;
    const weekEndStr = weekDays[6].dateString;

    return filteredEvents.filter(e => {
      if (!e.isAllDay) return false;
      if (e.startDate && e.endDate) {
        return e.startDate <= weekEndStr && e.endDate >= weekStartStr;
      }
      return e.date >= weekStartStr && e.date <= weekEndStr;
    });
  }, [filteredEvents, weekDays]);

  // Current red line position
  const currentHourFloat = currentTime.getHours() + currentTime.getMinutes() / 60;
  const isTimeInHourGrid = currentHourFloat >= 6 && currentHourFloat <= 23;
  const redLineTopPx = (currentHourFloat - 6) * 56;

  // Open Add Event modal for a specific date and time slot
  const handleSlotClick = (dateString, hour) => {
    setNewEventInitialData({
      date: dateString,
      dateString,
      startHour: hour,
      endHour: hour + 1
    });
    setIsAddEventModalOpen(true);
  };

  return (
    <div 
      className="google-calendar-root" 
      onClick={() => {
        setIsViewDropdownOpen(false);
        setIsCreateMenuOpen(false);
      }}
    >
      {/* 1. GOOGLE CALENDAR TOP BAR */}
      <header className="gcal-topbar">
        {/* Left Section */}
        <div className="gcal-top-left">
          <button 
            type="button" 
            className="gcal-icon-btn"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            title="Main menu"
          >
            <Menu size={20} />
          </button>

          {/* Official Google Calendar Logo */}
          <div 
            className="gcal-brand-logo" 
            onClick={handleTodayClick}
            title="Calendar - Click to reset to today"
          >
            <div className="gcal-logo-icon">
              <span className="gcal-logo-num">{new Date().getDate()}</span>
            </div>
            <span className="gcal-brand-text">Calendar</span>
          </div>

          <button 
            type="button" 
            className="gcal-today-btn"
            onClick={handleTodayClick}
          >
            Today
          </button>

          <div className="gcal-nav-arrows">
            <button 
              type="button" 
              className="gcal-arrow-btn" 
              title="Previous"
              onClick={handlePrev}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button" 
              className="gcal-arrow-btn" 
              title="Next"
              onClick={handleNext}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <h2 className="gcal-month-title">
            {currentViewTitle}
          </h2>
        </div>

        {/* Right Section */}
        <div className="gcal-top-right">
          {/* Universal Search */}
          <button 
            type="button" 
            className="gcal-icon-btn" 
            title="Search events, emails, tasks"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Search size={18} />
          </button>

          {/* Support */}
          <button 
            type="button" 
            className="gcal-icon-btn" 
            title="Support & Keyboard Shortcuts"
            onClick={() => setIsHelpModalOpen(true)}
          >
            <HelpCircle size={18} />
          </button>

          {/* Settings */}
          <button 
            type="button" 
            className="gcal-icon-btn" 
            title="Settings menu"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Settings size={18} />
          </button>

          {/* View Dropdown (Day, Week, Month, 4 days, Schedule) */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="gcal-view-selector-btn"
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
            >
              <span>{viewMode}</span>
              <ChevronDown size={14} />
            </button>

            {isViewDropdownOpen && (
              <div className="gcal-view-dropdown-menu">
                {['Day', 'Week', 'Month', '4 days', 'Schedule'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`gcal-dropdown-item ${viewMode === m ? 'selected' : ''}`}
                    onClick={() => {
                      setViewMode(m);
                      setIsViewDropdownOpen(false);
                    }}
                  >
                    <span>{m}</span>
                    <span className="text-xs text-gray-400">{m[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Google 9-dots Apps Switcher */}
          <button 
            type="button" 
            className="gcal-icon-btn" 
            title="Google apps & DailyEcho"
            onClick={() => setIsAppsGridOpen(true)}
          >
            <Grid size={18} />
          </button>

          {/* User Profile Avatar */}
          <div 
            className="gcal-profile-avatar" 
            title={`Google Account: ${currentUser?.email || 'Mayank'}`}
            onClick={() => setIsUserAccountOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
              alt="Profile" 
            />
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER (Sidebar + Calendar Grid + Right Add-ons) */}
      <div className="gcal-workspace-body">
        {/* Left Side Panel */}
        {isLeftSidebarOpen && (
          <aside className="gcal-left-sidebar">
            {/* "+ Create" Pill Button with Dropdown */}
            <div className="gcal-create-wrap relative" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="gcal-create-pill-btn"
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              >
                {/* Google 4-Color Plus SVG */}
                <svg className="gcal-create-plus-icon" viewBox="0 0 36 36">
                  <path fill="#4285F4" d="M16 16v14h4V16h14v-4H20V-2h-4v14H2v4h14z" />
                  <path fill="#FBBC05" d="M30 16H20v-4h10z" />
                  <path fill="#EA4335" d="M16 2v10h4V2z" />
                  <path fill="#34A853" d="M16 16H6v4h10z" />
                  <path fill="#4285F4" d="M20 20v10h-4V20z" />
                </svg>
                <span className="gcal-create-text">Create</span>
                <ChevronDown size={14} className="text-gray-500 ml-1" />
              </button>

              {isCreateMenuOpen && (
                <div className="gcal-create-menu-dropdown">
                  <button 
                    type="button"
                    className="create-menu-item"
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      setNewEventInitialData({
                        date: toISODateString(selectedDate),
                        dateString: toISODateString(selectedDate),
                        startHour: 10,
                        endHour: 11
                      });
                      setIsAddEventModalOpen(true);
                    }}
                  >
                    <CalIcon size={16} className="text-blue-500" />
                    <span>Event</span>
                  </button>

                  <button 
                    type="button"
                    className="create-menu-item"
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      setCurrentView('dashboard');
                      startAgentExecution('Schedule an important meeting and prepare task');
                    }}
                  >
                    <Sparkles size={16} className="text-teal-500" />
                    <span>DailyEcho AI Plan</span>
                  </button>

                  <button 
                    type="button"
                    className="create-menu-item"
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      setIsAddTaskModalOpen(true);
                    }}
                  >
                    <CheckSquare size={16} className="text-amber-500" />
                    <span>Task</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Mini Monthly Calendar */}
            <div className="gcal-mini-calendar-box">
              <div className="mini-cal-month-row">
                <span className="mini-cal-title">
                  {formatMonthYear(miniCalendarMonth)}
                </span>
                <div className="mini-cal-arrows">
                  <button 
                    type="button" 
                    className="mini-arrow-btn"
                    title="Previous month"
                    onClick={() => setMiniCalendarMonth(prev => addMonths(prev, -1))}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    type="button" 
                    className="mini-arrow-btn"
                    title="Next month"
                    onClick={() => setMiniCalendarMonth(prev => addMonths(prev, 1))}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="mini-cal-grid">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, i) => (
                  <div key={i} className="mini-day-name">{dayChar}</div>
                ))}
                {miniCalendarDays.map((d, idx) => {
                  const isSelected = toISODateString(selectedDate) === d.dateString;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`mini-day-cell ${d.isPrev || d.isNext ? 'dimmed' : ''} ${d.isToday ? 'today-circle' : ''} ${isSelected && !d.isToday ? 'selected-circle' : ''}`}
                      onClick={() => {
                        setSelectedDate(d.date);
                        setAnchorDate(d.date);
                      }}
                      title={formatFullDate(d.date)}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* "Meet with..." search box */}
            <div className="gcal-meet-search-box">
              <label className="meet-search-label">Meet with...</label>
              <div className="meet-search-input-wrap">
                <Users size={15} className="meet-search-icon" />
                <input
                  type="text"
                  placeholder="Search for people"
                  value={searchPeopleQuery}
                  onChange={(e) => setSearchPeopleQuery(e.target.value)}
                  className="meet-search-input"
                />
                {searchPeopleQuery && (
                  <button 
                    type="button" 
                    className="text-gray-400 p-0.5 hover:text-gray-600"
                    onClick={() => setSearchPeopleQuery('')}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* "My calendars" accordion */}
            <div className="gcal-calendars-section">
              <div className="cal-section-header">
                <span className="cal-section-title">My calendars</span>
                <ChevronDown size={15} className="text-gray-500 cursor-pointer" />
              </div>

              <div className="cal-checkbox-list">
                {calendars.map((cal) => (
                  <label key={cal.id} className="cal-checkbox-item">
                    <input
                      type="checkbox"
                      checked={cal.checked}
                      onChange={() => toggleCalendar(cal.id)}
                      style={{ accentColor: cal.color }}
                    />
                    <span className="cal-name-label">{cal.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* "Other calendars" section */}
            <div className="gcal-calendars-section">
              <div className="cal-section-header">
                <span className="cal-section-title">Other calendars</span>
                <button 
                  type="button"
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500"
                  onClick={() => {
                    const calName = prompt('Enter external calendar name or URL:');
                    if (calName) {
                      setCalendars(prev => [...prev, { id: `cal-${Date.now()}`, name: calName, color: '#f59e0b', checked: true }]);
                    }
                  }}
                  title="Add other calendar"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="cal-other-item">
                <span className="other-cal-dot"></span>
                <span className="other-cal-name">Holidays in Your Country</span>
              </div>
            </div>
          </aside>
        )}

        {/* 3. CENTER CALENDAR AREA */}
        <main className="gcal-main-calendar">
          {/* A. WEEK VIEW (Default) or 4-DAYS VIEW */}
          {(viewMode === 'Week' || viewMode === '4 days') && (
            <>
              {/* Days Header Row */}
              <div className="gcal-grid-header">
                {/* GMT Column */}
                <div className="gcal-gmt-cell">
                  <span>{timezoneInfo.gmtOffset}</span>
                </div>

                {/* Day Columns Header */}
                <div 
                  className="gcal-days-header-grid"
                  style={{ gridTemplateColumns: `repeat(${viewMode === 'Week' ? 7 : 4}, 1fr)` }}
                >
                  {(viewMode === 'Week' ? weekDays : fourDays).map((d, i) => (
                    <div 
                      key={i} 
                      className={`gcal-day-header-col ${d.isToday ? 'today-col' : ''}`}
                      onClick={() => setSelectedDate(d.date)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="day-name-text">{d.label}</span>
                      <span className={`day-number-text ${d.isToday ? 'active-today-bubble' : ''}`}>
                        {d.dayNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All-Day Events Banner Strip */}
              {allDayEventsForWeek.length > 0 && (
                <div className="gcal-allday-strip">
                  <div className="allday-label-cell"></div>
                  <div className="allday-events-container">
                    {allDayEventsForWeek.map((evt) => (
                      <div
                        key={evt.id}
                        className="gcal-allday-banner"
                        style={{
                          backgroundColor: evt.color,
                          color: evt.textColor || '#ffffff'
                        }}
                        onClick={() => setSelectedEvent(evt)}
                      >
                        <span className="allday-banner-title">{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hourly Time Grid */}
              <div className="gcal-time-grid-scroll">
                <div className="gcal-time-grid-body">
                  {/* Left Hours Axis */}
                  <div className="gcal-hours-axis">
                    {hours.map((h) => (
                      <div key={h} className="gcal-hour-label-cell">
                        <span>{formatHourLabel(h)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Columns Grid */}
                  <div className="gcal-columns-container">
                    {/* Horizontal hour lines */}
                    <div className="gcal-horizontal-lines">
                      {hours.map((h) => (
                        <div key={h} className="gcal-hour-horizontal-row"></div>
                      ))}
                    </div>

                    {/* Vertical Columns */}
                    <div 
                      className="gcal-vertical-columns-grid"
                      style={{ gridTemplateColumns: `repeat(${viewMode === 'Week' ? 7 : 4}, 1fr)` }}
                    >
                      {(viewMode === 'Week' ? weekDays : fourDays).map((d, colIndex) => {
                        const dayEvents = filteredEvents.filter(
                          evt => !evt.isAllDay && evt.date === d.dateString
                        );

                        return (
                          <div 
                            key={colIndex} 
                            className={`gcal-day-vertical-col ${d.isToday ? 'today-bg' : ''}`}
                            onClick={(e) => {
                              if (e.target === e.currentTarget) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickY = e.clientY - rect.top;
                                const clickedHour = Math.min(Math.max(Math.floor(clickY / 56) + 6, 6), 22);
                                handleSlotClick(d.dateString, clickedHour);
                              }
                            }}
                            title="Click any empty slot to add an event"
                          >
                            {/* Real-time Current Time Red Line Indicator */}
                            {d.isToday && isTimeInHourGrid && (
                              <div 
                                className="gcal-current-time-line"
                                style={{ top: `${redLineTopPx}px` }}
                              >
                                <div className="time-line-dot"></div>
                                <div className="time-line-bar"></div>
                              </div>
                            )}

                            {/* Render Events for this day column */}
                            {dayEvents.map((evt) => {
                              const topPx = (evt.startHour - 6) * 56;
                              const duration = evt.endHour ? (evt.endHour - evt.startHour) : (evt.durationHours || 1);
                              const heightPx = Math.max(duration * 56 - 4, 32);

                              return (
                                <div
                                  key={evt.id}
                                  className={`gcal-event-block ${evt.isAiGenerated ? 'ai-scheduled-block' : ''}`}
                                  style={{
                                    top: `${topPx}px`,
                                    height: `${heightPx}px`,
                                    backgroundColor: evt.color
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(evt);
                                  }}
                                >
                                  <div className="event-block-content">
                                    <div className="event-block-title-row">
                                      <span className="event-block-title">{evt.title}</span>
                                      {evt.isAiGenerated && (
                                        <Sparkles size={11} className="text-white ml-1 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="event-block-time">
                                      {evt.timeDisplay || formatTimeRange(evt.startHour, evt.endHour)}
                                    </div>
                                    {evt.location && (
                                      <div className="event-block-loc">{evt.location}</div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* B. DAY VIEW */}
          {viewMode === 'Day' && (
            <>
              {/* Day View Header */}
              <div className="gcal-grid-header">
                <div className="gcal-gmt-cell">
                  <span>{timezoneInfo.gmtOffset}</span>
                </div>
                <div className="flex-1 flex flex-col items-center py-2">
                  <span className="day-name-text">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][anchorDate.getDay()]}
                  </span>
                  <span className={`day-number-text ${toISODateString(anchorDate) === todayStr ? 'active-today-bubble' : ''}`}>
                    {anchorDate.getDate()}
                  </span>
                </div>
              </div>

              {/* Day Time Grid */}
              <div className="gcal-time-grid-scroll">
                <div className="gcal-time-grid-body">
                  <div className="gcal-hours-axis">
                    {hours.map((h) => (
                      <div key={h} className="gcal-hour-label-cell">
                        <span>{formatHourLabel(h)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="gcal-columns-container">
                    <div className="gcal-horizontal-lines">
                      {hours.map((h) => (
                        <div key={h} className="gcal-hour-horizontal-row"></div>
                      ))}
                    </div>

                    <div 
                      className={`gcal-day-vertical-col w-full h-full ${toISODateString(anchorDate) === todayStr ? 'today-bg' : ''}`}
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickY = e.clientY - rect.top;
                          const clickedHour = Math.min(Math.max(Math.floor(clickY / 56) + 6, 6), 22);
                          handleSlotClick(toISODateString(anchorDate), clickedHour);
                        }
                      }}
                    >
                      {toISODateString(anchorDate) === todayStr && isTimeInHourGrid && (
                        <div 
                          className="gcal-current-time-line"
                          style={{ top: `${redLineTopPx}px` }}
                        >
                          <div className="time-line-dot"></div>
                          <div className="time-line-bar"></div>
                        </div>
                      )}

                      {filteredEvents
                        .filter(evt => !evt.isAllDay && evt.date === toISODateString(anchorDate))
                        .map((evt) => {
                          const topPx = (evt.startHour - 6) * 56;
                          const duration = evt.endHour ? (evt.endHour - evt.startHour) : (evt.durationHours || 1);
                          const heightPx = Math.max(duration * 56 - 4, 36);

                          return (
                            <div
                              key={evt.id}
                              className={`gcal-event-block ${evt.isAiGenerated ? 'ai-scheduled-block' : ''}`}
                              style={{
                                top: `${topPx}px`,
                                height: `${heightPx}px`,
                                backgroundColor: evt.color,
                                left: '8px',
                                right: '16px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                              }}
                            >
                              <div className="event-block-content">
                                <div className="event-block-title-row">
                                  <span className="event-block-title text-sm">{evt.title}</span>
                                  {evt.isAiGenerated && (
                                    <Sparkles size={13} className="text-white ml-2" />
                                  )}
                                </div>
                                <div className="event-block-time text-xs font-medium">
                                  {evt.timeDisplay || formatTimeRange(evt.startHour, evt.endHour)}
                                </div>
                                {evt.location && (
                                  <div className="event-block-loc">{evt.location}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* C. MONTH VIEW */}
          {viewMode === 'Month' && (
            <div className="gcal-month-container">
              {/* 7 Columns Header */}
              <div className="gcal-month-grid-header">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((dayName, idx) => (
                  <div key={idx} className="gcal-month-header-cell">
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Month Cells Grid */}
              <div className="gcal-month-grid-cells">
                {monthViewCells.map((cell, idx) => {
                  const cellEvents = filteredEvents.filter(e => e.date === cell.dateString);

                  return (
                    <div
                      key={idx}
                      className={`gcal-month-cell ${cell.isPrev || cell.isNext ? 'dimmed' : ''} ${cell.isToday ? 'today-cell' : ''}`}
                      onClick={() => handleSlotClick(cell.dateString, 10)}
                    >
                      <div className="gcal-month-day-header">
                        <span className={`gcal-month-day-num ${cell.isToday ? 'active-today' : ''}`}>
                          {cell.day}
                        </span>
                      </div>

                      {/* Event chips */}
                      <div className="flex flex-col gap-1 overflow-hidden">
                        {cellEvents.slice(0, 3).map((evt) => (
                          <div
                            key={evt.id}
                            className={`gcal-month-chip ${evt.isAiGenerated ? 'ai-badge' : ''}`}
                            style={{ backgroundColor: evt.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                            }}
                            title={`${evt.title} (${evt.timeDisplay || ''})`}
                          >
                            <span className="truncate">{evt.title}</span>
                          </div>
                        ))}
                        {cellEvents.length > 3 && (
                          <span className="text-[10px] text-gray-500 font-medium px-1">
                            +{cellEvents.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* D. SCHEDULE VIEW (Agenda) */}
          {viewMode === 'Schedule' && (
            <div className="gcal-schedule-view">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <CalIcon size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-base font-medium">No events scheduled for this period.</p>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-pill mt-4"
                    onClick={() => {
                      setNewEventInitialData({
                        date: todayStr,
                        startHour: 10,
                        endHour: 11
                      });
                      setIsAddEventModalOpen(true);
                    }}
                  >
                    <Plus size={16} /> Create Event
                  </button>
                </div>
              ) : (
                <div className="gcal-schedule-cards-list">
                  {filteredEvents.map((evt) => {
                    const isEvtToday = evt.date === todayStr;

                    return (
                      <div
                        key={evt.id}
                        className="gcal-schedule-card"
                        onClick={() => setSelectedEvent(evt)}
                      >
                        <div 
                          className="gcal-schedule-card-color-bar" 
                          style={{ backgroundColor: evt.color }}
                        />

                        <div className="gcal-schedule-time-label">
                          <div className="font-semibold text-gray-800 dark:text-gray-100">
                            {formatFullDate(evt.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {evt.isAllDay ? 'All Day' : (evt.timeDisplay || formatTimeRange(evt.startHour, evt.endHour))}
                          </div>
                        </div>

                        <div className="gcal-schedule-main-info">
                          <div className="flex items-center gap-2">
                            <span className="gcal-schedule-title">{evt.title}</span>
                            {isEvtToday && (
                              <span className="gcal-schedule-today-pill">Today</span>
                            )}
                            {evt.isAiGenerated && (
                              <span className="badge badge-personal text-[10px]">
                                <Sparkles size={10} /> DailyEcho
                              </span>
                            )}
                          </div>

                          <div className="gcal-schedule-meta-row">
                            {evt.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={13} className="text-gray-400" />
                                <span>{evt.location}</span>
                              </span>
                            )}
                            {evt.attendees && evt.attendees.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users size={13} className="text-gray-400" />
                                <span>{evt.attendees.length} guests</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="gcal-schedule-right-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-pill text-xs flex items-center gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open('https://meet.google.com', '_blank');
                            }}
                          >
                            <Video size={13} className="text-blue-500" />
                            <span>Join</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* 4. RIGHT WORKSPACE ADD-ONS SIDEBAR */}
        <aside className="gcal-right-sidebar">
          <div className="gcal-addon-icons-col">
            {/* Google Keep */}
            <button 
              type="button" 
              className={`addon-icon-btn ${activeSideDrawer === 'keep' ? 'active-addon' : ''}`}
              title="Google Keep Notes"
              onClick={() => setActiveSideDrawer(activeSideDrawer === 'keep' ? null : 'keep')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#FBBC04" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
              </svg>
            </button>

            {/* Google Tasks */}
            <button 
              type="button" 
              className={`addon-icon-btn ${activeSideDrawer === 'tasks' ? 'active-addon' : ''}`}
              title="Google Tasks"
              onClick={() => setActiveSideDrawer(activeSideDrawer === 'tasks' ? null : 'tasks')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#1A73E8" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
              </svg>
            </button>

            {/* Google Contacts */}
            <button 
              type="button" 
              className={`addon-icon-btn ${activeSideDrawer === 'contacts' ? 'active-addon' : ''}`}
              title="Google Contacts"
              onClick={() => setActiveSideDrawer(activeSideDrawer === 'contacts' ? null : 'contacts')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#1A73E8" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {/* Google Maps */}
            <button 
              type="button" 
              className={`addon-icon-btn ${activeSideDrawer === 'maps' ? 'active-addon' : ''}`}
              title="Google Maps Venue Locations"
              onClick={() => setActiveSideDrawer(activeSideDrawer === 'maps' ? null : 'maps')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#34A853" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </button>

            <div className="addon-divider"></div>

            {/* Marketplace Addons */}
            <button 
              type="button" 
              className={`addon-icon-btn ${activeSideDrawer === 'addons' ? 'active-addon' : ''}`}
              title="Get Google Workspace Add-ons"
              onClick={() => setActiveSideDrawer(activeSideDrawer === 'addons' ? null : 'addons')}
            >
              <Plus size={18} className="text-gray-500" />
            </button>
          </div>
        </aside>

        {/* 5. SLIDING SIDE DRAWER FOR KEEP, TASKS, CONTACTS, MAPS, ADDONS */}
        <SideDrawer />
      </div>

      {/* 6. EVENT DETAILS DIALOG (Google Calendar Card Popover) */}
      {selectedEvent && (
        <div className="gcal-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="gcal-event-popover-card" onClick={(e) => e.stopPropagation()}>
            <div className="popover-top-bar" style={{ backgroundColor: selectedEvent.color }}>
              <div className="flex items-center gap-2">
                <CalIcon size={16} className="text-white" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Google Calendar Event
                </span>
                {selectedEvent.isAiGenerated && (
                  <span className="badge badge-personal text-[10px] ml-auto">
                    <Sparkles size={10} /> DailyEcho
                  </span>
                )}
              </div>
              <button 
                type="button" 
                className="popover-close-btn"
                onClick={() => setSelectedEvent(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="popover-body">
              <h3 className="popover-event-title">{selectedEvent.title}</h3>

              <div className="popover-meta-row">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {selectedEvent.isAllDay 
                      ? 'All Day' 
                      : (selectedEvent.timeDisplay || formatTimeRange(selectedEvent.startHour, selectedEvent.endHour))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFullDate(selectedEvent.date)}
                  </div>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="popover-meta-row">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="popover-meta-row">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedEvent.description}
                  </span>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="popover-meta-row col">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Users size={14} />
                    <span>Guests ({selectedEvent.attendees.length})</span>
                  </div>
                  <div className="guest-chips-wrap">
                    {selectedEvent.attendees.map((att, i) => (
                      <span key={i} className="guest-chip">
                        {att}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="popover-action-row">
                <button 
                  type="button" 
                  className="btn btn-primary btn-pill text-xs flex items-center gap-2"
                  onClick={() => window.open('https://meet.google.com', '_blank')}
                >
                  <Video size={14} />
                  <span>Join with Google Meet</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-pill text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1"
                  onClick={() => {
                    deleteCalendarEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  title="Delete event"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-pill text-xs ml-auto"
                  onClick={() => {
                    setSelectedEvent(null);
                    setCurrentView('inbox');
                  }}
                >
                  <span>Related Mail</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
