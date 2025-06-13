import {userList, projectList, taskList} from "./lists";

// Currently logged in application user, with projects and tasks.  Initialized as nobody (undefined).
export let loggedInUser = undefined;
export let activeProject = undefined;

export function logInUser(username, password) {
    const foundRegisteredUser = userList.find(registeredUser => registeredUser.username === username && registeredUser.password === password);
    if (foundRegisteredUser) {
        loggedInUser = foundRegisteredUser;
        // TODO set active project to user's default (but what if they deleted the default project -> set to first in list?/last used?)
        return "Successfully logged in";
    }
    else return "Invalid user or password.  Please try again";
}
