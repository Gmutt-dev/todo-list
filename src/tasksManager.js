import { getProjectsByUserClone } from "./projectsManager";
import { getStoredItem, setStoredItem } from "./storageController";

// Initialize:
const taskList = [];
taskList.push(...getStoredItem("taskList"));

// Factory function to create a new task object
export function createTask(linkedProject, title, description, dueDate, priority) {
    const id = crypto.randomUUID();
    const isDone = false;

    return {
        id,
        linkedProjectId: linkedProject.id,
        title,
        description,
        dueDate,
        priority,
        isDone
    };
}

export function addTask(project, title, description, dueDate, priority) {
    const newTask = createTask(project, title, description, dueDate, priority);
    if (newTask) {
        taskList.push(newTask);
        setStoredItem("taskList", taskList);
        return true; 
    }
}

function getTasksByUser(user) {
    const userProjects = getProjectsByUserClone(user);
    const userProjectsIds = userProjects.map( project => project.id);
    return taskList.filter(task => userProjectsIds.includes(task.linkedProjectId));
}

export function getTasksByUserClone(user) {
    const userProjects = getProjectsByUserClone(user);
    const userProjectsIds = userProjects.map( project => project.id);
    return structuredClone(taskList.filter(task => userProjectsIds.includes(task.linkedProjectId)));
}

export function deleteTasksByProjectId(projectId) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].linkedProjectId === projectId) {
            taskList.splice(i, 1);
            i--; // avoid missing the next element now moved back by one index value
        }
    }
    setStoredItem("taskList", taskList);
}

export function deleteTasksByUser(user) {
    const userTasks = getTasksByUser(user);
    for (let i = 0; i < taskList.length; i++) {
        if (userTasks.includes(taskList[i])) {
            taskList.splice(i, 1);
            i--; // avoid missing the next element now moved back by one index value
        }
    }
    setStoredItem("taskList", taskList);
}