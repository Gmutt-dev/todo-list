import createTask from "./createTask";
import createProject from "./createProject";
import createUser from "./createUser";
import checkUsernameExists from "./checkUserNameExists";

import { getStoredItem, setStoredItem } from "./storageController";

import {userList, projectList, taskList} from "./lists";

// Currently logged in application user.  Initialized as nobody (undefined).
let currentUser = undefined;

// On initialize, pull all stored items and append (if storage is available - storageController checks for this and alerts if necessary)
userList.push(...getStoredItem("userList"));
projectList.push(...getStoredItem("projectList"));
taskList.push(...getStoredItem("taskList"));

export function logInUser(username, password) {

    const foundRegisteredUser = userList.find(registeredUser => registeredUser.username === username && registeredUser.password === password);
    if (foundRegisteredUser) {
        currentUser = foundRegisteredUser;
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
        return newUser.username;
    }
}