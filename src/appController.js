import { isRegisteredUser, registerNewUser, deregisterUser } from "./usersManager";
import { getLoggedInUser, getUserSessionClone, createUserSession, clearUserSession } from "./userSession";
import { addProject, deleteProjectByProjectId, updateProject } from "./projectsManager";
import { addTask, deleteTaskByTaskId, updateTask } from "./tasksManager";

// Import the emitter obj for DOM <-> appController communication via events
// NB therefore no import of domController allowed here!  Must use emitter!
import emitter from "./emitter";

emitter.on("request:registerNewUser", registerNewUserHandler)
function registerNewUserHandler(event) {
    if (registerNewUser(event.username, event.password))
        emitter.emit("success:newUserRegistered", {
            message: `New user registered: ${event.username}`
        });
    else
        emitter.emit("fail:newUserRegistered", {
            message: `Failed to register new user ${event.username}
            Please try another username.`
        });
}

emitter.on("request:deregisterUser", deregisterUserHandler);
function deregisterUserHandler(event) {
    if (deregisterUser(event.username, event.password))
        emitter.emit("success:userDeregistered", {});
    else
        emitter.emit("fail:userDeregistered", {});
}

emitter.on("request:logInUser", logInUserHandler);
function logInUserHandler(event) {
    // check if valid user
    if (isRegisteredUser({username: event.username, password: event.password})) {
        // if valid user request new userSession
        if (createUserSession(event))
            emitter.emit("userSessionUpdated", getUserSessionClone());            
        }
        else
            emitter.emit("fail:userLoggedIn", {});
}

emitter.on("request:logOutUser", logOutUserHandler);
function logOutUserHandler() {
    if (clearUserSession())
        emitter.emit("userSessionUpdated", getUserSessionClone());
    else
        emitter.emit("fail:userLoggedOut", {});
}

emitter.on("request:addProject", addProjectHandler);
function addProjectHandler(event) {
    if (addProject(getLoggedInUser(), event.projectName))
        emitter.emit("userSessionUpdated", getUserSessionClone());
    else
        emitter.emit("fail:addProject", {});
}

emitter.on("request:addTask", addTaskHandler);
function addTaskHandler(event) {
    if (addTask(event.linkedProjectId, event.title, event.description, event.dueDate, event.priority))
        emitter.emit("userSessionUpdated", getUserSessionClone());
    else
        emitter.emit("fail:addTask", {});
}

emitter.on("request:deleteProject", deleteProjectHandler);
function deleteProjectHandler(event) {
    deleteProjectByProjectId(event.projectId);
    emitter.emit("userSessionUpdated", getUserSessionClone());
}

emitter.on("request:deleteTask", deleteTaskHandler);
function deleteTaskHandler(event) {
    deleteTaskByTaskId(event.taskId);
    emitter.emit("userSessionUpdated", getUserSessionClone());
}

emitter.on("request:updateProject", updateProjectHandler);
function updateProjectHandler(event) {
    updateProject(event);
    emitter.emit("userSessionUpdated", getUserSessionClone());
}

emitter.on("request:updateTask", updateTaskHandler);
function updateTaskHandler(event) {
    updateTask(event);
    emitter.emit("userSessionUpdated", getUserSessionClone());
}