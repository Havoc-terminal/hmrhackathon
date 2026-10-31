// Comprehensive date & time utilities for DailyEcho Google Calendar
// Pure JavaScript, zero external dependencies, timezone-aware

/**
 * Format a Date object to local YYYY-MM-DD string
 */
export const toISODateString = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * Parse YYYY-MM-DD string into a local midnight Date object
 */
export const parseISODate = (isoStr) => {
  if (!isoStr) return new Date();
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(isoStr);
};

/**
 * Add or subtract days from a date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add or subtract months
 */
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Check if two dates represent the exact same calendar day
 */
export const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = d1 instanceof Date ? d1 : parseISODate(d1);
  const date2 = d2 instanceof Date ? d2 : parseISODate(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Get start of week (Sunday = 0, Monday = 1)
 */
export const getStartOfWeek = (date, weekStartsOn = 0) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  return d;
};

/**
 * Generate 7 days for the week containing anchorDate
 */
export const getWeekDays = (anchorDate, weekStartsOn = 0) => {
  const start = getStartOfWeek(anchorDate, weekStartsOn);
  const todayStr = toISODateString(new Date());
  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(start, i);
    const dateStr = toISODateString(d);
    return {
      date: d,
      dateString: dateStr,
      dayNumber: d.getDate(),
      dayOfWeek: d.getDay(),
      label: dayLabels[d.getDay()],
      isToday: dateStr === todayStr
    };
  });
};

/**
 * Generate mini calendar matrix (prev month padding, current month, next month padding)
 */
export const getMonthMatrix = (anchorDate, weekStartsOn = 0) => {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const todayStr = toISODateString(new Date());

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Determine padding from previous month
  const startDay = firstDayOfMonth.getDay();
  const prevPadding = (startDay < weekStartsOn ? 7 : 0) + startDay - weekStartsOn;

  const days = [];

  // Previous month trailing days
  for (let i = prevPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, 1 - (i + 1));
    const dateStr = toISODateString(d);
    days.push({
      date: d,
      dateString: dateStr,
      day: d.getDate(),
      isPrev: true,
      isCurrentMonth: false,
      isNext: false,
      isToday: dateStr === todayStr
    });
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, month, i);
    const dateStr = toISODateString(d);
    days.push({
      date: d,
      dateString: dateStr,
      day: i,
      isPrev: false,
      isCurrentMonth: true,
      isNext: false,
      isToday: dateStr === todayStr
    });
  }

  // Next month leading days to complete full grid (multiple of 7: 35 or 42)
  const totalCells = days.length > 35 ? 42 : 35;
  const remaining = totalCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    const dateStr = toISODateString(d);
    days.push({
      date: d,
      dateString: dateStr,
      day: i,
      isPrev: false,
      isCurrentMonth: false,
      isNext: true,
      isToday: dateStr === todayStr
    });
  }

  return days;
};

/**
 * Format Month & Year for Top Bar
 */
export const formatMonthYear = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Format Range for Week View: "October 2026" or "Oct – Nov 2026" or "Dec 2026 – Jan 2027"
 */
export const formatWeekTitle = (weekDays) => {
  if (!weekDays || weekDays.length === 0) return '';
  const first = weekDays[0].date;
  const last = weekDays[6].date;

  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (first.getFullYear() !== last.getFullYear()) {
    return `${shortMonths[first.getMonth()]} ${first.getFullYear()} – ${shortMonths[last.getMonth()]} ${last.getFullYear()}`;
  }
  if (first.getMonth() !== last.getMonth()) {
    return `${shortMonths[first.getMonth()]} – ${shortMonths[last.getMonth()]} ${first.getFullYear()}`;
  }
  return `${fullMonths[first.getMonth()]} ${first.getFullYear()}`;
};

/**
 * Format Full Date for Event Dialog: e.g. "Friday, October 30, 2026"
 */
export const formatFullDate = (dateOrStr) => {
  const d = dateOrStr instanceof Date ? dateOrStr : parseISODate(dateOrStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format Display Date for Tasks: e.g. "31 Oct 2026"
 */
export const formatTaskDisplayDate = (dateOrStr) => {
  if (!dateOrStr) return '';
  const d = dateOrStr instanceof Date ? dateOrStr : parseISODate(dateOrStr);
  if (isNaN(d.getTime())) return String(dateOrStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Format hour number (e.g. 9 -> '9 AM', 13.5 -> '1:30 PM')
 */
export const formatHourLabel = (hour) => {
  const wholeHour = Math.floor(hour);
  const minutes = Math.round((hour - wholeHour) * 60);
  const minuteStr = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';

  if (wholeHour === 0 || wholeHour === 24) return `12${minuteStr} AM`;
  if (wholeHour === 12) return `12${minuteStr} PM`;
  if (wholeHour > 12) return `${wholeHour - 12}${minuteStr} PM`;
  return `${wholeHour}${minuteStr} AM`;
};

/**
 * Format time range from startHour & endHour
 */
export const formatTimeRange = (startHour, endHour) => {
  return `${formatHourLabel(startHour)} – ${formatHourLabel(endHour)}`;
};

/**
 * Get user's local timezone name and GMT offset
 */
export const getLocalTimezoneInfo = () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const offsetMin = -new Date().getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const absMin = Math.abs(offsetMin);
    const hrs = String(Math.floor(absMin / 60)).padStart(2, '0');
    const mins = String(absMin % 60).padStart(2, '0');
    return {
      timeZone,
      gmtOffset: `GMT${sign}${hrs}:${mins}`
    };
  } catch (e) {
    return { timeZone: 'Local', gmtOffset: 'GMT' };
  }
};

