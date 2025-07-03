import { isRegisteredUser, registerNewUser, deregisterUser } from "./usersManager";
import { getLoggedInUser, getUserSessionClone, newProject, newTask, createUserSession, clearUserSession } from "./userSession";
import { addProject } from "./projectsManager";
import { addTask } from "./tasksManager";

// Import the emitter obj for DOM <-> appController communication via events
// NB therefore no import of domController allowed here!  Must use emitter!
import emitter from "./emitter";

emitter.on("request:registerNewUser", registerNewUserHandler)
function registerNewUserHandler(event) {
    if (registerNewUser(event.username, event.password))
        emitter.emit("success:newUserRegistered", {});
    else
        emitter.emit("fail:newUserRegistered", {});
}

emitter.on("request:logInUser", logInUserHandler);
function logInUserHandler(event) {
    // check if valid user
    if (isRegisteredUser({username: event.username, password: event.password})) {
        // if valid user request new userSession
        if (createUserSession(event))
            emitter.emit("success:userLoggedIn", getUserSessionClone());            
        }
        else
            emitter.emit("fail:userLoggedIn", {});
}

emitter.on("request:logOutUser", logOutUserHandler);
function logOutUserHandler() {
    if (clearUserSession())
        emitter.emit("success:userLoggedOut", getUserSessionClone());
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
    if (addProject(getLoggedInUser(), event.ProjectName))
        emitter.emit("success:addProject", getUserSessionClone());
    else
        emitter.emit("fail:addProject", {});
}

emitter.on("request:addTask", addTaskHandler);
function addTaskHandler(event) {
    if (addTask(event.project, event.title, event.description, event.dueDate, event.priority))
        emitter.emit("success:addTask", getUserSessionClone());
    else
        emitter.emit("fail:addTask", {});
}

// Reminders:
// function to delete project (and all linked tasks)
// funtion to delete task
// function to edit a project (or maybe a method on the project?)?
// function to edit a task (or maybe method on task?)?