import React from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  Calendar, 
  Users,
  Mail, 
  MessageSquare, 
  BookOpen,
  History, 
  Home, 
  Plus,
  LogOut,
  User
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import RotatingLogo from '../Common/RotatingLogo';

export default function Sidebar() {
  const { 
    currentView, 
    setCurrentView, 
    setIsAddTaskModalOpen, 
    tasks,
    t,
    currentUser,
    logoutUser,
    setIsLoginModalOpen
  } = useKaarya();

  const navItems = [
    { id: 'dashboard', label: t.sidebarAiStudio, icon: Sparkles, badge: 'Agent' },
    { id: 'tasks', label: t.sidebarTasks, icon: CheckSquare, count: tasks.filter(t => t.status === 'To-do').length },
    { id: 'calendar', label: t.sidebarCalendar, icon: Calendar },
    { id: 'contacts', label: t.sidebarSmartContacts || 'Smart Contacts', icon: Users, badge: 'AI' },
    { id: 'inbox', label: t.sidebarInbox, icon: Mail },
    { id: 'chat', label: t.sidebarAssistant, icon: MessageSquare },
    { id: 'diary', label: t.sidebarDiary || 'Diary', icon: BookOpen },
    { id: 'history', label: t.sidebarHistory, icon: History }
  ];

  return (
    <aside className="dribbble-sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand-block" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
        <RotatingLogo size={38} />
        <div className="brand-text-wrap">
          <span className="brand-name">{t.brandName}</span>
          <span className="brand-tagline">{t.tagline}</span>
        </div>
      </div>

      {/* Quick Add Task button in sidebar */}
      <div className="sidebar-cta-wrap">
        <button
          type="button"
          className="btn btn-primary sidebar-add-task-btn"
          onClick={() => setIsAddTaskModalOpen(true)}
        >
          <Plus size={16} />
          <span>{t.btnNewTask}</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav-menu">
        <div className="nav-group-title">{t.navWorkspace}</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar-pill-badge">{item.badge}</span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="sidebar-count-badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Profile & Back to Landing */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-landing-switch-btn"
          onClick={() => setCurrentView('landing')}
        >
          <Home size={15} />
          <span>{t.btnLandingPage}</span>
        </button>

        {currentUser ? (
          <div className="user-profile-widget">
            <div className="user-avatar-wrap">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="user-avatar-img"
              />
              <span className="user-online-dot"></span>
            </div>
            <div className="user-meta-info flex-1">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{currentUser.email || t.adminRole}</span>
            </div>
            <button
              type="button"
              className="user-logout-btn"
              onClick={logoutUser}
              title={t.navLogout}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-secondary btn-pill text-xs w-full"
            onClick={() => setIsLoginModalOpen(true)}
          >
            <User size={13} />
            <span>{t.navLogin}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
