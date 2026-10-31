import React from 'react';
import { 
  Calendar, 
  Mail, 
  CheckSquare, 
  Video, 
  FileText, 
  HardDrive, 
  Users, 
  MapPin, 
  BookOpen, 
  Sparkles,
  X
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import RotatingLogo from '../Common/RotatingLogo';

export default function AppsGridDropdown() {
  const { 
    isAppsGridOpen, 
    setIsAppsGridOpen,
    setCurrentView,
    setActiveSideDrawer
  } = useKaarya();

  if (!isAppsGridOpen) return null;

  const apps = [
    { 
      name: 'DailyEcho Agent', 
      icon: <RotatingLogo size={28} />, 
      action: () => setCurrentView('dashboard'),
      highlight: true
    },
    { 
      name: 'Calendar', 
      icon: (
        <div className="w-7 h-7 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
          17
        </div>
      ), 
      action: () => setCurrentView('calendar')
    },
    { 
      name: 'Gmail', 
      icon: (
        <div className="w-7 h-7 rounded bg-red-500 text-white flex items-center justify-center">
          <Mail size={16} />
        </div>
      ), 
      action: () => setCurrentView('inbox')
    },
    { 
      name: 'Tasks', 
      icon: (
        <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center">
          <CheckSquare size={16} />
        </div>
      ), 
      action: () => setCurrentView('tasks')
    },
    { 
      name: 'Google Keep', 
      icon: (
        <div className="w-7 h-7 rounded bg-amber-400 text-white flex items-center justify-center">
          <BookOpen size={16} />
        </div>
      ), 
      action: () => {
        setCurrentView('calendar');
        setActiveSideDrawer('keep');
      }
    },
    { 
      name: 'Google Meet', 
      icon: (
        <div className="w-7 h-7 rounded bg-emerald-500 text-white flex items-center justify-center">
          <Video size={16} />
        </div>
      ), 
      action: () => window.open('https://meet.google.com', '_blank')
    },
    { 
      name: 'Google Drive', 
      icon: (
        <div className="w-7 h-7 rounded bg-amber-500 text-white flex items-center justify-center">
          <HardDrive size={16} />
        </div>
      ), 
      action: () => window.open('https://drive.google.com', '_blank')
    },
    { 
      name: 'Contacts', 
      icon: (
        <div className="w-7 h-7 rounded bg-blue-400 text-white flex items-center justify-center">
          <Users size={16} />
        </div>
      ), 
      action: () => {
        setCurrentView('calendar');
        setActiveSideDrawer('contacts');
      }
    },
    { 
      name: 'Google Maps', 
      icon: (
        <div className="w-7 h-7 rounded bg-green-600 text-white flex items-center justify-center">
          <MapPin size={16} />
        </div>
      ), 
      action: () => {
        setCurrentView('calendar');
        setActiveSideDrawer('maps');
      }
    }
  ];

  return (
    <div className="apps-grid-backdrop" onClick={() => setIsAppsGridOpen(false)}>
      <div className="apps-grid-card" onClick={(e) => e.stopPropagation()}>
        <div className="apps-grid-header">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Google Workspace & DailyEcho</span>
          <button 
            type="button" 
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400"
            onClick={() => setIsAppsGridOpen(false)}
          >
            <X size={14} />
          </button>
        </div>

        <div className="apps-grid-list">
          {apps.map((app, idx) => (
            <button
              key={idx}
              type="button"
              className={`app-grid-item ${app.highlight ? 'app-grid-highlight' : ''}`}
              onClick={() => {
                setIsAppsGridOpen(false);
                app.action();
              }}
            >
              <div className="app-grid-icon-wrap">{app.icon}</div>
              <span className="app-grid-name">{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
