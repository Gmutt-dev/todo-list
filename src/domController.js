// Import the emitter object for DOM to appController controller communication via events
// NB therefore no import of appController allowed here!  Must use emitter!
import emitter from "./emitter";

// TEMP - console testing
emitter.on("success:newUserRegistered", () => {console.log("Registration succeeded")});
emitter.on("fail:newUserRegistered", () => {console.log("Registration failed")});
emitter.on("success:userLoggedIn", (e) => {
    console.log("Successfully logged in:");
    console.log(e);
}
);
emitter.on("fail:userLoggedIn", () => console.log("Failed to log in. Please try again"))

emitter.emit("request:registerNewUser", {username: "Sarah", password: "pwd1"});

emitter.emit("request:logInUser", {username: "Sarah", password: "pwd1"});
// END TEMP