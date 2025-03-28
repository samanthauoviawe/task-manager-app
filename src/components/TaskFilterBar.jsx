import React from 'react';

function TaskFilterBar({ filter, setFilter }) {
  const filters = ['all', 'completed', 'pending'];

  return (
    <div className="task-filter-bar">
      {filters.map((status) => (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`filter-button ${filter === status ? 'active' : ''}`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

export default TaskFilterBar;

