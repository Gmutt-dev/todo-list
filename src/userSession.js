import { isRegisteredUser } from "./usersManager";
import { getProjectsByUserClone } from "./projectsManager";
import { getTasksByUserClone } from "./tasksManager";

let loggedInUser = undefined;

export function createUserSession(user) {
  if (isRegisteredUser(user)) {
    loggedInUser = user;
    return true;
  }
}

// There is no security no matter what you do here - everything is accessible in the browser
export function getLoggedInUser() {
  return { username: loggedInUser.username }; // No password returned for security reasons.  Was only needed for login
}

// I'm not sure all this deep cloning is strictly neccessary
export function getUserSessionClone() {
  if (loggedInUser)
    return structuredClone({
      loggedInUser: { username: loggedInUser.username },
      userProjects: getProjectsByUserClone(loggedInUser),
      userTasks: getTasksByUserClone(loggedInUser),
    });
}

// This can just be a void function - no need to explicity return undefined
export function clearUserSession() {
  loggedInUser = undefined;
  return undefined;
}
