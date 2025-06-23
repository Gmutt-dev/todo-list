import { userList, projectList } from "./lists";
import createProject from "./createProject";
import createUser from "./createUser";
import checkUsernameExists from "./checkUserNameExists";
import { setStoredItem } from "./storageController";

export function registerNewUser(username, password) {
    if (checkUsernameExists(username)){
        return "Failed. User already exists";
    }
    else {
        const newUser = createUser(username, password);
        userList.push(newUser);
        setStoredItem("userList", userList);
        // Create the default project for every new user:
        const defaultProject = createProject(newUser, "default");
        projectList.push(defaultProject);
        setStoredItem("projectList", projectList);
        return newUser.username;
    }
}