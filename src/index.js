import './style.css';

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');

const priority = document.getElementById('priority');
const date = document.getElementById('date');
const description = document.getElementById('description');
const btnTask = document.getElementById('addTask');
const updateTask = document.getElementById('updateTask');


const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// getting a task

const getTask = (task) => {
  document.getElementById('newTaskName').value = task.name;
  document.getElementById('description').value = task.description;
  document.getElementById('date').value = task.date;
  document.getElementById('priority').value = task.priority;
};

// Event listeneres // DOM manipulation

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});


tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
});

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

btnTask.addEventListener('click', (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  const desc = description.value;
  const prior = priority.value;
  const day = date.value;
  if (
    taskName === null
    || (taskName === '' && desc === null)
    || (desc === '' && prior === null)
    || (prior === '' && day === null)
    || day === ''
  ) return;
  const task = createTask(taskName, desc, prior, day);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

// constructors

const createList = (name) => ({ id: Date.now().toString(), name, tasks: [] });

const createTask = (name, description, priority, date) => ({
  id: Date.now().toString(),
  name,
  description,
  priority,
  date,
  complete: false,
});

// data storage and renders

const saveAndRender = () => {
  save();
  render();
};

const save = () => {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
};

const render = () => {
  clearElement(listsContainer);
  renderLists(lists, selectedListId);

  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
};

const renderTasks = (selectedList) => {
  const taskTemplate = document.getElementById('task-template');
  const tasksContainer = document.querySelector('[data-tasks]');
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('[data-label]');
    const labelName = taskElement.querySelector('[label-name]');
    const labelDesc = taskElement.querySelector('[label-description]');
    const labelDate = taskElement.querySelector('[label-date]');
    const labelPrior = taskElement.querySelector('[label-priority]');

    label.htmlFor = task.id;
    labelName.append(task.name);
    labelDesc.append(task.description);
    labelPrior.append(task.priority);
    labelDate.append(task.date);
    tasksContainer.appendChild(taskElement);
  });
};

const renderTaskCount = (selectedList) => {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
};

const renderLists = () => {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.appendChild(listElement);
  });
};

// deleting stuff

const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// adding a default list


const defaultList = () => {
  const list = createList('Create a To-Do List');
  if (lists.length === 0) {
    lists.push(list);
    const taskName = 'Task';
    const desc = 'Description';
    const prior = 'Priority';
    const day = 'Date';
    if (
      taskName === null
    || (taskName === '' && desc === null)
    || (desc === '' && prior === null)
    || (prior === '' && day === null)
    || day === ''
    ) return;
    const task = createTask(taskName, desc, prior, day);
    lists[0].tasks.push(task);
    renderLists(lists, selectedListId);
    saveAndRender();
  }
};

defaultList();
render();
