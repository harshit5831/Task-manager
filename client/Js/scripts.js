document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    let tasks = [];

    // Fetch tasks from API
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => {
                tasks = data;
                renderTasks();
            });
    }

    // Render tasks to the DOM
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <p><strong>Due:</strong> ${task.dueDate}</p>
                <div class="task-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editTask(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    }

    // Add or update a task
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        const id = document.getElementById('task-id').value;

        const taskData = { title, description, dueDate };

        if (id) {
            fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            }).then(() => {
                fetchTasks();
                $('#taskModal').modal('hide');
                taskForm.reset();
                document.getElementById('task-id').value = '';
            });
        } else {
            fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            }).then(() => {
                fetchTasks();
                $('#taskModal').modal('hide');
                taskForm.reset();
            });
        }
    });

    // Edit a task
    window.editTask = function (index) {
        const task = tasks[index];
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-due-date').value = task.dueDate;
        document.getElementById('task-id').value = task.id;
        $('#taskModal').modal('show');
    };

    // Delete a task
    window.deleteTask = function (index) {
        fetch(`/api/tasks/${tasks[index].id}`, {
            method: 'DELETE',
        }).then(() => {
            fetchTasks();
        });
    };

    fetchTasks();
});
