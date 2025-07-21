import "./styles.css";

// Import the emitter object for DOM to appController controller communication via events
// NB therefore no import of appController allowed here!  Must use emitter!
import emitter from "./emitter";
import { createHTMLElement } from "./DOM-fns";

const appContainer = document.querySelector(".app-container");
let userSessionClone = undefined;

function drawDefaultApp() {
    appContainer.classList.remove("logged-in");
    appContainer.classList.add("default");

    function drawDefaultHeaderContents() {

        const header = document.querySelector(".header");
        header.textContent = "";
        
        const logoDiv = createHTMLElement("div", {
            className: "logo"
        })
        const logoText = createHTMLElement("h1", {
            textContent: "Just DO it!"
        })
        logoDiv.appendChild(logoText);
        const logoSubText = createHTMLElement("p", {
            textContent: "The app that gets you from 'To Do' to 'Done!'"
        })
        logoDiv.appendChild(logoSubText);
        header.appendChild(logoDiv);
        
        const loginButton = createHTMLElement("button", {
            type: "button",
            className: "login-button",
            textContent: "Log in"
        })
        loginButton.addEventListener("click", loginButtonHandler)
        header.appendChild(loginButton);

        function loginButtonHandler(e) {
            const modal = document.querySelector(".modal-container");

            modal.classList.add("login-form");
            
            modal.appendChild(
                createHTMLElement("h2", {
                    textContent: "Log in request form"
                })
            );

            modal.appendChild(
                createHTMLElement("p", {
                    textContent: "Please enter your username and password and click submit."
                })
            );

            modal.appendChild(
                createHTMLElement("p", {
                    textContent: "IMPORTANT! - passwords and user content is not protected/encrypted.  However, all data remains ONLY on your device.  Please don't include any sensitive information anywhere in the app."
                })
            );

            const form = createHTMLElement("form", {
                method: "dialog"
            })
            
            form.appendChild(
                createHTMLElement("label", {
                    htmlFor: "username-input",
                    textContent: "Username"
                })
            );

            const usernameInput = createHTMLElement("input", {
                type: "text:",
                id: "username-input",
                required: true
            })
            form.appendChild(usernameInput);

            form.appendChild(
                createHTMLElement("label", {
                    htmlFor: "password-input",
                    textContent: "Password"
                })
            );

            const passwordInput = createHTMLElement("input", {
                type: "password",
                id: "password-input",
                required: true
            })
            form.appendChild(passwordInput);
            
            const submitButton = createHTMLElement("button", {
                type: "button",
                textContent: "Submit"
            })
            submitButton.addEventListener("click", (e) => {
                emitter.emit("request:logInUser", {
                    username: usernameInput.value,
                    password: passwordInput.value
                })
                modal.classList.remove("login-form");
                modal.close();
                modal.textContent = "";
            })
            form.appendChild(submitButton);
            
            const resetButton = createHTMLElement("button", {
                type: "reset",
                textContent: "Reset"
            })
            form.appendChild(resetButton);
            
            const cancelButton = createHTMLElement("button", {
                type: "button",
                textContent: "Cancel"
            });
            cancelButton.addEventListener("click", (e) => {
                modal.close();
                modal.classList.remove("login-form");
                modal.textContent = "";
            })

            form.appendChild(cancelButton);
            
            modal.appendChild(form);

            modal.showModal();
        }
    
        const registerButton = createHTMLElement("button", {
            type: "button",
            className: "register-button",
            textContent: "Register"
        })
        header.appendChild(registerButton);
    }

    function drawDefaultLeftSidebar() {
        const leftSidebar = document.querySelector(".left-sidebar");
        leftSidebar.textContent = "";
    }

    function drawDefaultMainSectionContents() {
        const mainSection = document.querySelector(".main-section");
        mainSection.textContent = "";

        mainSection.appendChild(
            createHTMLElement("p", {
                textContent: "Welcome to the app that gets you from 'To Do' to 'Done!'"
            })
        );
        mainSection.appendChild(
            createHTMLElement("p", {
                textContent: "Please log in or register a new user (see top right of page)"
            })
        );
    }

    drawDefaultHeaderContents();
    drawDefaultLeftSidebar();
    drawDefaultMainSectionContents();
}

