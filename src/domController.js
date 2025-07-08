import "./styles.css";

// Import the emitter object for DOM to appController controller communication via events
// NB therefore no import of appController allowed here!  Must use emitter!
import emitter from "./emitter";

const appContainer = document.querySelector(".app-container");

function drawDefaultApp() {
    appContainer.classList.remove("logged-in");
    appContainer.classList.add("default");

    function drawDefaultHeaderContents() {
        
        const header = document.querySelector(".header");
        header.textContent = "";
        
        const logoDiv = document.createElement("div");
        logoDiv.classList.add("logo");
        const logoText = document.createElement("H1");
        logoText.textContent = "Just DO it!";
        logoDiv.appendChild(logoText);
        const logoSubText = document.createElement("p");
        logoSubText.textContent = "The app that gets you from 'To Do' to 'Done!'";
        logoDiv.appendChild(logoSubText);
        header.appendChild(logoDiv);
    
        const loginButton = document.createElement("button");
        loginButton.type = "button";
        loginButton.classList.add("login-button");
        loginButton.textContent = "Log in";
        header.appendChild(loginButton);
    
        const registerButton = document.createElement("button");
        registerButton.type = "button";
        registerButton.classList.add("register-button");
        registerButton.textContent = "Register";
        header.appendChild(registerButton);
    }

    function drawDefaultMainSectionContents() {
        const mainSection = document.querySelector(".main-section");
        mainSection.textContent = "";
        const para1 = document.createElement("p");
        para1.textContent = "Welcome to the app that gets you from 'To Do' to 'Done!'";
        mainSection.appendChild(para1);
        const para2 = document.createElement("p");
        para2.textContent = "Please log in or register a new user (see top right of page)";
        mainSection.appendChild(para2);
    }

    drawDefaultHeaderContents();
    drawDefaultMainSectionContents();
}

function initializeAppGrid() {
    const header = document.createElement("header");
    header.classList.add("header");
    // const logoDiv = document.createElement("div");
    // logoDiv.innerHTML = "Do <br> It!"
    // header.appendChild(logoDiv);
    appContainer.appendChild(header);

    const leftSidebar = document.createElement("section");
    leftSidebar.classList.add("left-sidebar");
    appContainer.appendChild(leftSidebar);

    const mainSection = document.createElement("section");
    mainSection.classList.add("main-section");
    appContainer.appendChild(mainSection);

    drawDefaultApp();

}    

initializeAppGrid();



// TEMP - console testing
// let userSession;

// emitter.on("success:newUserRegistered", () => {console.log("Registration succeeded")});
// emitter.on("fail:newUserRegistered", () => {console.log("Registration failed")});
// emitter.on("success:userDeregistered", () => console.log("User successfully deregistered"));
// emitter.on("fail:userDeregistered", () => console.log("Failed to deregister user"));
// emitter.on("userSessionUpdated", (e) => {
//     console.log("Successfully logged in:");
//     userSession = e;
//     console.log(e);
// });
// emitter.on("fail:userLoggedIn", () => console.log("Failed to log in. Please try again"));
// // emitter.on("success:userLoggedOut", () => {
// //     console.log("Successfully logged out the user");
// //     userSession = undefined;
// // });
// emitter.on("fail:userLoggedOut", () => {
//     console.log("Failed to log out the user");
// });
// // emitter.on("success:addProject", () => console.log("Added new project"));
// emitter.on("fail:addProject", () => console.log("Failed to add new project"));
// // emitter.on("success:addTask", () => console.log("Successfully added a new task to the active project"));
// emitter.on("fail:addTask", () => console.log("Failed to add new task"));

// emitter.emit("request:registerNewUser", {username: "Sarah", password: "pwd1"});
// emitter.emit("request:registerNewUser", {username: "Peter", password: "pwd2"});
// emitter.emit("request:registerNewUser", {username: "John", password: "pwd3"});

// emitter.emit("request:logInUser", {username: "Sarah", password: "pwd1"});

// // emitter.emit("request:logOutUser", {});

// emitter.emit("request:deregisterUser", {username: "Peter", password: "pwd2"})

// emitter.emit("request:addProject", {projectName: "Garden"});

// emitter.emit("request:addTask", {project: userSession.userProjects[0], title: "Test title", description: "Test description", dueDate: new Date(2025, 7, 9) , priority:"high"});

// emitter.emit("request:updateTask", {id: "f3379445-f0f5-4933-a50e-566fb976e8a6", description: "Updated test description"});

// END TEMP