// Grab elements
const newProjectBtn = document.getElementById("_new_project");
const deleteBtn = document.getElementById('_delete_item');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const renameBtn = document.getElementById('_rename_item');
const renameModal = document.getElementById('rename-modal');
const renameInput = document.getElementById('rename-task-name');
const confirmRenameBtn = document.getElementById('confirm-rename');
const cancelRenameBtn = document.getElementById('cancel-rename');

const loadProjectBtn = document.getElementById('_load_project');
const loadModal = document.getElementById('load-project-modal');
const savedProjectsList = document.getElementById('project-list');
const cancelLoadBtn = document.getElementById('cancel-load-project');
const deleteAllProjectsBtn = document.getElementById('delete-all-projects-btn');

const itemModal = document.getElementById('item-modal');
const createTaskBtn = document.getElementById('create-task');
const cancelTaskBtn = document.getElementById('cancel-task');

const todoList = document.getElementById('todo-list');
const taskNameInput = document.getElementById('task-name');
const taskImportantInput = document.getElementById('task-important');

let currentRenameLabel = null;

// --- New Task Modal Logic ---
document.getElementById('_new_item').addEventListener('click', () => {
  itemModal.style.display = 'block';
  taskNameInput.value = '';
  taskImportantInput.checked = false;
  taskNameInput.focus();
});

cancelTaskBtn.addEventListener('click', () => {
  itemModal.style.display = 'none';
});

createTaskBtn.addEventListener('click', () => {
  const name = taskNameInput.value.trim();
  if (!name) return;

  const id = `task-${Date.now()}`;
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;

  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = name;

  if (taskImportantInput.checked) {
    label.classList.add('important');
    li.appendChild(checkbox);
    li.appendChild(label);
    todoList.prepend(li);
  } else {
    li.appendChild(checkbox);
    li.appendChild(label);
    todoList.appendChild(li);
  }

  itemModal.style.display = 'none';
});

// --- Rename Task ---
renameBtn.addEventListener('click', () => {
  const checkedBoxes = todoList.querySelectorAll('input[type="checkbox"]:checked');
  if (checkedBoxes.length === 0) {
    alert('Please select one task to rename.');
    return;
  }

  currentRenameLabel = checkedBoxes[0].nextElementSibling;
  renameInput.value = currentRenameLabel.textContent;
  renameModal.style.display = 'block';
  renameInput.focus();
});

cancelRenameBtn.addEventListener('click', () => {
  renameModal.style.display = 'none';
  currentRenameLabel = null;
});

confirmRenameBtn.addEventListener('click', () => {
  const newName = renameInput.value.trim();
  if (!newName) {
    alert('Task name cannot be empty.');
    return;
  }
  if (currentRenameLabel) {
    currentRenameLabel.textContent = newName;
  }
  renameModal.style.display = 'none';
  currentRenameLabel = null;
});

// --- Delete Tasks ---
deleteBtn.addEventListener('click', () => {
  const anyChecked = todoList.querySelector('input[type="checkbox"]:checked');
  if (!anyChecked) {
    alert('Please select at least one task to delete.');
    return;
  }
  deleteModal.style.display = 'block';
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.style.display = 'none';
});

confirmDeleteBtn.addEventListener('click', () => {
  todoList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    if (checkbox.checked) {
      checkbox.closest('li').remove();
    }
  });
  deleteModal.style.display = 'none';
});

// --- New Project (Save current, clear list) ---
newProjectBtn.addEventListener('click', () => {
  const tasks = [];
  todoList.querySelectorAll('li').forEach(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const label = li.querySelector('label');
    tasks.push({
      id: checkbox.id,
      name: label.textContent,
      checked: checkbox.checked,
      important: label.classList.contains('important')
    });
  });

  if (tasks.length > 0) {
    const timestamp = new Date().toISOString();
    localStorage.setItem(`taskManagerProject_${timestamp}`, JSON.stringify(tasks));
  }

  todoList.innerHTML = '';
});

// --- Load Project Modal Logic ---
loadProjectBtn.addEventListener('click', () => {
  // Clear list first
  savedProjectsList.innerHTML = '';

  // Collect saved projects keys and show them
  const keys = Object.keys(localStorage)
    .filter(key => key.startsWith('taskManagerProject_'))
    .sort((a,b) => b.localeCompare(a)); // newest first

  if (keys.length === 0) {
    savedProjectsList.innerHTML = '<li>No saved projects found.</li>';
  } else {
    keys.forEach(key => {
      const li = document.createElement('li');
      li.textContent = key.replace('taskManagerProject_', '').replace('T', ' ').slice(0, 19);
      li.style.cursor = 'pointer';
      li.style.padding = '6px 8px';
      li.style.borderBottom = '1px solid #ccc';

      li.addEventListener('click', () => {
        // Load project
        const saved = localStorage.getItem(key);
        if (!saved) return;

        const tasks = JSON.parse(saved);
        todoList.innerHTML = ''; // clear current

        tasks.forEach(task => {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = task.id;
          checkbox.checked = task.checked;

          const label = document.createElement('label');
          label.htmlFor = task.id;
          label.textContent = task.name;
          if (task.important) label.classList.add('important');

          li.appendChild(checkbox);
          li.appendChild(label);
          todoList.appendChild(li);
        });

        loadModal.style.display = 'none';
      });

      savedProjectsList.appendChild(li);
    });
  }

  loadModal.style.display = 'block';
});

cancelLoadBtn.addEventListener('click', () => {
  loadModal.style.display = 'none';
});

// --- Delete All Projects ---
deleteAllProjectsBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete ALL saved projects? This action cannot be undone.')) {
    // Remove all keys starting with 'taskManagerProject_'
    Object.keys(localStorage)
      .filter(key => key.startsWith('taskManagerProject_'))
      .forEach(key => localStorage.removeItem(key));

    savedProjectsList.innerHTML = '';r
    loadModal.style.display = 'none';
  }
});

// Optional: Close modals if clicking outside modal content
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});
