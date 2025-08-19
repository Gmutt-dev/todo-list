import { addProject, deleteProjectsByUser } from "./projectsManager";
import { deleteTasksByUser } from "./tasksManager";
import { getStoredItem, setStoredItem } from "./storageController";

//Initialization:
const userList = [];
userList.push(...getStoredItem("userList"));

// Factory function to create and return a new user
function createUser(username, password) {
  return {
    username,
    password,
  };
}

export function registerNewUser(username, password) {
  if (checkUsernameExists(username)) {
    return false;
  } else {
    const newUser = createUser(username, password);
    userList.push(newUser);
    setStoredItem("userList", userList);
    // Create the default project for every new user:
    addProject(newUser, "default");
    return true;
  }
}

function checkUsernameExists(username) {
  // If username is in userList obj return true, else return false
  if (userList.find((user) => user.username === username)) return true;
  else return false;
}

export function isRegisteredUser(user) {
  if (
    userList.find(
      (registeredUser) =>
        registeredUser.username === user.username &&
        registeredUser.password === user.password,
    )
  )
    return true;
  else return false;
}

export function getUserListClone() {
  return structuredClone(userList);
}

export function deregisterUser(username, password) {
  const foundRegisteredUser = userList.find(
    (registeredUser) =>
      registeredUser.username === username &&
      registeredUser.password === password,
  );
  if (foundRegisteredUser) {
    deleteProjectsByUser(foundRegisteredUser);
    deleteTasksByUser(foundRegisteredUser);
    userList.splice(
      userList.findIndex(
        (user) => user.username === foundRegisteredUser.username,
      ),
      1,
    );
    setStoredItem("userList", userList);
    return true;
  }
}
