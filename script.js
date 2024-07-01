let socket = new WebSocket('ws://localhost:3000');

socket.onopen = function(event) {
    console.log('Connected to WebSocket server');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    updateCompletionMessages(data);
};

socket.onclose = function(event) {
    console.log('Disconnected from WebSocket server');
};

function getTasksForWeekAndName(week, name) {
    let tasks = {};

    if (week === "week1") {
        if (name === "Yashu" || name === "Peter") {
            tasks = { Bathroom: "Yashu-Peter"};
        } else if (name === "Rohan" || name === "Sneha") {
            tasks = { Kitchen: "Rohan-Sneha" };
        } else if (name === "Muzammil") {
            tasks = { Trash: "Muzammil" };
        } else if (name === "Nikhil") {
            tasks = { Hallway: "Nikhil" };
        }
    } else if (week === "week2") {
        if (name === "Rohan" || name === "Sneha") {
            tasks = { Bathroom: "Rohan-Sneha" };
        } else if (name === "Muzammil" || name === "Nikhil") {
            tasks = { Kitchen: "Muzammil-Nikhil" };
        } else if (name === "Yashu") {
            tasks = { Trash: "Yashu" };
        } else if (name === "Peter") {
            tasks = { Hallway: "Peter" };
        }
    } else if (week === "week3") {
        if (name === "Muzammil" || name === "Nikhil") {
            tasks = { Bathroom: "Muzammil-Nikhil" };
        } else if (name === "Yashu" || name === "Peter") {
            tasks = { Kitchen: "Yashu-Peter" };
        } else if (name === "Rohan") {
            tasks = { Trash: "Rohan" };
        } else if (name === "Sneha") {
            tasks = { Hallway: "Sneha" };
        }
    } else if (week === "week4") {
        if (name === "Yashu" || name === "Peter") {
            tasks = { Bathroom: "Yashu-Peter"};
        } else if (name === "Rohan" || name === "Sneha") {
            tasks = { Kitchen: "Rohan-Sneha" };
        } else if (name === "Nikhil") {
            tasks = { Trash: "Nikhil" };
        } else if (name === "Muzammil") {
            tasks = { Hallway: "Muzammil" };
        }
    } else if (week === "week5") {
        if (name === "Rohan" || name === "Sneha") {
            tasks = { Bathroom: "Rohan-Sneha" };
        } else if (name === "Muzammil" || name === "Nikhil") {
            tasks = { Kitchen: "Muzammil-Nikhil" };
        } else if (name === "Peter") {
            tasks = { Trash: "Peter" };
        } else if (name === "Yashu") {
            tasks = { Hallway: "Yashu" };
        }
    } else if (week === "week6") {
        if (name === "Muzammil" || name === "Nikhil") {
            tasks = { Bathroom: "Muzammil-Nikhil" };
        } else if (name === "Yashu" || name === "Peter") {
            tasks = { Kitchen: "Yashu-Peter" };
        } else if (name === "Sneha") {
            tasks = { Trash: "Sneha" };
        } else if (name === "Rohan") {
            tasks = { Hallway: "Rohan" };
        }
    }

    return tasks;
}

function updateTasks() {
    const week = document.getElementById('week').value;
    const name = document.getElementById('name').value;
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = '';

    const tasks = getTasksForWeekAndName(week, name);
    for (const [taskName, taskValue] of Object.entries(tasks)) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `<input type="checkbox" id="${taskName}" onclick="toggleMessage('${name}', '${taskName}', '${week}')" ${isTaskCompleted(name, taskName, week) ? 'checked' : ''}> ${taskName}: ${taskValue}`;
        tasksDiv.appendChild(taskElement);
    }
    updateCompletionMessages();
}

function toggleMessage(name, task, week) {
    const checkbox = document.getElementById(task);
    if (checkbox.checked) {
        saveTaskCompletion(name, task, week, true);
        const message = `${name} has completed the ${task} task for the week ${week.replace('week', '')}`;
        socket.send(JSON.stringify({ type: 'task_completed', message: message }));
    } else {
        saveTaskCompletion(name, task, week, false);
    }
    updateCompletionMessages();
}

function saveTaskCompletion(name, task, week, isCompleted) {
    const completionData = JSON.parse(localStorage.getItem('completionData')) || {};
    if (!completionData[week]) {
        completionData[week] = {};
    }
    if (!completionData[week][name]) {
        completionData[week][name] = {};
    }
    completionData[week][name][task] = isCompleted;
    localStorage.setItem('completionData', JSON.stringify(completionData));
}

function isTaskCompleted(name, task, week) {
    const completionData = JSON.parse(localStorage.getItem('completionData')) || {};
    return completionData[week] && completionData[week][name] && completionData[week][name][task];
}

function updateCompletionMessages(data) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';
    const completionData = JSON.parse(localStorage.getItem('completionData')) || {};
    for (const [week, weekData] of Object.entries(completionData)) {
        for (const [name, nameData] of Object.entries(weekData)) {
            for (const [task, isCompleted] of Object.entries(nameData)) {
                if (isCompleted) {
                    const message = document.createElement('div');
                    message.innerText = `${name} has completed the ${task} task for the week ${week.replace('week', '')}`;
                    messageDiv.appendChild(message);
                }
            }
        }
    }
}

// Load initial tasks and messages
document.addEventListener('DOMContentLoaded', () => {
    updateTasks();
    updateCompletionMessages();
});
