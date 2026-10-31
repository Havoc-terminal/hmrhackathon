import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Check 
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function TasksBoard() {
  const { 
    tasks, 
    taskFilter, 
    setTaskFilter, 
    taskSearchQuery, 
    setTaskSearchQuery, 
    setIsAddTaskModalOpen,
    updateTaskStatus,
    deleteTask,
    t
  } = useKaarya();

  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Count items per category tab
  const todoCount = tasks.filter((t) => t.status === 'To-do').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const overdueCount = tasks.filter((t) => t.status === 'Overdue').length;

  const tabs = [
    { key: 'To-do', label: t.tabTodo, count: todoCount },
    { key: 'In progress', label: t.tabInProgress, count: inProgressCount },
    { key: 'Completed', label: t.tabCompleted, count: completedCount },
    { key: 'Overdue', label: t.tabOverdue, count: overdueCount },
    { key: 'All', label: t.tabAll, count: tasks.length }
  ];

  // Filter tasks based on selected tab and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = taskFilter === 'All' || task.status === taskFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(taskSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCardStyle = (category) => {
    switch (category) {
      case 'Work':
        return {
          cardBg: 'var(--pastel-peach-bg)',
          border: 'var(--pastel-peach-border)',
          tagBg: '#ffedd5',
          tagColor: '#c2410c'
        };
      case 'Personal':
        return {
          cardBg: 'var(--pastel-blue-bg)',
          border: 'var(--pastel-blue-border)',
          tagBg: '#dbeafe',
          tagColor: '#1d4ed8'
        };
      case 'Health':
        return {
          cardBg: 'var(--pastel-purple-bg)',
          border: 'var(--pastel-purple-border)',
          tagBg: '#ede9fe',
          tagColor: '#6d28d9'
        };
      case 'Finance':
        return {
          cardBg: 'var(--pastel-green-bg)',
          border: 'var(--pastel-green-border)',
          tagBg: '#dcfce7',
          tagColor: '#15803d'
        };
      default:
        return {
          cardBg: 'var(--bg-card)',
          border: 'var(--border-card)',
          tagBg: '#f3f4f6',
          tagColor: '#374151'
        };
    }
  };

  const handleDropdownAction = (taskId, newStatus) => {
    if (newStatus === 'delete') {
      deleteTask(taskId);
    } else {
      updateTaskStatus(taskId, newStatus);
    }
    setActiveDropdownId(null);
  };

  return (
    <div className="tasks-board-view" onClick={() => setActiveDropdownId(null)}>
      {/* Top Header Row */}
      <div className="board-top-row">
        <div>
          <h1 className="board-main-title">{t.boardTitle}</h1>
          <p className="board-sub-title">{t.boardSubtitle}</p>
        </div>

        <div className="board-top-actions">
          {/* Search Bar */}
          <div className="board-search-wrap">
            <Search size={15} className="board-search-icon" />
            <input
              type="text"
              placeholder={t.searchTasksPlaceholder}
              value={taskSearchQuery}
              onChange={(e) => setTaskSearchQuery(e.target.value)}
              className="board-search-input"
            />
          </div>

          {/* Add Task Button */}
          <button
            type="button"
            className="btn btn-primary add-task-hero-btn"
            onClick={() => setIsAddTaskModalOpen(true)}
          >
            <Plus size={16} />
            <span>{t.btnAddNewTask}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="board-tabs-row">
        <div className="board-tabs-list">
          {tabs.map((tab) => {
            const isActive = taskFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`board-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setTaskFilter(tab.key)}
              >
                <span>{tab.label}</span>
                <span className={`tab-counter ${isActive ? 'active-counter' : ''}`}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="task-cards-grid">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks-placeholder">
            <Clock size={36} className="text-gray-400" />
            <h3>No tasks found in this view</h3>
            <p>Try searching for a different keyword or create a new task with the AI agent.</p>
            <button 
              className="btn btn-primary btn-pill mt-4"
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              <Plus size={14} /> {t.btnAddNewTask}
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const style = getCardStyle(task.category);
            const isMenuOpen = activeDropdownId === task.id;

            return (
              <div
                key={task.id}
                className="task-dribbble-card"
                style={{
                  backgroundColor: style.cardBg,
                  borderColor: style.border
                }}
              >
                {/* Top Card Row */}
                <div className="card-top-header">
                  <div className="flex items-center gap-2">
                    <span
                      className="category-badge-pill"
                      style={{
                        backgroundColor: style.tagBg,
                        color: style.tagColor
                      }}
                    >
                      {task.category}
                    </span>

                    {task.aiGenerated && (
                      <span className="ai-gen-pill">
                        <Sparkles size={10} /> AI Agent
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      className="card-more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(isMenuOpen ? null : task.id);
                      }}
                      aria-label="Task options"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {isMenuOpen && (
                      <div 
                        className="dribbble-dropdown-menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="dropdown-label">{t.moveStatus}</div>
                        <button 
                          className={`dropdown-item ${task.status === 'To-do' ? 'selected' : ''}`}
                          onClick={() => handleDropdownAction(task.id, 'To-do')}
                        >
                          {task.status === 'To-do' && <Check size={12} />} {t.tabTodo}
                        </button>
                        <button 
                          className={`dropdown-item ${task.status === 'In progress' ? 'selected' : ''}`}
                          onClick={() => handleDropdownAction(task.id, 'In progress')}
                        >
                          {task.status === 'In progress' && <Check size={12} />} {t.tabInProgress}
                        </button>
                        <button 
                          className={`dropdown-item ${task.status === 'Completed' ? 'selected' : ''}`}
                          onClick={() => handleDropdownAction(task.id, 'Completed')}
                        >
                          {task.status === 'Completed' && <Check size={12} />} {t.tabCompleted}
                        </button>
                        <button 
                          className={`dropdown-item ${task.status === 'Overdue' ? 'selected' : ''}`}
                          onClick={() => handleDropdownAction(task.id, 'Overdue')}
                        >
                          {task.status === 'Overdue' && <Check size={12} />} {t.tabOverdue}
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item text-red-600"
                          onClick={() => handleDropdownAction(task.id, 'delete')}
                        >
                          {t.deleteTask}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Title & Warning */}
                <div className="card-title-row">
                  <h3 className="task-title-text">{task.title}</h3>
                  {task.hasWarning && (
                    <span className="warning-diamond" title="Upcoming deadline">
                      ◆
                    </span>
                  )}
                </div>

                {/* Card Description */}
                <p className="task-desc-text">{task.description}</p>

                {/* Bottom Row */}
                <div className="card-footer-row">
                  <div className="date-badge-wrap">
                    <CalendarIcon size={13} className="text-gray-500" />
                    <span className="date-text">{task.dueDate}</span>
                  </div>

                  <span className={`priority-indicator-pill priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
