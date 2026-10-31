import React from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Mail, 
  CheckSquare 
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function NotificationsDropdown() {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen,
    notifications,
    markAllNotificationsRead,
    clearNotifications,
    setCurrentView
  } = useKaarya();

  if (!isNotificationsOpen) return null;

  return (
    <div className="notif-dropdown-backdrop" onClick={() => setIsNotificationsOpen(false)}>
      <div className="notif-dropdown-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notif-header">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-teal-600" />
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">Notifications</h3>
            {notifications.some(n => !n.read) && (
              <span className="badge badge-error text-[10px] py-0 px-1.5">
                {notifications.filter(n => !n.read).length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline px-1"
              onClick={markAllNotificationsRead}
            >
              Mark all read
            </button>
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400"
              onClick={clearNotifications}
              title="Clear all"
            >
              <Trash2 size={13} />
            </button>
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400"
              onClick={() => setIsNotificationsOpen(false)}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              No new notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id} 
                className={`notif-item ${!item.read ? 'unread' : ''}`}
                onClick={() => {
                  if (item.type === 'calendar') setCurrentView('calendar');
                  if (item.type === 'agent') setCurrentView('dashboard');
                  if (item.type === 'email') setCurrentView('inbox');
                  if (item.type === 'task') setCurrentView('tasks');
                  setIsNotificationsOpen(false);
                }}
              >
                <div className="notif-icon-wrap">
                  {item.type === 'agent' && <Sparkles size={14} className="text-teal-500" />}
                  {item.type === 'calendar' && <Calendar size={14} className="text-blue-500" />}
                  {item.type === 'email' && <Mail size={14} className="text-red-500" />}
                  {item.type === 'task' && <CheckSquare size={14} className="text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</h4>
                    <span className="text-[10px] text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{item.desc}</p>
                </div>
                {!item.read && <div className="unread-dot" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
