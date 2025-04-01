import React, { useState, useEffect } from 'react';
import TaskFilterBar from './components/TaskFilterBar.jsx';
import TaskTable from './components/TaskTable.jsx';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('all');
  const [currentView, setCurrentView] = useState('tasks');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handlePageClick = (e) => {
    if (sidebarVisible && !e.target.closest('.sidebar') && !e.target.closest('.hamburger-icon')) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handlePageClick);
    return () => document.removeEventListener('click', handlePageClick);
  }, [sidebarVisible]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
      createdAt: new Date().toLocaleString(),
      completedAt: '',
      isEditing: false,
      updatedAt: ''
    };
    setTasks([newTask, ...tasks]);
  };

  const editTask = (id, newText, type = 'name') => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, [type]: newText, updatedAt: new Date().toLocaleString() } : task
    ));
  };

  const toggleEditMode = (id, isEditing = true) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing } : task
    ));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toLocaleString() : ''
          }
        : task
    ));
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirmation(true);
    setTaskToDelete(id);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    cancelDelete();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percentageComplete = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;

  const renderDashboard = () => (
    <div className="dashboard-overview">
      <h2>Overview</h2>
      <div className="dashboard-stats">
        <div className="stat-card"><h3>Total Tasks</h3><p>{totalTasks}</p></div>
        <div className="stat-card"><h3>Low Priority</h3><p>{lowPriority}</p></div>
        <div className="stat-card"><h3>Medium Priority</h3><p>{mediumPriority}</p></div>
        <div className="stat-card"><h3>High Priority</h3><p>{highPriority}</p></div>
        <div className="stat-card"><h3>Completion %</h3><p>{percentageComplete.toFixed(2)}%</p></div>
      </div>
    </div>
  );

  const renderTaskView = () => (
    <div>
      <TaskFilterBar filter={filter} setFilter={setFilter} />
      <TaskTable
        tasks={filteredTasks}
        onAdd={addTask}
        onEdit={editTask}
        onToggle={toggleComplete}
        onDelete={confirmDelete}
        onEditModeToggle={toggleEditMode}
      />

      {showDeleteConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this task?</p>
          <button onClick={() => deleteTask(taskToDelete)} className="confirm-delete">Yes</button>
          <button onClick={cancelDelete} className="cancel-delete">No</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <div className="hamburger-icon" onClick={toggleSidebar}>☰</div>

      <div className={`sidebar ${sidebarVisible ? 'show' : ''}`}>
        <h2 className="logo">Task Manager</h2>
        <ul>
          <li onClick={() => setCurrentView('dashboard')}>Dashboard</li>
          <li onClick={() => setCurrentView('tasks')}>Tasks</li>
        </ul>
      </div>

      <div className="main-content">
        {currentView === 'dashboard' ? renderDashboard() : renderTaskView()}
      </div>
    </div>
  );
}

export default App;