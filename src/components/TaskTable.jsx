import React, { useState, useRef, useEffect } from 'react';

function TaskTable({ tasks, onAdd, onEdit, onDelete, onToggle, onEditModeToggle }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newTask = {
      ...form,
    };

    onAdd(newTask);
    setForm({ name: '', description: '', priority: 'medium' });
  };

  const handleBlur = (id) => {
    onEditModeToggle(id, false);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEditModeToggle(id, false);
    }
  };

  return (
    <div className="task-table">
      <form onSubmit={handleSubmit} className="task-form">
        <label htmlFor="task-title" className="form-label">
          Task Title
          <input
            type="text"
            id="task-title"
            name="name"
            autoComplete="off"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Follow up with client"
            className="form-field"
          />
        </label>

        <label htmlFor="task-desc" className="form-label">
          Description
          <textarea
            id="task-desc"
            name="description"
            autoComplete="off"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details about the task..."
            className="form-field"
          />
        </label>

        <label htmlFor="task-priority" className="form-label">
          Priority
          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="form-field"
            autoComplete="off"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <button type="submit" className="add-task-button">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks to show.</div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className={`task-row ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
              {task.isEditing ? (
                <textarea
                  value={task.name}
                  onChange={(e) => onEdit(task.id, e.target.value, 'name')}
                  onBlur={() => handleBlur(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  className="task-textarea"
                  autoFocus
                />
              ) : (
                <strong onClick={() => onEditModeToggle(task.id)} style={{ cursor: 'pointer' }}>
                  {task.name}
                </strong>
              )}

              {task.isEditing ? (
                <textarea
                  value={task.description}
                  onChange={(e) => onEdit(task.id, e.target.value, 'description')}
                  onBlur={() => handleBlur(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  className="task-textarea"
                />
              ) : (
                <p onClick={() => onEditModeToggle(task.id)} style={{ cursor: 'pointer' }}>
                  {task.description}
                </p>
              )}

              <div className="task-dates">
                <div><strong>Created:</strong> {task.createdAt}</div>
                {task.completedAt && <div><strong>Completed:</strong> {task.completedAt}</div>}
                {task.updatedAt && <div><strong>Modified:</strong> {task.updatedAt}</div>}
              </div>
            </div>

            <div className="task-status">
              <span className={`status status-${task.priority}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            <div className="actions">
              <button onClick={() => onToggle(task.id)} className="toggle-button">
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
              <button onClick={() => onDelete(task.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskTable;
