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

console.log(userList)

// function storeItem(key, value) {

// }

function checkUsernameExists(username) {
    // If username is in userList obj return true, else return false
    if (userList.find(user => user.username === username)) return true; else return false;
}

function checkPassword() {
    // 
}

export function logInUser() {
    // checkUsername() && checkPassword() set currentUser = user, return logged in
    // else return invalid username or password, please try again

}

export function registerNewUser(username, password) {
    if (checkUsernameExists(username)){
        return "username already exists, try another username";
    }
    else {
        const newUser = createUser(username, password);
        userList.push(newUser);
        console.log(userList);
        setStoredItem("userList", userList);
        return "successful new user, you can now log in";
    }
    // checkUsername() -> false continue to create new user and save to storage and logInUser().
    // -> true name already taken, return please try another name

}