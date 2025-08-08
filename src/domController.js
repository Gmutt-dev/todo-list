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
import { loginButtonHandler, registerButtonHandler, addProjectButtonHandler } from "./DOM-handlers";
import { addTask, createTask } from "./tasksManager";

const appContainer = document.querySelector(".app-container");
let userSessionClone = undefined;
let userSelection = {
    selectedProjectId: undefined,
    selectedTaskIds: []
}

function resetUserData() {
    userSessionClone = undefined;
    userSelection = {
    selectedProjectId: undefined,
    selectedTaskIds: []
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
    logoutButton.addEventListener("click", e => {
        resetUserData();
        drawDefaultApp();
    });
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
            if (!e.target.parentElement.classList.contains("user-selected")) {
                userSelection.selectedProjectId = project.id;
                projectsList.querySelectorAll(".project").forEach(element => {
                    element.classList.remove("user-selected");
                    element.querySelectorAll("button:not(:first-child").forEach(button => button.classList.add("not-displayed"));
                    element.querySelectorAll("button:not(:first-child").forEach(button => button.classList.add("not-displayed"));
                })
                projectButton.parentElement.classList.add("user-selected");
                editButton.classList.remove("not-displayed");
                deleteButton.classList.remove("not-displayed");
                drawTasksSection(userSession);
            }
        })
        
        const editButton = createHTMLElement("button", {
            textContent: "",
            type: "button",
            className: "not-displayed"
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
            className: "not-displayed"
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
        if (userSelection.selectedProjectId === li.dataset.id) {
            li.classList.add("user-selected");
            editButton.classList.remove("not-displayed");
            deleteButton.classList.remove("not-displayed");
        }
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
    
    const addTaskButton = createHTMLElement("button", {
        type: "button",
        className: "add-task-button",
        textContent: "add task"
    })
    addTaskButton.addEventListener("click", e => {
        emitter.emit("request:addTask", {
           linkedProjectId: userSelection.selectedProjectId
        })
    })

    //request:addTask -> {linkedProjectId, title, description, dueDate, priority}
    div.appendChild(addTaskButton);

    if (userSelection.selectedProjectId) p.textContent = "Tasks:";
        else {
            addTaskButton.classList.add("not-displayed");
            p.textContent = "Please select a project from the left bar, to show related tasks";
        }

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
        .filter( task => userSelection.selectedProjectId ? (task.linkedProjectId === userSelection.selectedProjectId) : false )
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
                <button type="button" class="compact-button">Compact</button>
            </header>
            <form action="" method="get">
                <label for="${task.id}-title">Title:</label>
                <output id="${task.id}-title" name="title"></output>
                <label for="${task.id}-description" class="displayable not-displayed">Description:</label>
                <output id="${task.id}-description" class="displayable not-displayed" name="description"></output>
                <label for="${task.id}-due-date">Due date:</label>
                <output id="${task.id}-due-date" name="dueDate"></output>
                <label for="${task.id}-priority" class="displayable not-displayed">Priority:</label>
                <output id="${task.id}-priority" class="displayable not-displayed" name="priority"></output>
                <label for="${task.id}-is-done" class="displayable not-displayed">Completed?</label>
                <output id="${task.id}-is-done" class="displayable not-displayed" name="isDone"></output>
            </form>
            <footer class="displayable not-displayed">
                <button type="button" class="delete-button">Delete</button>
            </footer>
        `;

        taskCard.innerHTML = taskCardHtmlContent;

        taskCard.toEditable = function () {
            taskCard.querySelector(".edit-button").remove();
            taskCard.querySelector(".compact-button").remove();
            taskCard.querySelectorAll("output").forEach(output => {
                let input;
                if (output.name !== "priority") {
                    input = document.createElement("input");
                } else {
                    input = document.createElement("select");
                }
                const attributes = output.attributes;
                Array.from(attributes).forEach(attribute => {
                    input.setAttribute(attribute.name, attribute.value);
                })
                if (input.name === "isDone") {
                    input.checked = task.isDone;
                    input.type = "checkbox";
                }
                else if (input.name === "dueDate") {
                    input.value = format(task.dueDate, "yyyy-MM-dd");
                    input.type = "date";
                }
                else if (input.name === "priority") {
                    input.innerHTML = `
                        <option value="high">high</option>
                        <option value="normal">normal</option>
                        <option value="low">low</option>
                    `;
                    input.querySelector(`option[value=${task.priority}]`).selected=true;
                }
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
                    // If new task successfully updated, remove the new-task class to avoid deletion on clicking edit mode cancel button in future
                    taskCard.classList.remove("new-task");
                    emitter.emit("request:updateTask", {
                        id: task.id,
                        title: taskCard.querySelector(`input[name="title"]`).value,
                        description: taskCard.querySelector(`input[name="description"]`).value,
                        dueDate: new Date(taskCard.querySelector(`input[name="dueDate"]`).value),
                        priority: taskCard.querySelector(`select[name="priority"]`).value,
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
                    // Delete task if it's a new unedited task
                    if (taskCard.classList.contains("new-task")) emitter.emit("request:deleteTask", {taskId: task.id})
                        // Otherwise, just redraw the session
                        else drawTasksSection(userSession);
                })
        }

        taskCard.querySelector(".edit-button").addEventListener("click", e => {
            taskCard.toEditable();
        })

        taskCard.toCompact = function () {
            taskCard.querySelectorAll(".displayable").forEach(item => {
                if (item.classList.contains("displayed")) item.classList.replace("displayed", "not-displayed");
            });
        }
        
        taskCard.querySelector(".compact-button").addEventListener("click", e => {
            taskCard.toCompact();
            // Remove from userselection array, so it doesn't expand on next refresh
            userSelection.selectedTaskIds.splice(userSelection.selectedTaskIds.findIndex( id => id === task.id), 1);
        })

        // Fill in displayed values for all output fields
        taskCard.querySelectorAll("output").forEach(output => {
            if (output.name === "dueDate") output.value = format(task.dueDate, "dd-MMM-yyyy");
            else if (output.name === "isDone") output.value = task.isDone ? "yes" : "no";
            else output.value = task[`${output.name}`];
        })

        
        taskCard.querySelector(".delete-button").addEventListener("click", e => {
            emitter.emit("request:deleteTask", {taskId: task.id})
        })
        
        taskCard.expand = function () {
            taskCard.querySelectorAll(".displayable").forEach(item => {
                if (item.classList.contains("not-displayed")) item.classList.replace("not-displayed", "displayed");
            });
        }
        
        // If new task item, go to edit mode without user request, mark as new task class (to be removed if successfully updated/submitted)
        if (taskCard.querySelector("output[name='title']").value === "<New Task, please complete>") {
            taskCard.classList.add("new-task");
            taskCard.expand();
            taskCard.toEditable();
        }

        // Expand task card if user selection requires it
        if (userSelection.selectedTaskIds.includes(task.id)) taskCard.expand();

        // Click on card: expand card + add to user's selected tasks array
        taskCard.addEventListener("click", e => {
            if ((!userSelection.selectedTaskIds.includes(task.id)) && (e.target !== taskCard.querySelector(".compact-button"))) {
                taskCard.expand();
                userSelection.selectedTaskIds.push(task.id);
            }
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
            textContent: `Error, please try again. ${e.message || ""}`
        })
    );
    const closeButton = createHTMLElement("button", {
        textContent: "close"
    });
    closeButton.addEventListener("click", resetModal)
    modal.appendChild(closeButton);
    modal.showModal();
}

emitter.on("success:newUserRegistered", successHandler);

function successHandler(e) {
    const modal = document.querySelector(".modal-container");
    modal.appendChild(
        createHTMLElement("p", {
            textContent: `Success: ${e.message || ""}`
        })
    );
    const closeButton = createHTMLElement("button", {
        textContent: "close"
    });
    closeButton.addEventListener("click", resetModal)
    modal.appendChild(closeButton);
    modal.showModal();
}