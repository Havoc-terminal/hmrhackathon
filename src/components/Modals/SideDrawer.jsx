import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  CheckSquare, 
  ExternalLink,
  Download,
  Star,
  Navigation
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function SideDrawer() {
  const { 
    activeSideDrawer, 
    setActiveSideDrawer,
    keepNotes,
    addKeepNote,
    deleteKeepNote,
    tasks,
    addNewTask,
    updateTaskStatus,
    setCurrentView
  } = useKaarya();

  // Keep state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isTakingNote, setIsTakingNote] = useState(false);

  // Quick Task state
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  if (!activeSideDrawer) return null;

  const contactsList = [
    { name: 'Sarah Jenkins', role: 'Head of Product', email: 'sarah.j@vertexcloud.io', phone: '+1 (512) 890-4421', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
    { name: 'Danny Maiorca', role: 'Tech Lead', email: 'danny@maiorca.dev', phone: '+1 (512) 431-8902', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
    { name: 'Jonas Coach', role: 'Strength & Conditioning', email: 'jonas@coachathletics.dk', phone: '+45 28 91 00 23', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop' },
    { name: 'Sebastian Bates', role: 'Venture Partner', email: 'sebastian@warrior.io', phone: '+1 (415) 672-1190', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop' }
  ];

  const marketplaceApps = [
    { name: 'Zoom for Google Calendar', desc: 'Schedule and join Zoom meetings directly from Calendar', category: 'Conferencing', rating: 4.8, installs: '50M+' },
    { name: 'Slack for Workspace', desc: 'Sync channel announcements and status with DailyEcho calendar', category: 'Team Chat', rating: 4.7, installs: '10M+' },
    { name: 'Asana Project Sync', desc: 'Convert calendar action items into assigned project tasks', category: 'Workflow', rating: 4.9, installs: '20M+' },
    { name: 'DocuSign eSignature', desc: 'Sign agreements directly from Calendar invites and tasks', category: 'Productivity', rating: 4.6, installs: '15M+' }
  ];

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;
    addKeepNote({
      title: newNoteTitle,
      content: newNoteContent,
      color: '#fff9c4'
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsTakingNote(false);
  };

  const handleAddQuickTask = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    addNewTask({
      title: quickTaskTitle,
      category: 'Work',
      priority: 'Medium',
      dueDate: `${y}-${m}-${d}`
    });
    setQuickTaskTitle('');
  };

  return (
    <div className="side-drawer-container">
      {/* Drawer Header */}
      <div className="side-drawer-header">
        <div className="flex items-center gap-2">
          {activeSideDrawer === 'keep' && (
            <>
              <div className="w-5 h-5 rounded bg-amber-400 text-white flex items-center justify-center font-bold text-xs">
                K
              </div>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-100">Google Keep</span>
            </>
          )}
          {activeSideDrawer === 'tasks' && (
            <>
              <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                <CheckSquare size={12} />
              </div>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-100">Google Tasks</span>
            </>
          )}
          {activeSideDrawer === 'contacts' && (
            <>
              <div className="w-5 h-5 rounded bg-blue-400 text-white flex items-center justify-center font-bold text-xs">
                <Users size={12} />
              </div>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-100">Google Contacts</span>
            </>
          )}
          {activeSideDrawer === 'maps' && (
            <>
              <div className="w-5 h-5 rounded bg-green-600 text-white flex items-center justify-center font-bold text-xs">
                <MapPin size={12} />
              </div>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-100">Google Maps • Meeting Venues</span>
            </>
          )}
          {activeSideDrawer === 'addons' && (
            <>
              <div className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                +
              </div>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-100">Google Workspace Marketplace</span>
            </>
          )}
        </div>

        <button 
          type="button" 
          className="modal-close-btn"
          onClick={() => setActiveSideDrawer(null)}
          title="Close side panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="side-drawer-body">
        {/* 1. GOOGLE KEEP DRAWER */}
        {activeSideDrawer === 'keep' && (
          <div className="keep-drawer-content">
            {!isTakingNote ? (
              <div 
                className="take-note-trigger"
                onClick={() => setIsTakingNote(true)}
              >
                <span>Take a note...</span>
                <Plus size={16} className="text-gray-400" />
              </div>
            ) : (
              <form onSubmit={handleSaveNote} className="take-note-form">
                <input
                  type="text"
                  placeholder="Title"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="note-title-input"
                  autoFocus
                />
                <textarea
                  placeholder="Take a note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  className="note-content-input"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    type="button" 
                    className="btn btn-secondary text-xs"
                    onClick={() => setIsTakingNote(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary text-xs">
                    Done
                  </button>
                </div>
              </form>
            )}

            <div className="keep-notes-list">
              {keepNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="keep-note-card"
                  style={{ backgroundColor: note.color }}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-xs text-gray-900">{note.title}</h4>
                    <button 
                      type="button"
                      className="text-gray-400 hover:text-red-500 p-1"
                      onClick={() => deleteKeepNote(note.id)}
                      title="Delete note"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. GOOGLE TASKS DRAWER */}
        {activeSideDrawer === 'tasks' && (
          <div className="tasks-drawer-content">
            <form onSubmit={handleAddQuickTask} className="quick-task-form">
              <input
                type="text"
                placeholder="+ Add a task"
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="quick-task-input"
              />
            </form>

            <div className="drawer-tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="drawer-task-row">
                  <button
                    type="button"
                    className={`task-checkbox-circle ${task.status === 'Completed' ? 'checked' : ''}`}
                    onClick={() => updateTaskStatus(task.id, task.status === 'Completed' ? 'To-do' : 'Completed')}
                  >
                    {task.status === 'Completed' && <Check size={10} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                      {task.title}
                    </span>
                    <div className="text-[10px] text-gray-400">{task.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              className="btn btn-secondary text-xs w-full mt-4 flex items-center justify-center gap-1"
              onClick={() => {
                setActiveSideDrawer(null);
                setCurrentView('tasks');
              }}
            >
              <span>Open Full TaskFlow Board</span>
              <ExternalLink size={12} />
            </button>
          </div>
        )}

        {/* 3. GOOGLE CONTACTS DRAWER */}
        {activeSideDrawer === 'contacts' && (
          <div className="contacts-drawer-content">
            <div className="space-y-3">
              {contactsList.map((contact, i) => (
                <div key={i} className="contact-card">
                  <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-100">{contact.name}</h4>
                    <p className="text-[11px] text-gray-400">{contact.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="text-[11px] text-teal-600 hover:underline flex items-center gap-1"
                      >
                        <Mail size={10} />
                        <span className="truncate">{contact.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GOOGLE MAPS DRAWER */}
        {activeSideDrawer === 'maps' && (
          <div className="maps-drawer-content">
            <div className="maps-preview-card">
              <div className="maps-image-header">
                <Navigation size={24} className="text-white" />
                <span className="text-sm font-bold text-white">Austin, TX</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 font-semibold text-xs text-gray-800 dark:text-gray-200">
                  <MapPin size={14} className="text-red-500" />
                  <span>Downtown Executive Meeting Venue</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">500 E Cesar Chavez St, Austin, TX 78701</p>
                
                <div className="mt-3 border-t border-gray-100 dark:border-gray-800 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">From hotel:</span>
                    <span className="font-semibold text-emerald-600">8 min walk (0.4 mi)</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary text-xs w-full mt-3 flex items-center justify-center gap-1"
                  onClick={() => window.open('https://maps.google.com?q=Austin+Convention+Center', '_blank')}
                >
                  <Navigation size={12} />
                  <span>Directions in Google Maps</span>
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Upcoming Meeting Venue</h5>
              <p className="text-[11px] text-gray-500 mt-1">
                Breakfast @ Fuglevangsvej 11, Frederiksberg
              </p>
            </div>
          </div>
        )}

        {/* 5. ADD-ONS MARKETPLACE DRAWER */}
        {activeSideDrawer === 'addons' && (
          <div className="addons-drawer-content">
            <p className="text-xs text-gray-500 mb-3">Install productivity add-ons for Google Calendar & DailyEcho</p>
            <div className="space-y-2.5">
              {marketplaceApps.map((addon, i) => (
                <div key={i} className="addon-market-item">
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-100">{addon.name}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{addon.desc}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span className="flex items-center text-amber-500"><Star size={10} fill="currentColor" /> {addon.rating}</span>
                      <span>•</span>
                      <span>{addon.installs} installs</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary text-xs px-2.5 py-1"
                    onClick={(e) => {
                      e.target.innerText = 'Installed';
                      e.target.style.color = '#059669';
                    }}
                  >
                    Install
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
