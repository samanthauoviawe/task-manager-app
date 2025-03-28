import React, { useState } from 'react';

function TaskTable({ tasks, onAdd, onEdit, onDelete, onToggle }) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAdd(newTask.trim());
    setNewTask('');
  };

  return (
    <div className="task-table">
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="add-task-button">Add</button>
      </form>

      {/* Task Rows */}
      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks to show 😌</div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className={`task-row ${task.completed ? 'completed' : ''}`}>
            <input
              type="text"
              value={task.text}
              onChange={(e) => onEdit(task.id, e.target.value)}
              className="task-text"
            />
            <div className="actions">
              <button onClick={() => onToggle(task.id)} className="toggle-button">
                {task.completed ? '↩️' : '✅'}
              </button>
              <button onClick={() => onDelete(task.id)} className="delete-button">
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskTable;
