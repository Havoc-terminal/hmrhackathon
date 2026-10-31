import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Check, 
  Globe, 
  Sun, 
  Moon, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function Header() {
  const { 
    currentView, 
    setCurrentView, 
    startAgentExecution,
    language,
    setLanguage,
    t,
    LANGUAGES,
    theme,
    toggleTheme,
    setIsNotificationsOpen,
    setIsSearchModalOpen
  } = useKaarya();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return t.sidebarAiStudio;
      case 'tasks':
        return t.boardTitle;
      case 'calendar':
        return t.sidebarCalendar;
      case 'inbox':
        return t.sidebarInbox;
      case 'chat':
        return t.sidebarAssistant;
      case 'history':
        return t.sidebarHistory;
      default:
        return 'Workspace Overview';
    }
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="dashboard-top-navbar" onClick={() => setIsLangMenuOpen(false)}>
      <div className="flex items-center gap-4">
        <div>
          <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase">DailyEcho AGENT ENGINE</span>
          <h2 className="top-nav-heading">{getViewTitle()}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connected Google Apps Badges */}
        <div className="connected-apps-strip">
          <div className="app-status-chip" title="Gmail API Connected">
            <span className="status-dot-active"></span>
            <span>Gmail</span>
          </div>
          <div className="app-status-chip" title="Google Calendar Connected">
            <span className="status-dot-active"></span>
            <span>Calendar</span>
          </div>
          <div className="app-status-chip" title="Google Tasks Connected">
            <span className="status-dot-active"></span>
            <span>Tasks</span>
          </div>
        </div>

        {/* Language Selector Dropdown in Dashboard Header */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn-secondary btn-pill lang-selector-btn text-xs"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            title="Change Language / भाषा बदलें"
          >
            <Globe size={13} className="text-teal-600" />
            <span>{currentLangObj.flag} {currentLangObj.native}</span>
          </button>

          {isLangMenuOpen && (
            <div className="lang-dropdown-menu">
              <div className="lang-dropdown-header">Select Language:</div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-option-item ${language === lang.code ? 'selected' : ''}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangMenuOpen(false);
                  }}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name-bold">{lang.native}</span>
                  <span className="lang-code-tag">({lang.name})</span>
                  {language === lang.code && <Check size={14} className="ml-auto text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark / Light Mode Switch */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={t.toggleThemeTooltip}
          aria-label="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
        </button>

        {/* Quick Launch Hero Prompt */}
        <button
          type="button"
          className="btn btn-secondary btn-pill text-xs flex items-center gap-1.5"
          onClick={() => {
            setCurrentView('dashboard');
            startAgentExecution(t.heroDefaultPrompt);
          }}
        >
          <Sparkles size={13} className="text-teal-600" />
          <span>{t.btnStartAutomating}</span>
        </button>

        {/* Notification Bell */}
        <button 
          type="button" 
          className="icon-circle-btn relative" 
          title="Notifications"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <Bell size={16} />
          <span className="notif-badge-dot"></span>
        </button>
      </div>
    </header>
  );
}
