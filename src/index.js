import "./styles.css";

import {
    registerNewUser,
    logInUser, 
    getLoggedInUserProjects as getProjects,
    createLoggedInUserProject as createProject} from "./appController";



// TEMP testing with console
// const newUser = createUser("user1", "Sally");
// const newProject = createProject(newUser, "default");
// console.log(newProject);
// console.log(createTask(newProject,"Test Task","A task for testing","10Jan2025","high"));

// Choose to either log in or create new user
// -> New user:
// Please enter username and password (re-enter password - try again if no match):
console.log(registerNewUser("Sarah", "pwd"));
console.log(registerNewUser("Pete", "pwd2"));
// Create the user (appController) if the userName is available (appController -> storageController check), else ask to choose another username
// Store the user (storageController(emitter?)) and confirm can now log in

// -> Log in:
// display: please enter username + password
//  appController checks list of users and checks if username and password matches.
// Set current user equal to this user if match.
// Else return failed due to username or password mismatch

console.log(logInUser("Sarah", "pwd"));
console.log(getProjects());

createProject("test Project");

// TEMP END testing with console