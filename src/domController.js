// Import the emitter object for DOM to appController controller communication via events
// NB therefore no import of appController allowed here!  Must use emitter!
import emitter from "./emitter";


let userSession;

// TEMP - console testing
emitter.on("success:newUserRegistered", () => {console.log("Registration succeeded")});
emitter.on("fail:newUserRegistered", () => {console.log("Registration failed")});
emitter.on("success:userDeregistered", () => console.log("User successfully deregistered"));
emitter.on("fail:userDeregistered", () => console.log("Failed to deregister user"));
emitter.on("userSessionUpdated", (e) => {
    console.log("Successfully logged in:");
    userSession = e;
    console.log(e);
});
emitter.on("fail:userLoggedIn", () => console.log("Failed to log in. Please try again"));
// emitter.on("success:userLoggedOut", () => {
//     console.log("Successfully logged out the user");
//     userSession = undefined;
// });
emitter.on("fail:userLoggedOut", () => {
    console.log("Failed to log out the user");
});
// emitter.on("success:addProject", () => console.log("Added new project"));
emitter.on("fail:addProject", () => console.log("Failed to add new project"));
// emitter.on("success:addTask", () => console.log("Successfully added a new task to the active project"));
emitter.on("fail:addTask", () => console.log("Failed to add new task"));

emitter.emit("request:registerNewUser", {username: "Sarah", password: "pwd1"});
emitter.emit("request:registerNewUser", {username: "Peter", password: "pwd2"});
emitter.emit("request:registerNewUser", {username: "John", password: "pwd3"});

emitter.emit("request:logInUser", {username: "Sarah", password: "pwd1"});

// emitter.emit("request:logOutUser", {});

emitter.emit("request:deregisterUser", {username: "Peter", password: "pwd2"})

emitter.emit("request:addProject", {projectName: "Garden"});

emitter.emit("request:addTask", {project: userSession.userProjects[0], title: "Test title", description: "Test description", dueDate: "20250202", priority:"high"});


// END TEMP