function initializeAppGrid() {
    const header = document.createElement("header");
    header.classList.add("header");
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

emitter.on("userSessionUpdated", (e) => {

    userSessionClone = e;
    
    if (userSessionClone === undefined) {
        drawDefaultApp();
    }
    else {      
        appContainer.classList.add("logged-in");
        appContainer.classList.remove("default");

        function drawUserSession(userSession) {
            drawUserHeader(userSession);
            drawUserProjects(userSession);
            drawTasksSection(userSession);
        }
        drawUserSession(userSessionClone);

        function  drawUserHeader(userSession) {
            const header = document.querySelector(".header");
            // Remove all the logo's siblings
            header.querySelectorAll(".logo ~ *").forEach( element => element.remove());
            //draw user details
            const userDetailDiv = createHTMLElement("div", {
                className: "user-detail-container",
            });

            userDetailDiv.appendChild(
                createHTMLElement("p", {
                    textContent: "Logged in user:"
                })
            );

            userDetailDiv.appendChild(
                createHTMLElement("p", {
                    textContent: `${userSession.loggedInUser.username}`
                })
            );

            const logoutButton = createHTMLElement("button", {
                type: "button",
                textContent: "Log out"
            });
            logoutButton.addEventListener("click", logoutButtonHandler);
            userDetailDiv.appendChild(logoutButton);

            function logoutButtonHandler(e) {
                userSessionClone = undefined;
                drawDefaultApp();
            }
                
            header.appendChild(userDetailDiv);
        }

        function drawUserProjects(userSession) {
            const leftSidebar = document.querySelector(".left-sidebar");
            leftSidebar.textContent = "";
            const projectsList = createHTMLElement("ol", {
                textContent: "Projects:",
                className: "projects-list"
            });
            leftSidebar.appendChild(projectsList);
            userSession.userProjects
                .map(toHTMLElement)
                .forEach(element => projectsList.appendChild(element));
            function toHTMLElement(project) {
                const projectButton = createHTMLElement("button", {
                    type: "button",
                    textContent: project.name,
                    className: "project"
                });
                projectButton.dataset.id = project.id;
                projectButton.dataset.linkedUserId = project.linkedUserId;
                
                const li = createHTMLElement("li");
                li.appendChild(projectButton);
                return li;
            }
        }

        function drawTasksSection(userSession) {
            
            const mainSection = document.querySelector(".main-section");
            mainSection.textContent = "";
            
            function drawTasksHeader() {
                // create and draw div.tasksHeader->p
                const div = createHTMLElement("div", {
                    className: "task-header"
                })
                const p = createHTMLElement("p", {
                    textContent: "Tasks:"
                })
                div.appendChild(p);
                mainSection.appendChild(div);
            }
    
            function drawUserTasks(userSession) {
                // create and draw div with tasks as children
                const tasksContainer = createHTMLElement("div", {
                    className: "tasks-container"
                });
                mainSection.appendChild(tasksContainer);
                userSession.userTasks.map(toHTMLElement)
                    .forEach(element => tasksContainer.appendChild(element));
                
                    function toHTMLElement(task) {
                    const taskCard = createHTMLElement("div", {
                        className: "task-card"
                    })
                    taskCard.dataset.id = task.id;
                    taskCard.dataset.linkedProjectId = task.linkedProjectId;

                    taskCard.appendChild(
                        createHTMLElement("h5", {
                            textContent: task.title
                        })
                    );
                    taskCard.appendChild(
                        createHTMLElement("p", {
                            textContent: task.description,
                            className: "not-displayed"
                        })
                    );
                    taskCard.appendChild(
                        createHTMLElement("p", {
                            textContent: `Due date: ${task.dueDate}`
                        })
                    );
                    taskCard.appendChild(
                        createHTMLElement("p", {
                            textContent: `Priority: ${task.priority}`,
                            className: "not-displayed"
                        })
                    );
                    taskCard.appendChild(
                        createHTMLElement("label", {
                            htmlFor: "is-done",
                            className: "not-displayed",
                            textContent: "Done?"
                        })
                    );
                    taskCard.appendChild(
                        createHTMLElement("input", {
                            type: "checkbox",
                            id: "is-done",
                            className: "not-displayed",
                            value: task.isDone
                        })
                    );

                    return taskCard;
                
                    }
            }
        
        drawTasksHeader();
        drawUserTasks(userSession);

        }
    }
    });



// TEMP - console testing
// let userSession;

// emitter.on("success:newUserRegistered", () => {console.log("Registration succeeded")});
// emitter.on("fail:newUserRegistered", () => {console.log("Registration failed")});
// emitter.on("success:userDeregistered", () => console.log("User successfully deregistered"));
// emitter.on("fail:userDeregistered", () => console.log("Failed to deregister user"));

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