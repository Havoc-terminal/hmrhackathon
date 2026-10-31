// Intelligent Meeting & Timing Extractor for Gmail Threads
import { toISODateString, addDays, formatHourLabel, formatTimeRange } from './calendarUtils';

/**
 * Determine the next date for a given weekday name (e.g. "tuesday")
 */
function getNextWeekdayDate(dayName) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = days.indexOf(dayName.toLowerCase());
  if (targetDay === -1) return new Date();

  const now = new Date();
  const currentDay = now.getDay();
  let diff = targetDay - currentDay;
  if (diff <= 0) diff += 7; // Next occurrence

  return addDays(now, diff);
}

/**
 * Parses time string like "3:00 PM", "3pm", "11:30 AM", "14:00" into float hours (e.g. 15.0, 11.5)
 */
function parseTimeString(timeStr, ampmStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

  if (ampmStr) {
    const ampm = ampmStr.toLowerCase();
    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;
  }

  return hours + (minutes / 60);
}

/**
 * Analyze an email thread to extract meeting intent and timing
 */
export function parseMeetingFromEmail(email) {
  if (!email) return null;
  const text = `${email.subject || ''} ${email.snippet || ''} ${email.body || ''}`;
  const lowerText = text.toLowerCase();

  // 1. Check for meeting keywords
  const meetingKeywords = [
    'meeting', 'meet', 'sync', 'discussion', 'catchup', 'catch up', 
    'call', 'kickoff', 'review', 'demo', 'huddle', 'session', 'standup', 'schedule'
  ];
  const hasMeetingKeyword = meetingKeywords.some(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(text);
  });

  if (!hasMeetingKeyword) {
    return {
      hasMeeting: false,
      hasTiming: false,
      details: null
    };
  }

  // 2. Extract Timing (hours and minutes)
  let startHour = 10; // Default 10 AM if not explicit
  let endHour = 11;
  let hasExplicitTime = false;

  // Regex pattern for times like "3:00 PM", "3:30pm", "11 am", "9:00am - 10:00am"
  const timeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
  const rangeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(?:to|-|–)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;

  const rangeMatch = text.match(rangeRegex);
  if (rangeMatch) {
    hasExplicitTime = true;
    const h1 = parseInt(rangeMatch[1], 10);
    const m1 = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : 0;
    const h2 = parseInt(rangeMatch[3], 10);
    const m2 = rangeMatch[4] ? parseInt(rangeMatch[4], 10) : 0;
    const ampm = rangeMatch[5].toLowerCase();

    let start = h1;
    let end = h2;
    if (ampm === 'pm') {
      if (start < 12 && end <= 12 && start > end) {
        // e.g. 11 to 1 PM
      } else if (start < 12) {
        start += 12;
      }
      if (end < 12) end += 12;
    }
    startHour = start + (m1 / 60);
    endHour = end + (m2 / 60);
  } else {
    const timeMatch = text.match(timeRegex);
    if (timeMatch) {
      hasExplicitTime = true;
      const parsedHour = parseTimeString(timeMatch[1] + (timeMatch[2] ? `:${timeMatch[2]}` : ''), timeMatch[3]);
      if (parsedHour !== null) {
        startHour = parsedHour;
        endHour = parsedHour + 1; // Default 1 hour duration
      }
    }
  }

  // 3. Extract Date
  let targetDate = new Date();
  let hasExplicitDate = false;

  if (lowerText.includes('day after tomorrow')) {
    targetDate = addDays(new Date(), 2);
    hasExplicitDate = true;
  } else if (lowerText.includes('tomorrow')) {
    targetDate = addDays(new Date(), 1);
    hasExplicitDate = true;
  } else if (lowerText.includes('today')) {
    targetDate = new Date();
    hasExplicitDate = true;
  } else {
    // Check for weekday names
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of weekdays) {
      const dayRegex = new RegExp(`\\b(next\\s+)?${day}\\b`, 'i');
      if (dayRegex.test(lowerText)) {
        targetDate = getNextWeekdayDate(day);
        hasExplicitDate = true;
        break;
      }
    }
  }

  const dateString = toISODateString(targetDate);

  // 4. Extract Title
  let meetingTitle = email.subject || 'Meeting from Gmail';
  meetingTitle = meetingTitle
    .replace(/^(Re|Fwd|FWD|RE):\s*/i, '')
    .replace(/\s+sync.*$/i, '')
    .replace(/\s+tomorrow.*$/i, '')
    .replace(/\s+at\s+\d+.*$/i, '')
    .trim();

  if (!meetingTitle) {
    meetingTitle = 'Sync & Discussion';
  }

  // Capitalize nicely
  if (!meetingTitle.toLowerCase().includes('meeting') && !meetingTitle.toLowerCase().includes('review') && !meetingTitle.toLowerCase().includes('sync')) {
    meetingTitle = `${meetingTitle} Meeting`;
  }

  // 5. Extract Attendees
  const senderEmailMatch = (email.from || '').match(/<([^>]+)>/);
  const senderEmail = senderEmailMatch ? senderEmailMatch[1] : (email.from || 'colleague@work.com');
  const attendees = [senderEmail, email.to || 'me@dailyecho.ai'].filter(Boolean);

  // 6. Extract / Generate Location
  let location = 'Google Meet (meet.google.com/sync-room)';
  if (lowerText.includes('zoom.us')) {
    location = 'Zoom Video Conference';
  } else if (lowerText.includes('conference room') || lowerText.includes('room ')) {
    const roomMatch = text.match(/\b(Room\s+[A-Za-z0-9\-]+|Conference\s+Room\s+[A-Za-z0-9\-]+)\b/i);
    location = roomMatch ? roomMatch[0] : 'Office Conference Room';
  }

  const timeDisplay = formatTimeRange(startHour, endHour);

  return {
    hasMeeting: hasMeetingKeyword,
    hasTiming: hasExplicitTime || hasExplicitDate,
    details: {
      title: meetingTitle,
      date: dateString,
      startHour,
      endHour,
      timeDisplay,
      location,
      attendees,
      sourceEmailId: email.id,
      sourceSender: email.from,
      color: '#0d9488', // Teal accent for DailyEcho synced meetings
      isAiGenerated: true
    }
  };
}

/**
 * Checks if a meeting is already scheduled in calendarEvents
 */
export function isMeetingAlreadyScheduled(meetingDetails, calendarEvents) {
  if (!meetingDetails || !calendarEvents) return false;

  return calendarEvents.some(evt => {
    // Match by date and similar start time
    const sameDate = evt.date === meetingDetails.date;
    const sameHour = Math.abs(evt.startHour - meetingDetails.startHour) < 0.5;
    const similarTitle = evt.title && meetingDetails.title && (
      evt.title.toLowerCase().includes(meetingDetails.title.toLowerCase()) ||
      meetingDetails.title.toLowerCase().includes(evt.title.toLowerCase())
    );

    return sameDate && (sameHour || similarTitle);
  });
}

