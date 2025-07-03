import { getUserListClone, isRegisteredUser } from "./usersManager";
import { createProject, addProject, getProjectsByUserClone } from "./projectsManager";
import { createTask, addTask, getTasksByUserClone } from "./tasksManager";


// Currently logged in application user, with projects and tasks.  Initialized as nobody (undefined).
let loggedInUser = undefined;
let userProjects = undefined;
let userTasks = undefined;

export function createUserSession(user) {
    if (isRegisteredUser(user)) {
        loggedInUser = user;
        userProjects = getProjectsByUserClone(loggedInUser);
        userTasks = getTasksByUserClone(loggedInUser);
        return structuredClone({
            username: loggedInUser.username,
            userProjects,
            userTasks
        });
    }
}

export function getLoggedInUser() {
    return {username: loggedInUser.username} // No password returned for security reasons.  Was only needed for login
}

export function getUserSessionClone() {
    return structuredClone({
        loggedInUser: {username: loggedInUser.username},
        userProjects,
        userTasks
    })
}

export function clearUserSession() {
    loggedInUser = undefined;
    userProjects = undefined;
    userTasks = undefined;
    return undefined;
}
