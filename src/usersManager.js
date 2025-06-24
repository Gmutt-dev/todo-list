import { userList, projectList, taskList } from "./lists";
import createProject from "./createProject";
import createUser from "./createUser";
import checkUsernameExists from "./checkUserNameExists";
import { setStoredItem } from "./storageController";
import deleteProjectsByUser from "./deleteProjectsByUser";
import deleteTasksByUser from "./deleteTasksByUser";

export function registerNewUser(username, password) {
    if (checkUsernameExists(username)){
        return false;
    }
    else {
        const newUser = createUser(username, password);
        userList.push(newUser);
        setStoredItem("userList", userList);
        // Create the default project for every new user:
        const defaultProject = createProject(newUser, "default");
        projectList.push(defaultProject);
        setStoredItem("projectList", projectList);
        return true;
    }
}

export function deregisterUser(username, password) {
    const foundRegisteredUser = userList.find(registeredUser => registeredUser.username === username && registeredUser.password === password);
    if (foundRegisteredUser) {
        deleteProjectsByUser(foundRegisteredUser);
        setStoredItem("projectList", projectList);
        deleteTasksByUser(foundRegisteredUser);
        setStoredItem("taskList", taskList);
        userList.splice(userList.findIndex(user => user.username === foundRegisteredUser.username), 1)
        setStoredItem("userList", userList);
        return true;
    }
}