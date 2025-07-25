import "./styles.css";

import iconEdit from "./icons/edit.svg";
import iconDelete from "./icons/delete.svg";
import iconAdd from "./icons/add.svg";
import iconCheck from "./icons/check.svg";
import iconCancel from "./icons/cancel.svg";

// Import the emitter object for DOM to appController controller communication via events
// NB therefore no import of appController allowed here!  Must use emitter!
import emitter from "./emitter";
import { format } from "date-fns";
import { createHTMLElement } from "./DOM-fns";
import { loginButtonHandler, registerButtonHandler, logoutButtonHandler, addProjectButtonHandler } from "./DOM-handlers";
import { createTask } from "./tasksManager";

const appContainer = document.querySelector(".app-container");
let userSessionClone = undefined;
let userSelection = {
    selectedProjectId: undefined,
    selectedTaskId: undefined
}

function resetUserData() {
    userSessionClone = undefined;
    userSelection = {
    selectedProjectId: undefined,
    selectedTaskId: undefined
}
}

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


    
        const registerButton = createHTMLElement("button", {
            type: "button",
            className: "register-button",
            textContent: "Register"
        })
        registerButton.addEventListener("click", registerButtonHandler);
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

}    

initializeAppGrid();
drawDefaultApp();

// Event listener on document to close all pop-ups when clicing outside of the pop-ups
// document.addEventListener("click", e => {
//     const popups = document.querySelectorAll(".pop-up");
//     popups.forEach(popup => {
//         if (!popup.parentElement.contains(e.target)) popup.classList.add("not-displayed");
//     })
// })

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

    header.appendChild(userDetailDiv);
}

