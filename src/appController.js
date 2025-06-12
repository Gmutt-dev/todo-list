import createTask from "./createTask";
import createProject from "./createProject";
import createUser from "./createUser";
import checkUsernameExists from "./checkUserNameExists";

import { getStoredItem, setStoredItem } from "./storageController";

import {userList, projectList, taskList} from "./lists";


// On initialize, pull all stored items and append (if storage is available - storageController checks for this and alerts if necessary)
userList.push(...getStoredItem("userList"));
projectList.push(...getStoredItem("projectList"));
taskList.push(...getStoredItem("taskList"));

function checkPassword() {
    // 
}

export function logInUser() {
    // checkUsername() && checkPassword() set currentUser = user, return logged in
    // else return invalid username or password, please try again

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