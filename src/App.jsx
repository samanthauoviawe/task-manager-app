import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [currentView, setCurrentView] = useState('tasks'); // Default view is tasks
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    priority: 'medium',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.name.trim()) return;
    addTask(taskForm);
    setTaskForm({ name: '', description: '', priority: 'medium' }); // Reset form
  };

  const editTask = (id, newText, type) => {
    setTasks(tasks.map(task => (
      task.id === id ? { ...task, [type]: newText } : task
    )));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setShowDeleteConfirmation(false); // Close the confirmation dialog
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirmation(true);
    setTaskToDelete(id);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Dashboard Overview Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const percentageComplete = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // Priority Stats
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="dashboard-overview">
            <h2>Overview</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Tasks</h3>
                <p>{totalTasks}</p>
              </div>
              <div className="stat-card">
                <h3>Low Priority</h3>
                <p>{lowPriorityTasks}</p>
              </div>
              <div className="stat-card">
                <h3>Medium Priority</h3>
                <p>{mediumPriorityTasks}</p>
              </div>
              <div className="stat-card">
                <h3>High Priority</h3>
                <p>{highPriorityTasks}</p>
              </div>
              <div className="stat-card">
                <h3>Completion %</h3>
                <p>{percentageComplete.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        );
      case 'tasks':
      default:
        return (
          <div>
            {/* Filter Section */}
            <div className="task-filter-bar">
              <div
                onClick={() => setFilter('all')}
                className={`filter-tag ${filter === 'all' ? 'active' : ''}`}
              >
                All
              </div>
              <div
                onClick={() => setFilter('completed')}
                className={`filter-tag ${filter === 'completed' ? 'active' : ''}`}
              >
                Completed
              </div>
              <div
                onClick={() => setFilter('pending')}
                className={`filter-tag ${filter === 'pending' ? 'active' : ''}`}
              >
                Pending
              </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleSubmit} className="task-form">
              <input
                type="text"
                name="name"
                value={taskForm.name}
                onChange={handleChange}
                placeholder="Task Name"
                className="task-input"
              />
              <textarea
                name="description"
                value={taskForm.description}
                onChange={handleChange}
                placeholder="Task Description"
                className="task-textarea"
              />
              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleChange}
                className="task-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit" className="add-task-button">Add Task</button>
            </form>

            {/* Task Table */}
            <div className="task-table">
              {filteredTasks.length === 0 ? (
                <p>No tasks to show</p>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className={`task-row ${task.completed ? 'completed' : ''}`}>
                    <div className="task-text">
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => editTask(task.id, e.target.value, 'name')}
                        className="task-text"
                      />
                      <textarea
                        value={task.description}
                        onChange={(e) => editTask(task.id, e.target.value, 'description')}
                        className="task-textarea"
                      />
                    </div>
                    <div className="task-status">
                      <span
                        className={`status status-${task.priority}`}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                    <div className="actions">
                      <button onClick={() => toggleComplete(task.id)} className="toggle-button">
                        {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                      </button>
                      <button onClick={() => confirmDelete(task.id)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Confirmation Dialog for Deletion */}
            {showDeleteConfirmation && (
              <div className="confirmation-dialog">
                <p>Are you sure you want to delete this task?</p>
                <button onClick={() => deleteTask(taskToDelete)} className="confirm-delete">Yes</button>
                <button onClick={cancelDelete} className="cancel-delete">No</button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Task Manager</h2>
        <ul>
          <li onClick={() => setCurrentView('dashboard')}>Dashboard</li>
          <li onClick={() => setCurrentView('tasks')}>Tasks</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">{renderView()}</div>
    </div>
  );
}

export default App;
