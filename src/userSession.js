import {userList, projectList, taskList} from "./lists";
import getProjectsByUser from "./getProjectsByUser";
import createProject from "./createProject";
import createTask from "./createTask";
import { setStoredItem } from "./storageController";
import { getTasksByUser } from "./getTasksByUser";


// Currently logged in application user, with projects and tasks.  Initialized as nobody (undefined).
let loggedInUser = undefined;
let userProjects = undefined;
let userTasks = undefined;

export function logInUser(username, password) {
    const foundRegisteredUser = userList.find(registeredUser => registeredUser.username === username && registeredUser.password === password);
    if (foundRegisteredUser) {
        loggedInUser = foundRegisteredUser;
        userProjects = getProjectsByUser(loggedInUser);
        userTasks = getTasksByUser(loggedInUser);
        return {
            username: loggedInUser.username,
            userProjects,
            userTasks
        };
    }
}

export function logOutUser() {
    loggedInUser = undefined;
    userProjects = undefined;
    userTasks = undefined;
    return true;
}

export function addProject(name) {
    const newProject = createProject(loggedInUser, name);
    userProjects.push(newProject);
    projectList.push(newProject);
    setStoredItem("projectList", projectList);
    return true;
}

export function addTask(project, title, description, dueDate, priority) {
    const newTask = createTask(project, title, description, dueDate, priority);
    userTasks.push(newTask);
    taskList.push(newTask);
    setStoredItem("taskList", taskList);
    return true;
}


// Reminders:
// function to delete project (and all linked tasks)
// funtion to delete task
// function to edit a project (or maybe a method on the project?)?
// function to edit a task (or maybe method on task?)?