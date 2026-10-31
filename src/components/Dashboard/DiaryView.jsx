import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar as CalIcon, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Trash2, 
  Sparkles, 
  Search, 
  Clock, 
  Tag, 
  Smile, 
  FileText, 
  Copy, 
  Check, 
  Flame, 
  BookMarked,
  ArrowRight
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import { toISODateString, addDays, formatFullDate, parseISODate } from '../../services/calendarUtils';

const MOOD_OPTIONS = [
  { id: 'productive', label: 'Productive', emoji: '⚡', color: '#0d9488' },
  { id: 'inspired', label: 'Inspired', emoji: '🌟', color: '#f59e0b' },
  { id: 'focused', label: 'Focused', emoji: '🎯', color: '#2563eb' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#10b981' },
  { id: 'creative', label: 'Creative', emoji: '💡', color: '#8b5cf6' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#ec4899' }
];

const PRESET_TAGS = ['Work', 'Personal', 'Sprint', 'Reflection', 'Gratitude', 'Learnings', 'Ideas'];

const PROMPTS = [
  'What went well today and what made me proud?',
  'What was the biggest challenge, and how did I handle it?',
  'What are 3 things I am genuinely grateful for today?',
  'Key insight or lesson learned today:'
];

export default function DiaryView() {
  const { diaryEntries, saveDiaryEntry, deleteDiaryEntry, currentUser, t } = useKaarya();

  // Active viewing/editing date (YYYY-MM-DD)
  const todayStr = useMemo(() => toISODateString(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(() => todayStr);

  // Editor form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('productive');
  const [selectedTags, setSelectedTags] = useState(['Work']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Look for an existing entry for selectedDate
  const currentEntry = useMemo(() => {
    return diaryEntries.find(e => e.date === selectedDate);
  }, [diaryEntries, selectedDate]);

  // Load entry data when selectedDate changes or diaryEntries update
  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title || '');
      setContent(currentEntry.content || '');
      setMood(currentEntry.mood || 'productive');
      setSelectedTags(currentEntry.tags || ['Work']);
    } else {
      setTitle('');
      setContent('');
      setMood('productive');
      setSelectedTags(['Work']);
    }
    setIsSavedFeedback(false);
  }, [selectedDate, currentEntry]);

  // Date Navigation handlers
  const handlePrevDay = () => {
    const d = parseISODate(selectedDate);
    setSelectedDate(toISODateString(addDays(d, -1)));
  };

  const handleNextDay = () => {
    const d = parseISODate(selectedDate);
    setSelectedDate(toISODateString(addDays(d, 1)));
  };

  const handleJumpToToday = () => {
    setSelectedDate(todayStr);
  };

  // Tag toggle
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const cleanTag = customTagInput.trim().replace(/^#/, '');
      if (!selectedTags.includes(cleanTag)) {
        setSelectedTags(prev => [...prev, cleanTag]);
      }
      setCustomTagInput('');
    }
  };

  // Append inspiration prompt into content
  const handleInsertPrompt = (promptText) => {
    setContent(prev => {
      const spacer = prev.trim() ? '\n\n' : '';
      return `${prev}${spacer}• ${promptText}\n`;
    });
  };

  // Save entry
  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    saveDiaryEntry({
      date: selectedDate,
      title: title.trim() || 'Untitled Reflection',
      content,
      mood,
      tags: selectedTags
    });

    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Delete current entry
  const handleDeleteCurrent = () => {
    if (window.confirm(`Delete diary entry for ${formatFullDate(selectedDate)}?`)) {
      deleteDiaryEntry(selectedDate);
      setTitle('');
      setContent('');
    }
  };

  // Copy entry to clipboard
  const handleCopy = () => {
    const textToCopy = `${formatFullDate(selectedDate)}\n${title}\nMood: ${mood}\nTags: ${selectedTags.join(', ')}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  // Filtered diary entries for the browser
  const filteredEntries = useMemo(() => {
    return diaryEntries.filter(entry => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title && entry.title.toLowerCase().includes(q);
      const matchContent = entry.content && entry.content.toLowerCase().includes(q);
      const matchTags = entry.tags && entry.tags.some(t => t.toLowerCase().includes(q));
      const matchDate = entry.date && entry.date.includes(q);
      return matchTitle || matchContent || matchTags || matchDate;
    });
  }, [diaryEntries, searchQuery]);

  // Statistics
  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const totalWords = useMemo(() => {
    return diaryEntries.reduce((acc, curr) => {
      const words = curr.content ? curr.content.trim().split(/\s+/).length : 0;
      return acc + words;
    }, 0);
  }, [diaryEntries]);

  const isToday = selectedDate === todayStr;

  return (
    <div className="diary-workspace-container">
      {/* 1. TOP HEADER & DATE CONTROLS */}
      <header className="diary-header-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {currentUser?.name ? `${currentUser.name}'s Diary` : 'Personal & Work Diary'}
                </h1>
                <span className="badge badge-personal text-xs flex items-center gap-1">
                  <Flame size={12} className="text-amber-500" />
                  {diaryEntries.length} {diaryEntries.length === 1 ? 'entry' : 'entries'} saved
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Capture daily thoughts, learnings, gratitude, and reflections on any date.
              </p>
            </div>
          </div>

          {/* Date Navigator Bar */}
          <div className="diary-date-nav-bar">
            <button
              type="button"
              className="diary-nav-btn"
              onClick={handlePrevDay}
              title="Previous Day"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Jump to Today Button */}
            <button
              type="button"
              className={`diary-today-btn ${isToday ? 'active' : ''}`}
              onClick={handleJumpToToday}
            >
              Today
            </button>

            {/* Direct Date Picker */}
            <div className="diary-date-input-wrap">
              <CalIcon size={14} className="text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="diary-date-picker-input"
              />
            </div>

            <button
              type="button"
              className="diary-nav-btn"
              onClick={handleNextDay}
              title="Next Day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT LAYOUT (Writing Desk + Past Entries Sidebar) */}
      <div className="diary-main-body">
        {/* Left Column: The Writing Canvas */}
        <section className="diary-editor-card">
          <form onSubmit={handleSave} className="flex flex-col h-full">
            {/* Date Banner */}
            <div className="diary-editor-header">
              <div className="flex items-center gap-2">
                <span className="diary-full-date-label">
                  {formatFullDate(selectedDate)}
                </span>
                {isToday && (
                  <span className="diary-today-badge">Today</span>
                )}
                {currentEntry && (
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
                    Saved Entry
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {currentEntry && (
                  <>
                    <button
                      type="button"
                      className="diary-icon-btn"
                      onClick={handleCopy}
                      title="Copy entry text"
                    >
                      {copiedFeedback ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                    <button
                      type="button"
                      className="diary-icon-btn text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      onClick={handleDeleteCurrent}
                      title="Delete this date's entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-pill text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Save size={13} />
                  <span>{isSavedFeedback ? 'Saved!' : 'Save Entry'}</span>
                </button>
              </div>
            </div>

            {/* Entry Title Input */}
            <div className="diary-title-row">
              <input
                type="text"
                placeholder="Give today's entry a title (e.g. Milestone Achieved, Focus Blocks...)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="diary-title-input"
              />
            </div>

            {/* Mood Selector Row */}
            <div className="diary-mood-row">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium flex-shrink-0">
                <Smile size={14} />
                <span>Today's Mood:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`diary-mood-btn ${mood === m.id ? 'active' : ''}`}
                    onClick={() => setMood(m.id)}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Row */}
            <div className="diary-tags-row">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium flex-shrink-0">
                <Tag size={13} />
                <span>Tags:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`diary-tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
                {/* Additional selected custom tags */}
                {selectedTags.filter(t => !PRESET_TAGS.includes(t)).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="diary-tag-pill active"
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag} ✕
                  </button>
                ))}
                {/* Add custom tag input */}
                <input
                  type="text"
                  placeholder="+ add tag (Enter)"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  className="diary-custom-tag-input"
                />
              </div>
            </div>

            {/* Inspiration Prompt Quick Pills */}
            <div className="diary-prompts-bar">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Sparkles size={11} className="text-teal-500" />
                <span>Writing prompts:</span>
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="diary-prompt-chip"
                    onClick={() => handleInsertPrompt(p)}
                    title="Click to insert this prompt"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Text Area Content Editor */}
            <div className="diary-textarea-wrap">
              <textarea
                placeholder="Write your diary entry for this date... Thoughts, wins, notes, challenges, gratitudes, or key moments."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="diary-textarea"
                rows={12}
              />
            </div>

            {/* Editor Footer Status */}
            <div className="diary-editor-footer">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{content.length} characters</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {isSavedFeedback && (
                  <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 animate-pulse">
                    <Check size={13} /> Saved to DailyEcho Diary
                  </span>
                )}
                <span className="text-gray-400">
                  {currentEntry?.updatedAt 
                    ? `Last saved: ${new Date(currentEntry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                    : 'Auto-persists in your workspace'}
                </span>
              </div>
            </div>
          </form>
        </section>

        {/* Right Column: Past Entries Sidebar & Quick Search */}
        <aside className="diary-history-sidebar">
          {/* Quick Search */}
          <div className="diary-search-box">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search saved diary entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="diary-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-600 text-xs"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="diary-stats-card">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <BookMarked size={14} className="text-teal-500" />
                <span>Diary Journal</span>
              </span>
              <span className="text-teal-600 dark:text-teal-400">
                {totalWords} total words
              </span>
            </div>
          </div>

          {/* Entries Timeline List */}
          <div className="diary-entries-list">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
              All Saved Dates ({filteredEntries.length})
            </div>

            {filteredEntries.length === 0 ? (
              <div className="diary-empty-state">
                <FileText size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No diary entries found.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-pill text-xs mt-3"
                  onClick={handleJumpToToday}
                >
                  Write for Today
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = entry.date === selectedDate;
                const moodObj = MOOD_OPTIONS.find(m => m.id === entry.mood);

                return (
                  <div
                    key={entry.id || entry.date}
                    className={`diary-entry-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(entry.date)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="diary-card-date">
                        {entry.date === todayStr ? 'Today' : formatFullDate(entry.date)}
                      </span>
                      {moodObj && (
                        <span className="diary-card-mood" title={moodObj.label}>
                          {moodObj.emoji}
                        </span>
                      )}
                    </div>

                    <h4 className="diary-card-title">
                      {entry.title || 'Untitled Entry'}
                    </h4>

                    {entry.content && (
                      <p className="diary-card-snippet">
                        {entry.content}
                      </p>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="diary-card-tags">
                        {entry.tags.slice(0, 3).map((t, i) => (
                          <span key={i} className="diary-card-tag-chip">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

