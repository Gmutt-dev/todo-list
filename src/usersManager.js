import { addProject, deleteProjectsByUser } from "./projectsManager";
import { deleteTasksByUser } from "./tasksManager";
import { getStoredItem, setStoredItem } from "./storageController";

//Initialization:
const userList = [];
userList.push(...getStoredItem("userList"));

// You could inline this in the array constructor
// const userList = [...getStoredItem("userList")];

// This function is not useful - 1 it is only used in one place 2 it doesn't do anything other than construct a simple record.
// You could do this inline
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

// Array.some() does this for you https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
function checkUsernameExists(username) {
  // If username is in userList obj return true, else return false
  if (userList.find((user) => user.username === username)) return true;
  else return false;
}

// .some()
export function isRegisteredUser(user) {
  if (
    userList.find(
      (registeredUser) =>
        registeredUser.username === user.username &&
        registeredUser.password === user.password
    )
  )
    return true;
  else return false;
}

// This function is never called
export function getUserListClone() {
  return structuredClone(userList);
}

export function deregisterUser(username, password) {
  const foundRegisteredUser = userList.find(
    (registeredUser) =>
      registeredUser.username === username &&
      registeredUser.password === password
  );
  if (foundRegisteredUser) {
    deleteProjectsByUser(foundRegisteredUser);
    deleteTasksByUser(foundRegisteredUser);
    userList.splice(
      userList.findIndex(
        (user) => user.username === foundRegisteredUser.username
      ),
      1
    );
    setStoredItem("userList", userList);
    return true;
  }

  // A nice pattern to follow is what we call an 'early return'
  // The idea is that nesting/indentation is diffucult to read, so we aim to reduce this where possible
  // e.g.

  //   const foundRegisteredUser = userList.find(
  //     (registeredUser) =>
  //       registeredUser.username === username &&
  //       registeredUser.password === password
  //   );

  //   if (!foundRegisteredUser) return;

  //   deleteProjectsByUser(foundRegisteredUser);
  //   deleteTasksByUser(foundRegisteredUser);
  //   userList.splice(
  //     userList.findIndex(
  //       (user) => user.username === foundRegisteredUser.username
  //     ),
  //     1
  //   );
  //   setStoredItem("userList", userList);
  //   return true;
}

// You could consider using a Set for a list of unique things
// i.e. you could maintain a set of usernames which is easy to query and guaranteed to be unique
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
