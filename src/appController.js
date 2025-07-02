import { getStoredItem } from "./storageController";

import { projectList, taskList } from "./lists";

import { registerNewUser, deregisterUser } from "./usersManager";
import { addProject, addTask, logInUser, logOutUser } from "./userSession";

// Import the emitter obj for DOM <-> appController communication via events
// NB therefore no import of domController allowed here!  Must use emitter!
import emitter from "./emitter";

// On initialize, pull all stored items and append (if storage is available - storageController checks for this and alerts if necessary)

projectList.push(...getStoredItem("projectList"));
taskList.push(...getStoredItem("taskList"));

emitter.on("request:registerNewUser", registerNewUserHandler)
function registerNewUserHandler(event) {
    if (registerNewUser(event.username, event.password))
        emitter.emit("success:newUserRegistered", {});
    else
        emitter.emit("fail:newUserRegistered", {});
}

emitter.on("request:logInUser", logInUserHandler);
function logInUserHandler(event) {
    const userSession = logInUser(event.username, event.password);
    if (userSession)
        emitter.emit("success:userLoggedIn", userSession);
    else
        emitter.emit("fail:userLoggedIn", {});
}

emitter.on("request:logOutUser", logOutUserHandler);
function logOutUserHandler() {
    if (logOutUser())
        emitter.emit("success:userLoggedOut", {});
    else
        emitter.emit("fail:userLoggedOut", {});
}

emitter.on("request:deregisterUser", deregisterUserHandler);
function deregisterUserHandler(event) {
    if (deregisterUser(event.username, event.password))
        emitter.emit("success:userDeregistered", {});
    else
        emitter.emit("fail:userDeregistered", {});
}

emitter.on("request:addProject", addProjectHandler);
function addProjectHandler(event) {
    if (addProject(event.name))
        emitter.emit("success:addProject", {});
    else
        emitter.emit("fail:addProject", {});
}

emitter.on("request:addTask", addTaskHandler);
function addTaskHandler(event) {
    if (addTask(event.project, event.title, event.description, event.dueDate, event.priority))
        emitter.emit("success:addTask", {});
    else
        emitter.emit("fail:addTask", {});
}
