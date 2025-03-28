const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('#filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);
  input.value = '';
  saveAndRender();
});

function saveAndRender(filter = 'all') {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskList.innerHTML = '';

  let filtered = tasks;
  if (filter === 'completed') filtered = tasks.filter(t => t.completed);
  if (filter === 'pending') filtered = tasks.filter(t => !t.completed);

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener('blur', () => {
      task.text = span.textContent.trim();
      saveAndRender(filter);
    });

    const controls = document.createElement('div');

    const toggle = document.createElement('button');
    toggle.textContent = task.completed ? 'Undo' : 'Complete';
    toggle.onclick = () => {
      task.completed = !task.completed;
      saveAndRender(filter);
    };

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender(filter);
    };

    controls.appendChild(toggle);
    controls.appendChild(del);
    li.appendChild(span);
    li.appendChild(controls);
    taskList.appendChild(li);
  });
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    saveAndRender(button.dataset.filter);
  });
});

saveAndRender();