function drawUserProjects(userSession) {
    const leftSidebar = document.querySelector(".left-sidebar");
    leftSidebar.textContent = "";
    const projectsList = createHTMLElement("ol", {
        textContent: "Projects:",
        className: "projects-list"
    });
    const addProjectButton = createHTMLElement("button", {
        type: "button",
        textContent: ""
    });
    addProjectButton.style.backgroundImage = `url(${iconAdd})`;
    addProjectButton.textContent = "new project...";
    addProjectButton.addEventListener("click", addProjectButtonHandler);
    projectsList.appendChild(addProjectButton);

    const newProjectForm = createHTMLElement("form", {
        action: "",
        method: "get",
        classList: "not-displayed"
    })

    const newProjectInput = createHTMLElement("input", {
        type: "text",
        id: "new-project-input",
        required: true,
        placeholder: "enter name"
    });
    newProjectForm.appendChild(newProjectInput);

    const newProjectSubmitButton = createHTMLElement("button", {
        type: "button",
        textContent: ""
    });
    newProjectSubmitButton.style.backgroundImage =`url(${iconCheck})`;
    newProjectSubmitButton.addEventListener("click", e => {
        emitter.emit("request:addProject", {
            projectName: newProjectInput.value
        });
    });

    newProjectForm.appendChild(newProjectSubmitButton);
    
    // cancel button inline, with handler
    const newProjectCancelButton = createHTMLElement("button", {
        type: "button",
        textContent: ""
    });
    newProjectCancelButton.style.backgroundImage = `url(${iconCancel})`;
    newProjectCancelButton.addEventListener("click", addProjectButtonHandler);
    newProjectForm.appendChild(newProjectCancelButton);

    // append form to list of projects
    projectsList.appendChild(newProjectForm);

    leftSidebar.appendChild(projectsList);
    userSession.userProjects
        .map(toHTMLElement)
        .forEach(element => projectsList.appendChild(element));

    function toHTMLElement(project) {
        const projectButton = createHTMLElement("button", {
            type: "button",
            textContent: project.name,
        });
        projectButton.addEventListener("click", e => {
            userSelection.selectedProjectId = project.id;
            projectsList.querySelectorAll(".project").forEach(element => element.classList.remove("user-selected"));
            projectButton.parentElement.classList.add("user-selected");
            drawTasksSection(userSession);
        })
        
        const editButton = createHTMLElement("button", {
            textContent: "",
            type: "button",
        })
        editButton.style.backgroundImage = `url(${iconEdit})`;
        editButton.addEventListener("click", e => {
            editButton.classList.toggle("depressed");
            deleteButton.classList.add("not-displayed");
            userSelection.selectedProjectId = project.id;
            projectsList.querySelectorAll(".project").forEach(element => element.classList.remove("user-selected"));
            projectButton.parentElement.classList.add("user-selected");
            drawTasksSection(userSession);
            projectButton.contentEditable = true;
            projectButton.focus();
            projectButton.addEventListener("blur", e => {
                emitter.emit("request:updateProject", {
                    projectId: project.id,
                    name: projectButton.textContent
                })
            })
        });
        
        const deleteButton = createHTMLElement("button", {
            textContent: "",
            type: "button",
        })
        deleteButton.style.backgroundImage = `url(${iconDelete})`;
        deleteButton.addEventListener("click", e => {
            //TODO: Create modal for confirmation first
            emitter.emit("request:deleteProject", {projectId: e.target.parentElement.dataset.id})
        });
        
        const li = createHTMLElement("li", {
            className: "project"
        });
        li.dataset.id = project.id;
        if (userSelection.selectedProjectId === li.dataset.id) li.classList.add("user-selected");
        li.dataset.linkedUserId = project.linkedUserId;
        li.appendChild(projectButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        
        return li;
    }
}

function drawTasksHeader() {
    const mainSection = document.querySelector(".main-section");
    // create and draw div.tasksHeader->p
    const div = createHTMLElement("div", {
        className: "task-header"
    })
    const p = createHTMLElement("p", {
        textContent: "Tasks:"
    })
    div.appendChild(p);
    if (userSelection.selectedProjectId) p.textContent = "Tasks:";
        else p.textContent = "Please select a project from the left bar, to show related tasks";
    mainSection.appendChild(div);
}

function drawUserTasks(userSession) {
    const mainSection = document.querySelector(".main-section");
    // create and draw div with tasks as children
    const tasksContainer = createHTMLElement("div", {
        className: "tasks-container"
    });
    mainSection.appendChild(tasksContainer);

    userSession.userTasks
        .filter( task => userSelection.selectedProjectId ? task.linkedProjectId === userSelection.selectedProjectId : false )
        .map(toHTMLElement)
        .forEach(element => tasksContainer.appendChild(element));
    
        function toHTMLElement(task) {
        const taskCard = createHTMLElement("div", {
            className: "task-card"
        })
        taskCard.dataset.id = task.id;
        taskCard.dataset.linkedProjectId = task.linkedProjectId;

        const taskCardHtmlContent = `
            <header class="displayable not-displayed">
                <button type="button" class="edit-button">Edit</button>
            </header>
            <form action="" method="get">
                <label for="${task.id}-title">Title:</label>
                <output id="${task.id}-title" name="title"></output>
                <label for="${task.id}-description" class="displayable not-displayed">Description:</label>
                <output id="${task.id}-description" class="displayable not-displayed" name="description"></output>
                <label for="${task.id}-due-date">Due date:</label>
                <output id="${task.id}-due-date" name="dueDate" type="date"></output>
                <label for="${task.id}-priority" class="displayable not-displayed">Priority:</label>
                <output id="${task.id}-priority" class="displayable not-displayed" name="priority"></output>
                <label for="${task.id}-is-done" class="displayable not-displayed">Completed?</label>
                <output id="${task.id}-is-done" class="displayable not-displayed" name="isDone" type="checkbox"></output>
            </form>
            <footer class="displayable not-displayed">
                <button type="button" class="delete-button">Delete</button>
            </footer>
        `;

        taskCard.innerHTML = taskCardHtmlContent;

        taskCard.toEditable = function() {
            taskCard.querySelectorAll("output").forEach(output => {
                const input = document.createElement("input");
                const attributes = output.attributes;
                Array.from(attributes).forEach(attribute => {
                    input.setAttribute(attribute.name, attribute.value);
                })
                if (input.name === "isDone") input.checked = task.isDone;
                else if (input.name === "dueDate") input.value = format(task.dueDate, "yyyy-MM-dd")
                else input.value = task[`${input.name}`];
                output.replaceWith(input);
                });

                const submitButton = createHTMLElement("button", {
                    type: "submit",
                    textContent: "Submit",
                    className: "submit-button"
                });
                submitButton.addEventListener("click", e => {
                    e.preventDefault();
                    emitter.emit("request:updateTask", {
                        id: task.id,
                        title: taskCard.querySelector(`input[name="title"]`).value,
                        description: taskCard.querySelector(`input[name="description"]`).value,
                        dueDate: new Date(taskCard.querySelector(`input[name="dueDate"]`).value),
                        priority: taskCard.querySelector(`input[name="priority"]`).value,
                        isDone: taskCard.querySelector(`input[name="isDone"]`).checked
                    })
                });
                taskCard.querySelector(".delete-button").replaceWith(submitButton);

                const cancelButton = createHTMLElement("button", {
                    type: "button",
                    textContent: "Cancel",
                    className: "cancel-button"
                });
                taskCard.querySelector("footer").appendChild(cancelButton);
                cancelButton.addEventListener("click", e => {
                    drawTasksSection(userSession);
                })
        }

        taskCard.querySelector(".edit-button").addEventListener("click", e => {
            taskCard.toEditable();
            e.target.remove();
        })

        taskCard.querySelectorAll("output").forEach(output => {
            if (output.name === "dueDate") output.value = format(task.dueDate, "dd-MMM-yyyy");
            else if (output.name === "isDone") output.value = task.isDone ? "yes" : "no";
            else output.value = task[`${output.name}`];
        })

        taskCard.addEventListener("click", e => {
            taskCard.querySelectorAll(".displayable").forEach(item => {
                if (item.classList.contains("not-displayed")) item.classList.replace("not-displayed", "displayed");
            });
        })

        return taskCard;
    
        }
}

function drawTasksSection(userSession) {
    
    const mainSection = document.querySelector(".main-section");
    mainSection.textContent = "";
    
drawTasksHeader();
drawUserTasks(userSession);

}

function drawUserSession(userSession) {
    drawUserHeader(userSession);
    drawUserProjects(userSession);
    drawTasksSection(userSession);
}

function resetModal() {
    const modal = document.querySelector(".modal-container");
    modal.textContent = "";
    modal.close();
}

emitter.on("userSessionUpdated", (e) => {

    userSessionClone = e;
    
    if (userSessionClone === undefined) {
        drawDefaultApp();
    }
    else {      
        appContainer.classList.add("logged-in");
        appContainer.classList.remove("default");

    drawUserSession(userSessionClone);
    }
    });

emitter.on("fail:userLoggedIn", failureHandler);
emitter.on("fail:newUserRegistered", failureHandler);
emitter.on("fail:userLoggedOut", failureHandler);
emitter.on("fail:userDeregistered", failureHandler);
emitter.on("fail:addProject", failureHandler);
emitter.on("fail:addTask", failureHandler);

function failureHandler(e) {
    const modal = document.querySelector(".modal-container");
    modal.appendChild(
        createHTMLElement("p", {
            textContent: `Error, please try again. ${e.errorMessage ? e.errorMessage : ""}`
        })
    );
    const closeButton = createHTMLElement("button", {
        textContent: "close"
    });
    closeButton.addEventListener("click", resetModal)
    modal.appendChild(closeButton);
    modal.showModal();
}




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

emitter.emit("request:logInUser", {username: "Sarah", password: "pwd1"});

// // emitter.emit("request:logOutUser", {});

// emitter.emit("request:deregisterUser", {username: "Peter", password: "pwd2"})

// emitter.emit("request:addProject", {projectName: "Garden"});

// emitter.emit("request:addTask", {project: userSessionClone.userProjects[0], title: "Test title", description: "Test description", dueDate: new Date(2025, 7, 9) , priority:"high"});

// emitter.emit("request:updateTask", {id: "f3379445-f0f5-4933-a50e-566fb976e8a6", description: "Updated test description"});

// END TEMP