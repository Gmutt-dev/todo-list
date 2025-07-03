import { getUserListClone, isRegisteredUser } from "./usersManager";
import { createProject, addProject, getProjectsByUserClone } from "./projectsManager";
import { createTask, addTask, getTasksByUserClone } from "./tasksManager";


let loggedInUser = undefined;

export function createUserSession(user) {
    if (isRegisteredUser(user)) {
        loggedInUser = user;
        return true;
    }
}

export function getLoggedInUser() {
    return {username: loggedInUser.username} // No password returned for security reasons.  Was only needed for login
}

export function getUserSessionClone() {
    return structuredClone({
        loggedInUser: {username: loggedInUser.username},
        userProjects: getProjectsByUserClone(loggedInUser),
        userTasks: getTasksByUserClone(loggedInUser)
    })
}

export function clearUserSession() {
    loggedInUser = undefined;
    return undefined;
}
