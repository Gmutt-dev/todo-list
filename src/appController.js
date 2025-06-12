import createTask from "./createTask";
import createProject from "./createProject";
import createUser from "./createUser";
import checkUsernameExists from "./checkUserNameExists";

import { getStoredItem, setStoredItem } from "./storageController";

import {userList, projectList, taskList} from "./lists";

// Currently logged in application user.  Initialized as nobody (undefined).
let loggedInUser = undefined;

// On initialize, pull all stored items and append (if storage is available - storageController checks for this and alerts if necessary)
userList.push(...getStoredItem("userList"));
projectList.push(...getStoredItem("projectList"));
taskList.push(...getStoredItem("taskList"));

export function logInUser(username, password) {

    const foundRegisteredUser = userList.find(registeredUser => registeredUser.username === username && registeredUser.password === password);
    if (foundRegisteredUser) {
        loggedInUser = foundRegisteredUser;
        return "Successfully logged in";
    }
    else return "Invalid user or password.  Please try again";
}

export function registerNewUser(username, password) {
    if (checkUsernameExists(username)){
        return "Failed. User already exists";
    }
    else {
        const newUser = createUser(username, password);
        userList.push(newUser);
        setStoredItem("userList", userList);
        // Create the default project for every new user:
        const defaultProject = createProject(newUser, "default");
        projectList.push(defaultProject);
        setStoredItem("projectList", projectList);
        return newUser.username;
    }
}

export function getLoggedInUserProjects() {
    return projectList.filter(project => project.linkedUserId === loggedInUser.username);
    
}


function getLoggedInUserTasks(loggedInUser) {

}

// Reminders:
// function to delete user (and all linked projects and tasks)
// function to delete project (and all linked tasks)
// funtion to delete task
// function to rename a project (or maybe a method on the project?)?
// function to edit a task (or maybe method on task?)?