import {userList, projectList, taskList} from "./lists";
import getProjectsByUser from "./getProjectsByUser";
import createProject from "./createProject";
import { setStoredItem } from "./storageController";

// Currently logged in application user, with projects and tasks.  Initialized as nobody (undefined).
let loggedInUser = undefined;
let userProjects = undefined;
let SelectedProject = undefined;

export function logInUser(username, password) {
    const foundRegisteredUser = userList.find(registeredUser => registeredUser.username === username && registeredUser.password === password);
    if (foundRegisteredUser) {
        loggedInUser = foundRegisteredUser;
        userProjects = getProjectsByUser(loggedInUser);
        // TODO set active project to user's default (but what if they deleted the default project -> set to first in list?/last used?)
        if (userProjects.find(project => project.name === "default")) {
            SelectedProject = userProjects.find(project => project.name === "default");
        }
        else {
            SelectedProject = userProjects[0];
        }
        return "Successfully logged in";
    }
    else return "Invalid user or password.  Please try again";
}

export function addProject(name) {
    const newProject = createProject(loggedInUser, name);
    userProjects.push(newProject);
    projectList.push(newProject);
    setStoredItem("projectList", projectList);
    //set as new active project?
    //emit "newProject" event for dom update?
}

export function changeSelectedProject(id) {
    SelectedProject = userProjects.find(project => project.id === id);
    //emit event for dom update?
}