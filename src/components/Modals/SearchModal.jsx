import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Calendar, 
  Mail, 
  CheckSquare, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function SearchModal() {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen,
    calendarEvents,
    emails,
    tasks,
    setCurrentView
  } = useKaarya();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const evts = calendarEvents
      .filter(e => e.title.toLowerCase().includes(q) || (e.location && e.location.toLowerCase().includes(q)))
      .map(e => ({
        id: e.id,
        type: 'calendar',
        title: e.title,
        subtitle: `${e.timeDisplay || 'All Day'} • ${e.location || 'Google Calendar'}`,
        color: e.color || '#039be5'
      }));

    const mails = emails
      .filter(m => m.subject.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q) || m.snippet.toLowerCase().includes(q))
      .map(m => ({
        id: m.id,
        type: 'email',
        title: m.subject,
        subtitle: `From ${m.sender} • ${m.date}`,
        color: '#ea4335'
      }));

    const tsks = tasks
      .filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)))
      .map(t => ({
        id: t.id,
        type: 'task',
        title: t.title,
        subtitle: `Category: ${t.category} • Status: ${t.status}`,
        color: '#0d9488'
      }));

    return [...evts, ...mails, ...tsks];
  }, [query, calendarEvents, emails, tasks]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={() => setIsSearchModalOpen(false)}>
      <div className="modal-card-custom search-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-modal-header">
          <Search size={20} className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search events, emails, tasks, or colleagues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-modal-input"
            autoFocus
          />
          {query && (
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
              onClick={() => setQuery('')}
            >
              <X size={16} />
            </button>
          )}
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={() => setIsSearchModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="search-modal-body">
          {!query.trim() ? (
            <div className="search-empty-hint">
              <Sparkles size={24} className="text-teal-500 mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Universal Search</p>
              <p className="text-xs text-gray-500 mt-1">
                Type "Standup", "Strategy", "Sarah", or "Review" to search across Google Calendar, Gmail, and Google Tasks.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="search-no-results">
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="search-results-list">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Matching items ({filteredResults.length})
              </div>
              {filteredResults.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="search-result-row"
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    if (item.type === 'calendar') setCurrentView('calendar');
                    if (item.type === 'email') setCurrentView('inbox');
                    if (item.type === 'task') setCurrentView('tasks');
                  }}
                >
                  <div 
                    className="search-icon-badge"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.type === 'calendar' && <Calendar size={16} />}
                    {item.type === 'email' && <Mail size={16} />}
                    {item.type === 'task' && <CheckSquare size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{item.subtitle}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
