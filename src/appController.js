import createTask from "./createTask";
import createProject from "./createProject";
import createUser from "./createUser";

import { getStoredItem, setStoredItem } from "./storageController";


const userList = [];
const projectList = [];
const taskList = [];

// On initialize, pull all stored items and append (if storage is available - storageController checks for this and alerts if necessary)
userList.push(...getStoredItem("userList"));
projectList.push(...getStoredItem("projectList"));
taskList.push(...getStoredItem("taskList"));

// function storeItem(key, value) {

// }

function checkUsername() {
    // Get array of users from storage
    // If userName is in storage return true, else return false
}

function checkPassword() {
    // 
}

export function logInUser() {
    // checkUsername() && checkPassword() set currentUser = user, return logged in
    // else return invalid username or password, please try again

}

export function registerNewUser() {
    // checkUsername() -> false continue to create new user and save to storage and logInUser().
    // -> true name already taken, return please try another name

}