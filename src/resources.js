
const clearElement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};
const createTask = (name) => ({
    id: Date.now().toString(),
    name,
    complete: false,
});

const createList = (name) => ({
    id: Date.now().toString(),
    name,
    tasks: [],
});

const save = () => {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
};

const saveAndRender = () => {
    save();
    render();
};



const render = () => {
    clearElement(listsContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
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
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    });
};

const renderTaskCount = (selectedList) => {
    const incompleteTasks = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasks === 1 ? 'task' : 'tasks';
    listCountElement.innerText = `${incompleteTasks} ${taskString} remaining`;
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


export {

    save,
    saveAndRender,
    renderTaskCount,
    createList,
    createTask,
};