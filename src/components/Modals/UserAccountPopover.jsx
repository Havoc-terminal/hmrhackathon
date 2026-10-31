import React from 'react';
import { 
  X, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  UserPlus, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function UserAccountPopover() {
  const { 
    isUserAccountOpen, 
    setIsUserAccountOpen,
    currentUser,
    logoutUser,
    setIsSettingsModalOpen,
    setIsLoginModalOpen
  } = useKaarya();

  if (!isUserAccountOpen) return null;

  return (
    <div className="user-popover-backdrop" onClick={() => setIsUserAccountOpen(false)}>
      <div className="user-popover-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="user-popover-header">
          <span className="text-[11px] text-gray-500 font-medium">Google Account</span>
          <button 
            type="button" 
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400"
            onClick={() => setIsUserAccountOpen(false)}
          >
            <X size={14} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="user-popover-info">
          <div className="relative">
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"} 
              alt="Avatar" 
              className="user-popover-avatar"
            />
            <div className="avatar-camera-badge">
              <Sparkles size={10} className="text-white" />
            </div>
          </div>
          <h3 className="user-popover-name">{currentUser?.name || 'Mayank'}</h3>
          <p className="user-popover-email">{currentUser?.email || 'mayank.workspace@gmail.com'}</p>
          <span className="badge badge-success text-[10px] mt-1">DailyEcho AI Synced</span>

          <button 
            type="button" 
            className="btn btn-secondary btn-pill text-xs mt-3 w-full"
            onClick={() => {
              setIsUserAccountOpen(false);
              setIsSettingsModalOpen(true);
            }}
          >
            Manage your Google Account
          </button>
        </div>

        {/* Menu list */}
        <div className="user-popover-menu">
          <button 
            type="button" 
            className="user-popover-menu-item"
            onClick={() => {
              setIsUserAccountOpen(false);
              setIsLoginModalOpen(true);
            }}
          >
            <UserPlus size={16} />
            <span>Add another account</span>
          </button>

          <button 
            type="button" 
            className="user-popover-menu-item"
            onClick={() => {
              setIsUserAccountOpen(false);
              setIsSettingsModalOpen(true);
            }}
          >
            <Settings size={16} />
            <span>Workspace Settings</span>
          </button>

          <div className="popover-divider"></div>

          <button 
            type="button" 
            className="user-popover-menu-item text-red-600 dark:text-red-400"
            onClick={() => {
              setIsUserAccountOpen(false);
              logoutUser();
            }}
          >
            <LogOut size={16} />
            <span>Sign out of all accounts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
