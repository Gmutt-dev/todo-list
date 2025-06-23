// Import the emitter object for DOM to appController controller communication via events
// NB therefore no import of appController allowed here!  Must use emitter!
import emitter from "./emitter";

// TEMP - console testing
emitter.on("success:newUserRegistered", () => {console.log("Registration succeeded")});
emitter.on("fail:newUserRegistered", () => {console.log("Registration failed")});
emitter.emit("request:registerNewUser", {name: "Sarah", password: "pwd1"});
// END TEMP