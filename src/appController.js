import { getStoredItem } from "./storageController";

import { userList, projectList, taskList } from "./lists";

import { registerNewUser } from "./usersManager";
import { logInUser } from "./userSession";

// Import the emitter obj for DOM <-> appController communication via events
// NB therefore no import of domController allowed here!  Must use emitter!
import emitter from "./emitter";

// On initialize, pull all stored items and append (if storage is available - storageController checks for this and alerts if necessary)
userList.push(...getStoredItem("userList"));
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
        emitter.emit("fail:userLoggedIn", {})
}


// export function getLoggedInUserProjects() {
//     return projectList.filter(project => project.linkedUserId === loggedInUser.username);
    
// }

// export function createLoggedInUserProject(projectName) {
//     if (loggedInUser) {
//         const newProject = createProject(loggedInUser, projectName);
//         projectList.push(newProject);
//         setStoredItem("projectList", projectList);
//         activeProject = newProject; //set activeProject to this new project

//     }
// }


function getLoggedInUserTasks(loggedInUser) {

}

// Reminders:
// function to delete user (and all linked projects and tasks)
// function to delete project (and all linked tasks)
// funtion to delete task
// function to rename a project (or maybe a method on the project?)?
// function to edit a task (or maybe method on task?)?