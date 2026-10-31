import React from 'react';
import { KaaryaProvider, useKaarya } from './context/KaaryaContext';
import LandingPage from './components/LandingPage/LandingPage';
import Sidebar from './components/Dashboard/Sidebar';
import Header from './components/Dashboard/Header';
import TasksBoard from './components/Dashboard/TasksBoard';
import AiStudio from './components/Dashboard/AiStudio';
import AiAssistantChat from './components/Dashboard/AiAssistantChat';
import CalendarView from './components/Dashboard/CalendarView';
import SmartContactsView from './components/Dashboard/SmartContactsView';
import GmailView from './components/Dashboard/GmailView';
import HistoryView from './components/Dashboard/HistoryView';
import DiaryView from './components/Dashboard/DiaryView';
import AddTaskModal from './components/Modals/AddTaskModal';
import GenerateTemplateModal from './components/Modals/GenerateTemplateModal';
import HitlApprovalModal from './components/Modals/HitlApprovalModal';
import LoginModal from './components/Modals/LoginModal';
import SettingsModal from './components/Modals/SettingsModal';
import HelpModal from './components/Modals/HelpModal';
import SearchModal from './components/Modals/SearchModal';
import AppsGridDropdown from './components/Modals/AppsGridDropdown';
import UserAccountPopover from './components/Modals/UserAccountPopover';
import NotificationsDropdown from './components/Modals/NotificationsDropdown';
import AddEventModal from './components/Modals/AddEventModal';
import './App.css';

function MainAppContent() {
  const { currentView } = useKaarya();

  if (currentView === 'landing') {
    return (
      <div className="app-viewport">
        <LandingPage />
        <AddTaskModal />
        <GenerateTemplateModal />
        <HitlApprovalModal />
        <LoginModal />
      </div>
    );
  }

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar matching Dribbble style */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        <Header />

        <main className="dashboard-page-container">
          {currentView === 'dashboard' && <AiStudio />}
          {currentView === 'tasks' && <TasksBoard />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'contacts' && <SmartContactsView />}
          {currentView === 'inbox' && <GmailView />}
          {currentView === 'chat' && <AiAssistantChat />}
          {currentView === 'diary' && <DiaryView />}
          {currentView === 'history' && <HistoryView />}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <AddTaskModal />
      <GenerateTemplateModal />
      <HitlApprovalModal />
      <LoginModal />
      <SettingsModal />
      <HelpModal />
      <SearchModal />
      <AppsGridDropdown />
      <UserAccountPopover />
      <NotificationsDropdown />
      <AddEventModal />
    </div>
  );
}

export default function App() {
  return (
    <KaaryaProvider>
      <MainAppContent />
    </KaaryaProvider>
  );
}
